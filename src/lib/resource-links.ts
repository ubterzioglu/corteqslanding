import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export const resourceLinkPlatforms = [
  "Instagram",
  "LinkedIn",
  "Twitter (X)",
  "YouTube",
  "TikTok",
  "Facebook",
  "Reddit",
  "Discord",
  "Diğer",
] as const;

export const resourceLinkAuthors = ["UBT", "Burak", "Diğer"] as const;

export type ResourceLinkTableName = "advisor_social_media_links" | "social_media_links";
export type ResourceLinkPlatform = (typeof resourceLinkPlatforms)[number];
export type ResourceLinkAuthor = (typeof resourceLinkAuthors)[number];
export type AdvisorResourceLinkRow = Tables<"advisor_social_media_links">;
export type SocialResourceLinkRow = Tables<"social_media_links">;
export type ResourceLinkRow = AdvisorResourceLinkRow | SocialResourceLinkRow;
export type ResourceLinkInsert = TablesInsert<"advisor_social_media_links">;
export type ResourceLinkUpdate = TablesUpdate<"advisor_social_media_links">;

export type ResourceLinkFormState = {
  platform: ResourceLinkPlatform;
  description: string;
  link: string;
  added_by: ResourceLinkAuthor;
};

export function createEmptyResourceLinkFormState(): ResourceLinkFormState {
  return {
    platform: "Diğer",
    description: "",
    link: "",
    added_by: "UBT",
  };
}

export function validateResourceLinkUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Link URL zorunlu.";
  if (!/^https?:\/\/\S+$/i.test(trimmed)) return "Link http:// veya https:// ile başlamalı.";
  return null;
}

export function toResourceLinkPayload(form: ResourceLinkFormState): ResourceLinkInsert {
  const urlError = validateResourceLinkUrl(form.link);
  if (urlError) throw new Error(urlError);

  return {
    platform: form.platform,
    description: form.description.trim() || null,
    link: form.link.trim(),
    added_by: form.added_by,
  };
}

export function toResourceLinkFormState(row: ResourceLinkRow): ResourceLinkFormState {
  return {
    platform: row.platform,
    description: row.description ?? "",
    link: row.link ?? "",
    added_by: row.added_by,
  };
}

export function safeResourceHref(value: string | null) {
  if (!value) return "#";
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return "#";
  return trimmed;
}

export async function listResourceLinks(tableName: ResourceLinkTableName): Promise<ResourceLinkRow[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createResourceLink(
  tableName: ResourceLinkTableName,
  payload: ResourceLinkInsert,
): Promise<ResourceLinkRow> {
  const { data, error } = await supabase.from(tableName).insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateResourceLink(
  tableName: ResourceLinkTableName,
  id: string,
  payload: ResourceLinkUpdate,
): Promise<ResourceLinkRow> {
  const { data, error } = await supabase.from(tableName).update(payload).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteResourceLink(tableName: ResourceLinkTableName, id: string): Promise<void> {
  const { error } = await supabase.from(tableName).delete().eq("id", id);
  if (error) throw error;
}
