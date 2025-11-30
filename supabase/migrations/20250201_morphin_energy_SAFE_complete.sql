-- Complete Migration for Morphin Energy Credits
-- Run this in Supabase SQL Editor to finish setup

-- This checks what already exists and only creates what's missing

-- Check if user_credits table exists, create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_credits') THEN
        CREATE TABLE user_credits (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
            balance INT DEFAULT 100 NOT NULL CHECK (balance >= 0),
            total_earned INT DEFAULT 100 NOT NULL,
            total_spent INT DEFAULT 0 NOT NULL,
            last_recharged_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        CREATE INDEX idx_user_credits_user ON user_credits(user_id);
        CREATE INDEX idx_user_credits_balance ON user_credits(balance);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage user credits" ON user_credits;
CREATE POLICY "System can manage user credits" ON user_credits
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Initialize credits for existing users who don't have them yet
INSERT INTO user_credits (user_id, balance, total_earned)
SELECT id, 100, 100
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT (user_id) DO NOTHING;

-- Verify setup
SELECT 
    COUNT(*) as total_users_with_credits,
    SUM(balance) as total_active_energy,
    AVG(balance) as avg_balance
FROM user_credits;
