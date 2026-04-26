# CorteQS Diaspora Connect — Değişiklik Raporu
**Tarih aralığı:** 25–26 Nisan 2026
**Önceki kayıt:** `CHANGELOG.md` Oturum 6 (21 Nisan 2026)

Bu rapor, son iki gün içinde yapılan tüm yapısal, görsel ve içerik değişikliklerini detaylandırır. Değişiklikler kronolojik olarak ve etkilenen dosyalarla birlikte listelenmiştir.

---

## 1) Founding 1000 — Premium Üyelik Bölümü

### 1.1 Bölümün oluşturulması (25 Nisan, gece)
Ana sayfaya 5 kıta × 200 kullanıcı = 1000 kişilik kurucu üyelik konsepti eklendi. Premium koyu (slate) + altın gradient tema kullanıldı.

- **Stats:** 5 Kıta · 1000 Kurucu Üye · Kıta başı 200 kontenjan · 29 Ekim lansman
- **Hero Banner CTA:** "Founding 1000'e Katıl" butonu eklendi.

**Dosya:** `src/components/Founding1000Section.tsx` (yeni)

### 1.2 Ödeme entegrasyonu denemeleri
- **Stripe denemesi:** Stripe Türkiye/Katar'ı merchant olarak desteklemediği için iptal edildi.
- **Paddle denemesi:** Lovable hesabının e-posta kilidi nedeniyle setup tamamlanamadı.
- **Sonuç:** Şimdilik sadece kayıt formu üzerinden ilgi toplanıyor; ödeme entegrasyonu sonraya bırakıldı.

### 1.3 Ayrı sayfaya taşıma
Bölüm ana sayfadan kaldırıldı, `/founding-1000` route'una taşındı.

- **Yeni dosya:** `src/pages/Founding1000Page.tsx`
- **Route eklendi:** `src/App.tsx` → `/founding-1000`
- **Ana sayfadan kaldırıldı:** `src/pages/Index.tsx`
- **Hero CTA güncellendi:** Buton artık `/founding-1000` rotasına link veriyor.

### 1.4 Referral kodu otomasyonu
`GGVBLA-M7SDSR` kodu Founding 1000 sayfası için otomatikleştirildi.

- Hero altına altın gradient'li **🎁 referral bilgi bandı** eklendi.
- Form açıldığında kod otomatik dolu (readOnly) geliyor.

### 1.5 İçerik temizliği
- "Kategorileri Gör" alt CTA'sı kaldırıldı (kullanıcı isteğiyle gereksiz bulundu).

---

## 2) Blogger ve Vlogger Yarışma Sayfaları

### 2.1 Sayfaların oluşturulması (docx içeriklerinden)
İki yeni yarışma sayfası, kullanıcı tarafından paylaşılan dokümanlara göre kuruldu.

- **`/blogger-yarismasi`** → `src/pages/BloggerContestPage.tsx`
  - Hero · Temalar · Otantik / AI kategorileri · €25 katılım · max 5 içerik · teaser paketi · podcast bölümü · değerlendirme tablosu · ödüller (1.€1500 / 2.€500 / 3.€250) · takvim · "Hikâyeni Gönder" CTA
- **`/vlogger-yarismasi`** → `src/pages/VloggerContestPage.tsx`
  - Katılım maddeleri · kategoriler · temalar · ödüller · değerlendirme + abonelik dönüşüm ağırlığı · referral kodu açıklaması · takvim · "Videonu Gönder" CTA

Her iki sayfa `RegisterInterestForm`'u `defaultCategory="blogger-vlogger"` ile çağırıyor.

### 2.2 Vlogger sayfası — Magic Ball maskotu
Kullanıcının paylaştığı stil rehberinden CorteQS Magic Ball karakteri AI ile izole edildi.

- **Yeni asset:** `src/assets/corteqs-magic-ball-hero.jpg`
- Hero iki sütunlu grid yapıldı (sol: metin/CTA, sağ: maskot)
- Maskotta çift halo (amber + mavi) glow efekti + hafif yukarı/aşağı hareket
- **`tailwind.config.ts`**: Yeni `float` keyframe ve animation eklendi

```ts
keyframes: { float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
animation: { float: 'float 3s ease-in-out infinite' },
```

### 2.3 İkincil CTA temizliği
İki sayfada da çapraz link CTA'ları (Blogger↔Vlogger) kaldırıldı; ana eylem (Hikâyeni Gönder / Videonu Gönder) tek başına kaldı.

### 2.4 Referral kodu otomasyonu
- **`src/components/RegisterInterestForm.tsx`**: Yeni `defaultReferralCode` prop eklendi. Değer geldiğinde input `readOnly` olur ve 🎁 ikonlu açıklama gösterir.
- Her iki yarışma sayfasından `defaultReferralCode="GGVBLA-M7SDSR"` geçiliyor.

```tsx
<Input
  defaultValue={defaultReferralCode || ""}
  readOnly={!!defaultReferralCode}
  className="uppercase"
/>
```

---

## 3) HeroSection — Düzenlemeler ve İyileştirmeler

### 3.1 CTA temizliği (kullanıcı isteğiyle)
- "✨ AI ile 60 Saniyede Kaydol" butonu **kaldırıldı**
- "⏳ Yakında Açılıyor — Hemen Kaydol..." butonu **kaldırıldı**
- Sadece üç odaklı link bırakıldı:
  - 🌍 Founding 1000'e Katıl → `/founding-1000`
  - ✍️ Blogger Yarışması → `/blogger-yarismasi`
  - 🎥 Vlogger Yarışması → `/vlogger-yarismasi`

### 3.2 Founding 1000 butonuna tagline
Hero'daki ana CTA `flex-col` yapıldı, alt satıra tagline eklendi:

```tsx
<span>🌍 Founding 1000'e Katıl →</span>
<span className="mt-1 text-[11px] font-semibold ... uppercase">
  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar
</span>
```

Ayrıca buton üst-sağ köşeye **"Erken Erişim"** rozeti eklendi (slate-900 zemin, amber-300 metin).

---

## 4) CategoriesSection — İyileştirmeler

### 4.1 İşletmeler kartı açıklaması genişletildi
"Diasporadaki Türk işletmeleri, şirketleri ve girişimcileri — **marketler, klinikler, restoranlar, kafeler, butikler, ajanslar, kuaförler, atölyeler, turizm ofisleri** ve daha fazlasını keşfedin, iş birliği yapın."

### 4.2 Founding 1000 davet bandı (kategori kartlarının altı)
Section'ın açık temasına uyumlu krem/amber gradient zeminde (`bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100`), 2px amber border'lı bir banner eklendi.

- **Tagline:** "Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar"
- **"Erken Erişim"** rozeti
- **Birincil CTA:** `/founding-1000` rotasına gidiyor (amber→yellow gradient)

**Dosya:** `src/components/CategoriesSection.tsx`

---

## 5) CitiesSection — Görsel İyileştirme (26 Nisan sabah)

Kullanıcı kartların "biraz silik" kaldığını belirtti. Sadelik korunarak küçük kontürlü iyileştirme yapıldı.

### Kart düzeyinde:
- `shadow-sm` ve subtle `ring-1 ring-border/40` eklendi
- Arka plan gradient opacity'si hover olmadan da görünsün diye **0% → 40%** çıkarıldı
- Hover'da ring/border accent'lendi (`hover:ring-primary/20`, `hover:border-primary/50`)

### Bayrak ikon container:
- `ring-1 ring-primary/20` eklendi → daha tanımlı görünüm

### CTA redesign — text linkler **pill butonlara** dönüştürüldü:
- **AI Sohbet** → birincil pill buton (`bg-primary text-primary-foreground`, gölge)
- **Form** → ikincil outlined pill (`border border-border bg-background`)

```tsx
<button onClick={() => triggerCitySelect(city.name, "ai")}
  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
             bg-primary text-primary-foreground text-xs font-semibold
             shadow-sm hover:bg-primary/90 hover:shadow transition-all">
  AI Sohbet →
</button>
```

**Dosya:** `src/components/CitiesSection.tsx`

---

## 6) RegisterInterestForm — Yeni Prop

```tsx
interface RegisterInterestFormProps {
  // ... (mevcut props)
  defaultReferralCode?: string;
}
```

- Sayfa-spesifik referral kodlarının formdan otomatik geçmesini sağlar.
- Input `readOnly` olur, kullanıcının kodu silmesi engellenir.
- 🎁 ikonu + yeşil küçük açıklama ile gösterilir.

---

## Etkilenen Dosyalar (Özet Tablo)

| Dosya | Değişiklik Türü |
|-------|------------------|
| `src/components/Founding1000Section.tsx` | **Yeni** + sonradan referral bandı + CTA temizliği |
| `src/pages/Founding1000Page.tsx` | **Yeni** sayfa wrapper |
| `src/pages/BloggerContestPage.tsx` | **Yeni** sayfa, referral kodu, CTA sadeleştirme |
| `src/pages/VloggerContestPage.tsx` | **Yeni** sayfa + Magic Ball maskotu, float anim, referral kodu |
| `src/assets/corteqs-magic-ball-hero.jpg` | **Yeni** (AI ile izole edildi) |
| `src/App.tsx` | 3 yeni route |
| `src/pages/Index.tsx` | Founding1000 bölümü çıkarıldı |
| `src/components/HeroSection.tsx` | CTA temizliği, üç sayfa linki, tagline + "Erken Erişim" rozeti |
| `src/components/CategoriesSection.tsx` | İşletme açıklaması genişletildi, Founding 1000 davet bandı |
| `src/components/CitiesSection.tsx` | Kart kontürleri + pill CTA'lar |
| `src/components/RegisterInterestForm.tsx` | `defaultReferralCode` prop |
| `tailwind.config.ts` | `float` keyframe + animation |

---

## Bilinen / Açık Konular

- **Ödeme entegrasyonu:** Stripe (TR/QA desteklenmiyor) ve Paddle (e-posta kilidi) takıldı. Founding 1000 şu anda sadece **ilgi formu** topluyor; gerçek ödeme akışı kurulmadı.
- **E-posta otomasyonu:** Mevcut "kayıt sonrası teşekkür e-postası" planı korunuyor; yarışma ve Founding 1000 sayfaları için özelleştirilmiş şablonlar eklenebilir.

---

*Rapor otomatik oluşturuldu — 26 Nisan 2026*
