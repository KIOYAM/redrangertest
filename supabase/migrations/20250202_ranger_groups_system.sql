-- Power Rangers Tool Groups Database Schema
-- Complete system for organizing tools by life context

-- ============================================
-- 1. RANGER GROUPS TABLE
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

-- ============================================
-- 2. TOOL CATEGORIES TABLE
-- ============================================

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
-- 3. RLS POLICIES
-- ============================================

ALTER TABLE ranger_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;

-- Public read for active groups
CREATE POLICY "Anyone can view active ranger groups" ON ranger_groups
  FOR SELECT
  USING (is_active = true);

-- Public read for active tools
CREATE POLICY "Anyone can view active tool categories" ON tool_categories
  FOR SELECT
  USING (is_active = true);

-- Admin manage
CREATE POLICY "Admins can manage ranger groups" ON ranger_groups
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins can manage tool categories" ON tool_categories
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 4. SEED RANGER GROUPS
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

-- ============================================
-- 5. SEED TOOL CATEGORIES (Map existing tools)
-- ============================================

-- Get group IDs for reference
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
-- ============================================

-- Function to get all tools in a group
CREATE OR REPLACE FUNCTION get_group_tools(p_group_name TEXT)
RETURNS TABLE (
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
CREATE OR REPLACE FUNCTION get_all_ranger_groups()
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
-- VERIFICATION QUERIES
-- ============================================

-- Verify setup
SELECT 
  'Ranger Groups' as table_name,
  COUNT(*) as count
FROM ranger_groups
UNION ALL
SELECT 
  'Tool Categories' as table_name,
  COUNT(*) as count
FROM tool_categories;

-- Show all groups with tool counts
SELECT * FROM get_all_ranger_groups();
