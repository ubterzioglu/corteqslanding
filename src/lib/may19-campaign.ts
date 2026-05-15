import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export type May19SubmissionKind = "idea" | "moment";

export type SubmitMay19CampaignInput = {
  kind: May19SubmissionKind;
  fullName: string;
  email: string;
  country: string;
  city: string;
  socialHandle?: string;
  title: string;
  description: string;
  message?: string;
  link?: string;
  consent: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function submitMay19CampaignEntry(input: SubmitMay19CampaignInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const country = input.country.trim();
  const city = input.city.trim();
  const title = input.title.trim();
  const description = input.description.trim();
  const message = normalizeOptional(input.message);
  const socialHandle = normalizeOptional(input.socialHandle);
  const link = normalizeOptional(input.link);

  if (!fullName || !email || !country || !city || !title || !description) {
    throw new Error("Lutfen zorunlu alanlari doldurun.");
  }

  if (!emailPattern.test(email)) {
    throw new Error("Gecerli bir e-posta adresi girin.");
  }

  if (!input.consent) {
    throw new Error("Gonderim icin izin kutusunu isaretleyin.");
  }

  if (link) {
    try {
      new URL(link);
    } catch {
      throw new Error("Paylasim linki gecerli bir URL olmali.");
    }
  }

  const payload: TablesInsert<"may19_campaign_submissions"> = {
    kind: input.kind,
    full_name: fullName,
    email,
    country,
    city,
    social_handle: socialHandle,
    title,
    description,
    message,
    link,
    consent: input.consent,
  };

  const { error } = await supabase.from("may19_campaign_submissions").insert(payload);

  if (error) {
    throw error;
  }
}
