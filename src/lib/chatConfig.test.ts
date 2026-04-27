import { describe, expect, it } from "vitest";

import { resolveCategoryInput, shouldUseRagFallback, validateStep } from "@/lib/chatConfig";

describe("chatConfig helpers", () => {
  it("accepts typed category labels and aliases", () => {
    expect(resolveCategoryInput("İşletme / Şirket")).toBe("isletme");
    expect(resolveCategoryInput("emlak şirketi")).toBe("isletme");
    expect(resolveCategoryInput("doktor")).toBe("danisman");
    expect(resolveCategoryInput("şehir elçisi")).toBe("sehir-elcisi");
  });

  it("keeps category validation compatible with natural input", () => {
    expect(validateStep("category", "doktor", {} as never)).toEqual({ ok: true });
    expect(validateStep("category", "rastgele cevap", {} as never)).toEqual({
      ok: false,
      message: "Lütfen bir kategori seç.",
    });
  });

  it("detects likely knowledge questions for rag fallback", () => {
    expect(shouldUseRagFallback("Corteqs nedir?")).toBe(true);
    expect(shouldUseRagFallback("Nasıl çalışıyor bu platform")).toBe(true);
    expect(shouldUseRagFallback("Berlin")).toBe(false);
  });
});
