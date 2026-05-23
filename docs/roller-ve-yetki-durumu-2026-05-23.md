# CorteQS Roller ve Yetki Modeli - Teknik Durum Dökümanı

Tarih: 23 Mayıs 2026
Kapsam: `c:\temp_private\corteqs\corteqs_landing` kod tabanı ve migration geçmişi
Durum türü: Kod/migration bazlı mevcut durum analizi (canlı DB introspection yapılmadı)

## 1) Özet

Sistemde yetkilendirme üç ana katmanda çalışıyor:

1. Kimlik doğrulama (Auth): Supabase Auth oturumu (JWT/session).
2. Uygulama yönlendirme/guard: React tarafında `RequireAuth`, `AdminLayout`, profil yönlendirme.
3. Veri erişim kontrolü (RLS): Supabase tablo ve storage policy’leri.

Pratikte iki ana yetki ekseni var:

- Public/Anon işlem alanı: form gönderimleri ve bazı içerik okumaları.
- Admin işlem alanı: `admin_users` üyeliği + `public.is_admin(auth.uid())` tabanlı erişimler.

## 2) Rol Modeli

Sistemde klasik RBAC tabloları yerine pratik ve iki seviyeli bir model var.

### 2.1 Kimliği olmayan kullanıcı (`anon`)

- Public form insert işlemlerini yapabilir (ilgili tablolarda policy varsa).
- Yayındaki anketleri okuyabilir.
- Admin veri setlerine erişemez.

### 2.2 Giriş yapmış kullanıcı (`authenticated`)

- Public işlemlerin authenticated varyantlarını yapabilir.
- Kendi profilini (`user_profiles`) okuyup güncelleyebilir.
- Admin değilse admin ekranlarına/data’larına erişemez.

### 2.3 Admin kullanıcı (`authenticated` + `admin_users` üyeliği)

- `admin_users` tablosunda `user_id` satırı olan kullanıcıdır.
- RLS tarafında çoğu kritik işlem `public.is_admin(auth.uid())` ile açılır.
- Admin paneli erişimi UI seviyesinde de `userIsAdmin` kontrolüyle korunur.

## 3) Uygulama Katmanı Yetki Akışı

### 3.1 Auth session

- `AuthProvider` Supabase session’ı izler (`onAuthStateChange` + `getSession`).
- `RequireAuth` olmayan session’da kullanıcıyı `/login`’e yönlendirir.

İlgili dosyalar:
- `src/components/auth/AuthProvider.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/pages/LoginPage.tsx`

### 3.2 Profil rol/type akışı

- Login sonrası `/profile` route’u korunur.
- `ProfileResolverPage`, `user_profiles.profile_type` alanını okur.
- Profil tipi yoksa kullanıcıya tip seçtirir ve `user_profiles` tablosuna upsert yapar.
- `ProfilePage`, URL’deki `:type` ile DB’deki `assignedType` uyuşmazsa doğru profile redirect eder.

Desteklenen profil tipleri:
- `bireysel`
- `danisman`
- `isletme`
- `kurulus-dernek`
- `blogger-vlogger-youtuber`
- `sehir-elcisi`

İlgili dosyalar:
- `src/pages/ProfileResolverPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/lib/profile-types.ts`

### 3.3 Admin panel akışı

- `/admin` altında giriş formu var; session yoksa login ekranı gösteriliyor.
- Session varsa `userIsAdmin(user.id)` çağrısı ile `admin_users` kontrolü yapılıyor.
- Admin değilse “bu hesabın admin yetkisi yok” ekranı gösteriliyor.

İlgili dosyalar:
- `src/components/admin/AdminLayout.tsx`
- `src/lib/admin.ts`

Not:
- UI’de guard mevcut olsa da asıl güvenlik katmanı RLS policy’lerdir.

## 4) Veritabanı Yetki Modeli (RLS)

## 4.1 Admin üyeliği ve yardımcı fonksiyon

### `admin_users`

- Admin üyeliğini temsil eder (`user_id` PK).
- Kullanıcı sadece kendi membership kaydını okuyabilir.

Migration:
- `supabase/migrations/20260406193000_admin_and_submission_workflow.sql`

### `public.is_admin(uid uuid)`

- `admin_users` tablosunda satır var mı kontrol eder.
- `security definer` SQL fonksiyonu olarak tanımlı.
- Çok sayıda policy bu fonksiyonu çağırır.

Migration:
- `supabase/migrations/20260424000000_muhasebe_module.sql`

## 4.2 `submissions` yetki durumu

Evrim:
- İlk durumda authenticated herkes select yapabiliyordu.
- Sonra admin üyeliğine daraltıldı.
- Insert policy’si birden fazla kez reset/reassert edilerek public insert garanti altına alınmış.

Güncel niyet:
- Insert: `anon, authenticated` (public form akışı için açık)
- Select/Update: admin üyeliğine bağlı

İlgili migrationlar:
- `20260406104636_435b29f1-111a-44a7-8840-41211d0a1c6a.sql`
- `20260406193000_admin_and_submission_workflow.sql`
- `20260519102000_reassert_submissions_public_insert_policy.sql`
- `20260519112000_reset_submissions_insert_policies.sql`
- `20260519114500_reset_submissions_insert_and_all_policies.sql`

## 4.3 `user_profiles` yetki durumu

- RLS açık.
- `select/insert/update` sadece `auth.uid() = user_id` için izinli.
- Frontend role-type routing bu tabloya dayanıyor.

Migration:
- `supabase/migrations/20260520152000_create_user_profiles_v2.sql`

Not:
- Eski `profiles` tablosu da mevcut migration geçmişinde var; yeni akış `user_profiles` kullanıyor.

## 4.4 Anket (Survey) modülü

Tablolar:
- `surveys`, `survey_questions`, `survey_responses`, `survey_answers`

Policy özeti:
- Public: sadece yayın koşullarını sağlayan anket ve soruları okuyabilir.
- Admin: tüm CRUD/response erişimleri `is_admin` ile açılır.

Migration:
- `supabase/migrations/20260517120000_create_surveys_module.sql`

Edge function:
- `submit-survey-response` için `verify_jwt = false` (public submission hedefli).
- İçeride rate-limit, payload doğrulama, anti-spam kontrolleri var.

## 4.5 Workspace / içerik yönetimi / muhasebe

Admin-only modele çekilen başlıca alanlar:
- `command_center_items`
- `resource_entries`
- `mvp_items`
- muhasebe tabloları (`expenses`, `incomes`)
- çeşitli sosyal medya link tabloları

Hardening sonrası pattern:
- authenticated + `is_admin(auth.uid())` şartı

İlgili migrationlar:
- `20260512103000_security_hardening_phase1.sql`
- `20260424000000_muhasebe_module.sql`

## 4.6 Storage bucket policy durumu

### Submission belgeleri (`submission-documents`)
- Okuma: admin
- Silme: admin
- Upload: public (`owner is null` kısıtıyla)

### May19 dosyaları
- Upload: public
- Okuma/silme: admin

### WhatsApp landing hero görselleri
- Public read
- Upload/update/delete: authenticated owner bazlı

İlgili migrationlar:
- `20260512103000_security_hardening_phase1.sql`
- `20260515173000_add_may19_storage_buckets_and_fields.sql`
- `20260516152000_fix_may19_storage_insert_policies.sql`
- `20260517110000_add_whatsapp_landing_hero_bucket.sql`

## 5) Edge Function Yetki ve JWT Durumu

`supabase/config.toml`:

- `chat-register`: `verify_jwt = true`
- `find-matches`: `verify_jwt = true`
- `send-submission-email`: `verify_jwt = true`
- `lansman-admin`: `verify_jwt = true`
- `submit-survey-response`: `verify_jwt = false`

Yorum:
- Public olması gereken tek fonksiyon `submit-survey-response` olarak konumlanmış.
- JWT zorunlu fonksiyonlarda ayrıca origin/rate-limit/payload kontrolleri uygulanıyor.

## 6) Rol-Yetki Matrisi (Operasyonel)

1. `anon`
- Yapabilir: public form insertleri (policy açık olanlar), yayın anket okumaları
- Yapamaz: admin panel, admin tabloları, admin storage okuma/silme

2. `authenticated (non-admin)`
- Yapabilir: kendi session işlemleri, kendi `user_profiles` CRUD
- Yapamaz: admin-only tablo/policy aksiyonları

3. `authenticated + admin_users`
- Yapabilir: admin panel fonksiyonları, admin-only tablo ve storage aksiyonları
- Koşul: `admin_users` üyelik kaydı + RLS policy

## 7) Mevcut Güçlü Noktalar

- UI guard + RLS birlikte kullanılıyor.
- Admin kontrolü merkezi bir primitive’e bağlanmış: `is_admin`.
- Survey/public endpointlerde rate-limit ve validation katmanları var.
- Hardening migrationlarıyla authenticated-genel erişimden admin-daraltılmış modele geçilmiş.

## 8) Riskler ve Açık Konular

1. Migration geçmişinde policy reset/recreate adımları yoğun.
- Ortamlar arası policy drift riski var (stage/prod farkı oluşabilir).

2. `profiles` ve `user_profiles` birlikte geçmişte mevcut.
- Kod yeni tabloda (`user_profiles`) olsa da eski tabloya bağımlı kalan ad-hoc sorgular olabilir.

3. Bazı public insert/storage akışları kasıtlı açık.
- Abuse riskini düşük tutmak için rate-limit + captcha + ek sinyal kontrolleri değerlendirilmeli.

4. Bu rapor canlı DB introspection içermiyor.
- Canlı ortamda son policy setinin migration niyetiyle birebir olduğunun ayrıca doğrulanması gerekir.

## 9) Doğrulama Checklist’i (Canlı Ortam İçin)

1. `admin_users` üzerinde beklenen üyeliklerin varlığını doğrula.
2. `pg_policies` üzerinden kritik tabloların policy snapshot’unu al:
- `submissions`
- `user_profiles`
- `surveys`, `survey_questions`, `survey_responses`, `survey_answers`
- `command_center_items`, `resource_entries`, `mvp_items`
- `expenses`, `incomes`
3. Storage policy snapshot:
- `submission-documents`
- `19051919_fikir`, `19051919_memory`
- `whatsapp-landing-hero`
4. Edge function config doğrula:
- `submit-survey-response` dışında public function kalmadığını kontrol et.
5. Smoke test:
- non-admin kullanıcı ile admin endpoint/UI erişim denemeleri (beklenen: erişim yok)
- admin kullanıcı ile CRUD erişimleri (beklenen: erişim var)

## 10) Referans Dosyalar

- `src/components/auth/AuthProvider.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/lib/admin.ts`
- `src/pages/ProfileResolverPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/lib/profile-types.ts`
- `supabase/config.toml`
- `supabase/migrations/20260406193000_admin_and_submission_workflow.sql`
- `supabase/migrations/20260424000000_muhasebe_module.sql`
- `supabase/migrations/20260512103000_security_hardening_phase1.sql`
- `supabase/migrations/20260517120000_create_surveys_module.sql`
- `supabase/migrations/20260520152000_create_user_profiles_v2.sql`
