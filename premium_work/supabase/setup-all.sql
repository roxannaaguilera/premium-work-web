-- Premium Work: run this entire file in the Supabase SQL Editor.
-- Creates missing tables and configures private CV storage. Does not delete submissions.
begin;


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
  privacy_version text,
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


-- Each row is a service request. One company may submit several requests.
create table if not exists public.client_requests (
  id uuid primary key,
  name text not null check (char_length(name) between 1 and 200),
  company text not null check (char_length(company) between 1 and 200),
  email text not null check (char_length(email) between 1 and 200),
  phone text check (char_length(phone) <= 100),
  city text not null check (char_length(city) between 1 and 200),
  sector text not null,
  service text not null,
  event_date date,
  staff_count integer check (staff_count between 1 and 10000),
  budget numeric(11,2) check (budget between 0 and 100000000),
  message text not null check (char_length(message) between 1 and 5000),
  privacy_version text,
  consent_at timestamptz not null
);
create index if not exists client_requests_date_idx on public.client_requests (event_date);
create index if not exists client_requests_sector_service_idx on public.client_requests (sector, service);
create index if not exists client_requests_created_idx on public.client_requests (consent_at desc, id);
create index if not exists client_requests_budget_idx on public.client_requests (budget);
create index if not exists client_requests_staff_idx on public.client_requests (staff_count);
alter table public.client_requests enable row level security;
revoke all on public.client_requests from anon, authenticated;
grant select, insert, update, delete on public.client_requests to service_role;


-- Run after candidates.sql and clients.sql if those tables already existed.
-- Existing records stay NULL: never fabricate historical acceptance evidence.
alter table public.candidates add column if not exists privacy_version text;
alter table public.client_requests add column if not exists privacy_version text;
comment on column public.client_requests.consent_at is 'Timestamp of submission and acknowledgement of privacy information; not marketing consent.';
comment on column public.candidates.consent_at is 'Timestamp of affirmative consent to the candidate pool.';


notify pgrst, 'reload schema';
commit;
