# CorteQS - Veritabanı Bilgileri

## Bağlantı Bilgileri

- **Supabase URL:** `https://nwpfmfwbguklkhjgqzbh.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGZtZndiZ3VrbGtoamdxemJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODA1NDUsImV4cCI6MjA5MTA1NjU0NX0.rbLgOKduddHU7z8jkhQ__H9GYW3h3oFl1C5Xt3gfIPU`
- **Project Ref:** `nwpfmfwbguklkhjgqzbh`

## Tablo: `submissions`

| Kolon | Tip | Zorunlu | Varsayılan |
|-------|-----|---------|------------|
| id | uuid | ✅ | gen_random_uuid() |
| form_type | text | ✅ | 'register' |
| category | text | ❌ | - |
| fullname | text | ✅ | - |
| country | text | ✅ | - |
| city | text | ✅ | - |
| business | text | ❌ | - |
| field | text | ✅ | - |
| email | text | ✅ | - |
| phone | text | ✅ | - |
| description | text | ❌ | - |
| contest_interest | boolean | ❌ | false |
| linkedin | text | ❌ | - |
| instagram | text | ❌ | - |
| tiktok | text | ❌ | - |
| facebook | text | ❌ | - |
| twitter | text | ❌ | - |
| website | text | ❌ | - |
| consent | boolean | ✅ | false |
| created_at | timestamptz | ✅ | now() |

## RLS Politikaları

| Politika | Komut | Roller |
|----------|-------|--------|
| Anyone can submit a registration | INSERT | anon, authenticated |
| Authenticated users can read submissions | SELECT | authenticated |

## Form Tipleri
- `register` — Kategori kayıt formu
- `support` — Destek/yatırım formu

## Kategoriler
| Değer | Etiket |
|-------|--------|
| danisman | Danışman |
| isletme | İşletme / Şirket |
| dernek | Dernek |
| vakif | Vakıf |
| radyo-tv | Radyo / TV |
| blogger-vlogger | Blogger / Vlogger |
| sehir-elcisi | Şehir Elçisi |
| bireysel | Bireysel Kullanıcı |

## Admin Paneli
- Rota: `/admin`
- Kayıtları tablo halinde görüntüleme, filtreleme ve Excel/CSV export desteği
