import { supabase } from "@/integrations/supabase/client";

export type RadarNewsType = "news" | "stat" | "announcement";

export interface RadarNewsItem {
  id: string;
  type: RadarNewsType;
  title: string;
  summary: string;
  detailContent: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  metricValue: string | null;
  linkEnabled: boolean;
  slug: string | null;
  sortOrder: number;
  isActive: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  externalUrl: string | null;
}

export interface RadarNewsInput {
  type: RadarNewsType;
  title: string;
  summary: string;
  detailContent?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  metricValue?: string | null;
  slug?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  publishedAt?: string;
  externalUrl?: string | null;
}

const RADAR_SELECT =
  "id,type,title,summary,detail_content,image_url,image_alt,metric_value,link_enabled,slug,sort_order,is_active,published_at,created_at,updated_at,external_url";

const mapRadarNewsItem = (row: any): RadarNewsItem => ({
  id: row.id,
  type: row.type,
  title: row.title,
  summary: row.summary,
  detailContent: row.detail_content,
  imageUrl: row.image_url,
  imageAlt: row.image_alt,
  metricValue: row.metric_value,
  linkEnabled: row.link_enabled,
  slug: row.slug,
  sortOrder: row.sort_order,
  isActive: row.is_active,
  publishedAt: row.published_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  externalUrl: row.external_url,
});

const toDbPayload = (input: RadarNewsInput) => {
  const detailContent = input.detailContent?.trim() || null;
  const slug = detailContent ? slugify(input.slug || input.title) : null;

  return {
    type: input.type,
    title: input.title.trim(),
    summary: input.summary.trim(),
    detail_content: detailContent,
    image_url: input.imageUrl?.trim() || null,
    image_alt: input.imageAlt?.trim() || null,
    metric_value: input.metricValue?.trim() || null,
    slug,
    link_enabled: Boolean(detailContent && slug),
    sort_order: input.sortOrder ?? 0,
    is_active: input.isActive ?? true,
    published_at: input.publishedAt ?? new Date().toISOString(),
    external_url: input.externalUrl?.trim() || null,
  };
};

export const slugify = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

export const formatRadarDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export async function fetchPublicRadarNews(limit?: number) {
  let query = supabase
    .from("marquee_items")
    .select(RADAR_SELECT)
    .eq("type", "news")
    .eq("is_active", true)
    .lte("published_at", new Date().toISOString())
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRadarNewsItem);
}

export async function fetchRadarNewsAdmin() {
  const { data, error } = await supabase
    .from("marquee_items")
    .select(RADAR_SELECT)
    .eq("type", "news")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRadarNewsItem);
}

export async function fetchRadarNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("marquee_items")
    .select(RADAR_SELECT)
    .eq("type", "news")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRadarNewsItem(data) : null;
}

export async function createRadarNews(input: RadarNewsInput) {
  const { data, error } = await supabase
    .from("marquee_items")
    .insert(toDbPayload(input))
    .select(RADAR_SELECT)
    .single();

  if (error) throw error;
  return mapRadarNewsItem(data);
}

export async function updateRadarNews(id: string, input: RadarNewsInput) {
  const { data, error } = await supabase
    .from("marquee_items")
    .update(toDbPayload(input))
    .eq("id", id)
    .select(RADAR_SELECT)
    .single();

  if (error) throw error;
  return mapRadarNewsItem(data);
}

export async function deleteRadarNews(id: string) {
  const { error } = await supabase.from("marquee_items").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadRadarImage(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `radar/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("newsimage")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("newsimage").getPublicUrl(path);
  return data.publicUrl;
}
