create table if not exists public.candidates (
  id uuid primary key,
  name text not null,
  email text not null,
  phone text not null,
  city text not null,
  years numeric not null check (years between 0 and 80),
  sector text not null,
  companies text not null,
  availability text not null,
  consent_at timestamptz not null,
  cv_path text not null unique
);
create index if not exists candidates_years_idx on public.candidates (years);
create index if not exists candidates_sector_idx on public.candidates (sector);
alter table public.candidates enable row level security;
revoke all on public.candidates from anon, authenticated;
grant select, insert, update, delete on public.candidates to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('candidate-cvs', 'candidate-cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

-- No public policies: data and downloads pass through authenticated server routes.
