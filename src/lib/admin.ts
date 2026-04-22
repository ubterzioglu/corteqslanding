import { supabase } from "@/integrations/supabase/client";
import {
  type CreateReferralCodeParams,
  createReferralCodeWithRetry,
  type ReferralCodeRow,
} from "@/lib/referral-codes";

export async function userIsAdmin(userId: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function createReferralCode(params: CreateReferralCodeParams): Promise<ReferralCodeRow> {
  return createReferralCodeWithRetry(params, async (payload) => {
    const { data, error } = await supabase.from("referral_codes").insert(payload).select("*").single();
    return { data, error };
  });
}
