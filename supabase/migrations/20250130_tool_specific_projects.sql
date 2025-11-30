-- Tool-Specific Projects Migration
-- This migration adds tool association to projects and ensures name uniqueness per tool

-- ============================================
-- 1. ADD tool_name COLUMN
-- ============================================

-- Add tool_name column to projects table (nullable for backward compatibility)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tool_name TEXT;

-- ============================================
-- 2. MIGRATE EXISTING DATA
-- ============================================

-- Populate tool_name for existing projects based on their memory entries
-- This finds the most frequently used tool_name in project_memory for each project
UPDATE projects p
SET tool_name = (
    SELECT pm.tool_name
    FROM project_memory pm
    WHERE pm.project_id = p.id
    GROUP BY pm.tool_name
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
WHERE p.tool_name IS NULL 
AND EXISTS (
    SELECT 1 FROM project_memory pm WHERE pm.project_id = p.id
);

-- For projects with no memory entries, set a default tool_name
UPDATE projects
SET tool_name = 'general'
WHERE tool_name IS NULL;

-- ============================================
-- 3. ADD CONSTRAINTS
-- ============================================

-- Now make tool_name NOT NULL since all projects should have a tool
ALTER TABLE projects
ALTER COLUMN tool_name SET NOT NULL;

-- Add unique constraint: project names must be unique per user per tool
-- This allows "Login Feature" in both email and developer tools
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_unique_name_per_tool
ON projects(user_id, tool_name, LOWER(title));

-- ============================================
-- 4. ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Index for filtering projects by tool
CREATE INDEX IF NOT EXISTS idx_projects_tool_name 
ON projects(tool_name);

-- Composite index for common query pattern (user + tool)
CREATE INDEX IF NOT EXISTS idx_projects_user_tool 
ON projects(user_id, tool_name, updated_at DESC);

-- ============================================
-- 5. ADD HELPER FUNCTION
-- ============================================

-- Function to check if project name exists for a given user and tool
CREATE OR REPLACE FUNCTION check_project_name_exists(
    p_user_id UUID,
    p_tool_name TEXT,
    p_title TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM projects 
        WHERE user_id = p_user_id 
        AND tool_name = p_tool_name 
        AND LOWER(title) = LOWER(p_title)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES (for testing)
-- ============================================

-- Check tool distribution
-- SELECT tool_name, COUNT(*) as project_count 
-- FROM projects 
-- GROUP BY tool_name 
-- ORDER BY project_count DESC;

-- Check for any NULL tool_names (should be zero)
-- SELECT COUNT(*) FROM projects WHERE tool_name IS NULL;

-- Test unique constraint (should fail if run twice with same values)
-- INSERT INTO projects (user_id, tool_name, title) 
-- VALUES (auth.uid(), 'email', 'Test Project');
