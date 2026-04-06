# CorteQS Database Info

Bu dokuman, repodaki mevcut Supabase ayarlari, migration dosyalari ve generated type dosyasina gore hazirlanmistir.
Canli veritabani dogrudan sorgulanmamistir; burada yazanlar repo icindeki gercek kaynaklardan cikarilmistir.

## Su Anda Hangi Database Kullaniliyor

Aktif uygulama baglantisi su Supabase projesine gidiyor:

- Project ID / Ref: `nhvbikijjkymkcldgznv`
- Supabase URL: `https://nhvbikijjkymkcldgznv.supabase.co`
- Client-side env source: `.env`
- Supabase local config source: `supabase/config.toml`
- Frontend client file: `src/integrations/supabase/client.ts`

Projede gorulen env degerleri:

```env
VITE_SUPABASE_PROJECT_ID="nhvbikijjkymkcldgznv"
VITE_SUPABASE_URL="https://nhvbikijjkymkcldgznv.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
```

## Schema Ozeti

Repoda su anda sadece `public` schema icin type tanimi bulunuyor.

- Schema: `public`
- Tables:
  - `public.submissions`
  - `public.admin_users`
- Views: yok
- SQL functions: yok
- Enums: yok
- Composite types: yok

## Migration Gecmisi

Repoda gorulen migration dosyalari:

1. `20260406104636_435b29f1-111a-44a7-8840-41211d0a1c6a.sql`
   - `public.submissions` tablosunu olusturur
   - RLS acilir
   - Public insert policy eklenir
   - Ilk admin read policy eklenir
2. `20260406193000_admin_and_submission_workflow.sql`
   - `public.admin_users` tablosunu ekler
   - `submissions` tablosuna admin takip alanlari ekler
   - read/update policy'lerini admin allowlist mantigina cevirir
   - index'ler ekler

## Table: `public.submissions`

Amac:

- Landing page kayit formlarini saklar
- Destek / yatirim formunu saklar
- Admin panelde durum ve not takibi icin kullanilir

Kolonlar:

| Kolon | Tip | Null | Default | Not |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | hayir | `gen_random_uuid()` | Primary key |
| `form_type` | `text` | hayir | `register` | `register` veya `support` |
| `category` | `text` | evet | - | Kayit kategorisi, support formunda `support` |
| `fullname` | `text` | hayir | - | Ad soyad |
| `country` | `text` | hayir | - | Ulke |
| `city` | `text` | hayir | - | Sehir |
| `business` | `text` | evet | - | Sirket / kurum |
| `field` | `text` | hayir | - | Faaliyet / ilgi alani |
| `email` | `text` | hayir | - | Iletisim e-postasi |
| `phone` | `text` | hayir | - | Iletisim telefonu |
| `description` | `text` | evet | - | Ozellikle support form aciklamasi |
| `contest_interest` | `boolean` | evet | `false` | Blogger/vlogger yarişma ilgisi |
| `linkedin` | `text` | evet | - | Sosyal hesap |
| `instagram` | `text` | evet | - | Sosyal hesap |
| `tiktok` | `text` | evet | - | Sosyal hesap |
| `facebook` | `text` | evet | - | Sosyal hesap |
| `twitter` | `text` | evet | - | Sosyal hesap |
| `website` | `text` | evet | - | Web sitesi |
| `consent` | `boolean` | hayir | `false` | KVKK/izin benzeri onay |
| `status` | `text` | hayir | `new` | Admin takip durumu |
| `notes` | `text` | evet | - | Admin ic notu |
| `reviewed_at` | `timestamptz` | evet | - | Son admin aksiyon zamani |
| `reviewed_by` | `uuid` | evet | - | `admin_users.user_id` baglantisi |
| `created_at` | `timestamptz` | hayir | `now()` | Kayit zamani |

Durum alaninin izinli degerleri:

- `new`
- `contacted`
- `archived`

Bu tabloda kullanilan uygulama mantigi:

- Public kullanici form doldurunca insert olur
- Admin panel bu tabloyu listeler
- Admin durum ve not gunceller
- Mail bildirimi form kaydindan sonra Edge Function ile tetiklenir

Indexler:

- `submissions_created_at_idx` on `created_at desc`
- `submissions_form_type_idx` on `form_type`
- `submissions_category_idx` on `category`
- `submissions_status_idx` on `status`

Iliskiler:

- Foreign key: `submissions.reviewed_by -> admin_users.user_id`

## Table: `public.admin_users`

Amac:

- Admin paneline girebilecek kullanicilarin allowlist tablosudur
- Supabase Auth user UUID'leri burada tutulur

Kolonlar:

| Kolon | Tip | Null | Default | Not |
| --- | --- | --- | --- | --- |
| `user_id` | `uuid` | hayir | - | Primary key, Supabase Auth user id |
| `created_at` | `timestamptz` | hayir | `now()` | Kayit zamani |

Bu tabloda uygulama mantigi:

- Kullanici sadece login olunca admin olmaz
- `/admin` ekrani once auth session kontrol eder
- Sonra `admin_users` tablosunda kullanicinin UUID'si var mi diye bakar
- Varsa kayitlari gorebilir, yoksa goremez

## RLS ve Yetki Politikasi

### `public.submissions`

RLS: acik

Policy'ler:

- `Anyone can submit a registration`
  - `INSERT`
  - Roller: `anon`, `authenticated`
  - Amac: formu herkes doldurabilsin
- `Admin users can read submissions`
  - `SELECT`
  - Roller: `authenticated`
  - Kosul: `auth.uid()` degeri `admin_users` tablosunda bulunmali
- `Admin users can update submissions`
  - `UPDATE`
  - Roller: `authenticated`
  - Kosul: `auth.uid()` degeri `admin_users` tablosunda bulunmali

### `public.admin_users`

RLS: acik

Policy'ler:

- `Users can read their own admin membership`
  - `SELECT`
  - Roller: `authenticated`
  - Kosul: kullanici sadece kendi `user_id` satirini gorebilir

## Uygulamanin Database ile Nasil Konustugu

Frontend Supabase client:

- Dosya: `src/integrations/supabase/client.ts`
- `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` kullanir

Form akisi:

- Dosya: `src/components/RegisterInterestForm.tsx`
- `public.submissions` tablosuna insert atar
- Basarili kayittan sonra `send-submission-email` edge function cagrilir

Admin akisi:

- Dosya: `src/pages/AdminPage.tsx`
- `admin_users` tablosundan yetki kontrolu yapar
- `submissions` tablosunu okur
- `status`, `notes`, `reviewed_at`, `reviewed_by` alanlarini gunceller

## Database Tarafinda Bilinen Eksikler / Olmayanlar

Repodaki type ve migration'lara gore su an:

- additional schema yok
- SQL function yok
- database view yok
- enum type yok
- trigger tanimi yok
- stored procedure yok

Not:

- Supabase Auth kendi sistem tablolarini kullanir, fakat bunlar repodaki `public` schema tiplerine dahil degildir
- Edge Function kullanimi vardir ama bu veritabani SQL function'i degildir

## Mail ile Ilgili Database Baglantili Bilgi

Mail akisi dogrudan database tablosu degil, form kaydi + edge function uzerinden ilerler:

- Edge Function: `send-submission-email`
- Konum: `supabase/functions/send-submission-email/index.ts`

Gerekli secret'lar:

- `RESEND_API_KEY`
- `MAIL_FROM`
- `MAIL_TO_ADMIN`

Opsiyonel secret'lar:

- `MAIL_REPLY_TO`
- `MAIL_SEND_CONFIRMATION=true`

Davranis:

- Form kaydi veritabanina yazilir
- Sonra mail gonderimi denenir
- Mail hatasi olsa bile kayit veritabaninda kalir

## Admin Kurulumu

1. Supabase Auth uzerinden admin kullaniciyi olustur
2. O kullanicinin UUID bilgisini al
3. Asagidaki SQL ile `admin_users` tablosuna ekle

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_ID');
```

4. Kullanici `/admin` ekranindan giris yapabilir

## Kisa Ozet

Su anda uygulama tek bir Supabase projesi kullanıyor:

- `nhvbikijjkymkcldgznv`

Repoda tanimli public database yuzeyi su:

- 2 tablo
  - `submissions`
  - `admin_users`
- 0 view
- 0 SQL function
- 0 enum
- 1 foreign key
- 4 index
- RLS aktif
