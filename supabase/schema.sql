create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 80),
  name_key text generated always as (lower(regexp_replace(btrim(full_name),'\s+',' ','g'))) stored unique, -- one row per guest; resubmits update
  attending boolean not null,
  guests smallint not null default 0 check (guests between 0 and 10 and (attending or guests=0) and (not attending or guests>=1)),
  message text check (message is null or char_length(message)<=500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger rsvps_touch before update on public.rsvps for each row execute function public.touch_updated_at();
alter table public.rsvps enable row level security; -- no policies: browser/anon has no access; only the server service-role key writes
-- Future family dashboard: add a SELECT policy for authenticated family emails, e.g.
-- create policy "family read" on public.rsvps for select to authenticated using (auth.jwt()->>'email' in ('a@x.com'));
create view public.rsvp_summary with (security_invoker=true) as
  select count(*) responses, count(*) filter (where attending) accepting, coalesce(sum(guests),0) total_guests from public.rsvps;
