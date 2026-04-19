import { describe, expect, it } from "vitest";

import {
  buildSubmissionSearchText,
  getCategoryLabel,
  getFormTypeLabel,
  getStatusLabel,
  toSubmissionInsert,
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
  });

  it("normalizes referral fields consistently", () => {
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
      },
      "register",
    );

    expect(submission.referral_source).toBe("whatsapp");
    expect(submission.referral_detail).toBe("Berlin Diaspora");
    expect(submission.referral_code).toBe("ABC42");
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
      description: "Community builder",
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
  });
});
