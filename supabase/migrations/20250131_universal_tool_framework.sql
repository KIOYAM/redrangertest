-- Universal Tool Enhancement Framework - Database Schema
-- Phase 1: Core tables for wizard system, AI recommendations, and outcome tracking

-- ============================================
-- 1. WIZARD RESPONSES TABLE
-- ============================================

-- Stores all wizard step responses across all tools
CREATE TABLE IF NOT EXISTS wizard_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  step_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for wizard responses
CREATE INDEX IF NOT EXISTS idx_wizard_responses_project 
ON wizard_responses(project_id);

CREATE INDEX IF NOT EXISTS idx_wizard_responses_tool 
ON wizard_responses(tool_name);

CREATE INDEX IF NOT EXISTS idx_wizard_responses_created 
ON wizard_responses(created_at DESC);

-- ============================================
-- 2. TASK OUTCOMES TABLE
-- ============================================

-- Tracks success/failure of tasks across all tools
CREATE TABLE IF NOT EXISTS task_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  task_description TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'partial', 'failed', 'error')) NOT NULL,
  ai_tool_used TEXT,
  feedback JSONB,
  error_details TEXT,
  success_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for task outcomes
CREATE INDEX IF NOT EXISTS idx_task_outcomes_project 
ON task_outcomes(project_id);

CREATE INDEX IF NOT EXISTS idx_task_outcomes_tool 
ON task_outcomes(tool_name);

CREATE INDEX IF NOT EXISTS idx_task_outcomes_status 
ON task_outcomes(status);

CREATE INDEX IF NOT EXISTS idx_task_outcomes_ai_tool 
ON task_outcomes(ai_tool_used);

CREATE INDEX IF NOT EXISTS idx_task_outcomes_created 
ON task_outcomes(created_at DESC);

-- ============================================
-- 3. AI RECOMMENDATIONS TABLE
-- ============================================

-- Logs AI tool recommendations and user choices
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  recommended_tool TEXT NOT NULL,
  confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  user_choice TEXT,
  was_accepted BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for AI recommendations
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_project 
ON ai_recommendations(project_id);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_tool 
ON ai_recommendations(tool_name);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_accepted 
ON ai_recommendations(was_accepted) 
WHERE was_accepted IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_confidence 
ON ai_recommendations(confidence DESC);

-- ============================================
-- 4. SUCCESS PATTERNS TABLE
-- ============================================

-- Stores learned success patterns for recommendations
CREATE TABLE IF NOT EXISTS success_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  context JSONB NOT NULL,
  success_rate FLOAT NOT NULL CHECK (success_rate >= 0 AND success_rate <= 1),
  usage_count INT DEFAULT 0 NOT NULL,
  last_validated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for success patterns
CREATE INDEX IF NOT EXISTS idx_success_patterns_tool 
ON success_patterns(tool_name);

CREATE INDEX IF NOT EXISTS idx_success_patterns_rate 
ON success_patterns(success_rate DESC);

CREATE INDEX IF NOT EXISTS idx_success_patterns_type 
ON success_patterns(pattern_type);

CREATE INDEX IF NOT EXISTS idx_success_patterns_usage 
ON success_patterns(usage_count DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE wizard_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_patterns ENABLE ROW LEVEL SECURITY;

-- Wizard responses policies
CREATE POLICY "Users manage own wizard responses" ON wizard_responses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = wizard_responses.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Task outcomes policies
CREATE POLICY "Users manage own task outcomes" ON task_outcomes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = task_outcomes.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- AI recommendations policies
CREATE POLICY "Users manage own AI recommendations" ON ai_recommendations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ai_recommendations.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Success patterns policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users read success patterns" ON success_patterns
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only system can write success patterns (via service role)
CREATE POLICY "Service role manages success patterns" ON success_patterns
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to get wizard completion status
CREATE OR REPLACE FUNCTION get_wizard_completion(p_project_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_responses JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'step_id', step_id,
      'question', question,
      'answer', answer,
      'created_at', created_at
    ) ORDER BY created_at
  ) INTO v_responses
  FROM wizard_responses
  WHERE project_id = p_project_id;
  
  RETURN COALESCE(v_responses, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate success rate for AI tool
CREATE OR REPLACE FUNCTION calculate_ai_tool_success_rate(
  p_ai_tool TEXT,
  p_tool_name TEXT DEFAULT NULL
)
RETURNS FLOAT AS $$
DECLARE
  v_success_rate FLOAT;
BEGIN
  SELECT 
    CAST(COUNT(*) FILTER (WHERE status = 'success') AS FLOAT) / 
    NULLIF(COUNT(*), 0)
  INTO v_success_rate
  FROM task_outcomes
  WHERE ai_tool_used = p_ai_tool
    AND (p_tool_name IS NULL OR tool_name = p_tool_name);
  
  RETURN COALESCE(v_success_rate, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update success patterns
CREATE OR REPLACE FUNCTION update_success_patterns()
RETURNS TRIGGER AS $$
BEGIN
  -- Update pattern usage count and success rate
  -- This runs after task outcome is inserted
  IF NEW.status IN ('success', 'partial') THEN
    INSERT INTO success_patterns (
      tool_name,
      pattern_type,
      context,
      success_rate,
      usage_count
    )
    VALUES (
      NEW.tool_name,
      CONCAT(NEW.tool_name, '_', NEW.ai_tool_used),
      jsonb_build_object('ai_tool', NEW.ai_tool_used),
      1.0,
      1
    )
    ON CONFLICT (tool_name, pattern_type) 
    DO UPDATE SET
      usage_count = success_patterns.usage_count + 1,
      success_rate = (
        SELECT calculate_ai_tool_success_rate(NEW.ai_tool_used, NEW.tool_name)
      ),
      last_validated = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update success patterns
DROP TRIGGER IF EXISTS trigger_update_success_patterns ON task_outcomes;
CREATE TRIGGER trigger_update_success_patterns
  AFTER INSERT ON task_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION update_success_patterns();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables exist
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('wizard_responses', 'task_outcomes', 'ai_recommendations', 'success_patterns');

-- Check indexes exist
-- SELECT indexname, tablename 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('wizard_responses', 'task_outcomes', 'ai_recommendations', 'success_patterns');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('wizard_responses', 'task_outcomes', 'ai_recommendations', 'success_patterns');
