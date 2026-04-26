# Değişiklik Günlüğü (Changelog)

## Oturum 6 — 21 Nisan 2026 · Şehir Bazlı Hızlı Giriş
- **Akıllı Kayıt Deneyimi:** AI sohbet bölümü başlığı "Devrimci" yerine "Akıllı Kayıt Deneyimi" oldu; alt metin diaspora bağlantısı, iş yapma ve tanışma vurgusuyla güncellendi.
- **Şehir kartı CTA'ları:** Her şehir kartında artık iki ayrı buton var — **AI Sohbet** ve **Form**. Tıklanan şehir adı seçilen kanala otomatik geçiyor.
- **Marquee tag'leri tıklanabilir:** İki satırlık global şehir bandındaki her chip artık AI sohbeti başlatıyor; yanındaki küçük "Form" butonu klasik formu o şehirle açıyor.
- **Cross-component event bus:** `corteqs:select-city` custom event'i ile `CitiesSection → ChatRegisterBar` arası şehir aktarımı yapılıyor; AI tarafında `collected.city` prefill ediliyor, form tarafında `defaultCity` prop'u ile input dolduruluyor.
- **Değişen dosyalar:** `src/components/CitiesSection.tsx`, `src/components/ChatRegisterBar.tsx`, `src/components/RegisterInterestForm.tsx`.

## Oturum 5 — 21 Nisan 2026 · AI Eşleştirme

### Yenilikler
- **AI Arz/Talep Eşleştirme:** Sohbet asistanı, kullanıcının arz/talebini analiz edip mevcut diaspora ağında **anahtar kelime + AI hibrit** yöntemiyle en iyi 5 eşleşmeyi bulur. Eşleşmeler hem kayıt onayından önce (önizleme) hem de kayıt sonrası (kalıcı) sohbette kart olarak gösterilir.
- **Görsel destekli arz:** AI artık araba/ev/eşya satışı gibi durumlarda görsel yüklemeyi proaktif olarak istiyor. Yüklenen görseller `submission-documents` bucket'ına kaydediliyor ve eşleşme kayıtlarına bağlanıyor.
- **Eşleşme kart UI:** Sohbet içinde her eşleşmeye uygunluk skoru (%), şehir/ülke, alan ve AI'nın gerekçesi gösteriliyor.

### Veritabanı
- Yeni `matches` tablosu: kaynak kayıt, eşleşen kayıt, skor, gerekçe ve bildirim durumu (e-posta için hazır).
- RLS: Yalnızca giriş yapmış admin eşleşmeleri görebilir; eşleşmeler arka plan sistemi tarafından oluşturulur.

### Edge Functions
- **find-matches:** Anahtar kelime ön filtre + Gemini 2.5 Flash ile semantik sıralama. En fazla 5 eşleşme döner. `persist=true` ile DB'ye kaydedilir.
- **chat-register:** Sistem promptu çevikleştirildi — arz/talep konularında (araç, hizmet, iş, yatırım) detay yakalama protokolü. Model: gpt-5-mini.

### Etkilenen Dosyalar
| Dosya | Değişiklik |
|---|---|
| `supabase/functions/find-matches/index.ts` | Yeni — hibrit eşleştirme |
| `supabase/functions/chat-register/index.ts` | Çevik prompt + arz/talep protokolü |
| `src/components/ChatRegisterBar.tsx` | Eşleşme önizleme + kalıcı kaydetme + kart UI |


## Oturum 4 — 20 Nisan 2026

### İyileştirmeler
- **Kategori güçlendirmesi:** "Danışman" kategorisi → **"Danışman / Doktor / Avukat"** olarak yeniden adlandırıldı. Seçildiğinde hekim, avukat, mali müşavir, mühendis, koç, terapist gibi diaspora uzmanları için açıklayıcı bilgi kutusu görünüyor.
- **Çoklu doküman yükleme:** Form artık tek seferde **birden fazla dosya** (en fazla 5, dosya başına 10 MB) kabul ediyor. Her dosya ayrı listelenebilir ve "Kaldır" butonuyla silinebilir. Kayıttaki tüm dosyalar admin panelinde tek tek listelenir.
- **Arz & Talep AI ipucu:** Hem kayıt hem bağışçı formundaki Arz & Talep alanına "🤖 Detaylı veri AI eşleşme (AI match) kalitesini artıracaktır" yardım metni eklendi.
- **Form altındaki email kutusu kaldırıldı:** Kayıt formundaki info@corteqs.net bağlantı kutusu kaldırıldı.

### Veritabanı
- `submissions` tablosuna `documents` (JSONB) alanı eklendi — çoklu dosya kayıtları için. Eski `document_url`/`document_name` alanları geriye dönük uyumluluk için korunuyor.

### Etkilenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `src/components/RegisterInterestForm.tsx` | Çoklu dosya yükleme, Danışman/Doktor/Avukat kategorisi + açıklama, AI match ipucu, email kutusu kaldırıldı |
| `src/components/BackerForm.tsx` | Arz & Talep AI match ipucu |
| `src/pages/AdminPage.tsx` | Çoklu doküman gösterimi (tablo + CSV), kategori filtresi etiketi |

---

## Oturum 3 — 20 Nisan 2026

### Yeni Özellikler
- **WhatsApp grup kutusu kaldırıldı:** Kayıt formundaki "Kategori WhatsApp grubuna katılmak istiyorum" onay kutusu kaldırıldı.
- **CV / Doküman yükleme:** Kategori seçimi olan tüm kayıtlara opsiyonel CV/doküman yükleme eklendi (PDF, DOC, DOCX, JPG, PNG, WEBP — maks. 10 MB). Dosyalar `submission-documents` storage bucket'ına yükleniyor ve public URL olarak kayıtta saklanıyor.
- **Arz & Talep alanı:** Tüm kayıt formlarına (Register + Backer) 1000 karakterlik serbest metin "Arz & Talepleriniz" alanı eklendi (ör. "İş arıyorum", "Aracımı satıyorum", "Parti biletim var").
- **Referral kodu metni güncellendi:** "Sizi davet eden admin/influencer referral kodunuzu girin. Avantajlardan faydalanın."
- **Admin paneli:** Tablo ve CSV export yeni alanları (Arz & Talep, Doküman linki) gösterecek şekilde güncellendi.

### Veritabanı
- `submissions` tablosuna `document_url`, `document_name`, `offers_needs` kolonları eklendi.
- Yeni public storage bucket: `submission-documents` (10 MB, sadece izin verilen MIME türleri).

### Etkilenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `src/components/RegisterInterestForm.tsx` | WhatsApp kutusu kaldırıldı, CV upload + Arz/Talep alanı + referral metni |
| `src/components/BackerForm.tsx` | Arz/Talep alanı + referral metni |
| `src/pages/AdminPage.tsx` | Yeni alanlar için tablo & CSV sütunları |

---

## Oturum 2 — 7 Nisan 2026

### Yeni Özellikler
- **Form hata detaylandırma:** `RegisterInterestForm.tsx` dosyasında Supabase'e gönderilen veri açıkça yapılandırıldı (`insertData` objesi). Hata mesajları artık konsola detaylı yazılıyor ve kullanıcıya gerçek hata mesajı gösteriliyor.
- **Teşekkür e-postası planlandı:** Form submit sonrası kullanıcıya otomatik teşekkür e-postası gönderilmesi için e-posta domain kurulumu başlatıldı (henüz tamamlanmadı).

### Etkilenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `src/components/RegisterInterestForm.tsx` | Veri mapping düzeltildi, hata loglama eklendi |

---

## Oturum 1 — 7 Nisan 2026

### Düzeltmeler
- **Beyaz ekran sorunu giderildi:** `src/App.css` dosyasındaki Vite varsayılan `#root` stilleri (`max-width`, `padding`, `text-align`) kaldırıldı. Bu stiller sayfa düzenini bozuyordu.

### Görsel İyileştirmeler
- **Kategoriler bölümüne arka plan görseli eklendi:** `src/components/CategoriesSection.tsx` dosyasına dünya network görseli (`/lovable-uploads/...`) arka plan olarak eklendi.
- **Arka plan opacity artırıldı:** Görsel daha belirgin hale getirildi.
  - `opacity-[0.07]` → `opacity-[0.18]` → `opacity-[0.24]` → `opacity-[0.31]` (kademeli olarak artırıldı)

### Etkilenen Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `src/App.css` | Vite varsayılan stilleri kaldırıldı |
| `src/components/CategoriesSection.tsx` | Arka plan görseli eklendi, opacity ayarlandı |
