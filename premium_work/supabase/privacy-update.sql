-- Run after candidates.sql and clients.sql if those tables already existed.
-- Existing records stay NULL: never fabricate historical acceptance evidence.
alter table public.candidates add column if not exists privacy_version text;
alter table public.client_requests add column if not exists privacy_version text;
comment on column public.client_requests.consent_at is 'Timestamp of submission and acknowledgement of privacy information; not marketing consent.';
comment on column public.candidates.consent_at is 'Timestamp of affirmative consent to the candidate pool.';
