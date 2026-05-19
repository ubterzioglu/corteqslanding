# CorteQS Landing - Teknik Durum Dokumani

Bu dokuman, projenin **19 Mayis 2026** tarihindeki mevcut teknik durumunu, mimarisini, veri akislarini ve operasyonel kurallarini ozetler.

## 1) Proje Ozeti

CorteQS Landing, React + Vite tabanli bir web uygulamasidir. Uygulama:

- Public landing ve kampanya sayfalari sunar
- Form tabanli lead/submission toplar
- Supabase uzerinde kimlik, veri saklama ve RLS ile yetkilendirme yapar
- Admin paneli ile operasyonel yonetim ekranlari saglar
- Supabase Edge Functions ile e-posta, kayit, eslestirme ve anket islemleri yapar

Ana teknoloji yiginlari:

- Frontend: React 18, TypeScript, Vite 5, Tailwind CSS
- UI: Radix UI + shadcn yapisi
- Data client: `@supabase/supabase-js`
- State/Data fetching: TanStack Query
- Test: Vitest + Testing Library

## 2) Kaynak Agac ve Moduler Yapilanma

Top-level:

- `src/` -> frontend uygulama kodu
- `supabase/migrations/` -> veritabani schema/RLS migrationlari
- `supabase/functions/` -> Edge Function kodlari
- `docs/`, `docu/` -> teknik notlar ve dokumanlar
- `server.mjs` -> production static server + `/api/chat` proxy
- `Dockerfile`, `nginx.conf.template`, `docker-entrypoint-env.sh` -> container deployment

`src` icinde:

- `pages/` -> route seviyesinde ekranlar (public + admin + kampanya + anket)
- `components/` -> tekrar kullanilan UI/business componentleri
- `lib/` -> domain helperlari (submissions, lansman, referral, survey, muhasebe vb.)
- `integrations/supabase/` -> typed client + DB tipleri

## 3) Uygulama Mimarisi

### 3.1 Frontend Calisma Modeli

- Uygulama `src/App.tsx` uzerinden route tabanli calisir.
- Kuresel providerlar:
  - `QueryClientProvider`
  - `TooltipProvider`
  - Toast/Sonner providerlari
- Public alanlar `PublicLayout` altinda, admin alanlar `/admin` + `AdminLayout` altinda toplanir.

### 3.2 Routing

Onemli public route'lar:

- `/` -> landing
- `/form` -> kayit formu
- `/aiform` -> AI destekli form
- `/lansman` -> lansman form akisi
- `/founding-1000`, `/blogger-yarismasi`, `/vlogger-yarismasi`
- `/19051919`, `/190519idea`, `/190519memory`, `/19051919/harita`
- `/anket`, `/anket/:slug`, `/anket/tesekkurler`

Onemli admin route'lar:

- `/admin` -> dashboard/home
- `/admin/members` -> submissions yonetimi
- `/admin/lansman` -> lansman kayit yonetimi
- `/admin/referral*` -> referral kaynak/tip/grup ve kod yonetimi
- `/admin/surveys*` -> anket yonetimi
- `/admin/whatsapp-landings`
- `/admin/workspace/*` -> command center/resource/todo/mvp/notes alanlari
- `/admin/may19/*` -> 19 Mayis moderasyon ekranlari

## 4) Veri Katmani ve Supabase

### 4.1 Supabase Proje ve Fonksiyon Ayarlari

`supabase/config.toml`:

- `project_id = "injprdrsklkxgnaiixzh"`
- `verify_jwt = true` olan functionlar:
  - `chat-register`
  - `find-matches`
  - `send-submission-email`
  - `lansman-admin`
- `verify_jwt = false`:
  - `submit-survey-response` (public anket gonderimi)

### 4.2 Ana Tablolar (migrationlardan)

- `public.submissions`
- `public.admin_users`
- `public.matches`
- `public.referral_sources`
- `public.referral_types`
- `public.referral_groups`
- `public.referral_codes`
- `public.referral_code_usages`
- `public.wa_users`
- `public.marquee_items`
- `public.lansman_registrations`
- `public.whatsapp_landings`
- `public.whatsapp_join_requests`
- `public.may19_campaign_submissions`
- `public.surveys`
- `public.survey_questions`
- `public.survey_responses`
- `public.survey_answers`

### 4.3 RLS ve Yetkilendirme Yaklasimi

Genel desen:

- Public insert gereken tablolarda (`submissions`, `lansman_registrations`, bazi campaign tablolari) `anon/authenticated` insert policyleri bulunur.
- Admin okuma/yazma gereken tablolarda policy kontrolu `public.is_admin(auth.uid())` veya `public.admin_users` tablosu uzerinden yapilir.
- Storage policyleri bucket bazli kisitlanmistir (security hardening migrationlariyla).

Son durumda eklenen migration:

- `20260519102000_reassert_submissions_public_insert_policy.sql`
  - `public.submissions` icin public insert policy'sini tekrar garanti altina alir.

## 5) Submission Akisi (Kritik Is Akisi)

Client tarafi:

- Formlar (`FormPage`, `RegisterInterestForm`, `BackerForm`) `toSubmissionInsert` ile payload olusturur.
- Referral kod varsa `validateReferralCodeBeforeSubmit` ile RPC dogrulamasi yapilir.
- Kayit `insertSubmissionWithCompatibility` ile DB'ye yazilir.
  - Eksik kolon/versiyon farklarinda sinirli fallback denemesi vardir.

DB tarafi:

- `submissions_apply_referral_code` triggeri:
  - referral code normalize ve validasyon
  - `referral_code_id` baglama
- `submissions_log_referral_usage` triggeri:
  - referral usage sayaci/artik kayit

Not:

- Form submission akisi, e-posta bildirimi basarisiz olsa bile kaydi tamamlamayi hedefler.

## 6) Anket (Survey) Modulu

Schema:

- `surveys` (anket metadata/yayin durumu)
- `survey_questions` (soru tanimlari)
- `survey_responses` (yanit ust kayitlari)
- `survey_answers` (soru bazli cevaplar)

Yazma akisi:

- Public form `submit-survey-response` Edge Function'a gider.
- Function tarafinda:
  - payload parse/validation
  - anti-spam timing check
  - edge rate limit kontrolu (`edge_rate_limits`)
  - response ve answer insertleri

## 7) Edge Function Envanteri

- `chat-register` -> sohbet tabanli kayit toplama
- `find-matches` -> submission eslestirme
- `lansman-admin` -> lansman admin islemleri
- `send-submission-email` -> kayit e-posta bildirimi
- `submit-survey-response` -> public anket gonderimi

## 8) Frontend UI/UX Teknik Notlari

- Header/nav: `SiteHeader.tsx` responsive davranisi guncel durumda dar genislikte hamburger menuye dusecek sekilde ayarlanmistir (`xl` alti).
- UI altyapisi Radix + utility class pattern'i ile ilerler.
- `PublicLayout` ve admin shell ayrimi korunur.

## 9) Runtime Config ve Deployment

### 9.1 Runtime Env Config

Frontend Supabase degerleri runtime'da `env-config.js` ile beslenir:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

`src/integrations/supabase/client.ts` hem runtime config hem `import.meta.env` fallback'i kullanir.

### 9.2 Production Serving

Iki ana model desteklenir:

1. Nginx tabanli container (`Dockerfile` + `nginx.conf.template`)
2. Node static server (`server.mjs`)

`server.mjs` ozellikleri:

- `dist/` static serve
- SPA fallback
- hashed asset yoksa 404
- `/api/chat` proxy -> `https://rag.corteqs.net/api/chat`
- request size limiti, timeout, basit IP rate limit
- guvenlik header seti

### 9.3 Build

- Vite rollup input:
  - `index.html`
  - `lansman/index.html`
- Standalone commercial HTML dosyalari build cikisina emit edilir (`vite.config.ts` custom plugin).

## 10) Guvenlik ve Hardening Notlari

- RLS aktif ve policy bazli erisim kisitli.
- Storage bucket policyleri hardening migrationlariyla daraltilmis.
- `/api/chat` proxy secret'i server-side tutulur (`RAG_API_SECRET`).
- `SUPABASE_SERVICE_ROLE_KEY` frontend'e expose edilmemelidir.
- Admin erisimi auth session + admin membership policy'si ile kontrol edilir.

## 11) Test ve Kalite Kontrolleri

Scriptler:

- `npm run test` -> vitest
- `npm run lint` -> eslint
- `npm run build` -> prod build
- `npm run verify:release` -> build artifact/live release dogrulamasi

Test kapsaminda ozel olarak su alanlarin testleri mevcut:

- form ve lansman sayfalari
- AI form akisi
- may19 kampanya sayfalari
- header/footer/hizli bilesenler
- `src/lib` altinda domain helper unit testleri

## 12) Bilinen Riskler / Teknik Borclar

1. `.env` dosyasinda publishable key alaninin placeholder kalmasi (`REPLACE_WITH_NEW_ANON_KEY`) ortama bagli auth/RLS sorunlari yaratabilir.
2. Uzun migration gecmisi nedeniyle ortamlar arasi policy drift riski vardir; prod/stage policy snapshot dogrulamasi rutinlestirilmelidir.
3. Farkli deploy modlari (nginx + node server) birlikte desteklendigi icin operasyonel konfig farklari izlenmelidir.

## 13) Operasyonel Kontrol Listesi (Onerilen)

Deploy oncesi:

1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. Supabase migration sync kontrolu (`supabase db push` / migration status)
5. Kritik policy kontrolu:
   - `submissions` public insert policy
   - admin-only tablolarin select/update policyleri

Deploy sonrasi:

1. `BASE_URL=<live-url> npm run verify:release`
2. Public form submit smoke test
3. Admin login + listeleme smoke test
4. Survey submit smoke test
5. `/api/chat` proxy health kontrolu

## 14) Dosya Referanslari

- [App.tsx](C:/temp_private/corteqs/corteqs_landing/src/App.tsx)
- [SiteHeader.tsx](C:/temp_private/corteqs/corteqs_landing/src/components/SiteHeader.tsx)
- [submissions.ts](C:/temp_private/corteqs/corteqs_landing/src/lib/submissions.ts)
- [client.ts](C:/temp_private/corteqs/corteqs_landing/src/integrations/supabase/client.ts)
- [server.mjs](C:/temp_private/corteqs/corteqs_landing/server.mjs)
- [vite.config.ts](C:/temp_private/corteqs/corteqs_landing/vite.config.ts)
- [config.toml](C:/temp_private/corteqs/corteqs_landing/supabase/config.toml)
- [20260519102000_reassert_submissions_public_insert_policy.sql](C:/temp_private/corteqs/corteqs_landing/supabase/migrations/20260519102000_reassert_submissions_public_insert_policy.sql)

