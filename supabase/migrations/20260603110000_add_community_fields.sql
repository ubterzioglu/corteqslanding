alter table public.whatsapp_landings
  drop constraint if exists whatsapp_landings_category_check;

update public.whatsapp_landings
  set category = 'yatirim'
  where category = 'girisim';

alter table public.whatsapp_landings
  add constraint whatsapp_landings_category_check
  check (category in (
    'alumni', 'hobi', 'is', 'doktor', 'yatirim', 'akademik',
    'dayanisma', 'hr', 'kisisel-gelisim', 'diger'
  ));

alter table public.whatsapp_landings
  add column if not exists member_count integer,
  add column if not exists member_count_updated_at timestamptz,
  add column if not exists group_score integer,
  add column if not exists language text
    check (language in ('tr', 'en', 'de', 'ar')),
  add column if not exists origin text
    check (origin in ('global', 'mena', 'berlin', 'turkiye', 'avrupa'));
