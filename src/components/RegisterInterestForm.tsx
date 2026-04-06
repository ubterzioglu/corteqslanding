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

  useEffect(() => {
    if (open && defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory, open]);

  const isSupport = mode === "support";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
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
        title: "Kaydiniz alindi",
        description: "Tesekkurler. Platform acildiginda sizinle iletisime gececegiz.",
      });

      onOpenChange(false);
      setConsent(false);
      setSelectedCategory(defaultCategory || "");
      event.currentTarget.reset();
    } catch (submissionError) {
      console.error("Submission error:", submissionError);
      toast({
        title: "Bir hata olustu",
        description: "Lutfen tekrar deneyin veya info@corteqs.net adresine yazin.",
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
          <img src={heroNetworkLight} alt="" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <img src={corteqsLogo} alt="CorteQS Logo" className="mb-3 h-10" />
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">
                {isSupport ? "Projeye Destek ve Yatirim" : "Ilginizi Kaydedin"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isSupport
                  ? "Diaspora Connect projesine destek vermek veya yatirim yapmak icin bilgilerinizi birakin."
                  : "Yakinda aciliyoruz. Ilk erisim icin bilgilerinizi birakin."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-2">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {isSupport ? "Stratejik ortaklik" : "Yakinda: AI destekli eslestirme"}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {isSupport ? "Yatirim firsati" : "Yakinda: 50+ sehir agi"}
            </span>
          </div>

          {!isSupport && (
            <div>
              <Label htmlFor="category">Kategori / Ilgi Alani</Label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Seciniz...
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
                  <p className="mb-1 text-sm font-semibold text-foreground">Odullu blog yazisi yarismasi yakinda</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Diaspora deneyiminizi anlatan en iyi blog yazisini yazin, odulleri kazanin.
                  </p>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" name="contest_interest" value="yes" className="rounded border-input" />
                    <span className="text-sm text-foreground">Yarisma ile ilgili bilgi istiyorum</span>
                  </label>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="fullname">Ad Soyad</Label>
            <Input id="fullname" name="fullname" placeholder="Adiniz Soyadiniz" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="country">Ulke</Label>
              <Input id="country" name="country" placeholder="Almanya" required />
            </div>
            <div>
              <Label htmlFor="city">Sehir</Label>
              <Input id="city" name="city" placeholder="Berlin" required />
            </div>
          </div>

          <div>
            <Label htmlFor="business">Isletme / Kurulus (opsiyonel)</Label>
            <Input id="business" name="business" placeholder="Sirket veya kurulus adi" />
          </div>

          <div>
            <Label htmlFor="field">Istigal / Ilgi Sahasi</Label>
            <Input id="field" name="field" placeholder="Faaliyet veya ilgi alaniniz" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+49 123 456" required />
            </div>
          </div>

          {selectedCategory === "sehir-elcisi" && !isSupport && (
            <div className="space-y-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Sosyal medya hesaplariniz</p>
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
                  <Input id="instagram" name="instagram" placeholder="@kullaniciadi" />
                </div>
                <div>
                  <Label htmlFor="tiktok" className="text-xs">
                    TikTok
                  </Label>
                  <Input id="tiktok" name="tiktok" placeholder="@kullaniciadi" />
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
                  <Input id="twitter" name="twitter" placeholder="@kullaniciadi" />
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
              <Label htmlFor="description">Aciklama</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Projeye verebileceginiz teknik, organizasyonel veya yatirim destegini kisaca yazin."
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
            <strong className="text-foreground">Yakinda:</strong> Platform acilir acilmaz size haber verecegiz.
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
              Kisisel bilgilerimi, CorteQS tarafindan tarafima ulasilmasi amaciyla paylasiyorum.
              Bilgilerim ucuncu sahislarla paylasilmayacaktir.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gonderiliyor..." : isSupport ? "Destek basvurusu gonder" : "Kayit birak / takip et"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterInterestForm;
