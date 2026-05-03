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
  twitter: "",
  website: "",
  description: "",
};

const optionalUrlFields: Array<keyof Pick<
  LansmanRegistrationFormData,
  "linkedin" | "instagram" | "twitter" | "website"
>> = ["linkedin", "instagram", "twitter", "website"];

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
      nextErrors.phone = "Telefon alanı zorunludur.";
    } else if (!isValidWhatsappPhone(values.phone)) {
      nextErrors.phone = "Telefon numarasını uluslararası formatta girin. Örn: +491701234567";
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Lansman Kaydı</h2>
        <p className="text-sm text-muted-foreground">
          Bilgilerinizi bırakın, başvurunuzu inceleyelim.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium text-foreground">
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
          <label htmlFor="last_name" className="text-sm font-medium text-foreground">
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
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Telefon
        </label>
        <Input
          id="phone"
          value={values.phone}
          onChange={(event) => updateValue("phone", event.target.value)}
          placeholder="+491701234567"
          aria-invalid={Boolean(errors.phone)}
        />
        <p className="text-xs text-muted-foreground">
          WhatsApp uyumlu uluslararası format kullanın.
        </p>
        {renderFieldError("phone")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium text-foreground">
            LinkedIn URL
          </label>
          <Input
            id="linkedin"
            value={values.linkedin}
            onChange={(event) => updateValue("linkedin", event.target.value)}
            placeholder="https://linkedin.com/in/ornek"
            aria-invalid={Boolean(errors.linkedin)}
          />
          {renderFieldError("linkedin")}
        </div>

        <div className="space-y-2">
          <label htmlFor="instagram" className="text-sm font-medium text-foreground">
            Instagram URL
          </label>
          <Input
            id="instagram"
            value={values.instagram}
            onChange={(event) => updateValue("instagram", event.target.value)}
            placeholder="https://instagram.com/ornek"
            aria-invalid={Boolean(errors.instagram)}
          />
          {renderFieldError("instagram")}
        </div>

        <div className="space-y-2">
          <label htmlFor="twitter" className="text-sm font-medium text-foreground">
            X / Twitter URL
          </label>
          <Input
            id="twitter"
            value={values.twitter}
            onChange={(event) => updateValue("twitter", event.target.value)}
            placeholder="https://x.com/ornek"
            aria-invalid={Boolean(errors.twitter)}
          />
          {renderFieldError("twitter")}
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium text-foreground">
            Web Sitesi
          </label>
          <Input
            id="website"
            value={values.website}
            onChange={(event) => updateValue("website", event.target.value)}
            placeholder="https://example.com"
            aria-invalid={Boolean(errors.website)}
          />
          {renderFieldError("website")}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Kısa Açıklama
        </label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          rows={4}
        />
      </div>

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {submitError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Gönderiliyor..." : "Kaydı Gönder"}
      </Button>
    </form>
  );
};

export default LansmanForm;
