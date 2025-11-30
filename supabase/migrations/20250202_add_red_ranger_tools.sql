-- Add tools to Red Ranger group
DO $$
DECLARE
  red_id UUID;
BEGIN
  -- Get Red Ranger ID
  SELECT id INTO red_id FROM ranger_groups WHERE name = 'red_ranger';

  IF red_id IS NOT NULL THEN
    -- Insert tools
    INSERT INTO tool_categories (
      tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active
    ) VALUES
      -- 1. Developer Prompt Generator (Existing but updating details if needed)
      (
        'developer_tool', red_id, 'Developer Prompt Generator', 
        'Generate optimized prompts for Cursor, VS Code, and other AI coding assistants. Perfect for complex development tasks.',
        'Code2', '/groups/red/developer', 10, 1, true, true
      ),
      -- 2. Professional Email Writer (Existing)
      (
        'email_tool', red_id, 'Professional Email Writer',
        'Draft professional business emails with the perfect tone. Supports multiple languages and styles.',
        'Mail', '/groups/red/email', 5, 2, false, true
      ),
      -- 3. API Documentation Prompt
      (
        'api_docs_tool', red_id, 'API Documentation Prompt',
        'Generate comprehensive API documentation prompts for technical writing and developer guides.',
        'Book', '/groups/red/api-docs', 15, 3, true, true
      ),
      -- 4. Business Proposal Generator
      (
        'proposal_tool', red_id, 'Business Proposal Generator',
        'Create compelling business proposals and pitch decks with structured prompts.',
        'FileText', '/groups/red/proposal', 12, 4, false, true
      ),
      -- 5. Meeting Notes Formatter
      (
        'meeting_notes_tool', red_id, 'Meeting Notes Formatter',
        'Transform raw meeting notes into structured, actionable summaries and follow-ups.',
        'ClipboardList', '/groups/red/meeting-notes', 8, 5, false, true
      ),
      -- 6. Project Planning Prompt
      (
        'project_plan_tool', red_id, 'Project Planning Prompt',
        'Generate detailed project plans, timelines, and resource allocation prompts.',
        'Projector', '/groups/red/project-plan', 10, 6, false, true
      ),
      -- 7. Code Review Prompt
      (
        'code_review_tool', red_id, 'Code Review Prompt',
        'Generate comprehensive code review prompts for quality assurance and best practices.',
        'Search', '/groups/red/code-review', 12, 7, false, true
      ),
      -- 8. Technical Specifications
      (
        'tech_specs_tool', red_id, 'Technical Specifications',
        'Create detailed technical specification documents and system architecture prompts.',
        'Settings', '/groups/red/tech-specs', 15, 8, false, true
      ),
      -- 9. Bug Report Generator
      (
        'bug_report_tool', red_id, 'Bug Report Generator',
        'Generate structured bug reports with reproduction steps and technical details.',
        'Bug', '/groups/red/bug-report', 8, 9, false, true
      ),
      -- 10. Professional Resume Prompt
      (
        'resume_tool', red_id, 'Professional Resume Prompt',
        'Create compelling resume and cover letter prompts tailored to specific roles.',
        'User', '/groups/red/resume', 10, 10, false, true
      ),
      -- 11. LinkedIn Post Generator
      (
        'linkedin_tool', red_id, 'LinkedIn Post Generator',
        'Craft engaging LinkedIn posts for professional networking and thought leadership.',
        'Linkedin', '/groups/red/linkedin', 7, 11, false, true
      ),
      -- 12. Presentation Outline Prompt
      (
        'presentation_tool', red_id, 'Presentation Outline Prompt',
        'Generate structured presentation outlines and slide content for business pitches.',
        'Presentation', '/groups/red/presentation', 10, 12, false, true
      )
    ON CONFLICT (tool_name, group_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      description = EXCLUDED.description,
      icon = EXCLUDED.icon,
      credit_cost = EXCLUDED.credit_cost,
      display_order = EXCLUDED.display_order,
      is_featured = EXCLUDED.is_featured;
  END IF;
END $$;
