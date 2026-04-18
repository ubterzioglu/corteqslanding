# SEO + GEO Degisiklik Ozeti

## Tarih: 2026-04-18

---

## 1. Meta Taglar (index.html)

- **Title:** `CorteQS Landing Page` -> `CorteQS - Turk Diaspora Network Platformu | Diaspora Connect`
- **Description:** Keyword-rich, max 160 char yeniden yazildi
- **Canonical:** `<link rel="canonical" href="https://corteqs.net/" />` eklendi
- **Robots:** `<meta name="robots" content="index, follow" />` eklendi
- **OG:url, og:site_name, og:locale:** Eklendi (`tr_TR`, `CorteQS`)
- **OG:image:** R2 bucket URL -> `https://corteqs.net/og-image.png`
- **Twitter:site:** `@Lovable` -> `@corteqsx`

## 2. robots.txt

- `Disallow: /admin` eklendi
- `Sitemap: https://corteqs.net/sitemap.xml` eklendi

## 3. sitemap.xml (YENI)

- `public/sitemap.xml` olusturuldu
- Ana sayfa (`https://corteqs.net/`) tek URL olarak kaydedildi

## 4. JSON-LD Structured Data (YENI)

index.html'e `<script type="application/ld+json">` eklendi:

- **Organization:** CorteQS bilgileri, logo, sameAs (X, LinkedIn, Instagram), contactPoint, founders
- **WebSite:** Site bilgileri
- **WebPage:** Sayfa bilgileri
- **FAQPage:** 5 soru-cevap (GEO kritik):
  1. CorteQS nedir?
  2. Diaspora network neden onemli?
  3. CorteQS'e nasil kaydolabilirim?
  4. Sehir elcisi nedir?
  5. Onursal kurucu programi nedir?
- **SpeakableSpecification:** AI assistant'lar icin cssSelector isareti

## 5. Internal Navigation Links

HeroSection stats bar'ina nav eklendi:
- Hakkimizda (`#hakkinda`)
- Kategoriler (`#kategoriler`)
- Sehir Elcilieri (`#elciler`)
- Destek (`#destek`)

## 6. External Authority Links

AboutSection'e 2 dofollow Wikipedia/OECD linki eklendi:
- Wikipedia "Turkish diaspora"
- OECD "migration"

## 7. Heading Structure Fix

- BloggerSection: `<h4>` -> `<h3>` (h2 altinda h4 olmamaliydi)

## 8. Image Alt Text Iyilestirmeleri

| Dosya | Eski | Yeni |
|---|---|---|
| HeroSection | "Dunya sehirleri" | "Dunya genelinde diaspora topluluklarini birlestiren CorteQS platformu" |
| AboutSection | "Diaspora toplulugu bulusmasi" | "Turk diasporasi topluluk bulusmasi ve is birligi etkinligi" |
| AmbassadorSection | "Sehir elcisi" | "CorteQS sehir elcisi - yerel diaspora temsilcisi" |
| RegisterInterestForm | `alt=""` | `aria-hidden="true"` eklendi |
| BackerForm | `alt=""` | `aria-hidden="true"` eklendi |

## 9. GEO Content Expansion (AboutSection)

- CorteQS tanim paragrafi (definition block)
- Wikipedia linkli diaspora istatistik paragrafi
- OECD linkli is birligi paragrafi
- Kisa tanim: "CorteQS nedir?" (AI-friendly summary)

## 10. Footer Trust Signals

- `<h2>` -> `<p>` (footer heading semantik duzeltme)
- Internal link cluster: Iletisim, Hakkimizda, Destek linkleri eklendi

---

## Yapilamayan / Ertelenen

- **Prerender:** `vite-plugin-prerender` ESM scope'ta `require` hatasi veriyor. Alternatif: CI/Docker ortaminda puppeteer-based prerender, veya Cloudflare Pages/Netlify statik hosting.
- **og-image.png:** Kullanici tarafindan `public/` altina konulmali (1200x630px onerilen)
- **WhatsApp linki:** Hala placeholder (`/example`), gercek URL ile degistirilmeli
- **Google Search Console:** Sitemap gonderimi kullanici tarafindan yapilmali
- **Google Analytics 4:** Ayri task olarak eklenmeli
