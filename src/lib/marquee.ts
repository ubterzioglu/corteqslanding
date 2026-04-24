import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type MarqueeItemType = "news" | "stat" | "announcement";
export type MarqueeItemRow = Tables<"marquee_items">;
export type MarqueeItemInsert = TablesInsert<"marquee_items">;
export type MarqueeItemUpdate = TablesUpdate<"marquee_items">;

export const marqueeTypeLabels: Record<MarqueeItemType, string> = {
  news: "Haber",
  stat: "İstatistik",
  announcement: "Duyuru",
};

export const fallbackMarqueeItems: MarqueeItemRow[] = [
  {
    id: "fallback-164-country",
    type: "stat",
    slug: "turk-diasporasi-164-ulke",
    title: "Türk diasporası 164 ülkede görünür",
    summary: "CorteQS, şehir bazlı bağlantılarla küresel Türk topluluğunu tek ekosistemde toplamayı hedefliyor.",
    detail_content: null,
    image_url: "/og-image.png",
    image_alt: "CorteQS küresel diaspora ağı",
    metric_value: "164 ülke",
    link_enabled: true,
    sort_order: 10,
    is_active: true,
    published_at: new Date(0).toISOString(),
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  {
    id: "fallback-8-8-million",
    type: "stat",
    slug: null,
    title: "8.8 milyon kişilik küresel topluluk",
    summary: "Yurt dışında yaşayan Türkler için şehir, meslek ve ihtiyaç bazlı bağlantı alanı kuruluyor.",
    detail_content: null,
    image_url: "/logocorteqsbig.png",
    image_alt: "CorteQS diaspora bağlantı görseli",
    metric_value: "8.8 milyon",
    link_enabled: false,
    sort_order: 20,
    is_active: true,
    published_at: new Date(0).toISOString(),
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  {
    id: "fallback-announcement",
    type: "announcement",
    slug: "erken-kayit-duyurusu",
    title: "Erken kayıt ve şehir elçisi başvuruları açık",
    summary: "Platform açılışı öncesi danışman, işletme, içerik üreticisi ve şehir elçisi adayları kayıt bırakabiliyor.",
    detail_content: null,
    image_url: "/og-image.png",
    image_alt: "CorteQS erken kayıt duyurusu",
    metric_value: null,
    link_enabled: true,
    sort_order: 30,
    is_active: true,
    published_at: new Date(0).toISOString(),
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
];

export function slugifyMarqueeTitle(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function listPublicMarqueeItems(): Promise<MarqueeItemRow[]> {
  const { data, error } = await supabase
    .from("marquee_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPublicMarqueeItemBySlug(slug: string): Promise<MarqueeItemRow | null> {
  const { data, error } = await supabase
    .from("marquee_items")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("link_enabled", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listAdminMarqueeItems(): Promise<MarqueeItemRow[]> {
  const { data, error } = await supabase
    .from("marquee_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createMarqueeItem(payload: MarqueeItemInsert): Promise<MarqueeItemRow> {
  const { data, error } = await supabase.from("marquee_items").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateMarqueeItem(id: string, payload: MarqueeItemUpdate): Promise<MarqueeItemRow> {
  const { data, error } = await supabase.from("marquee_items").update(payload).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteMarqueeItem(id: string): Promise<void> {
  const { error } = await supabase.from("marquee_items").delete().eq("id", id);
  if (error) throw error;
}
