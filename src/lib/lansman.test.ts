import { describe, expect, it } from "vitest";

import {
  buildInitials,
  isValidWhatsappPhone,
  updateRegistrationStatus,
  validateOptionalUrl,
} from "@/lib/lansman";

describe("lansman helpers", () => {
  it("builds initials from first and last name", () => {
    expect(buildInitials("Ugur", "Bulut")).toBe("UB");
    expect(buildInitials(" ada ", " lovelace ")).toBe("AL");
  });

  it("validates international whatsapp phone formats", () => {
    expect(isValidWhatsappPhone("+491701234567")).toBe(true);
    expect(isValidWhatsappPhone("+49 170 1234567")).toBe(true);
    expect(isValidWhatsappPhone("01701234567")).toBe(false);
    expect(isValidWhatsappPhone("+12")).toBe(false);
  });

  it("accepts blank optional urls and rejects malformed ones", () => {
    expect(validateOptionalUrl("")).toBeNull();
    expect(validateOptionalUrl(" https://example.com/profile ")).toBe(
      "https://example.com/profile",
    );
    expect(() => validateOptionalUrl("instagram.com/user")).toThrow(
      "Geçerli bir URL girin.",
    );
  });

  it("rejects unsupported status updates before hitting the database", async () => {
    await expect(
      updateRegistrationStatus("test-id", "pending"),
    ).rejects.toThrow("Geçersiz durum güncellemesi.");
  });
});
