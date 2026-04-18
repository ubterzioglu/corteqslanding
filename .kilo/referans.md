# Lovable Sync - referans.md

## Surec (Plan)

### Genel Akis

1. Lovable'dan projenin guncel hali `referans/` dizinine zip olarak indirilir
2. Zip acilip mevcut repo ile karsilastirma yapilir
3. Farklar kategorilere ayrilir: ui, backend, auth, mail, db, content
4. Her fark icin: uygula veya ertele karari verilir
5. Uygulanan degisiklikler bu dosyanin gunluk bolumune kaydedilir
6. Build + test calistirilir

### Korunacak Alanlar

- `.env`, `.env.local` ve tum secret dosyalari
- `supabase/` migration'lari (sadece yeni migration eklenir, mevcut degistirilmez)
- `src/` altindaki admin panel, auth logic ve ozel integration'lar
- `Dockerfile`, `nginx.conf`, `docker-entrypoint-env.sh`
- `.kilo/` dizini

### Kaynak

- Kullanici her seferinde guncel halini `referans/` klasoru altina manuel olarak koyar (zip veya acilmis kaynak kod olarak)
- Agent `referans/` dizinindeki en yeni kaynak kodu kullanir

---

## Guncelleme Gunlugu

### [2026-04-18 11:27] - Sync #1
**Kaynak:** Lovable (referans/ dizinindeki acilmis kaynak kod)
**Durum:** Ertelendi - Repomuz referanstan ileride, uygulanacak yeni degisiklik yok

**Yeni Ozellikler:**
- Yok (referans, bizim repomuzun temel hali)

**Degisen Ozellikler:**
- Repomuz referanstan cok daha ileride. Referans temel Lovable export'u.

**Kategoriler:**
- ui: CategoriesSection opacity farki (bizde 0.07, referansta 0.31)
- backend: Bizde merkezi submissions kutuphanesi + email bildirimi
- auth: Bizde admin_users tablosu ile role-based access
- mail: Bizde notifySubmission() fonksiyonu
- db: Bizde submissions tablosuna notes, status, reviewed_at, reviewed_by kolonlari
- content: Bizde ASCII-safe Turkce

**Uygulanan Degisiklikler:**
- Yok

**Ertelenen Maddeler:**
- CategoriesSection opacity: 0.07 (bilincli tasarim karari)
- Unicode Turkce + emojiler: ASCII-safe tercih ediliyor
- AdminPanel: Bizim versiyon cok daha gelismis

---

### [2026-04-18 17:50] - Sync #2
**Kaynak:** Lovable (guncellenmis referans/ - yeni export)
**Durum:** Kismen Uygulandi

**Yeni Ozellikler (referanstan gelen):**
- BackerForm component'i - Bagis/backing formu ($10-$10000 tier'lar)
- SupportSection - Onursal Kurucular membership paketleri
- FooterSection - WhatsApp topluluk CTA + LinkedIn/Instagram butonlari
- Gorsel filter - tum bolum fotograflarinda brightness/saturation/contrast filter + gradient overlay
- Telefon validasyonu - E.164 format (ulke kodu zorunlu)
- WhatsApp opt-in - kayit formunda WhatsApp grubu tercihi

**Degisen Ozellikler:**
- HeroSection CTA text guncellendi
- CategoriesSection background opacity 0.07 -> 0.31
- supabase/types.ts: donation_amount, donation_currency, company_name, whatsapp_interest kolonlari eklendi
- submissions.ts: backer modu destegi + yeni alanlar
- AdminPage.tsx CSV export: yeni kolonlar eklendi

**Kategoriler:**
- ui: Gorsel filter (About, Ambassador, Blogger, Hero), CategoriesSection opacity, BackerForm UI, SupportSection tiers, FooterSection sosyal medya
- backend: Telefon validasyonu, backer formu supabase insert, merkezi submissions'a backer modu
- auth: Degisiklik yok
- mail: BackerForm notifySubmission entegrasyonu
- db: submissions tablosuna 4 yeni kolon (donation_amount, donation_currency, company_name, whatsapp_interest)
- content: HeroSection CTA text guncellendi

**Uygulanan Degisiklikler:**
- src/integrations/supabase/types.ts: 4 yeni kolon eklendi
- src/lib/submissions.ts: backer modu + yeni alanlar
- src/components/BackerForm.tsx: YENI - merkezi lib'e uyarlandi
- src/components/SupportSection.tsx: Onursal Kurucular bolumu + BackerForm
- src/components/FooterSection.tsx: WhatsApp + LinkedIn + Instagram
- src/components/HeroSection.tsx: CTA text + gorsel filter
- src/components/AboutSection.tsx: Gorsel filter + gradient overlay
- src/components/AmbassadorSection.tsx: Gorsel filter + gradient overlay
- src/components/BloggerSection.tsx: Gorsel filter + gradient overlay
- src/components/CategoriesSection.tsx: opacity 0.31
- src/components/RegisterInterestForm.tsx: Telefon validasyonu + WhatsApp opt-in
- src/pages/AdminPage.tsx: CSV export'a yeni kolonlar

**Ertelenen Maddeler:**
- Unicode Turkce karakterler: ASCII-safe tercih edilmeye devam

**Dogrulama:**
- npm run build: BASARILI
- npm run lint: 0 error (src/ icin), 0 yeni warning
