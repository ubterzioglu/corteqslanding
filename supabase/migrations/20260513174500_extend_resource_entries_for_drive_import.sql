alter table public.resource_entries
  add column if not exists source_folder text,
  add column if not exists source_subfolder text,
  add column if not exists source_snapshot_date date,
  add column if not exists import_batch text;

update public.resource_entries
set
  source_folder = coalesce(source_folder, 'Manuel Kayıt'),
  import_batch = coalesce(import_batch, 'manual-entry')
where source_folder is null
   or import_batch is null;

alter table public.resource_entries
  alter column source_folder set not null,
  alter column import_batch set not null;

delete from public.resource_entries entry
using (
  select id
  from (
    select
      id,
      row_number() over (
        partition by url
        order by created_at desc, id desc
      ) as row_num
    from public.resource_entries
    where url is not null
  ) ranked
  where ranked.row_num > 1
) duplicates
where entry.id = duplicates.id;

create unique index if not exists resource_entries_url_unique_idx
  on public.resource_entries (url)
  where url is not null;
