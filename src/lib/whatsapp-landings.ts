import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type LandingMode = "visual" | "text";
export type LandingCategory =
  | "alumni"
  | "hobi"
  | "is"
  | "doktor"
  | "yatirim"
  | "girisim"
  | "akademik"
  | "dayanisma"
  | "diger";
export type LandingStatus = "pending" | "approved" | "rejected";
export type LandingSubmitterRole = "manager" | "member";

type WhatsAppLandingRow = Tables<"whatsapp_landings">;
type WhatsAppJoinRequestInsert = TablesInsert<"whatsapp_join_requests">;

export interface WhatsAppLanding {
  id: string;
  dbId?: string;
  groupName: string;
  platform?: string;
  category: LandingCategory;
  country: string;
  city: string;
  mode: LandingMode;
  heroImage?: string;
  tagline: string;
  callToActionText: string;
  conditions: string;
  whatsappLink: string;
  adminName?: string;
  adminContact?: string;
  description?: string;
  submitterRole?: LandingSubmitterRole;
  memberApproved?: boolean;
  adminApproved?: boolean;
  status?: LandingStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface SaveLandingInput {
  groupName: string;
  category: LandingCategory;
  country: string;
  city: string;
  mode: LandingMode;
  heroImage?: string;
  tagline?: string;
  callToActionText?: string;
  conditions?: string;
  whatsappLink: string;
  adminName?: string;
  adminContact?: string;
  description?: string;
}

export interface JoinRequestInput {
  landingDbId: string;
  fullName: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface UpdateLandingInput {
  groupName: string;
  category: LandingCategory;
  country: string;
  city: string;
  mode: LandingMode;
  heroImage?: string;
  tagline?: string;
  callToActionText?: string;
  conditions?: string;
  whatsappLink: string;
  adminName?: string;
  adminContact?: string;
  description?: string;
}

const WHATSAPP_LANDING_HERO_BUCKET = "whatsapp-landing-hero";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function parseSubmitterRole(description?: string | null): LandingSubmitterRole | undefined {
  if (!description) return undefined;
  if (description.includes("[Başvuru tipi: Topluluk Yöneticisiyim]")) return "manager";
  if (description.includes("[Başvuru tipi: Topluluk Üyesiyim]")) return "member";
  return undefined;
}

function parseTagValue(description: string | null | undefined, tagName: string) {
  if (!description) return undefined;
  const match = description.match(new RegExp(`\\[${tagName}:\\s*([^\\]]+)\\]`, "i"));
  return match?.[1]?.trim();
}

function parseBooleanTag(description: string | null | undefined, tagName: string, fallback: boolean) {
  if (!description) return fallback;
  const match = description.match(new RegExp(`\\[${tagName}:\\s*(true|false)\\]`, "i"));
  if (!match) return fallback;
  return match[1].toLowerCase() === "true";
}

function rowToLanding(row: WhatsAppLandingRow): WhatsAppLanding {
  return {
    id: row.slug,
    dbId: row.id,
    groupName: row.group_name,
    platform: parseTagValue(row.description, "Platform"),
    category: row.category as LandingCategory,
    country: row.country,
    city: row.city,
    mode: row.mode as LandingMode,
    heroImage: row.hero_image ?? undefined,
    tagline: row.tagline ?? "",
    callToActionText: row.call_to_action_text ?? "",
    conditions: row.conditions ?? "",
    whatsappLink: row.whatsapp_link,
    adminName: row.admin_name ?? undefined,
    adminContact: row.admin_contact ?? undefined,
    description: row.description ?? undefined,
    submitterRole: parseSubmitterRole(row.description),
    memberApproved: parseBooleanTag(row.description, "Badge member", true),
    adminApproved: parseBooleanTag(row.description, "Badge admin", row.status === "approved"),
    status: row.status as LandingStatus,
    rejectionReason: row.rejection_reason ?? undefined,
    createdAt: row.created_at,
  };
}

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Giriş yapmalısın.");
  return user;
}

export async function getLanding(slug: string): Promise<WhatsAppLanding | undefined> {
  const { data, error } = await supabase
    .from("whatsapp_landings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!error && data) return rowToLanding(data);
  return undefined;
}

export async function listLandings(): Promise<WhatsAppLanding[]> {
  const { data, error } = await supabase
    .from("whatsapp_landings")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (!error && data) return data.map(rowToLanding);
  return [];
}

export async function submitLanding(input: SaveLandingInput): Promise<{ slug: string; id: string }> {
  const user = await getAuthenticatedUser();
  const baseSlug = slugify(`${input.groupName}-${input.city}`) || `addwa-${Date.now()}`;
  let slug = baseSlug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data } = await supabase.from("whatsapp_landings").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const payload: TablesInsert<"whatsapp_landings"> = {
    user_id: user.id,
    slug,
    group_name: input.groupName.trim(),
    category: input.category,
    country: input.country.trim(),
    city: input.city.trim(),
    mode: input.mode,
    hero_image: input.heroImage?.trim() || null,
    tagline: input.tagline?.trim() || null,
    call_to_action_text: input.callToActionText?.trim() || null,
    conditions: input.conditions?.trim() || null,
    whatsapp_link: input.whatsappLink.trim(),
    admin_name: input.adminName?.trim() || null,
    admin_contact: input.adminContact?.trim() || null,
    description: input.description?.trim() || null,
  };

  const { data, error } = await supabase
    .from("whatsapp_landings")
    .insert(payload)
    .select("id, slug")
    .single();

  if (error) throw error;
  return { id: data.id, slug: data.slug };
}

export async function uploadWhatsAppLandingHeroImage(file: File): Promise<string> {
  const user = await getAuthenticatedUser();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const safeBase = slugify(file.name.replace(/\.[^/.]+$/, "")) || "hero-image";
  const filePath = `${user.id}/${Date.now()}-${safeBase}.${extension}`;

  const { error } = await supabase.storage
    .from(WHATSAPP_LANDING_HERO_BUCKET)
    .upload(filePath, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage
    .from(WHATSAPP_LANDING_HERO_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createJoinRequest(input: JoinRequestInput) {
  const user = await getAuthenticatedUser();

  const payload: WhatsAppJoinRequestInsert = {
    landing_id: input.landingDbId,
    user_id: user.id,
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    note: input.note?.trim() || null,
  };

  const { error } = await supabase.from("whatsapp_join_requests").insert(payload);
  if (error) throw error;
}

export async function listAllSubmissions(status?: LandingStatus): Promise<WhatsAppLanding[]> {
  let query = supabase.from("whatsapp_landings").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(rowToLanding);
}

export async function setLandingStatus(dbId: string, status: LandingStatus, rejectionReason?: string) {
  const { error } = await supabase
    .from("whatsapp_landings")
    .update({
      status,
      rejection_reason: rejectionReason?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dbId);

  if (error) throw error;
}

export async function updateLandingTagline(dbId: string, tagline: string) {
  const { error } = await supabase
    .from("whatsapp_landings")
    .update({
      tagline: tagline.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dbId);

  if (error) throw error;
}

export async function updateLanding(dbId: string, input: UpdateLandingInput) {
  const { error } = await supabase
    .from("whatsapp_landings")
    .update({
      group_name: input.groupName.trim(),
      category: input.category,
      country: input.country.trim(),
      city: input.city.trim(),
      mode: input.mode,
      hero_image: input.heroImage?.trim() || null,
      tagline: input.tagline?.trim() || null,
      call_to_action_text: input.callToActionText?.trim() || null,
      conditions: input.conditions?.trim() || null,
      whatsapp_link: input.whatsappLink.trim(),
      admin_name: input.adminName?.trim() || null,
      admin_contact: input.adminContact?.trim() || null,
      description: input.description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dbId);

  if (error) throw error;
}

export async function deleteLanding(dbId: string) {
  const { error } = await supabase.from("whatsapp_landings").delete().eq("id", dbId);
  if (error) throw error;
}
