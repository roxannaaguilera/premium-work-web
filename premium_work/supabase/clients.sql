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
