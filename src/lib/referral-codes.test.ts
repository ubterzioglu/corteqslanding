import { describe, expect, it, vi } from "vitest";

import {
  buildCheckChar,
  createReferralCodeWithRetry,
  generateReferralCode,
  type ReferralCodeInsert,
  type ReferralCodeRow,
} from "@/lib/referral-codes";

function buildRowFromPayload(payload: ReferralCodeInsert): ReferralCodeRow {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    code: payload.code,
    code_prefix: payload.code_prefix,
    type_key: payload.type_key,
    type_char: payload.type_char,
    source_key: payload.source_key,
    source_char: payload.source_char,
    referral_date: payload.referral_date,
    month_char: payload.month_char,
    year_short: payload.year_short,
    random_part: payload.random_part,
    check_char: payload.check_char,
    note: payload.note ?? null,
    is_active: payload.is_active ?? true,
    is_used: payload.is_used ?? false,
    used_by: payload.used_by ?? null,
    used_at: payload.used_at ?? null,
    created_by: payload.created_by ?? null,
    created_at: payload.created_at ?? "2026-04-22T00:00:00.000Z",
  };
}

describe("referral code helpers", () => {
  it("generates referral code in expected pattern", () => {
    const generated = generateReferralCode({
      type: "normal",
      source: "linkedin",
      date: "2026-04-22",
    });

    expect(generated.code).toMatch(/^[A-D][WILOPM][1-9XYZ][0-9]{2}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]$/);
  });

  it("maps months 10, 11, 12 to X, Y, Z", () => {
    expect(generateReferralCode({ type: "normal", source: "manual", date: "2026-10-01" }).month_char).toBe("X");
    expect(generateReferralCode({ type: "normal", source: "manual", date: "2026-11-01" }).month_char).toBe("Y");
    expect(generateReferralCode({ type: "normal", source: "manual", date: "2026-12-01" }).month_char).toBe("Z");
  });

  it("builds deterministic checksum", () => {
    const input = "AL426K7QM";
    expect(buildCheckChar(input)).toBe(buildCheckChar(input));
  });

  it("throws for invalid date format", () => {
    expect(() =>
      generateReferralCode({
        type: "normal",
        source: "linkedin",
        date: "22-04-2026",
      }),
    ).toThrow("Invalid referral date");
  });

  it("retries on unique violation and succeeds on second attempt", async () => {
    const insertFn = vi
      .fn<
        (payload: ReferralCodeInsert) => Promise<{ data: ReferralCodeRow | null; error: { code?: string; message: string } | null }>
      >()
      .mockResolvedValueOnce({
        data: null,
        error: { code: "23505", message: "duplicate key value violates unique constraint" },
      })
      .mockImplementationOnce(async (payload) => ({
        data: buildRowFromPayload(payload),
        error: null,
      }));

    const result = await createReferralCodeWithRetry(
      {
        type: "campaign",
        source: "whatsapp",
        date: "2026-04-22",
        note: "Test note",
        createdBy: "00000000-0000-0000-0000-000000000111",
      },
      insertFn,
      5,
    );

    expect(result.code).toMatch(/^CW426-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]$/);
    expect(insertFn).toHaveBeenCalledTimes(2);
  });
});
