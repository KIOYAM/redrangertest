-- Fix Profiles Table and Signup Trigger
-- This migration ensures the profiles table exists and the signup trigger is working

-- 1. Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  user_type text check (user_type in ('student', 'employee', 'business', 'freelancer', 'teacher', 'hr', 'developer', 'other')) default 'other',
  job_role text,
  onboarding_completed boolean default false,
  is_active boolean default true,

  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Create/Update the handle_new_user function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email
  )
  on conflict (id) do nothing; -- Prevent error if profile already exists
  return new;
end;
$$ language plpgsql security definer;

-- 5. Re-create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
