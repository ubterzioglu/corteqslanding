import { supabase } from "@/integrations/supabase/client";
import {
  createReferralCodeWithRetry,
  type ReferralCodeRow,
  type ReferralGroupRow,
  type ReferralSourceRow,
  type ReferralTypeRow,
  validateReferralCodeToken,
} from "@/lib/referral-codes";
import { normalizeTurkishText } from "@/lib/text-normalization";

export async function userIsAdmin(userId: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function listReferralSources(onlyActive = false): Promise<ReferralSourceRow[]> {
  let query = supabase.from("referral_sources").select("*").order("name", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listReferralTypes(onlyActive = false): Promise<ReferralTypeRow[]> {
  let query = supabase.from("referral_types").select("*").order("name", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listReferralGroups(onlyActive = false): Promise<ReferralGroupRow[]> {
  let query = supabase.from("referral_groups").select("*").order("name", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createReferralSource(params: { name: string; code: string }) {
  const payload = {
    name: normalizeTurkishText(params.name),
    code: validateReferralCodeToken(params.code),
  };
  const { data, error } = await supabase.from("referral_sources").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function createReferralGroup(params: { name: string; code: string }) {
  const payload = {
    name: normalizeTurkishText(params.name),
    code: validateReferralCodeToken(params.code),
  };
  const { data, error } = await supabase.from("referral_groups").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function createReferralType(params: { name: string; code: string }) {
  const payload = {
    name: normalizeTurkishText(params.name),
    code: validateReferralCodeToken(params.code),
  };
  const { data, error } = await supabase.from("referral_types").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateReferralSource(params: { id: string; name?: string; is_active?: boolean }) {
  const payload: { name?: string; is_active?: boolean } = {};
  if (typeof params.name === "string") payload.name = normalizeTurkishText(params.name);
  if (typeof params.is_active === "boolean") payload.is_active = params.is_active;
  const { data, error } = await supabase.from("referral_sources").update(payload).eq("id", params.id).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateReferralGroup(params: { id: string; name?: string; is_active?: boolean }) {
  const payload: { name?: string; is_active?: boolean } = {};
  if (typeof params.name === "string") payload.name = normalizeTurkishText(params.name);
  if (typeof params.is_active === "boolean") payload.is_active = params.is_active;
  const { data, error } = await supabase.from("referral_groups").update(payload).eq("id", params.id).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateReferralType(params: { id: string; name?: string; is_active?: boolean }) {
  const payload: { name?: string; is_active?: boolean } = {};
  if (typeof params.name === "string") payload.name = normalizeTurkishText(params.name);
  if (typeof params.is_active === "boolean") payload.is_active = params.is_active;
  const { data, error } = await supabase.from("referral_types").update(payload).eq("id", params.id).select("*").single();
  if (error) throw error;
  return data;
}

export async function createReferralCode(params: {
  sourceId: string;
  groupId: string;
  typeId: string;
  validFrom: string;
  validUntil: string;
  note?: string | null;
  createdBy?: string | null;
  randomLength?: 5 | 6 | 7;
}): Promise<ReferralCodeRow> {
  const [sourceList, groupList, typeList] = await Promise.all([
    listReferralSources(false),
    listReferralGroups(false),
    listReferralTypes(false),
  ]);
  const source = sourceList.find((item) => item.id === params.sourceId);
  const group = groupList.find((item) => item.id === params.groupId);
  const type = typeList.find((item) => item.id === params.typeId);
  if (!source) throw new Error("Referral source not found.");
  if (!group) throw new Error("Referral group not found.");
  if (!type) throw new Error("Referral type not found.");

  return createReferralCodeWithRetry(
    {
      source,
      group,
      type,
      validFrom: params.validFrom,
      validUntil: params.validUntil,
      note: params.note ?? null,
      createdBy: params.createdBy ?? null,
      randomLength: params.randomLength ?? 6,
    },
    async (payload) => {
      const { data, error } = await supabase.from("referral_codes").insert(payload).select("*").single();
      return { data, error };
    },
  );
}
