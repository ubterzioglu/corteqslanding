import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import type {
  LansmanRegistration,
  LansmanRegistrationFormData,
  LansmanRegistrationInsert,
  LansmanRegistrationStatus,
} from "@/types/lansman";

const phonePattern = /^\+[1-9]\d{7,14}$/;
const optionalUrlSchema = z.string().trim().url("Geçerli bir URL girin.");
export function normalizePhone(phone: string) {
  return phone.replace(/[\s\-().]/g, "");
}

export function isValidWhatsappPhone(phone: string) {
  return phonePattern.test(normalizePhone(phone));
}

export function buildInitials(firstName: string, lastName: string) {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function validateOptionalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return optionalUrlSchema.parse(trimmed);
}

function validateRegistrationInput(data: LansmanRegistrationFormData) {
  const firstName = data.first_name.trim();
  const lastName = data.last_name.trim();
  const phone = normalizePhone(data.phone);

  if (!firstName) {
    throw new Error("Ad alanı zorunludur.");
  }

  if (!lastName) {
    throw new Error("Soyad alanı zorunludur.");
  }

  if (!isValidWhatsappPhone(phone)) {
    throw new Error("Telefon numarasını ülke kodu ile girin. Örn: +491701234567");
  }

  return {
    first_name: firstName,
    last_name: lastName,
    phone,
    linkedin: validateOptionalUrl(data.linkedin),
    instagram: validateOptionalUrl(data.instagram),
    youtube: validateOptionalUrl(data.youtube),
    website: validateOptionalUrl(data.website),
    description: normalizeOptionalText(data.description),
  };
}

export async function createRegistration(data: LansmanRegistrationFormData) {
  const validated = validateRegistrationInput(data);
  const payload: LansmanRegistrationInsert = {
    ...validated,
    initials: buildInitials(validated.first_name, validated.last_name),
    status: "pending",
  };

  const { error } = await supabase
    .from("lansman_registrations")
    .insert(payload);

  if (error) throw error;
  return payload;
}

export async function getAllRegistrations() {
  const { data, error } = await supabase
    .from("lansman_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LansmanRegistration[];
}

export async function updateRegistrationStatus(
  id: string,
  status: LansmanRegistrationStatus,
) {
  if (status !== "approved" && status !== "rejected") {
    throw new Error("Geçersiz durum güncellemesi.");
  }

  const { data, error } = await supabase
    .from("lansman_registrations")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as LansmanRegistration;
}
