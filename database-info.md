# CorteQS Diaspora Connect - Veritabanı Bilgileri

## Supabase Proje Bilgileri
- **Proje Ref:** nhvbikijjkymkcldgznv
- **Supabase URL:** https://nhvbikijjkymkcldgznv.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmJpa2lqamt5bWtjbGRnem52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzAxNDEsImV4cCI6MjA5MTA0NjE0MX0.3tgDsaERZmEU0hn9-24mk5o8TtXGNsoGV1VB4Niscqs

## Tablo: `submissions`

| Kolon | Tip | Zorunlu | Varsayılan |
|-------|-----|---------|------------|
| id | uuid | Evet | gen_random_uuid() |
| form_type | text | Evet | 'register' |
| category | text | Hayır | - |
| fullname | text | Evet | - |
| country | text | Evet | - |
| city | text | Evet | - |
| business | text | Hayır | - |
| field | text | Evet | - |
| email | text | Evet | - |
| phone | text | Evet | - |
| description | text | Hayır | - |
| contest_interest | boolean | Hayır | false |
| linkedin | text | Hayır | - |
| instagram | text | Hayır | - |
| tiktok | text | Hayır | - |
| facebook | text | Hayır | - |
| twitter | text | Hayır | - |
| website | text | Hayır | - |
| consent | boolean | Evet | false |
| created_at | timestamptz | Evet | now() |

## RLS Politikaları

1. **Anyone can submit a registration** - INSERT izni (anon + authenticated)
2. **Authenticated users can read submissions** - SELECT izni (authenticated)

## Form Tipleri
- `register` - Kategori kayıt formu
- `support` - Destek/Yatırım formu

## Kategoriler
- `danisman` - Danışman
- `isletme` - İşletme / Şirket
- `dernek` - Dernek
- `vakif` - Vakıf
- `radyo-tv` - Radyo / TV
- `blogger-vlogger` - Blogger / Vlogger
- `sehir-elcisi` - Şehir Elçisi
- `bireysel` - Bireysel Kullanıcı
