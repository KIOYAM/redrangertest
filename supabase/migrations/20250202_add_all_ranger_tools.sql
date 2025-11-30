-- Add tools to ALL Ranger groups
DO $$
DECLARE
  red_id UUID;
  blue_id UUID;
  yellow_id UUID;
  green_id UUID;
  black_id UUID;
  white_id UUID;
BEGIN
  -- Get Group IDs
  SELECT id INTO red_id FROM ranger_groups WHERE name = 'red_ranger';
  SELECT id INTO blue_id FROM ranger_groups WHERE name = 'blue_ranger';
  SELECT id INTO yellow_id FROM ranger_groups WHERE name = 'yellow_ranger';
  SELECT id INTO green_id FROM ranger_groups WHERE name = 'green_ranger';
  SELECT id INTO black_id FROM ranger_groups WHERE name = 'black_ranger';
  SELECT id INTO white_id FROM ranger_groups WHERE name = 'white_ranger';

  -- ==========================================
  -- RED RANGER (Work) - 12 Tools
  -- ==========================================
  IF red_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('developer_tool', red_id, 'Developer Prompt Generator', 'Generate optimized prompts for Cursor, VS Code, and other AI coding assistants.', 'Code2', '/groups/red/developer', 10, 1, true, true),
      ('email_tool', red_id, 'Professional Email Writer', 'Draft professional business emails with the perfect tone.', 'Mail', '/groups/red/email', 5, 2, false, true),
      ('api_docs_tool', red_id, 'API Documentation Prompt', 'Generate comprehensive API documentation prompts for technical writing.', 'Book', '/groups/red/api-docs', 15, 3, true, true),
      ('proposal_tool', red_id, 'Business Proposal Generator', 'Create compelling business proposals and pitch decks.', 'FileText', '/groups/red/proposal', 12, 4, false, true),
      ('meeting_notes_tool', red_id, 'Meeting Notes Formatter', 'Transform raw meeting notes into structured, actionable summaries.', 'ClipboardList', '/groups/red/meeting-notes', 8, 5, false, true),
      ('project_plan_tool', red_id, 'Project Planning Prompt', 'Generate detailed project plans, timelines, and resource allocation prompts.', 'Projector', '/groups/red/project-plan', 10, 6, false, true),
      ('code_review_tool', red_id, 'Code Review Prompt', 'Generate comprehensive code review prompts for quality assurance.', 'Search', '/groups/red/code-review', 12, 7, false, true),
      ('tech_specs_tool', red_id, 'Technical Specifications', 'Create detailed technical specification documents and system architecture prompts.', 'Settings', '/groups/red/tech-specs', 15, 8, false, true),
      ('bug_report_tool', red_id, 'Bug Report Generator', 'Generate structured bug reports with reproduction steps.', 'Bug', '/groups/red/bug-report', 8, 9, false, true),
      ('resume_tool', red_id, 'Professional Resume Prompt', 'Create compelling resume and cover letter prompts tailored to specific roles.', 'User', '/groups/red/resume', 10, 10, false, true),
      ('linkedin_tool', red_id, 'LinkedIn Post Generator', 'Craft engaging LinkedIn posts for professional networking.', 'Linkedin', '/groups/red/linkedin', 7, 11, false, true),
      ('presentation_tool', red_id, 'Presentation Outline Prompt', 'Generate structured presentation outlines and slide content.', 'Presentation', '/groups/red/presentation', 10, 12, false, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

  -- ==========================================
  -- BLUE RANGER (Learn) - 10 Tools
  -- ==========================================
  IF blue_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('study_plan', blue_id, 'Study Plan Generator', 'Create personalized study schedules and curriculum roadmaps.', 'Book', '/groups/blue/study-plan', 8, 1, true, true),
      ('language_tutor', blue_id, 'Language Tutor Prompt', 'Generate immersive language learning scenarios and vocabulary drills.', 'Languages', '/groups/blue/language', 5, 2, false, true),
      ('math_solver', blue_id, 'Math Problem Solver', 'Get step-by-step explanations for complex mathematical problems.', 'Calculator', '/groups/blue/math', 5, 3, false, true),
      ('essay_outliner', blue_id, 'Essay Outliner', 'Structure your academic essays with clear arguments and evidence points.', 'PenTool', '/groups/blue/essay', 8, 4, true, true),
      ('quiz_generator', blue_id, 'Quiz Generator', 'Create practice quizzes and flashcards for any subject.', 'Brain', '/groups/blue/quiz', 6, 5, false, true),
      ('research_summary', blue_id, 'Research Summarizer', 'Summarize long academic papers and articles into key takeaways.', 'Library', '/groups/blue/research', 10, 6, false, true),
      ('flashcard_creator', blue_id, 'Flashcard Creator', 'Generate spaced repetition flashcards for efficient memorization.', 'ClipboardList', '/groups/blue/flashcards', 4, 7, false, true),
      ('coding_tutor', blue_id, 'Coding Tutor', 'Learn programming concepts with interactive explanations and examples.', 'Code2', '/groups/blue/coding', 8, 8, true, true),
      ('science_explainer', blue_id, 'Science Explainer', 'Simplify complex scientific concepts into easy-to-understand analogies.', 'Projector', '/groups/blue/science', 6, 9, false, true),
      ('history_timeline', blue_id, 'History Timeline', 'Generate chronological timelines of historical events and eras.', 'Calendar', '/groups/blue/history', 5, 10, false, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

  -- ==========================================
  -- YELLOW RANGER (Create) - 10 Tools
  -- ==========================================
  IF yellow_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('blog_post', yellow_id, 'Blog Post Generator', 'Write engaging blog posts with SEO-optimized structures.', 'FileText', '/groups/yellow/blog', 10, 1, true, true),
      ('social_caption', yellow_id, 'Social Media Caption', 'Create catchy captions for Instagram, TikTok, and Twitter.', 'Instagram', '/groups/yellow/social', 5, 2, false, true),
      ('logo_concept', yellow_id, 'Logo Design Concept', 'Generate detailed prompts for AI image generators to create logos.', 'Image', '/groups/yellow/logo', 8, 3, true, true),
      ('story_plot', yellow_id, 'Story Plot Generator', 'Brainstorm unique plot twists and character arcs for your stories.', 'Book', '/groups/yellow/story', 8, 4, false, true),
      ('song_lyrics', yellow_id, 'Song Lyrics Writer', 'Compose original song lyrics in any genre or style.', 'Music', '/groups/yellow/lyrics', 8, 5, false, true),
      ('video_script', yellow_id, 'Video Script Writer', 'Write scripts for YouTube videos, Reels, and TikToks.', 'Video', '/groups/yellow/script', 10, 6, true, true),
      ('character_creator', yellow_id, 'Character Creator', 'Develop deep, multidimensional characters for your narratives.', 'User', '/groups/yellow/character', 6, 7, false, true),
      ('poem_generator', yellow_id, 'Poem Generator', 'Generate beautiful poetry in various forms (Haiku, Sonnet, Free Verse).', 'PenTool', '/groups/yellow/poem', 5, 8, false, true),
      ('newsletter_draft', yellow_id, 'Newsletter Drafter', 'Create engaging email newsletters to grow your audience.', 'Mail', '/groups/yellow/newsletter', 8, 9, false, true),
      ('art_prompt', yellow_id, 'Art Prompt Generator', 'Generate detailed artistic prompts for Midjourney and DALL-E.', 'Palette', '/groups/yellow/art', 5, 10, true, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

  -- ==========================================
  -- GREEN RANGER (Life) - 10 Tools
  -- ==========================================
  IF green_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('meal_planner', green_id, 'Meal Planner', 'Create weekly meal plans based on your dietary preferences.', 'Utensils', '/groups/green/meal', 5, 1, true, true),
      ('workout_routine', green_id, 'Workout Routine', 'Generate personalized workout plans for your fitness goals.', 'Dumbbell', '/groups/green/workout', 5, 2, true, true),
      ('travel_itinerary', green_id, 'Travel Itinerary', 'Plan the perfect trip with day-by-day itineraries and tips.', 'Plane', '/groups/green/travel', 10, 3, true, true),
      ('budget_planner', green_id, 'Budget Planner', 'Create monthly budgets and financial savings plans.', 'Calculator', '/groups/green/budget', 8, 4, false, true),
      ('journal_prompts', green_id, 'Journal Prompts', 'Get daily prompts for self-reflection and mindfulness.', 'Book', '/groups/green/journal', 3, 5, false, true),
      ('gift_ideas', green_id, 'Gift Ideas Generator', 'Find thoughtful gift ideas for friends and family.', 'Smile', '/groups/green/gift', 4, 6, false, true),
      ('date_night', green_id, 'Date Night Planner', 'Plan romantic and fun date nights tailored to your interests.', 'Heart', '/groups/green/date', 5, 7, false, true),
      ('home_org', green_id, 'Home Organization', 'Get tips and schedules for organizing and cleaning your home.', 'Home', '/groups/green/home', 5, 8, false, true),
      ('habit_tracker', green_id, 'Habit Tracker', 'Design a system to build and stick to new positive habits.', 'ClipboardList', '/groups/green/habit', 5, 9, false, true),
      ('mindfulness', green_id, 'Mindfulness Guide', 'Generate meditation scripts and mindfulness exercises.', 'Brain', '/groups/green/mindfulness', 5, 10, false, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

  -- ==========================================
  -- BLACK RANGER (Pro) - 10 Tools
  -- ==========================================
  IF black_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('system_arch', black_id, 'System Architecture', 'Design scalable system architectures and cloud infrastructure.', 'Server', '/groups/black/arch', 20, 1, true, true),
      ('db_schema', black_id, 'Database Schema', 'Design optimized database schemas and relationship diagrams.', 'Database', '/groups/black/db', 15, 2, true, true),
      ('security_audit', black_id, 'Security Audit', 'Generate security audit checklists and vulnerability assessments.', 'Shield', '/groups/black/security', 20, 3, true, true),
      ('devops_pipeline', black_id, 'DevOps Pipeline', 'Design CI/CD pipelines and automation workflows.', 'Workflow', '/groups/black/devops', 15, 4, false, true),
      ('cloud_config', black_id, 'Cloud Configuration', 'Generate Terraform or CloudFormation scripts for infrastructure.', 'Cpu', '/groups/black/cloud', 15, 5, false, true),
      ('api_integration', black_id, 'API Integration Strategy', 'Plan complex API integrations and middleware logic.', 'Globe', '/groups/black/api', 15, 6, false, true),
      ('terminal_helper', black_id, 'Terminal Command Helper', 'Generate complex shell commands and scripts.', 'Terminal', '/groups/black/terminal', 8, 7, false, true),
      ('regex_gen', black_id, 'Regex Generator', 'Create complex Regular Expressions for data validation.', 'Code2', '/groups/black/regex', 8, 8, false, true),
      ('data_analysis', black_id, 'Data Analysis Query', 'Write complex SQL or Python pandas queries for data analysis.', 'Search', '/groups/black/data', 12, 9, false, true),
      ('algo_optimizer', black_id, 'Algorithm Optimizer', 'Optimize code algorithms for time and space complexity.', 'Settings', '/groups/black/algo', 12, 10, false, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

  -- ==========================================
  -- WHITE RANGER (Legendary) - 10 Tools
  -- ==========================================
  IF white_id IS NOT NULL THEN
    INSERT INTO tool_categories (tool_name, group_id, display_name, description, icon, route_path, credit_cost, display_order, is_featured, is_active) VALUES
      ('pitch_deck', white_id, 'Startup Pitch Deck', 'Create a legendary pitch deck structure to raise millions.', 'Presentation', '/groups/white/pitch', 25, 1, true, true),
      ('brand_identity', white_id, 'Brand Identity Master', 'Define a world-class brand voice, mission, and visual identity.', 'Gem', '/groups/white/brand', 20, 2, true, true),
      ('viral_campaign', white_id, 'Viral Marketing Campaign', 'Architect a marketing campaign designed to go viral globally.', 'Rocket', '/groups/white/viral', 20, 3, true, true),
      ('bestseller_plot', white_id, 'Bestseller Book Plot', 'Outline a novel plot with the potential to be a NYT bestseller.', 'Crown', '/groups/white/book', 15, 4, false, true),
      ('ted_talk', white_id, 'TED Talk Script', 'Draft an inspiring and impactful speech worthy of a TED stage.', 'Mic', '/groups/white/ted', 15, 5, false, true),
      ('masterclass_outline', white_id, 'Masterclass Course', 'Structure a premium educational course on your area of expertise.', 'GraduationCap', '/groups/white/course', 15, 6, false, true),
      ('executive_decision', white_id, 'Executive Decision Maker', 'Analyze complex business decisions with strategic frameworks.', 'Trophy', '/groups/white/decision', 20, 7, false, true),
      ('luxury_travel', white_id, 'Luxury Travel Concierge', 'Plan an ultra-luxury travel experience with exclusive details.', 'Plane', '/groups/white/travel', 15, 8, false, true),
      ('investment_strategy', white_id, 'Investment Strategy', 'Analyze market trends and generate high-level investment theses.', 'Calculator', '/groups/white/invest', 20, 9, false, true),
      ('legacy_builder', white_id, 'Legacy Builder', 'Plan your long-term impact and legacy strategy.', 'Sparkles', '/groups/white/legacy', 25, 10, true, true)
    ON CONFLICT (tool_name, group_id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description, icon = EXCLUDED.icon, credit_cost = EXCLUDED.credit_cost, display_order = EXCLUDED.display_order, is_featured = EXCLUDED.is_featured;
  END IF;

END $$;
