import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const isWriteMode = args.includes("--write");
const envArg = args.find((arg) => arg.startsWith("--env-file="));
const xlsxArg = args.find((arg) => arg.startsWith("--xlsx-file="));
const envFilePath = path.resolve(projectRoot, envArg ? envArg.slice("--env-file=".length) : ".env.local");
const workbookPath = xlsxArg
  ? path.resolve(projectRoot, xlsxArg.slice("--xlsx-file=".length))
  : "C:\\Users\\baris-terzioglu\\OneDrive - adesso Group\\Desktop\\corteqs_drive_dosyalari_13-05-2026.xlsx";

const IMPORT_BATCH = "drive-files-2026-05-13";
const DEFAULT_ADDED_BY = "UBT";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function info(message) {
  console.log(`INFO: ${message}`);
}

function parseEnvFile(content) {
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

async function loadEnv() {
  try {
    const content = await readFile(envFilePath, "utf8");
    return parseEnvFile(content);
  } catch {
    fail(`Env file okunamadı: ${envFilePath}`);
  }
}

function parseSnapshotDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function mapDepartment(folder) {
  const normalized = String(folder ?? "").trim().toUpperCase();
  if (normalized === "HR") return "İnsan Kaynakları";
  if (normalized === "ARGE") return "ARGE";
  return "Genel";
}

function normalizeSubfolder(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed && trimmed !== "-" ? trimmed : null;
}

function normalizeCell(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseWorkbookRows(xlsxFile) {
  const pythonScript = `
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

path = sys.argv[1]
ns_main = {'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ns_rel = {'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}

def col_index(col):
    n = 0
    for ch in col:
        if ch.isalpha():
            n = n * 26 + (ord(ch.upper()) - 64)
    return n - 1

with zipfile.ZipFile(path) as z:
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('a:si', ns_main):
            shared.append(''.join(t.text or '' for t in si.iterfind('.//a:t', ns_main)))

    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    target = None
    for rel in rels.findall('rel:Relationship', ns_rel):
        if rel.attrib.get('Target') == '/xl/worksheets/sheet1.xml':
            target = rel.attrib['Target'].lstrip('/')
            break
    if not target:
        raise RuntimeError('İlk sheet bulunamadı.')

    ws = ET.fromstring(z.read(target))
    rows = []
    for row in ws.findall('a:sheetData/a:row', ns_main):
        values = {}
        for cell in row.findall('a:c', ns_main):
            ref = ''.join(ch for ch in cell.attrib.get('r', '') if ch.isalpha())
            idx = col_index(ref)
            kind = cell.attrib.get('t')
            node = cell.find('a:v', ns_main)
            raw = '' if node is None else (node.text or '')
            if kind == 's' and raw.isdigit():
                value = shared[int(raw)]
            else:
                value = raw
            values[idx] = value
        max_idx = max(values.keys(), default=-1)
        rows.append([values.get(i, '') for i in range(max_idx + 1)])

print(json.dumps(rows, ensure_ascii=False))
`;

  const stdout = execFileSync("python", ["-c", pythonScript, xlsxFile], {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
    },
  });

  return JSON.parse(stdout);
}

function normalizeRows(rawRows) {
  const [headerRow = [], ...dataRows] = rawRows;
  const expectedHeader = ["Drive Klasör", "Drive Alt Klasör", "Bugünün Tarihi", "Dosya Adı", "URL"];

  if (expectedHeader.some((value, index) => String(headerRow[index] ?? "").trim() !== value)) {
    fail(`Excel başlıkları beklenen formatta değil: ${JSON.stringify(headerRow)}`);
  }

  const stats = {
    totalRows: dataRows.length,
    validRows: 0,
    skippedRows: 0,
    duplicateInputRows: 0,
    departmentCounts: {
      Genel: 0,
      "İnsan Kaynakları": 0,
      ARGE: 0,
    },
  };

  const normalizedByUrl = new Map();

  for (const row of dataRows) {
    const sourceFolder = normalizeCell(row[0]);
    const sourceSubfolder = normalizeSubfolder(row[1]);
    const sourceSnapshotDate = parseSnapshotDate(row[2]);
    const title = normalizeCell(row[3]);
    const url = normalizeCell(row[4]);

    if (!sourceFolder || !title || !url) {
      stats.skippedRows += 1;
      continue;
    }

    const department = mapDepartment(sourceFolder);
    const normalized = {
      department,
      record_kind: "Link",
      added_by: DEFAULT_ADDED_BY,
      title,
      description: null,
      url,
      storage_bucket: null,
      storage_path: null,
      file_name: null,
      person_first_name: null,
      person_last_name: null,
      person_role: null,
      linkedin_url: null,
      instagram_url: null,
      website_url: null,
      source_folder: sourceFolder,
      source_subfolder: sourceSubfolder,
      source_snapshot_date: sourceSnapshotDate,
      import_batch: IMPORT_BATCH,
    };

    if (normalizedByUrl.has(url)) {
      stats.duplicateInputRows += 1;
    }

    normalizedByUrl.set(url, normalized);
  }

  const records = Array.from(normalizedByUrl.values());
  stats.validRows = records.length;

  for (const record of records) {
    stats.departmentCounts[record.department] += 1;
  }

  return { records, stats };
}

async function fetchExistingByUrl(supabase, urls) {
  const existing = new Map();
  const data = supabase.restGet(
    "/rest/v1/resource_entries?select=id,url,description,storage_bucket,storage_path,file_name,person_first_name,person_last_name,person_role,linkedin_url,instagram_url,website_url&url=not.is.null"
  );

  for (const row of data ?? []) {
    if (urls.includes(row.url)) {
      existing.set(row.url, row);
    }
  }

  return existing;
}

function mergeWithExisting(record, existing) {
  if (!existing) return record;

  return {
    ...record,
    id: existing.id,
    description: existing.description,
    storage_bucket: existing.storage_bucket,
    storage_path: existing.storage_path,
    file_name: existing.file_name,
    person_first_name: existing.person_first_name,
    person_last_name: existing.person_last_name,
    person_role: existing.person_role,
    linkedin_url: existing.linkedin_url,
    instagram_url: existing.instagram_url,
    website_url: existing.website_url,
  };
}

function printSummary(stats, insertCount, updateCount) {
  info(`Env file: ${path.relative(projectRoot, envFilePath)}`);
  info(`Excel dosyası: ${workbookPath}`);
  info(`Mod: ${isWriteMode ? "WRITE" : "DRY RUN"}`);
  info(`Toplam okunan satır: ${stats.totalRows}`);
  info(`Geçerli satır: ${stats.validRows}`);
  info(`Atlanan satır: ${stats.skippedRows}`);
  info(`Excel içi duplicate URL satırı: ${stats.duplicateInputRows}`);
  info(`Insert edilecek kayıt: ${insertCount}`);
  info(`Update edilecek kayıt: ${updateCount}`);
  info(
    `Department dağılımı: Genel=${stats.departmentCounts["Genel"]}, İnsan Kaynakları=${stats.departmentCounts["İnsan Kaynakları"]}, ARGE=${stats.departmentCounts["ARGE"]}`
  );
}

async function main() {
  const env = await loadEnv();
  const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    fail("SUPABASE_URL/VITE_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik.");
  }

  const rawRows = parseWorkbookRows(workbookPath);
  const { records, stats } = normalizeRows(rawRows);

  const supabase = {
    baseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
    restGet(relativePath) {
      try {
        const stdout = execFileSync(
          "curl.exe",
          [
            "-s",
            "-H",
            `apikey: ${serviceRoleKey}`,
            "-H",
            `Authorization: Bearer ${serviceRoleKey}`,
            `${this.baseUrl}${relativePath}`,
          ],
          {
            cwd: projectRoot,
            encoding: "utf8",
          }
        );

        return JSON.parse(stdout);
      } catch (error) {
        fail(`Mevcut resource kayıtları okunamadı: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    restInsert(payload) {
      try {
        const stdout = execFileSync(
          "curl.exe",
          [
            "-s",
            "-X",
            "POST",
            "-H",
            `apikey: ${serviceRoleKey}`,
            "-H",
            `Authorization: Bearer ${serviceRoleKey}`,
            "-H",
            "Content-Type: application/json",
            "-H",
            "Prefer: return=minimal",
            "--data-binary",
            "@-",
            `${this.baseUrl}/rest/v1/resource_entries`,
          ],
          {
            cwd: projectRoot,
            encoding: "utf8",
            input: JSON.stringify(payload),
          }
        );

        if (stdout && stdout.trim().startsWith("{")) {
          const parsed = JSON.parse(stdout);
          if (parsed.message) {
            fail(`Import başarısız: ${parsed.message}`);
          }
        }
      } catch (error) {
        fail(`Import başarısız: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    restUpdateById(id, payload) {
      try {
        const stdout = execFileSync(
          "curl.exe",
          [
            "-s",
            "-X",
            "PATCH",
            "-H",
            `apikey: ${serviceRoleKey}`,
            "-H",
            `Authorization: Bearer ${serviceRoleKey}`,
            "-H",
            "Content-Type: application/json",
            "-H",
            "Prefer: return=minimal",
            "--data-binary",
            "@-",
            `${this.baseUrl}/rest/v1/resource_entries?id=eq.${id}`,
          ],
          {
            cwd: projectRoot,
            encoding: "utf8",
            input: JSON.stringify(payload),
          }
        );

        if (stdout && stdout.trim().startsWith("{")) {
          const parsed = JSON.parse(stdout);
          if (parsed.message) {
            fail(`Update başarısız: ${parsed.message}`);
          }
        }
      } catch (error) {
        fail(`Update başarısız: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  };

  const existingByUrl = await fetchExistingByUrl(
    supabase,
    records.map((record) => record.url)
  );

  const payloads = records.map((record) => mergeWithExisting(record, existingByUrl.get(record.url)));
  const insertCount = payloads.filter((record) => !record.id).length;
  const updateCount = payloads.length - insertCount;

  printSummary(stats, insertCount, updateCount);

  if (!isWriteMode) {
    ok("Dry run tamamlandı. Yazmak için --write kullanın.");
    return;
  }

  const inserts = payloads.filter((payload) => !payload.id);
  const updates = payloads.filter((payload) => payload.id);

  if (inserts.length > 0) {
    supabase.restInsert(inserts.map(({ id, ...payload }) => payload));
  }

  for (const update of updates) {
    const { id, ...payload } = update;
    supabase.restUpdateById(id, payload);
  }

  ok(`Import tamamlandı. Insert edilen kayıt: ${insertCount}`);
  ok(`Import tamamlandı. Update edilen kayıt: ${updateCount}`);
}

await main();
