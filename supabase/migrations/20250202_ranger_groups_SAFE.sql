-- SAFE VERSION - Power Rangers Ranger Groups System
-- This version can be run multiple times without errors

-- ============================================
-- 1. TABLES (will skip if already exist)
-- ============================================

CREATE TABLE IF NOT EXISTS ranger_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  color_primary TEXT NOT NULL,
  color_secondary TEXT NOT NULL,
  color_accent TEXT NOT NULL,
  gradient_class TEXT NOT NULL,
  helmet_icon TEXT,
  description TEXT,
  tagline TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ranger_groups_active ON ranger_groups(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_ranger_groups_name ON ranger_groups(name);

CREATE TABLE IF NOT EXISTS tool_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  group_id UUID REFERENCES ranger_groups(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  route_path TEXT NOT NULL,
  credit_cost INT NOT NULL DEFAULT 10,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(tool_name, group_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_categories_group ON tool_categories(group_id, is_active);
CREATE INDEX IF NOT EXISTS idx_tool_categories_tool ON tool_categories(tool_name);

-- ============================================
-- 2. RLS POLICIES (drop and recreate)
-- ============================================

ALTER TABLE ranger_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active ranger groups" ON ranger_groups;
DROP POLICY IF EXISTS "Anyone can view active tool categories" ON tool_categories;
DROP POLICY IF EXISTS "Admins can manage ranger groups" ON ranger_groups;
DROP POLICY IF EXISTS "Admins can manage tool categories" ON tool_categories;

-- Recreate policies
CREATE POLICY "Anyone can view active ranger groups" ON ranger_groups
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active tool categories" ON tool_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage ranger groups" ON ranger_groups
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins can manage tool categories" ON tool_categories
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 3. SEED DATA
-- ============================================

INSERT INTO ranger_groups (
  name, display_name, color_primary, color_secondary, color_accent, 
  gradient_class, tagline, display_order, is_premium
) VALUES
  (
    'red_ranger',
    'Work',
    '#DC2626',
    '#991B1B',
    '#FCA5A5',
    'from-red-600 to-red-800',
    'Power up your professional work',
    1,
    false
  ),
  (
    'blue_ranger',
    'Learn',
    '#2563EB',
    '#1E40AF',
    '#93C5FD',
    'from-blue-600 to-blue-800',
    'Knowledge is power',
    2,
    false
  ),
  (
    'yellow_ranger',
    'Create',
    '#F59E0B',
    '#D97706',
    '#FCD34D',
    'from-yellow-500 to-yellow-700',
    'Unleash your creative energy',
    3,
    false
  ),
  (
    'green_ranger',
    'Life',
    '#10B981',
    '#059669',
    '#6EE7B7',
    'from-green-500 to-green-700',
    'Organize your personal life',
    4,
    false
  ),
  (
    'black_ranger',
    'Pro',
    '#1F2937',
    '#111827',
    '#6B7280',
    'from-gray-800 to-black',
    'Advanced power tools',
    5,
    false
  ),
  (
    'white_ranger',
    'Legendary',
    '#F3F4F6',
    '#E5E7EB',
    '#FFFFFF',
    'from-gray-100 to-white',
    'Premium exclusive features',
    6,
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Seed tool mappings
DO $$
DECLARE
  red_id UUID;
  blue_id UUID;
  yellow_id UUID;
  green_id UUID;
  black_id UUID;
  white_id UUID;
BEGIN
  SELECT id INTO red_id FROM ranger_groups WHERE name = 'red_ranger';
  SELECT id INTO blue_id FROM ranger_groups WHERE name = 'blue_ranger';
  SELECT id INTO yellow_id FROM ranger_groups WHERE name = 'yellow_ranger';
  SELECT id INTO green_id FROM ranger_groups WHERE name = 'green_ranger';
  SELECT id INTO black_id FROM ranger_groups WHERE name = 'black_ranger';
  SELECT id INTO white_id FROM ranger_groups WHERE name = 'white_ranger';

  -- Developer Tool
  INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured)
  VALUES
    ('developer_tool', red_id, 'Developer', 'Generate optimized code prompts for any programming task', 'Code2', '/groups/work/developer', 10, 1, true),
    ('developer_tool', blue_id, 'Developer', 'Learn programming with AI-powered code generation', 'Code2', '/groups/learn/developer', 10, 1, false),
    ('developer_tool', black_id, 'Developer', 'Advanced code generation and architecture', 'Code2', '/groups/pro/developer', 10, 1, false)
  ON CONFLICT DO NOTHING;

  -- Email Tool
  INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order)
  VALUES
    ('email_tool', red_id, 'Email', 'Professional email templates and responses', 'Mail', '/groups/work/email', 5, 2),
    ('email_tool', yellow_id, 'Email', 'Creative email campaigns and newsletters', 'Mail', '/groups/create/email', 5, 3)
  ON CONFLICT DO NOTHING;

  -- Content Tool
  INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured)
  VALUES
    ('content_tool', yellow_id, 'Content', 'Generate engaging content for social media and blogs', 'FileText', '/groups/create/content', 8, 1, true),
    ('content_tool', red_id, 'Content', 'Professional content for business and marketing', 'FileText', '/groups/work/content', 8, 3, false)
  ON CONFLICT DO NOTHING;

  -- Design Tool
  INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured)
  VALUES
    ('design_tool', yellow_id, 'Design', 'Create stunning visuals and graphics', 'Palette', '/groups/create/design', 15, 2, true),
    ('design_tool', white_id, 'Design', 'Premium AI-powered design tools', 'Palette', '/groups/legendary/design', 15, 1, true)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- 4. FUNCTIONS (drop and recreate)
-- ============================================

-- Drop existing functions
DROP FUNCTION IF EXISTS get_group_tools(TEXT);
DROP FUNCTION IF EXISTS get_all_ranger_groups();

-- Function to get all tools in a group
CREATE FUNCTION get_group_tools(p_group_name TEXT)
RETURNS TABLE (
  id UUID,
  tool_name TEXT,
  display_name TEXT,
  description TEXT,
  icon TEXT,
  route_path TEXT,
  credit_cost INT,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.id,
    tc.tool_name,
    tc.display_name,
    tc.description,
    tc.icon,
    tc.route_path,
    tc.credit_cost,
    tc.is_featured
  FROM tool_categories tc
  JOIN ranger_groups rg ON tc.group_id = rg.id
  WHERE rg.name = p_group_name
    AND tc.is_active = true
  ORDER BY tc.is_featured DESC, tc.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get all active groups
CREATE FUNCTION get_all_ranger_groups()
RETURNS TABLE (
  id UUID,
  name TEXT,
  display_name TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  color_accent TEXT,
  gradient_class TEXT,
  tagline TEXT,
  tool_count BIGINT,
  is_premium BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rg.id,
    rg.name,
    rg.display_name,
    rg.color_primary,
    rg.color_secondary,
    rg.color_accent,
    rg.gradient_class,
    rg.tagline,
    COUNT(tc.id) as tool_count,
    rg.is_premium
  FROM ranger_groups rg
  LEFT JOIN tool_categories tc ON rg.id = tc.group_id AND tc.is_active = true
  WHERE rg.is_active = true
  GROUP BY rg.id
  ORDER BY rg.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

-- Show results
SELECT 'Ranger Groups' as table_name, COUNT(*) as count FROM ranger_groups
UNION ALL
SELECT 'Tool Categories' as table_name, COUNT(*) as count FROM tool_categories;

-- Show all groups with tool counts
SELECT * FROM get_all_ranger_groups();
