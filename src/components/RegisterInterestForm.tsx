import { useEffect, useState } from "react";

import heroNetworkLight from "@/assets/hero-network-light.jpg";
import corteqsLogo from "@/assets/corteqs-logo-globe.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifySubmission } from "@/lib/mail";
import { categoryOptions, toSubmissionInsert, type SubmissionFormMode } from "@/lib/submissions";

interface RegisterInterestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
  mode?: SubmissionFormMode;
}

const RegisterInterestForm = ({
  open,
  onOpenChange,
  defaultCategory,
  mode = "register",
}: RegisterInterestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || "");
  const [consent, setConsent] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/[\s\-().]/g, "");
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  };

  useEffect(() => {
    if (open && defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory, open]);

  const isSupport = mode === "support";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("Telefon ülke kodu ile başlamalı (örn: +49 170 1234567).");
      return;
    }
    setPhoneError("");

    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    values.phone = phone.replace(/[\s\-().]/g, "");
    const payload = toSubmissionInsert(values, mode);
    const notificationPayload = {
      ...payload,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("submissions").insert(payload);

      if (error) throw error;

      try {
        await notifySubmission(notificationPayload);
      } catch (notificationError) {
        console.error("Mail notification error:", notificationError);
      }

      toast({
        title: "Kaydınız alındı",
        description: "Teşekkürler. Platform açıldığında sizinle iletişime geçeceğiz.",
      });

      onOpenChange(false);
      setConsent(false);
      setPhone("");
      setSelectedCategory(defaultCategory || "");
      event.currentTarget.reset();
    } catch (submissionError) {
      console.error("Submission error:", submissionError);
      toast({
        title: "Bir hata oluştu",
        description: "Lütfen tekrar deneyin veya info@corteqs.net adresine yazın.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-none p-0 sm:max-w-lg">
        <div className="relative overflow-hidden rounded-t-lg">
          <img src={heroNetworkLight} alt="" aria-hidden="true" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <img src={corteqsLogo} alt="CorteQS Logo" className="mb-3 h-10" />
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">
                {isSupport ? "Projeye Destek ve Yatirim" : "İlginizi Kaydedin"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isSupport
                  ? "Diaspora Connect projesine destek vermek veya yatırım yapmak için bilgilerinizi bırakın."
                  : "Yakında açılıyoruz. İlk erişim için bilgilerinizi bırakın."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-2">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {isSupport ? "Stratejik ortaklık" : "Yakında: AI destekli eşleştirme"}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {isSupport ? "Yatırım fırsatı" : "Yakında: 50+ şehir ağı"}
            </span>
          </div>

          {!isSupport && (
            <div>
              <Label htmlFor="category">Kategori / İlgi Alanı</Label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Seçiniz...
                </option>
                {categoryOptions
                  .filter((option) => option.value !== "support")
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>

              {selectedCategory === "blogger-vlogger" && (
                <div className="mt-3 rounded-lg border border-accent/20 bg-accent/10 p-3">
                  <p className="mb-1 text-sm font-semibold text-foreground">Ödüllü blog yazısı yarışması yakında</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Diaspora deneyiminizi anlatan en iyi blog yazısını yazın, ödülleri kazanın.
                  </p>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" name="contest_interest" value="yes" className="rounded border-input" />
                    <span className="text-sm text-foreground">Yarışma ile ilgili bilgi istiyorum</span>
                  </label>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="fullname">Ad Soyad</Label>
            <Input id="fullname" name="fullname" placeholder="Adınız Soyadınız" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="country">Ülke</Label>
              <Input id="country" name="country" placeholder="Almanya" required />
            </div>
            <div>
              <Label htmlFor="city">Şehir</Label>
              <Input id="city" name="city" placeholder="Berlin" required />
            </div>
          </div>

          <div>
            <Label htmlFor="business">İşletme / Kuruluş (opsiyonel)</Label>
            <Input id="business" name="business" placeholder="Şirket veya kuruluş adı" />
          </div>

          <div>
            <Label htmlFor="field">İştigal / İlgi Sahası</Label>
            <Input id="field" name="field" placeholder="Faaliyet veya ilgi alanınız" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
            </div>
            <div>
              <Label htmlFor="phone">Telefon (ülke kodu ile)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="+49 170 1234567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                pattern="^\+[1-9][0-9\s\-().]{7,20}$"
                required
                aria-invalid={!!phoneError}
              />
              {phoneError ? (
                <p className="text-xs text-destructive mt-1">{phoneError}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">+ ile başlatın, ülke kodu zorunlu.</p>
              )}
            </div>
          </div>

          {selectedCategory === "sehir-elcisi" && !isSupport && (
            <div className="space-y-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Sosyal medya hesaplarınız</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="linkedin" className="text-xs">
                    LinkedIn
                  </Label>
                  <Input id="linkedin" name="linkedin" placeholder="linkedin.com/in/..." />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-xs">
                    Instagram
                  </Label>
                  <Input id="instagram" name="instagram" placeholder="@kullanıcıadı" />
                </div>
                <div>
                  <Label htmlFor="tiktok" className="text-xs">
                    TikTok
                  </Label>
                  <Input id="tiktok" name="tiktok" placeholder="@kullanıcıadı" />
                </div>
                <div>
                  <Label htmlFor="facebook" className="text-xs">
                    Facebook
                  </Label>
                  <Input id="facebook" name="facebook" placeholder="facebook.com/..." />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-xs">
                    X (Twitter)
                  </Label>
                  <Input id="twitter" name="twitter" placeholder="@kullanıcıadı" />
                </div>
                <div>
                  <Label htmlFor="website" className="text-xs">
                    Web sitesi
                  </Label>
                  <Input id="website" name="website" type="url" placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {isSupport && (
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Projeye verebileceğiniz teknik, organizasyonel veya yatırım desteğini kısaca yazın."
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3">
            <span className="text-lg">@</span>
            <a href="mailto:info@corteqs.net" className="font-semibold text-primary hover:underline">
              info@corteqs.net
            </a>
          </div>

          <div className="rounded-lg border border-accent/15 bg-accent/5 p-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Yakında:</strong> Platform açılır açılmaz size haber vereceğiz.
          </div>

          <label className="flex items-start gap-2 p-3 rounded-lg bg-[#25D366]/5 border border-[#25D366]/30 cursor-pointer">
            <input type="checkbox" name="whatsapp_interest" value="yes" className="mt-1 rounded border-input accent-[#25D366]" />
            <span className="text-sm text-foreground leading-relaxed">
              <strong>WhatsApp topluluğuna katılmak istiyorum.</strong>{" "}
              <span className="text-muted-foreground">Davet linki size iletilecek.</span>
            </span>
          </label>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
              Kişisel bilgilerimi, CorteQS tarafından tarafıma ulaşılması amacıyla paylaşıyorum.
              Bilgilerim üçüncü şahıslarla paylaşılmayacaktır.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : isSupport ? "Destek başvurusu gönder" : "Kayıt bırak / takip et"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterInterestForm;
