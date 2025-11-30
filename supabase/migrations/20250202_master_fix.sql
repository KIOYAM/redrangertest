-- MASTER FIX: Ensure all tables and triggers exist
-- Run this to fix "Database error saving new user"

-- 1. Ensure PROFILES table exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  email text,
  user_type text default 'other',
  onboarding_completed boolean default false,
  is_active boolean default true
);
alter table public.profiles enable row level security;

-- 2. Ensure USER_CREDITS table exists
create table if not exists public.user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique not null,
  balance int default 100 not null check (balance >= 0),
  total_earned int default 100 not null,
  total_spent int default 0 not null,
  last_recharged_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
alter table public.user_credits enable row level security;

-- 3. Fix PROFILE Trigger (handle_new_user)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Fix CREDITS Trigger (initialize_user_credits)
create or replace function public.initialize_user_credits()
returns trigger as $$
begin
  insert into public.user_credits (user_id, balance, total_earned)
  values (new.id, 100, 100)
  on conflict (user_id) do nothing; -- Prevent error if credits already exist
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_init_user_credits on auth.users;
create trigger trigger_init_user_credits
  after insert on auth.users
  for each row execute procedure public.initialize_user_credits();

-- 5. Create basic RLS policies (Drop first to avoid errors)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own credits" on public.user_credits;
create policy "Users can view own credits" on public.user_credits for select using (auth.uid() = user_id);
