import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Award, Crown, Sparkles, Star, Mail, Check } from "lucide-react";
import heroNetworkLight from "@/assets/hero-network-light.jpg";
import corteqsLogo from "@/assets/corteqs-logo-globe.png";
import { notifySubmission } from "@/lib/mail";
import { toSubmissionInsert } from "@/lib/submissions";

interface BackerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTier?: number;
}

type DonorType = "individual" | "company";

type Tier = {
  amount: number;
  label: string;
  icon: typeof Sparkles;
  perks: string[];
  accent: string;
  border: string;
  popular?: boolean;
};

const tiers: Tier[] = [
  {
    amount: 10,
    label: "Erken Uye",
    icon: Sparkles,
    perks: [
      "Platform acilmadan once erken erisim",
      "Kurucu guncellemelerine erisim",
      "Kapali WhatsApp toplulugu",
      "Profilde \"Erken Uye\" rozeti",
    ],
    accent: "from-accent/20 to-accent/5",
    border: "border-accent/30",
  },
  {
    amount: 100,
    label: "Cekirdek Uye",
    icon: Star,
    perks: [
      "Tum Erken Uye avantajlari",
      "Ilk etkinliklere oncelikli erisim",
      "Premium uyelik indirimi",
      "Profil gorunurluk artirimi",
    ],
    accent: "from-primary/25 to-primary/5",
    border: "border-primary/40",
  },
  {
    amount: 1000,
    label: "Sehir Patronu",
    icon: Award,
    perks: [
      "Tum Cekirdek Uye avantajlari",
      "Sehir bazli one cikma",
      "Erken kullanici lead'lerine erisim",
      "Etkinlik sponsorlugu onceligi",
      "Sehir Patronlarina ozel online etkinlik",
      "Platform reklam kredisi",
    ],
    accent: "from-primary/35 to-accent/10",
    border: "border-primary/50",
    popular: true,
  },
  {
    amount: 10000,
    label: "Onursal Kurucu",
    icon: Crown,
    perks: [
      "Tum Sehir Patronu avantajlari",
      "CorteQS platform, uygulama ve sosyal medyada global gorunurluk",
      "Onursal Kurucular panosunda premium yer",
      "Ozel is birligi firsatlari",
      "Stratejik 1:1 gorusmeler",
    ],
    accent: "from-yellow-500/25 via-primary/15 to-accent/10",
    border: "border-yellow-500/50",
  },
];

const BackerForm = ({ open, onOpenChange, defaultTier }: BackerFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [donorType, setDonorType] = useState<DonorType>("individual");
  const [selectedTier, setSelectedTier] = useState<number>(defaultTier ?? 100);

  useEffect(() => {
    if (open && defaultTier) setSelectedTier(defaultTier);
  }, [open, defaultTier]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/[\s\-().]/g, "");
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("Telefon ulke kodu ile baslamali (orn: +49 170 1234567).");
      return;
    }
    setPhoneError("");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const payload = toSubmissionInsert(
      { ...values, phone: phone.replace(/[\s\-().]/g, ""), donation_amount: String(selectedTier), donor_type: donorType },
      "backer",
    );
    const notificationPayload = { ...payload, created_at: new Date().toISOString() };

    try {
      const { error } = await supabase.from("submissions").insert(payload);
      if (error) throw error;

      try {
        await notifySubmission(notificationPayload);
      } catch (notificationError) {
        console.error("Mail notification error:", notificationError);
      }

      toast({
        title: "Bagis Niyetiniz Alindi!",
        description: "Tesekkurler! Detayli gorusme icin kisa sure icinde size e-posta gonderecegiz.",
      });

      onOpenChange(false);
      setConsent(false);
      setPhone("");
      setSelectedTier(100);
      setDonorType("individual");
    } catch (err: unknown) {
      console.error("Backer submission error:", err);
      const message = err instanceof Error ? err.message : "Lutfen tekrar deneyin veya info@corteqs.net adresine yazin.";
      toast({
        title: "Bir hata olustu",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 border-none">
        <div className="relative rounded-t-lg overflow-hidden">
          <img src={heroNetworkLight} alt="" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/95" />
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/95 text-yellow-950 text-xs font-bold shadow-lg">
              <Crown className="w-3.5 h-3.5" /> ONURSAL KURUCULAR PROGRAMI
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <img src={corteqsLogo} alt="CorteQS Logo" className="h-10 mb-3" />
            <DialogHeader>
              <DialogTitle className="text-foreground text-2xl">
                Bagis Kabul Ediyoruz - Onursal Kuruculariniz Arasina Girin
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Diaspora Connect'in temellerini birlikte atalim. Bagisinizla erken erisim, uyelik avantajlari, platform reklamlari ve onursal kurucular panomuzda yer alma firsati kazinin.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-4">
          <div>
            <Label className="text-base font-semibold mb-3 block">Bagis Tutarinizi Secin</Label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.amount;
                return (
                  <button
                    type="button"
                    key={tier.amount}
                    onClick={() => setSelectedTier(tier.amount)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all bg-gradient-to-br ${tier.accent} ${
                      isSelected
                        ? `${tier.border} ring-2 ring-primary/50 scale-[1.02] shadow-lg`
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wide">
                        Populer
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <Icon className="w-6 h-6 text-primary mb-2" />
                    <div className="font-bold text-foreground text-2xl">${tier.amount.toLocaleString()}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{tier.label}</div>
                    <ul className="space-y-1">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="text-xs text-foreground/80 flex items-start gap-1">
                          <span className="text-primary mt-0.5">-</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Bagisci Tipi</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDonorType("individual")}
                className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                  donorType === "individual"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                Kisisel
              </button>
              <button
                type="button"
                onClick={() => setDonorType("company")}
                className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                  donorType === "company"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                Firma
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullname">Ad Soyad</Label>
              <Input id="fullname" name="fullname" placeholder="Adiniz Soyadiniz" required />
            </div>

            {donorType === "company" && (
              <div>
                <Label htmlFor="company_name">Firma Adi</Label>
                <Input id="company_name" name="company_name" placeholder="Sirket veya kurulus adi" required />
              </div>
            )}

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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
              </div>
              <div>
                <Label htmlFor="phone">Telefon (ulke kodu ile)</Label>
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
                  <p className="text-xs text-muted-foreground mt-1">+ ile baslatin, ulke kodu zorunlu.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Mesajiniz (opsiyonel)</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Bagisinizla ilgili belirtmek istedikleriniz, beklentileriniz veya is birligi onerileriniz..."
                className="resize-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Detayli Bilgilendirme
            </p>
            <p className="text-sm text-muted-foreground">
              Backing/Destek karsiligi erken erisim, uyelik paketi avantajlari, platform reklam firsatlari ve <strong className="text-foreground">Onursal Bagiscilar Panomuzda</strong> yer alma detaylari icin e-posta ile size ulasip gorusme planlayacagiz.
            </p>
            <a href="mailto:info@corteqs.net" className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              info@corteqs.net
            </a>
          </div>

          <label className="flex items-start gap-2 p-3 rounded-lg bg-[#25D366]/5 border border-[#25D366]/30 cursor-pointer">
            <input type="checkbox" name="whatsapp_interest" value="yes" className="mt-1 rounded border-input accent-[#25D366]" />
            <span className="text-sm text-foreground leading-relaxed">
              <strong>Onursal Kurucular WhatsApp grubuna katilmak istiyorum.</strong>{" "}
              <span className="text-muted-foreground">Davet linki size iletilecek.</span>
            </span>
          </label>

          <div className="flex items-start gap-2">
            <Checkbox
              id="backer-consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="backer-consent" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
              Kisisel bilgilerimi, CorteQS tarafindan bagis surecinin yurutulmesi ve tarafima ulasilmasi amaciyla paylasuyorum. Bilgilerim ucuncu sahislarla paylasilmayacaktir.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-primary to-primary text-white font-bold text-base hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? "Gonderiliyor..." : `${selectedTier.toLocaleString()}$ Bagis Niyetimi Bildir →`}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BackerForm;
