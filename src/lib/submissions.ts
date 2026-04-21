import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Submission = Tables<"submissions">;
export type SubmissionInsert = TablesInsert<"submissions">;
export type SubmissionStatus = Submission["status"];
export type SubmissionFormMode = "register" | "support" | "backer";
export type UploadedDocument = {
  url: string;
  name: string;
};

export const allowedSubmissionDocumentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const maxSubmissionDocumentBytes = 10 * 1024 * 1024;
export const maxSubmissionDocumentCount = 5;

export const categoryOptions = [
  { value: "danisman", label: "Danışman" },
  { value: "isletme", label: "İşletme / Şirket" },
  { value: "dernek", label: "Dernek" },
  { value: "vakif", label: "Vakıf" },
  { value: "radyo-tv", label: "Radyo / TV" },
  { value: "blogger-vlogger", label: "Blogger / Vlogger" },
  { value: "influencer", label: "Influencer" },
  { value: "sehir-elcisi", label: "Şehir Elçisi" },
  { value: "bireysel", label: "Bireysel Kullanıcı" },
  { value: "support", label: "Destek / Yatırım" },
] as const;

export const referralSourceOptions = [
  { value: "whatsapp", label: "WhatsApp Grubu" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x-twitter", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "arkadas-tavsiye", label: "Arkadaş / Tavsiye" },
  { value: "etkinlik", label: "Etkinlik / Buluşma" },
  { value: "google", label: "Google Arama" },
  { value: "basin-haber", label: "Basın / Haber" },
  { value: "diger", label: "Diğer" },
] as const;

const categoryLabelMap = new Map(categoryOptions.map((option) => [option.value, option.label]));
const referralLabelMap = new Map(referralSourceOptions.map((option) => [option.value, option.label]));

const statusLabelMap: Record<SubmissionStatus, string> = {
  new: "Yeni",
  contacted: "İletişime geçildi",
  archived: "Arşivlendi",
};

export const submissionStatusOptions: Array<{ value: SubmissionStatus; label: string }> = [
  { value: "new", label: statusLabelMap.new },
  { value: "contacted", label: statusLabelMap.contacted },
  { value: "archived", label: statusLabelMap.archived },
];

export function getCategoryLabel(category: string | null) {
  if (!category) return "Belirtilmedi";
  return categoryLabelMap.get(category) ?? category;
}

export function getFormTypeLabel(formType: string) {
  if (formType === "support") return "Destek";
  if (formType === "backer") return "Backer";
  return "Kayıt";
}

export function getStatusLabel(status: SubmissionStatus) {
  return statusLabelMap[status] ?? status;
}

export function getReferralSourceLabel(source: string | null) {
  if (!source) return "Belirtilmedi";
  return referralLabelMap.get(source) ?? source;
}

export function shouldShowReferralDetail(source: string) {
  return source !== "" && source !== "google" && source !== "basin-haber";
}

export function isReferralDetailRequired(source: string) {
  return source === "whatsapp";
}

export function getReferralDetailLabel(source: string) {
  if (source === "whatsapp") return "Hangi WhatsApp grubu? *";
  if (source === "instagram") return "Hangi Instagram hesabı / gönderi?";
  if (source === "linkedin") return "Hangi LinkedIn hesabı / gönderi?";
  if (source === "x-twitter") return "Hangi X (Twitter) hesabı?";
  if (source === "facebook") return "Hangi Facebook sayfa / grubu?";
  if (source === "tiktok") return "Hangi TikTok hesabı?";
  if (source === "youtube") return "Hangi YouTube kanalı / videosu?";
  if (source === "arkadas-tavsiye") return "Sizi yönlendiren kişinin adı";
  if (source === "etkinlik") return "Hangi etkinlik / buluşma?";
  if (source === "diger") return "Lütfen detay verin";
  return "Detay";
}

export function getReferralDetailPlaceholder(source: string) {
  if (source === "whatsapp") return "Örn: Berlin Diaspora Topluluğu";
  if (source === "arkadas-tavsiye") return "Örn: Ahmet Yılmaz";
  return "Detay yazın";
}

export function buildSubmissionSearchText(submission: Submission) {
  return [
    submission.form_type,
    submission.category,
    submission.status,
    submission.fullname,
    submission.country,
    submission.city,
    submission.business,
    submission.field,
    submission.email,
    submission.phone,
    submission.description,
    submission.offers_needs,
    submission.notes,
    submission.document_name,
    submission.company_name,
    submission.donation_amount?.toString(),
    submission.donation_currency,
    submission.whatsapp_interest?.toString(),
    submission.referral_source,
    submission.referral_detail,
    submission.referral_code,
    submission.linkedin,
    submission.instagram,
    submission.tiktok,
    submission.facebook,
    submission.twitter,
    submission.website,
    submission.documents
      ?.map((document) => {
        if (!document || typeof document !== "object") return "";
        return "name" in document && typeof document.name === "string" ? document.name : "";
      })
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function validateSubmissionDocuments(files: File[], currentFiles: File[] = []) {
  const merged = [...currentFiles];

  for (const file of files) {
    if (!allowedSubmissionDocumentTypes.includes(file.type as (typeof allowedSubmissionDocumentTypes)[number])) {
      return {
        ok: false as const,
        message: `"${file.name}" desteklenmeyen format. Sadece PDF, DOC, DOCX, JPG, PNG, WEBP.`,
      };
    }

    if (file.size > maxSubmissionDocumentBytes) {
      return {
        ok: false as const,
        message: `"${file.name}" çok büyük. Dosya başına maks. 10 MB.`,
      };
    }

    if (merged.length >= maxSubmissionDocumentCount) {
      return {
        ok: false as const,
        message: `En fazla ${maxSubmissionDocumentCount} dosya yükleyebilirsiniz.`,
      };
    }

    if (!merged.some((existing) => existing.name === file.name && existing.size === file.size)) {
      merged.push(file);
    }
  }

  return { ok: true as const, files: merged };
}

export async function uploadSubmissionDocuments(files: File[]): Promise<UploadedDocument[]> {
  if (!files.length) return [];

  const { supabase } = await import("@/integrations/supabase/client");
  const uploadedDocs: UploadedDocument[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error } = await supabase.storage
      .from("submission-documents")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("submission-documents").getPublicUrl(path);
    uploadedDocs.push({ url: data.publicUrl, name: file.name });
  }

  return uploadedDocs;
}

export function toSubmissionInsert(
  values: Record<string, FormDataEntryValue>,
  mode: SubmissionFormMode,
): SubmissionInsert {
  const isSupport = mode === "support";
  const isBacker = mode === "backer";

  return {
    form_type: isBacker ? "backer" : isSupport ? "support" : "register",
    category: isBacker ? "backer" : isSupport ? "support" : String(values.category ?? ""),
    fullname: String(values.fullname ?? ""),
    country: String(values.country ?? ""),
    city: String(values.city ?? ""),
    business: String(values.business ?? "") || null,
    company_name: isBacker ? (String(values.company_name ?? "") || null) : null,
    field: isBacker ? (String(values.donor_type ?? "") === "company" ? "Firma Bağışı" : "Bireysel Bağışçı") : String(values.field ?? ""),
    email: String(values.email ?? ""),
    phone: String(values.phone ?? ""),
    description: String(values.description ?? "") || null,
    offers_needs: String(values.offers_needs ?? "").trim() || null,
    document_url: String(values.document_url ?? "") || null,
    document_name: String(values.document_name ?? "") || null,
    documents: Array.isArray(values.documents) ? (values.documents as unknown as SubmissionInsert["documents"]) : [],
    contest_interest: !isBacker && values.contest_interest === "yes",
    whatsapp_interest: isBacker ? values.whatsapp_interest === "yes" : values.whatsapp_interest === "yes",
    donation_amount: isBacker ? Number(values.donation_amount ?? 0) || null : null,
    donation_currency: isBacker ? "USD" : null,
    referral_source: String(values.referral_source ?? "") || null,
    referral_detail: String(values.referral_detail ?? "").trim() || null,
    referral_code: String(values.referral_code ?? "").trim().toUpperCase() || null,
    linkedin: String(values.linkedin ?? "") || null,
    instagram: String(values.instagram ?? "") || null,
    tiktok: String(values.tiktok ?? "") || null,
    facebook: String(values.facebook ?? "") || null,
    twitter: String(values.twitter ?? "") || null,
    website: String(values.website ?? "") || null,
    consent: true,
    status: "new",
  };
}
