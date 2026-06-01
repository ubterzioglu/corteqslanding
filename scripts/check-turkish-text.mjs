import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const recursiveFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...recursiveFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
};

const targetFiles = [
  ...recursiveFiles(path.join(rootDir, "src", "pages")),
  ...recursiveFiles(path.join(rootDir, "src", "components")),
  path.join(rootDir, "src", "lib", "cadde.ts"),
  path.join(rootDir, "src", "lib", "individual-profile.ts"),
].filter((filePath) => statSync(filePath, { throwIfNoEntry: false })?.isFile() && !filePath.includes(".test."));

const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const suspiciousPatterns = [
  /\bGiris Yap\b/g,
  /\bgiris yap\b/g,
  /\bKayit Ol\b/g,
  /\bkayit ol\b/g,
  /\bPaylasim\b/g,
  /\bpaylasim\b/g,
  /\bGonderiliyor\b/g,
  /\bYukleniyor\b/g,
  /\bTurkiye\b/g,
  /\bBirlesik Krallik\b/g,
  /\bUlke sec\b/g,
  /\bSehir sec\b/g,
  /\bUlke\b/g,
  /\bSehir\b/g,
  /\bKopru\b/g,
  /\bAciklama\b/g,
  /\bHakkinda\b/g,
  /\bFotografi\b/g,
  /\bProfil Ayarlari\b/g,
  /\bAktif Ulke\b/g,
  /\bAktif Sehir\b/g,
  /\bKac Yildir Burada\b/g,
  /\bDogum Tarihi\b/g,
  /\bEgitim\b/g,
  /\bGorunum\b/g,
  /\bMekani\b/g,
  /\bGorusme\b/g,
  /\bEtkinlige\b/g,
  /\bUyesi\b/g,
];

const mojibakePattern = /Ã.|Ä.|Å.|�/g;
const issues = [];

for (const filePath of targetFiles) {
  if (!allowedExtensions.has(path.extname(filePath))) continue;

  const content = readFileSync(filePath, "utf8");
  const relativePath = path.relative(rootDir, filePath);
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.includes("turkish-check-ignore")) return;

    if (mojibakePattern.test(line)) {
      issues.push(`${relativePath}:${index + 1} mojibake -> ${line.trim()}`);
    }
    mojibakePattern.lastIndex = 0;

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(line)) {
        issues.push(`${relativePath}:${index + 1} suspicious Turkish copy -> ${line.trim()}`);
        pattern.lastIndex = 0;
        break;
      }
      pattern.lastIndex = 0;
    }
  });
}

if (issues.length > 0) {
  console.error("Turkish text check failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log("Turkish text check passed.");
