import { describe, expect, it } from "vitest";

import {
  MANUAL_RESOURCE_IMPORT_BATCH,
  MANUAL_RESOURCE_SOURCE_FOLDER,
  mapResourceEntryRow,
} from "@/lib/dashboard/resource-items";

describe("resource-items", () => {
  it("maps new import metadata fields from row shape", () => {
    const mapped = mapResourceEntryRow({
      id: "1",
      department: "Genel",
      record_kind: "Link",
      added_by: "UBT",
      title: "Test Dosya",
      description: null,
      url: "https://docs.google.com/document/d/test",
      storage_bucket: null,
      storage_path: null,
      file_name: null,
      person_first_name: null,
      person_last_name: null,
      person_role: null,
      linkedin_url: null,
      instagram_url: null,
      website_url: null,
      source_folder: "MARKETİNG",
      source_subfolder: "MAYIS 2026",
      source_snapshot_date: "2026-05-13",
      import_batch: "drive-files-2026-05-13",
      created_at: "2026-05-13T12:00:00.000Z",
    });

    expect(mapped.sourceFolder).toBe("MARKETİNG");
    expect(mapped.sourceSubfolder).toBe("MAYIS 2026");
    expect(mapped.sourceSnapshotDate).toBe("2026-05-13");
    expect(mapped.importBatch).toBe("drive-files-2026-05-13");
  });

  it("exports stable manual defaults for admin-created entries", () => {
    expect(MANUAL_RESOURCE_SOURCE_FOLDER).toBe("Manuel Kayıt");
    expect(MANUAL_RESOURCE_IMPORT_BATCH).toBe("manual-entry");
  });
});
