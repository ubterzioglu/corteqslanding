import { describe, expect, it } from "vitest";

import {
  createEmptyAdvisorResourceLinkFormState,
  toAdvisorResourceLinkFormState,
  toAdvisorResourceLinkPayload,
  validateAdvisorResourceLinkForm,
  type AdvisorResourceLinkRow,
} from "@/lib/resource-links";

describe("advisor resource link helpers", () => {
  it("builds advisor contact payloads with trimmed contact fields", () => {
    const payload = toAdvisorResourceLinkPayload({
      ...createEmptyAdvisorResourceLinkFormState(),
      name: "  Ada Lovelace  ",
      description: "  Berlin danışmanı  ",
      email: " ada@example.com ",
      phone: " +49 555 ",
      whatsapp: " +49 555 WA ",
      instagram: " @ada ",
      contacted_whatsapp: true,
      contacted_email: true,
    });

    expect(payload.name).toBe("Ada Lovelace");
    expect(payload.description).toBe("Berlin danışmanı");
    expect(payload.email).toBe("ada@example.com");
    expect(payload.phone).toBe("+49 555");
    expect(payload.whatsapp).toBe("+49 555 WA");
    expect(payload.instagram).toBe("@ada");
    expect(payload.contacted_whatsapp).toBe(true);
    expect(payload.contacted_instagram).toBe(false);
    expect(payload.contacted_email).toBe(true);
    expect(payload.contacted_phone).toBe(false);
  });

  it("requires an advisor name", () => {
    expect(validateAdvisorResourceLinkForm(createEmptyAdvisorResourceLinkFormState())).toBe("Ad zorunlu.");
  });

  it("maps advisor rows back to editable form state", () => {
    const row: AdvisorResourceLinkRow = {
      id: "1",
      name: "Ada",
      platform: "Diğer",
      description: null,
      link: null,
      email: null,
      phone: "+49",
      whatsapp: null,
      instagram: "@ada",
      contacted_whatsapp: false,
      contacted_instagram: true,
      contacted_email: false,
      contacted_phone: true,
      added_by: "UBT",
      created_at: "2026-04-24T00:00:00.000Z",
    };

    expect(toAdvisorResourceLinkFormState(row)).toEqual({
      name: "Ada",
      description: "",
      email: "",
      phone: "+49",
      whatsapp: "",
      instagram: "@ada",
      contacted_whatsapp: false,
      contacted_instagram: true,
      contacted_email: false,
      contacted_phone: true,
      added_by: "UBT",
    });
  });
});
