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

type WhatsAppLandingRow = Tables<"whatsapp_landings">;
type WhatsAppJoinRequestInsert = TablesInsert<"whatsapp_join_requests">;

export interface WhatsAppLanding {
  id: string;
  dbId?: string;
  groupName: string;
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

const DEMOS: WhatsAppLanding[] = [
  {
    id: "odtu-almanya",
    groupName: "ODTU Mezunlari Almanya",
    category: "alumni",
    country: "Almanya",
    city: "Berlin",
    mode: "visual",
    heroImage:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=600&fit=crop",
    tagline: "Almanya'daki ODTU ailesi tek cati altinda",
    callToActionText:
      "Mezun networking, kariyer firsatlari ve sehir bulusmalari icin aramiza katil.",
    conditions:
      "Sadece ODTU mezunlari\nMezuniyet yili ve bolum ile tanis\nReklam ve link spam yasak",
    whatsappLink: "https://chat.whatsapp.com/odtu-almanya",
    adminName: "Burak Yilmaz",
    adminContact: "+49 170 000 0000",
    description: "Demo grup",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doktor-londra",
    groupName: "Londra Turk Doktorlar Networking",
    category: "doktor",
    country: "Ingiltere",
    city: "Londra",
    mode: "text",
    tagline: "NHS ve ozel sektorde Turk hekim dayanismasi",
    callToActionText:
      "Vaka tartismasi, brans referansi ve is ilanlari icin profesyonel bir hekim agi.",
    conditions:
      "Sadece doktorlar veya süreçteki hekimler\nKısa tanıtım gerekli\nHasta bilgisi paylaşımı yasak",
    whatsappLink: "https://chat.whatsapp.com/doktor-london",
    adminName: "Dr. Leyla Aydin",
    adminContact: "info@corteqs.net",
    description: "Demo grup",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kitap-dubai",
    groupName: "Dubai Turk Kitap Kulubu",
    category: "hobi",
    country: "BAE",
    city: "Dubai",
    mode: "visual",
    heroImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop",
    tagline: "Ayda bir kitap, ayda bir bulusma",
    callToActionText:
      "Dubai'de yasayan Turk kitapseverler icin her ay secilen kitabi birlikte tartisiyoruz.",
    conditions:
      "Aylik kitabi okuma sozu ver\nSpoiler uyarisina dikkat et\nGrup ici reklam yasak",
    whatsappLink: "https://chat.whatsapp.com/kitap-dubai",
    adminName: "Selma Kaya",
    adminContact: "+971 50 000 0000",
    description: "Demo grup",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

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

function rowToLanding(row: WhatsAppLandingRow): WhatsAppLanding {
  return {
    id: row.slug,
    dbId: row.id,
    groupName: row.group_name,
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
  if (!user) throw new Error("Giris yapmalisin.");
  return user;
}

export async function getLanding(slug: string): Promise<WhatsAppLanding | undefined> {
  const { data, error } = await supabase
    .from("whatsapp_landings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!error && data) return rowToLanding(data);
  return DEMOS.find((entry) => entry.id === slug);
}

export async function listLandings(): Promise<WhatsAppLanding[]> {
  const { data, error } = await supabase
    .from("whatsapp_landings")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (!error && data && data.length > 0) {
    return data.map(rowToLanding);
  }

  return DEMOS;
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

export async function deleteLanding(dbId: string) {
  const { error } = await supabase.from("whatsapp_landings").delete().eq("id", dbId);
  if (error) throw error;
}
