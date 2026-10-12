-- Technically Creative — membership foundation schema
-- Paste this into the Supabase SQL editor (Project > SQL Editor > New query) and run it once.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  membership_tier text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  newsletter_opt_in boolean not null default false,
  newsletter_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- For databases created before the newsletter feature (create table above is a no-op there).
alter table public.profiles add column if not exists newsletter_opt_in boolean not null default false;
alter table public.profiles add column if not exists newsletter_synced_at timestamptz;

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Browser-role clients may only READ their own row. An update policy here would let
-- any signed-in user rewrite their own membership_tier (free -> paid) straight from
-- the browser with the public anon key. Every write goes through a server route using
-- the service-role key instead (Stripe webhook, /api/newsletter/preference), and rows
-- are created by the trigger below (as the table owner).
drop policy if exists "Users can update own profile" on public.profiles;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- newsletter_opt_in comes from the signup form's checkbox (signUp options.data).
  -- Compared as text so malformed metadata can never make this insert — and with
  -- it the whole signup — fail. on conflict keeps the trigger from ever aborting.
  insert into public.profiles (id, email, newsletter_opt_in)
  values (
    new.id,
    new.email,
    lower(coalesce(new.raw_user_meta_data ->> 'newsletter_opt_in', '')) = 'true'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: give any pre-existing auth user without a profile row one (e.g. a row that
-- was deleted by hand while testing), so the account page never has a missing profile.
insert into public.profiles (id, email)
select u.id, u.email from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- NoteMapper — usage-gate + paid-save schema
-- One row per visitor (anonymous or linked to an account) tracking the
-- free-tier conversion count and, once captured, their email.
create table if not exists public.notemapper_usage (
  id uuid primary key default gen_random_uuid(),
  anon_id uuid not null unique,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  use_count integer not null default 0,
  email_captured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notemapper_usage_user_id_idx
  on public.notemapper_usage (user_id) where user_id is not null;

alter table public.notemapper_usage enable row level security;
-- No client-role policies on purpose: this table is written before a visitor
-- has any Supabase session (anonymous phase), so there's no auth.uid() to key
-- RLS on. Every read/write goes through API routes using
-- createSupabaseServiceRoleClient(), same as the Stripe webhook above already
-- does for unauthenticated-context writes to `profiles`.

insert into storage.buckets (id, name, public)
values ('notemapper-saves', 'notemapper-saves', false)
on conflict (id) do nothing;

create table if not exists public.notemapper_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_filename text not null,
  detected_key text,
  detected_bpm integer,
  storage_prefix text not null, -- "{user_id}/{id}"
  created_at timestamptz not null default now()
);

create index if not exists notemapper_saves_user_id_idx on public.notemapper_saves (user_id);

alter table public.notemapper_saves enable row level security;

drop policy if exists "Users can view own notemapper saves" on public.notemapper_saves;
create policy "Users can view own notemapper saves"
  on public.notemapper_saves for select
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own notemapper saves" on public.notemapper_saves;
create policy "Users can insert own notemapper saves"
  on public.notemapper_saves for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own notemapper save files" on storage.objects;
create policy "Users can manage own notemapper save files"
  on storage.objects for all
  using (bucket_id = 'notemapper-saves' and (select auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'notemapper-saves' and (select auth.uid())::text = (storage.foldername(name))[1]);
