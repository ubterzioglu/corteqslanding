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
  { value: "danisman", label: "Danışman / Doktor / Avukat" },
  { value: "isletme", label: "İşletme / Şirket" },
  { value: "dernek", label: "Dernek" },
  { value: "vakif", label: "Vakıf" },
  { value: "radyo-tv", label: "Radyo / TV" },
  { value: "blogger-vlogger", label: "Blogger / Vlogger" },
  { value: "sehir-elcisi", label: "Şehir Elçisi / City Business Partner" },
  { value: "bireysel", label: "Bireysel Kullanıcı" },
];

type FormMode = "register" | "support";

interface RegisterInterestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
  defaultCity?: string;
  defaultReferralCode?: string;
  mode?: FormMode;
}

const RegisterInterestForm = ({ open, onOpenChange, defaultCategory, defaultCity, defaultReferralCode, mode = "register" }: RegisterInterestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(defaultCategory || "");
  const [consent, setConsent] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [referralDetail, setReferralDetail] = useState("");
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [documentError, setDocumentError] = useState("");

  useEffect(() => {
    if (open && defaultCategory) {
      setSelectedCat(defaultCategory);
    }
  }, [open, defaultCategory]);

  const isSupport = mode === "support";

  // Categories that should show the CV / document upload field
  const categoriesWithDocUpload = new Set([
    "danisman",
    "isletme",
    "dernek",
    "vakif",
    "radyo-tv",
    "blogger-vlogger",
    "sehir-elcisi",
    "bireysel",
  ]);
  const showDocUpload = !isSupport && categoriesWithDocUpload.has(selectedCat);

  const ALLOWED_DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
  const MAX_DOC_COUNT = 5;

  const validatePhone = (value: string) => {
    // E.164 format: + followed by 8-15 digits, leading digit 1-9
    const cleaned = value.replace(/[\s\-().]/g, "");
    const e164 = /^\+[1-9]\d{7,14}$/;
    return e164.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("Telefon ülke kodu ile başlamalı (örn: +49 170 1234567).");
      return;
    }
    setPhoneError("");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Optional multiple document uploads
      const uploadedDocs: { url: string; name: string }[] = [];
      for (const file of documentFiles) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("submission-documents")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage.from("submission-documents").getPublicUrl(path);
        uploadedDocs.push({ url: pub.publicUrl, name: file.name });
      }
      const firstDoc = uploadedDocs[0];

      const insertData = {
        form_type: isSupport ? "support" : "register",
        category: isSupport ? "support" : (data.category as string),
        fullname: data.fullname as string,
        country: data.country as string,
        city: data.city as string,
        business: (data.business as string) || null,
        field: data.field as string,
        email: data.email as string,
        phone: phone.replace(/[\s\-().]/g, ""),
        description: (data.description as string) || null,
        offers_needs: (data.offers_needs as string)?.trim() || null,
        document_url: firstDoc?.url ?? null,
        document_name: firstDoc?.name ?? null,
        documents: uploadedDocs,
        contest_interest: data.contest_interest === "yes" ? true : false,
        whatsapp_interest: false,
        linkedin: (data.linkedin as string) || null,
        instagram: (data.instagram as string) || null,
        tiktok: (data.tiktok as string) || null,
        facebook: (data.facebook as string) || null,
        twitter: (data.twitter as string) || null,
        website: (data.website as string) || null,
        referral_source: referralSource || null,
        referral_detail: referralDetail.trim() || null,
        referral_code: ((data.referral_code as string) || "").trim().toUpperCase() || null,
        consent: true,
      };

      console.log("Submitting data:", insertData);
      const { error } = await supabase.from("submissions").insert(insertData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Kaydınız Alındı! ✅",
        description: "Teşekkürler! Platform açıldığında sizinle iletişime geçeceğiz.",
      });

      onOpenChange(false);
      setConsent(false);
      setPhone("");
      setPhoneError("");
      setReferralSource("");
      setReferralDetail("");
      setSelectedCat(defaultCategory || "");
      setDocumentFiles([]);
      setDocumentError("");
    } catch (err: any) {
      console.error("Submission error details:", err?.message, err?.code, err?.details, err);
      toast({
        title: "Bir hata oluştu",
        description: err?.message || "Lütfen tekrar deneyin veya info@corteqs.net adresine yazın.",
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

              {selectedCat === "danisman" && (
                <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    🩺⚖️💼 Danışman / Doktor / Avukat Profili
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Diaspora topluluğuna hizmet veren <strong className="text-foreground">hekim, avukat, mali müşavir, mühendis, koç, terapist</strong> ve diğer uzman danışmanlar için. Uzmanlık alanınızı, hizmet dilinizi ve sertifikalarınızı CV/dokümana ekleyin — açılışta sizi <strong className="text-foreground">doğru danışan</strong> ile eşleştirelim.
                  </p>
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
              <Input id="city" name="city" placeholder="Berlin" defaultValue={defaultCity || ""} key={defaultCity || "city"} required />
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
                title="Telefon ülke kodu ile başlamalı (örn: +49 170 1234567)"
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

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="referral_source">Bizi nereden buldunuz?</Label>
                <select
                  id="referral_source"
                  name="referral_source"
                  value={referralSource}
                  onChange={(e) => {
                    setReferralSource(e.target.value);
                    setReferralDetail("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="" disabled>Seçiniz...</option>
                  <option value="whatsapp">WhatsApp Grubu</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x-twitter">X (Twitter)</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="arkadas-tavsiye">Arkadaş / Tavsiye</option>
                  <option value="etkinlik">Etkinlik / Buluşma</option>
                  <option value="google">Google Arama</option>
                  <option value="basin-haber">Basın / Haber</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              <div>
                <Label htmlFor="referral_code">Referral Kodu (opsiyonel)</Label>
                <Input
                  id="referral_code"
                  name="referral_code"
                  placeholder="Admin / davet kodu"
                  maxLength={32}
                  className="uppercase"
                  defaultValue={defaultReferralCode || ""}
                  key={defaultReferralCode || "ref"}
                  readOnly={!!defaultReferralCode}
                />
                  <p className="text-xs text-muted-foreground mt-1">
                    {defaultReferralCode
                      ? `🎁 Bu sayfadan kayıt olanlara özel referral kodu otomatik tanımlandı: ${defaultReferralCode}`
                      : "Sizi davet eden admin/influencer referral kodunuzu girin. Avantajlardan faydalanın."}
                  </p>
              </div>
            </div>

            {referralSource && referralSource !== "google" && referralSource !== "basin-haber" && (
              <div>
                <Label htmlFor="referral_detail">
                  {referralSource === "whatsapp" && "Hangi WhatsApp grubu? *"}
                  {referralSource === "instagram" && "Hangi Instagram hesabı / gönderi?"}
                  {referralSource === "linkedin" && "Hangi LinkedIn hesabı / gönderi?"}
                  {referralSource === "x-twitter" && "Hangi X (Twitter) hesabı?"}
                  {referralSource === "facebook" && "Hangi Facebook sayfa / grubu?"}
                  {referralSource === "tiktok" && "Hangi TikTok hesabı?"}
                  {referralSource === "youtube" && "Hangi YouTube kanalı / videosu?"}
                  {referralSource === "arkadas-tavsiye" && "Sizi yönlendiren kişinin adı"}
                  {referralSource === "etkinlik" && "Hangi etkinlik / buluşma?"}
                  {referralSource === "diger" && "Lütfen detay verin"}
                </Label>
                <Input
                  id="referral_detail"
                  name="referral_detail"
                  value={referralDetail}
                  onChange={(e) => setReferralDetail(e.target.value)}
                  placeholder={
                    referralSource === "whatsapp"
                      ? "Örn: Berlin Diaspora Topluluğu"
                      : referralSource === "arkadas-tavsiye"
                      ? "Örn: Ahmet Yılmaz"
                      : "Detay yazın"
                  }
                  maxLength={120}
                  required={referralSource === "whatsapp"}
                />
              </div>
            )}
          </div>


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

          {/* Arz / Talep — tüm kayıtlarda */}
          <div>
            <Label htmlFor="offers_needs">Arz & Talepleriniz (opsiyonel)</Label>
            <Textarea
              id="offers_needs"
              name="offers_needs"
              rows={3}
              maxLength={1000}
              placeholder="Örn: İş arıyorum • Aracımı satıyorum • Parti biletim var • Eleman arıyorum • Ev kiralıyorum..."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Diasporadaki arz ve taleplerinizi serbestçe yazın. <strong className="text-primary">🤖 Detaylı veri AI eşleşme (AI match) kalitesini artıracaktır</strong> — sizi doğru kişilerle daha hızlı eşleştirelim.
            </p>
          </div>

          {/* CV / Doküman yükleme — sadece kategori seçilmişse */}
          {showDocUpload && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <Label htmlFor="document" className="text-sm font-semibold">
                📎 CV / Doküman Yükle (opsiyonel — birden fazla dosya seçebilirsiniz)
              </Label>
              <Input
                id="document"
                name="document"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? []);
                  if (picked.length === 0) return;

                  const merged = [...documentFiles];
                  for (const file of picked) {
                    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
                      setDocumentError(`"${file.name}" desteklenmeyen format. Sadece PDF, DOC, DOCX, JPG, PNG, WEBP.`);
                      e.target.value = "";
                      return;
                    }
                    if (file.size > MAX_DOC_BYTES) {
                      setDocumentError(`"${file.name}" çok büyük. Dosya başına maks. 10 MB.`);
                      e.target.value = "";
                      return;
                    }
                    if (merged.length >= MAX_DOC_COUNT) {
                      setDocumentError(`En fazla ${MAX_DOC_COUNT} dosya yükleyebilirsiniz.`);
                      e.target.value = "";
                      return;
                    }
                    if (!merged.some((f) => f.name === file.name && f.size === file.size)) {
                      merged.push(file);
                    }
                  }
                  setDocumentError("");
                  setDocumentFiles(merged);
                  e.target.value = "";
                }}
                className="mt-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {documentError && (
                <p className="text-xs text-destructive mt-2">{documentError}</p>
              )}
              {documentFiles.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {documentFiles.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-2 text-xs bg-background/60 rounded px-2 py-1 border border-primary/15"
                    >
                      <span className="text-primary font-medium truncate">
                        ✓ {f.name} <span className="text-muted-foreground">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setDocumentFiles(documentFiles.filter((_, idx) => idx !== i))}
                        className="text-destructive hover:underline shrink-0"
                        aria-label={`${f.name} dosyasını kaldır`}
                      >
                        Kaldır
                      </button>
                    </li>
                  ))}
                  <li className="text-[11px] text-muted-foreground pt-1">
                    {documentFiles.length} / {MAX_DOC_COUNT} dosya seçildi.
                  </li>
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  CV, portföy, sertifika, broşür veya tanıtım dökümanlarınızı ekleyin. PDF, DOC, JPG, PNG — dosya başına maks. 10 MB, en fazla {MAX_DOC_COUNT} dosya.
                </p>
              )}
            </div>
          )}

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
