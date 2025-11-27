-- AI Project Workspace System - Database Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Project memory table
create table if not exists project_memory (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  role text check (role in ('user', 'ai')) not null,
  content text not null,
  tool_name text,
  created_at timestamp with time zone default now() not null
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_created_at on projects(created_at desc);
create index if not exists idx_project_memory_project_id on project_memory(project_id);
create index if not exists idx_project_memory_created_at on project_memory(created_at desc);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

alter table projects enable row level security;
alter table project_memory enable row level security;

-- ============================================
-- 4. CREATE RLS POLICIES - PROJECTS
-- ============================================

-- Users can read their own projects
create policy "Users read own projects" on projects
  for select
  using (auth.uid() = user_id);

-- Users can insert their own projects
create policy "Users insert own projects" on projects
  for insert
  with check (auth.uid() = user_id);

-- Users can update their own projects
create policy "Users update own projects" on projects
  for update
  using (auth.uid() = user_id);

-- Users can delete their own projects
create policy "Users delete own projects" on projects
  for delete
  using (auth.uid() = user_id);

-- ============================================
-- 5. CREATE RLS POLICIES - PROJECT MEMORY
-- ============================================

-- Users can manage memory for their own projects
create policy "Users manage own project memory" on project_memory
  for all
  using (
    exists (
      select 1 from projects
      where projects.id = project_memory.project_id
      and projects.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. CREATE FUNCTION TO UPDATE updated_at
-- ============================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- 7. CREATE TRIGGER FOR updated_at
-- ============================================

drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();
