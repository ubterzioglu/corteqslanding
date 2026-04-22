import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { normalizeTurkishText } from "@/lib/text-normalization";

export const SAFE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const DEFAULT_RANDOM_LENGTH = 4;

export type ReferralCodeRow = Tables<"referral_codes">;
export type ReferralCodeInsert = TablesInsert<"referral_codes">;
export type ReferralSourceRow = Tables<"referral_sources">;
export type ReferralTypeRow = Tables<"referral_types">;

export type CreateReferralCodeParams = {
  sourceId: string;
  typeId: string;
  month: number;
  year: number;
  note?: string | null;
  createdBy?: string | null;
  randomLength?: 4 | 5;
};

export function validateReferralCodeToken(code: string) {
  const normalized = normalizeTurkishText(code).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error("Code must be exactly 2 uppercase letters.");
  }
  return normalized;
}

function getRandomValues(length: number) {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return values;
}

export function randomString(length: number): string {
  const values = getRandomValues(length);
  let result = "";
  for (let index = 0; index < values.length; index += 1) {
    result += SAFE_CHARS[values[index] % SAFE_CHARS.length];
  }
  return result;
}

export function generateReferralCodeFromParts(params: {
  sourceCode: string;
  typeCode: string;
  month: number;
  year: number;
  randomLength?: number;
}) {
  const sourceCode = validateReferralCodeToken(params.sourceCode);
  const typeCode = validateReferralCodeToken(params.typeCode);
  if (params.month < 1 || params.month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }
  if (params.year < 2000 || params.year > 2099) {
    throw new Error("Year must be between 2000 and 2099.");
  }

  const mm = String(params.month).padStart(2, "0");
  const yy = String(params.year).slice(-2);
  const randomLength = params.randomLength ?? DEFAULT_RANDOM_LENGTH;
  const randomPart = randomString(randomLength);
  const code = `${sourceCode}${typeCode}${mm}${yy}-${randomPart}`;

  return {
    code,
    sourceCode,
    typeCode,
    monthNum: params.month,
    yearShort: yy,
    randomPart,
  };
}

export function buildReferralInsertPayload(params: {
  source: ReferralSourceRow;
  type: ReferralTypeRow;
  month: number;
  year: number;
  note?: string | null;
  createdBy?: string | null;
  randomLength?: 4 | 5;
}): ReferralCodeInsert {
  if (!params.source.is_active) throw new Error("Selected source is not active.");
  if (!params.type.is_active) throw new Error("Selected type is not active.");

  const generated = generateReferralCodeFromParts({
    sourceCode: params.source.code,
    typeCode: params.type.code,
    month: params.month,
    year: params.year,
    randomLength: params.randomLength ?? DEFAULT_RANDOM_LENGTH,
  });

  return {
    code: generated.code,
    source_id: params.source.id,
    type_id: params.type.id,
    source_code: generated.sourceCode,
    type_code: generated.typeCode,
    month_num: generated.monthNum,
    year_short: generated.yearShort,
    random_part: generated.randomPart,
    note: params.note ? normalizeTurkishText(params.note) : null,
    created_by: params.createdBy ?? null,
  };
}

type InsertResult<TData> = {
  data: TData | null;
  error: { code?: string; message: string } | null;
};

export async function createReferralCodeWithRetry<TData extends ReferralCodeRow>(
  params: {
    source: ReferralSourceRow;
    type: ReferralTypeRow;
    month: number;
    year: number;
    note?: string | null;
    createdBy?: string | null;
    randomLength?: 4 | 5;
  },
  insertFn: (payload: ReferralCodeInsert) => Promise<InsertResult<TData>>,
  maxAttempts = 5,
): Promise<TData> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const payload = buildReferralInsertPayload(params);
    const { data, error } = await insertFn(payload);
    if (!error && data) return data;
    if (!error && !data) throw new Error("Referral code insert returned empty result.");
    if (error.code !== "23505") throw new Error(error.message);
  }

  throw new Error("Referral code could not be generated uniquely after multiple attempts.");
}
