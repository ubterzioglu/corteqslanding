import { describe, expect, it, vi } from "vitest";

import {
  createReferralCodeWithRetry,
  generateReferralCodeFromParts,
  type ReferralCodeInsert,
  type ReferralCodeRow,
  validateReferralCodeToken,
} from "@/lib/referral-codes";

function buildRowFromPayload(payload: ReferralCodeInsert): ReferralCodeRow {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    code: payload.code,
    source_id: payload.source_id,
    type_id: payload.type_id,
    source_code: payload.source_code,
    type_code: payload.type_code,
    month_num: payload.month_num,
    year_short: payload.year_short,
    random_part: payload.random_part,
    note: payload.note ?? null,
    is_active: payload.is_active ?? true,
    is_used: payload.is_used ?? false,
    used_at: payload.used_at ?? null,
    created_by: payload.created_by ?? null,
    created_at: payload.created_at ?? "2026-04-22T00:00:00.000Z",
  };
}

describe("referral code helpers", () => {
  it("builds code in SOURCE+TYPE+MM+YY-RAND format", () => {
    const generated = generateReferralCodeFromParts({
      sourceCode: "WA",
      typeCode: "NM",
      month: 4,
      year: 2026,
      randomLength: 4,
    });

    expect(generated.code).toMatch(/^[A-Z]{4}[0-9]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
    expect(generated.code.startsWith("WANM0426-")).toBe(true);
  });

  it("accepts only 2-letter uppercase tokens", () => {
    expect(validateReferralCodeToken("wa")).toBe("WA");
    expect(() => validateReferralCodeToken("W1")).toThrow();
    expect(() => validateReferralCodeToken("WAA")).toThrow();
  });

  it("retries on unique violation and succeeds", async () => {
    const source = { id: "s1", code: "WA", name: "WhatsApp", is_active: true, created_at: "2026-01-01T00:00:00Z" };
    const type = { id: "t1", code: "NM", name: "Normal", is_active: true, created_at: "2026-01-01T00:00:00Z" };

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
      { source, type, month: 4, year: 2026, note: "Deneme" },
      insertFn,
      5,
    );

    expect(result.code).toMatch(/^WANM0426-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
    expect(insertFn).toHaveBeenCalledTimes(2);
  });
});
