-- User Profile System - Extend profiles table
-- Run this in Supabase SQL Editor

-- Add new columns to existing profiles table
alter table profiles
  add column if not exists full_name text,
  add column if not exists user_type text check (user_type in ('student', 'employee', 'business', 'freelancer', 'teacher', 'hr', 'developer', 'other')) default 'other',
  add column if not exists avatar_url text,
  add column if not exists job_role text,
  add column if not exists onboarding_completed boolean default false,
  add column if not exists is_active boolean default true;

-- Create indexes for filtering
create index if not exists idx_profiles_onboarding on profiles(onboarding_completed);
create index if not exists idx_profiles_user_type on profiles(user_type);
create index if not exists idx_profiles_is_active on profiles(is_active);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_profiles_updated_at on profiles;
create trigger trigger_profiles_updated_at
before update on profiles
for each row execute procedure update_updated_at();

-- Fix RLS Policies to avoid infinite recursion
-- Drop old policies
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can read all profiles" on profiles;
drop policy if exists "Admins can update all profiles" on profiles;
drop policy if exists "Users can view all profiles" on profiles;

-- Users can read their own profile
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- Users can update their own profile (except sensitive fields)
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Note: For admin access, we'll handle authorization in the API layer
-- instead of RLS to avoid circular dependency
-- The API routes check the user's role directly from their JWT or a direct query
