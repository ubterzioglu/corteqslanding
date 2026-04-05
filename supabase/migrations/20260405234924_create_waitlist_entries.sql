create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  persona text not null check (persona in ('kurulus', 'isletme', 'son-kullanici', 'gelistirici')),
  location text,
  contribution text,
  source text default 'landing_v1',
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_entries_email_unique
  on public.waitlist_entries (lower(email));

alter table public.waitlist_entries enable row level security;

create policy if not exists "anon can insert waitlist"
  on public.waitlist_entries
  for insert
  to anon
  with check (true);
