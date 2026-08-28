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
