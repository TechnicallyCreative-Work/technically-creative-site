-- Technically Creative — membership foundation schema
-- Paste this into the Supabase SQL editor (Project > SQL Editor > New query) and run it once.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  membership_tier text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- No insert/delete policy for regular users on purpose — rows are created by the
-- trigger below (as the table owner) and updated by the Stripe webhook using the
-- service-role key, which bypasses RLS entirely.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
