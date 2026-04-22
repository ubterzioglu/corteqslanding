import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ReferralType = "normal" | "partner" | "campaign" | "manual";
export type ReferralSource = "whatsapp" | "instagram" | "linkedin" | "organic" | "partner" | "manual";

export const TYPE_MAP: Record<ReferralType, string> = {
  normal: "A",
  partner: "B",
  campaign: "C",
  manual: "D",
};

export const SOURCE_MAP: Record<ReferralSource, string> = {
  whatsapp: "W",
  instagram: "I",
  linkedin: "L",
  organic: "O",
  partner: "P",
  manual: "M",
};

export const MONTH_MAP = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "Y", "Z"] as const;
export const SAFE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const referralTypeOptions: Array<{ value: ReferralType; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "partner", label: "Partner" },
  { value: "campaign", label: "Campaign" },
  { value: "manual", label: "Manual" },
];

export const referralSourceOptions: Array<{ value: ReferralSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "organic", label: "Organic" },
  { value: "partner", label: "Partner" },
  { value: "manual", label: "Manual" },
];

export type GeneratedReferralCode = {
  code: string;
  code_prefix: string;
  type_key: ReferralType;
  type_char: string;
  source_key: ReferralSource;
  source_char: string;
  referral_date: string;
  month_char: string;
  year_short: string;
  random_part: string;
  check_char: string;
};

export type CreateReferralCodeParams = {
  type: ReferralType;
  source: ReferralSource;
  date: string;
  note?: string | null;
  createdBy?: string | null;
};

export type ReferralCodeInsert = TablesInsert<"referral_codes">;
export type ReferralCodeRow = Tables<"referral_codes">;

function parseDateInput(date: string) {
  const trimmed = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error("Invalid referral date. Use YYYY-MM-DD format.");
  }

  const dateObj = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid referral date");
  }

  return dateObj;
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

export function buildCheckChar(input: string): string {
  let sum = 0;
  for (let index = 0; index < input.length; index += 1) {
    sum += input.charCodeAt(index) * (index + 1);
  }

  return SAFE_CHARS[sum % SAFE_CHARS.length];
}

export function generateReferralCode(params: {
  type: ReferralType;
  source: ReferralSource;
  date: string;
}): GeneratedReferralCode {
  const dateObj = parseDateInput(params.date);

  const typeChar = TYPE_MAP[params.type];
  const sourceChar = SOURCE_MAP[params.source];
  const monthChar = MONTH_MAP[dateObj.getUTCMonth()];
  const yearShort = String(dateObj.getUTCFullYear()).slice(-2);
  const prefix = `${typeChar}${sourceChar}${monthChar}${yearShort}`;
  const randomPart = randomString(4);
  const raw = `${prefix}${randomPart}`;
  const checkChar = buildCheckChar(raw);

  return {
    code: `${prefix}-${randomPart}-${checkChar}`,
    code_prefix: prefix,
    type_key: params.type,
    type_char: typeChar,
    source_key: params.source,
    source_char: sourceChar,
    referral_date: params.date,
    month_char: monthChar,
    year_short: yearShort,
    random_part: randomPart,
    check_char: checkChar,
  };
}

export function buildReferralInsertPayload(
  params: CreateReferralCodeParams,
  generated = generateReferralCode(params),
): ReferralCodeInsert {
  return {
    ...generated,
    note: params.note?.trim() || null,
    created_by: params.createdBy ?? null,
  };
}

type InsertResult<TData> = {
  data: TData | null;
  error: { code?: string; message: string } | null;
};

export async function createReferralCodeWithRetry<TData extends ReferralCodeRow>(
  params: CreateReferralCodeParams,
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
