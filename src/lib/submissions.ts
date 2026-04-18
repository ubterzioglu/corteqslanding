import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Submission = Tables<"submissions">;
export type SubmissionInsert = TablesInsert<"submissions">;
export type SubmissionStatus = Submission["status"];
export type SubmissionFormMode = "register" | "support" | "backer";

export const categoryOptions = [
  { value: "danisman", label: "Danışman" },
  { value: "isletme", label: "İşletme / Şirket" },
  { value: "dernek", label: "Dernek" },
  { value: "vakif", label: "Vakıf" },
  { value: "radyo-tv", label: "Radyo / TV" },
  { value: "blogger-vlogger", label: "Blogger / Vlogger" },
  { value: "sehir-elcisi", label: "Şehir Elçisi" },
  { value: "bireysel", label: "Bireysel Kullanıcı" },
  { value: "support", label: "Destek / Yatırım" },
] as const;

const categoryLabelMap = new Map(categoryOptions.map((option) => [option.value, option.label]));

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
    submission.notes,
    submission.company_name,
    submission.donation_amount?.toString(),
    submission.donation_currency,
    submission.whatsapp_interest?.toString(),
    submission.linkedin,
    submission.instagram,
    submission.tiktok,
    submission.facebook,
    submission.twitter,
    submission.website,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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
    contest_interest: !isBacker && values.contest_interest === "yes",
    whatsapp_interest: isBacker ? values.whatsapp_interest === "yes" : values.whatsapp_interest === "yes",
    donation_amount: isBacker ? Number(values.donation_amount ?? 0) || null : null,
    donation_currency: isBacker ? "USD" : null,
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
