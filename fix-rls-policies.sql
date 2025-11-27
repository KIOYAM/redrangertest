-- =========================================
-- QUICK FIX: Drop everything with CASCADE then recreate
-- =========================================

-- Drop all policies first
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Now drop the function (no dependencies left)
drop function if exists public.is_admin();

-- Create the helper function
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select role into user_role
  from public.profiles
  where id = auth.uid()
  limit 1;
  
  return user_role = 'admin';
end;
$$ language plpgsql security definer;

-- Recreate policies with the fixed approach
-- 1. Users can view their own profile
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- 2. Users can INSERT their own profile
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- 3. Users can UPDATE their own profile
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- 4. Admins can view all profiles (FIXED - no recursion)
create policy "Admins can view all profiles"
on public.profiles
for select
using (
  auth.uid() = id  -- Can always see own profile
  OR 
  public.is_admin()  -- Or is an admin (uses function, prevents recursion)
);

-- 5. Admins can update any profile (FIXED - no recursion)
create policy "Admins can update profiles"
on public.profiles
for update
using (public.is_admin())
with check (true);
