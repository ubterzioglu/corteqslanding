import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRegistration, isValidWhatsappPhone, validateOptionalUrl } from "@/lib/lansman";
import type { LansmanRegistrationFormData } from "@/types/lansman";

type FormErrors = Partial<Record<keyof LansmanRegistrationFormData, string>>;

const initialValues: LansmanRegistrationFormData = {
  first_name: "",
  last_name: "",
  phone: "",
  linkedin: "",
  instagram: "",
  youtube: "",
  website: "",
  description: "",
};

const optionalUrlFields: Array<keyof Pick<LansmanRegistrationFormData, "website">> = ["website"];

interface LansmanFormProps {
  onSuccess?: () => void;
}

const LansmanForm = ({ onSuccess }: LansmanFormProps) => {
  const [values, setValues] = useState<LansmanRegistrationFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const updateValue = (field: keyof LansmanRegistrationFormData, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccessMessage("");
    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!values.first_name.trim()) {
      nextErrors.first_name = "Ad alanı zorunludur.";
    }

    if (!values.last_name.trim()) {
      nextErrors.last_name = "Soyad alanı zorunludur.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "WhatsApp numarası zorunludur.";
    } else if (!isValidWhatsappPhone(values.phone)) {
      nextErrors.phone = "WhatsApp numarasını uluslararası formatta girin. Örnek: +491701234567";
    }

    if (!values.instagram.trim()) {
      nextErrors.instagram = "Instagram kullanıcı adı zorunludur.";
    }

    for (const field of optionalUrlFields) {
      try {
        validateOptionalUrl(values[field]);
      } catch (error) {
        nextErrors[field] =
          error instanceof Error ? error.message : "Geçerli bir URL girin.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      await createRegistration(values);
      setValues(initialValues);
      setErrors({});
      setSuccessMessage("Kayıt alındı, onay bekliyor.");
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (field: keyof LansmanRegistrationFormData) =>
    errors[field] ? (
      <p className="text-sm text-destructive" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 text-white"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Lansman Kaydı</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Zorunlu alanlar
        </p>

        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium text-white">
            Ad
          </label>
          <Input
            id="first_name"
            value={values.first_name}
            onChange={(event) => updateValue("first_name", event.target.value)}
            aria-invalid={Boolean(errors.first_name)}
          />
          {renderFieldError("first_name")}
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="text-sm font-medium text-white">
            Soyad
          </label>
          <Input
            id="last_name"
            value={values.last_name}
            onChange={(event) => updateValue("last_name", event.target.value)}
            aria-invalid={Boolean(errors.last_name)}
          />
          {renderFieldError("last_name")}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-white">
          WhatsApp Numarası
        </label>
        <Input
          id="phone"
          value={values.phone}
          onChange={(event) => updateValue("phone", event.target.value)}
          placeholder="+491701234567"
          aria-invalid={Boolean(errors.phone)}
        />
        <p className="text-xs text-slate-200">
          WhatsApp uyumlu uluslararası format kullanın.
        </p>
        {renderFieldError("phone")}
        <div className="space-y-2">
          <label htmlFor="instagram" className="text-sm font-medium text-white">
            Instagram
          </label>
          <Input
            id="instagram"
            value={values.instagram}
            onChange={(event) => updateValue("instagram", event.target.value)}
            placeholder="Kullanıcı adınızı yazın"
            aria-invalid={Boolean(errors.instagram)}
          />
          <p className="text-xs text-slate-200">
            Sadece Instagram kullanıcı adınızı yazın, link yazmayın.
          </p>
          {renderFieldError("instagram")}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Opsiyonel
        </p>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium text-white">
            LinkedIn
          </label>
          <Input
            id="linkedin"
            value={values.linkedin}
            onChange={(event) => updateValue("linkedin", event.target.value)}
            placeholder="/in sonrasını yazın (opsiyonel)"
            aria-invalid={Boolean(errors.linkedin)}
          />
          <p className="text-xs text-slate-200">
            Sadece LinkedIn kullanıcı adınızı yazın, link yazmayın. Opsiyonel.
          </p>
          {renderFieldError("linkedin")}
        </div>

        <div className="space-y-2">
          <label htmlFor="youtube" className="text-sm font-medium text-white">
            YouTube
          </label>
          <Input
            id="youtube"
            value={values.youtube}
            onChange={(event) => updateValue("youtube", event.target.value)}
            placeholder="Kanal adınızı yazın (opsiyonel)"
            aria-invalid={Boolean(errors.youtube)}
          />
          <p className="text-xs text-slate-200">
            Sadece YouTube kanal adınızı yazın, link yazmayın. Opsiyonel.
          </p>
          {renderFieldError("youtube")}
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium text-white">
            Web Sitesi
          </label>
          <Input
            id="website"
            value={values.website}
            onChange={(event) => updateValue("website", event.target.value)}
            placeholder="https://example.com (opsiyonel)"
            aria-invalid={Boolean(errors.website)}
          />
          <p className="text-xs text-slate-200">
            Web siteniz varsa tam adresini yazabilirsiniz. Opsiyonel.
          </p>
          {renderFieldError("website")}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-white">
          Sorular ve Yorumlar
        </label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          rows={4}
        />
      </div>

      {successMessage ? (
        <p className="rounded-md border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      {submitError ? (
        <p className="rounded-md border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 hover:bg-slate-100">
        {isSubmitting ? "Gönderiliyor..." : "Kaydı Gönder"}
      </Button>
    </form>
  );
};

export default LansmanForm;
