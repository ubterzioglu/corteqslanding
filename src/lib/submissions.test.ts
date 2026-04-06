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
  });

  it("renders labels and search text consistently", () => {
    expect(getCategoryLabel("sehir-elcisi")).toBe("Sehir Elcisi");
    expect(getFormTypeLabel("support")).toBe("Destek");
    expect(getStatusLabel("contacted")).toBe("Iletisime gecildi");

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
  });
});
