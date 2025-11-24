-- =========================================
-- 1) CLEANUP (SAFE DROPS)
-- =========================================

-- Drop trigger if it already exists
drop trigger if exists on_auth_user_created on auth.users;

-- Drop function if it already exists
drop function if exists public.handle_new_user();

-- Drop existing policies if they exist (to avoid "already exists" errors)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- =========================================
-- 2) TABLE (CREATE IF NOT EXISTS)
-- =========================================

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  can_use_ai boolean default false,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- =========================================
-- 3) RLS POLICIES (RECREATE CLEANLY)
-- =========================================

-- 1. Users can view their own profile
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- 2. Admins can view all profiles
create policy "Admins can view all profiles"
on public.profiles
for select
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- 3. Admins can update any profile (role, can_use_ai)
create policy "Admins can update profiles"
on public.profiles
for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (true);

-- 4. Users can INSERT their own profile (very important for trigger insert)
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- 5. Users can UPDATE their own profile only
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================================
-- 4) TRIGGER FUNCTION (CREATE/REPLACE)
-- =========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, can_use_ai)
  values (new.id, new.email, 'user', false);
  return new;
end;
$$ language plpgsql security definer;

-- =========================================
-- 5) TRIGGER (CREATE/REPLACE)
-- =========================================

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
