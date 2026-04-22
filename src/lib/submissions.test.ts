import { describe, expect, it } from "vitest";

import {
  buildSubmissionSearchText,
  getCategoryLabel,
  getFormTypeLabel,
  getStatusLabel,
  type UploadedDocument,
  toSubmissionInsert,
  validateSubmissionDocuments,
} from "@/lib/submissions";

describe("submission helpers", () => {
  it("builds register inserts with default review status", () => {
    const submission = toSubmissionInsert(
      {
        category: "danisman",
        fullname: "Ada Lovelace",
        country: "Germany",
        city: "Berlin",
        business: "",
        field: "AI",
        email: "ada@example.com",
        phone: "+49 555",
        offers_needs: "Danışmanlık veriyorum",
      },
      "register",
    );

    expect(submission.form_type).toBe("register");
    expect(submission.category).toBe("danisman");
    expect(submission.status).toBe("new");
    expect(submission.business).toBeNull();
    expect(submission.referral_source).toBeNull();
    expect(submission.referral_detail).toBeNull();
    expect(submission.referral_code).toBeNull();
    expect(submission.referral_code_id).toBeNull();
    expect(submission.offers_needs).toBe("Danışmanlık veriyorum");
    expect(submission.documents).toEqual([]);
  });

  it("normalizes referral fields consistently", () => {
    const documents: UploadedDocument[] = [{ url: "https://example.com/cv.pdf", name: "cv.pdf" }];
    const submission = toSubmissionInsert(
      {
        category: "danisman",
        fullname: "Ada Lovelace",
        country: "Germany",
        city: "Berlin",
        business: "",
        field: "AI",
        email: "ada@example.com",
      phone: "+49 555",
      referral_source: "whatsapp",
      referral_detail: "Berlin Diaspora",
      referral_code: " abc42 ",
        document_url: "https://example.com/cv.pdf",
        document_name: "cv.pdf",
        documents: documents as unknown as FormDataEntryValue,
      },
      "register",
    );

    expect(submission.referral_source).toBe("whatsapp");
    expect(submission.referral_detail).toBe("Berlin Diaspora");
    expect(submission.referral_code).toBe("ABC42");
    expect(submission.document_name).toBe("cv.pdf");
  });

  it("renders labels and search text consistently", () => {
    expect(getCategoryLabel("sehir-elcisi")).toBe("Şehir Elçisi");
    expect(getFormTypeLabel("support")).toBe("Destek");
    expect(getStatusLabel("contacted")).toBe("İletişime geçildi");

    const haystack = buildSubmissionSearchText({
      id: "1",
      form_type: "register",
      category: "sehir-elcisi",
      fullname: "Ada Lovelace",
      country: "Germany",
      city: "Berlin",
      business: null,
      field: "Technology",
      email: "ada@example.com",
      phone: "+49 555",
      referral_source: "whatsapp",
      referral_detail: "Berlin Diaspora",
      referral_code: "ABC42",
      referral_code_id: null,
      description: "Community builder",
      offers_needs: "Network arıyor",
      document_url: "https://example.com/doc.pdf",
      document_name: "doc.pdf",
      documents: [{ url: "https://example.com/doc.pdf", name: "doc.pdf" }],
      contest_interest: false,
      linkedin: null,
      instagram: "@ada",
      tiktok: null,
      facebook: null,
      twitter: null,
      website: null,
      consent: true,
      created_at: "2026-04-06T19:30:00.000Z",
      status: "new",
      notes: "Priority lead",
      reviewed_at: null,
      reviewed_by: null,
    });

    expect(haystack).toContain("community builder");
    expect(haystack).toContain("priority lead");
    expect(haystack).toContain("berlin diaspora");
    expect(haystack).toContain("abc42");
    expect(haystack).toContain("network arıyor");
    expect(haystack).toContain("doc.pdf");
  });

  it("validates uploaded documents against limits and types", () => {
    const validFile = new File(["hello"], "cv.pdf", { type: "application/pdf" });
    const invalidFile = new File(["hello"], "script.exe", { type: "application/x-msdownload" });

    const valid = validateSubmissionDocuments([validFile]);
    expect(valid.ok).toBe(true);
    if (valid.ok) {
      expect(valid.files).toHaveLength(1);
    }

    const invalid = validateSubmissionDocuments([invalidFile]);
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.message).toContain("desteklenmeyen format");
    }
  });
});
