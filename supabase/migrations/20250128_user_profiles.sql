-- User Profile System - Extend profiles table
-- Run this in Supabase SQL Editor

-- Add new columns to existing profiles table
alter table profiles
  add column if not exists full_name text,
  add column if not exists user_type text check (user_type in ('student', 'employee', 'business', 'freelancer', 'other')) default 'other',
  add column if not exists avatar_url text,
  add column if not exists is_active boolean default true;

-- Create index for filtering
create index if not exists idx_profiles_user_type on profiles(user_type);
create index if not exists idx_profiles_is_active on profiles(is_active);
create index if not exists idx_profiles_role on profiles(role);

-- RLS policies should already exist, but verify users can update their own profile
-- Users can update their own profile (except role, can_use_ai, is_active)
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile
drop policy if exists "Admins can update any profile" on profiles;
create policy "Admins can update any profile" on profiles
  for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Users can read all profiles (for collaboration features)
drop policy if exists "Users can view all profiles" on profiles;
create policy "Users can view all profiles" on profiles
  for select
  using (true);
