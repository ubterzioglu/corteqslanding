import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroNetworkLight from "@/assets/hero-network-light.jpg";
import corteqsLogo from "@/assets/corteqs-logo-globe.png";

const categories = [
  { value: "danisman", label: "Danışman" },
  { value: "isletme", label: "İşletme / Şirket" },
  { value: "dernek", label: "Dernek" },
  { value: "vakif", label: "Vakıf" },
  { value: "radyo-tv", label: "Radyo / TV" },
  { value: "blogger-vlogger", label: "Blogger / Vlogger" },
  { value: "sehir-elcisi", label: "Şehir Elçisi" },
  { value: "bireysel", label: "Bireysel Kullanıcı" },
];

type FormMode = "register" | "support";

interface RegisterInterestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
  mode?: FormMode;
}

const RegisterInterestForm = ({ open, onOpenChange, defaultCategory, mode = "register" }: RegisterInterestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(defaultCategory || "");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (open && defaultCategory) {
      setSelectedCat(defaultCategory);
    }
  }, [open, defaultCategory]);

  const isSupport = mode === "support";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from("submissions").insert({
        form_type: isSupport ? "support" : "register",
        category: isSupport ? "support" : (data.category as string),
        fullname: data.fullname as string,
        country: data.country as string,
        city: data.city as string,
        business: (data.business as string) || null,
        field: data.field as string,
        email: data.email as string,
        phone: data.phone as string,
        description: (data.description as string) || null,
        contest_interest: data.contest_interest === "yes",
        linkedin: (data.linkedin as string) || null,
        instagram: (data.instagram as string) || null,
        tiktok: (data.tiktok as string) || null,
        facebook: (data.facebook as string) || null,
        twitter: (data.twitter as string) || null,
        website: (data.website as string) || null,
        consent: true,
      });

      if (error) throw error;

      toast({
        title: "Kaydınız Alındı! ✅",
        description: "Teşekkürler! Platform açıldığında sizinle iletişime geçeceğiz.",
      });

      onOpenChange(false);
      setConsent(false);
      setSelectedCat(defaultCategory || "");
    } catch (err) {
      console.error("Submission error:", err);
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 border-none">
        <div className="relative rounded-t-lg overflow-hidden">
          <img src={heroNetworkLight} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <img src={corteqsLogo} alt="CorteQS Logo" className="h-10 mb-3" />
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">
                {isSupport ? "Projeye Destek & Yatırım" : "İlginizi Kaydedin"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isSupport
                  ? "💡 Diaspora Connect projesine destek vermek veya yatırım yapmak için bilgilerinizi bırakın."
                  : "🚀 Yakında açılıyoruz! İlk erişim için bilgilerinizi bırakın."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {isSupport ? "🤝 Stratejik Ortaklık" : "🎯 Yakında: AI Destekli Eşleştirme"}
            </span>
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              {isSupport ? "💰 Yatırım Fırsatı" : "🌍 Yakında: 50+ Şehir Ağı"}
            </span>
          </div>

          {!isSupport && (
            <div>
              <Label htmlFor="category">Kategori / İlgi Alanı</Label>
              <select
                id="category"
                name="category"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>Seçiniz...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              {selectedCat === "blogger-vlogger" && (
                <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm font-semibold text-foreground mb-1">🏆 Ödüllü Blog Yazısı Yarışmamız Başlıyor!</p>
                  <p className="text-xs text-muted-foreground mb-2">Diaspora deneyiminizi anlatan en iyi blog yazısını yazın, ödülleri kazanın.</p>
                  <label className="flex items-center gap-2 cursor-pointer">
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
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+49 123 456" required />
            </div>
          </div>

          {selectedCat === "sehir-elcisi" && !isSupport && (
            <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm font-semibold text-foreground">📱 Sosyal Medya Hesaplarınız</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                  <Input id="linkedin" name="linkedin" placeholder="linkedin.com/in/..." />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                  <Input id="instagram" name="instagram" placeholder="@kullaniciadi" />
                </div>
                <div>
                  <Label htmlFor="tiktok" className="text-xs">TikTok</Label>
                  <Input id="tiktok" name="tiktok" placeholder="@kullaniciadi" />
                </div>
                <div>
                  <Label htmlFor="facebook" className="text-xs">Facebook</Label>
                  <Input id="facebook" name="facebook" placeholder="facebook.com/..." />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-xs">X (Twitter)</Label>
                  <Input id="twitter" name="twitter" placeholder="@kullaniciadi" />
                </div>
                <div>
                  <Label htmlFor="website" className="text-xs">Web Sitesi</Label>
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
                placeholder="Projeye verebileceğiniz teknik, organizasyonel ve yatırım gibi destekleri buraya yazın. Sizinle bağlantıya geçelim."
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
            <span className="text-lg">✉️</span>
            <a href="mailto:info@corteqs.net" className="text-primary font-semibold hover:underline">
              info@corteqs.net
            </a>
          </div>

          <div className="p-3 rounded-lg bg-accent/5 border border-accent/15 text-sm text-muted-foreground">
            ⏳ <strong className="text-foreground">Yakında!</strong> Platform açılır açılmaz size ilk haber vereceğiz. Erken kayıt avantajlarından yararlanın.
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
              Kişisel bilgilerimi, CorteQS tarafından tarafıma ulaşılması amacıyla paylaşıyorum. Bilgilerim üçüncü şahıslarla paylaşılmayacaktır.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Gönderiliyor..." : (isSupport ? "Destek Başvurusu Gönder →" : "Kayıt Bırak / Takip Et →")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterInterestForm;
