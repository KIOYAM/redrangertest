-- Red Rangers Morphin Energy Credit System
-- Business credit system for AI tool usage

-- ============================================
-- 1. USER CREDITS TABLE (Morphin Energy Balance)
-- ============================================

CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  balance INT DEFAULT 100 NOT NULL CHECK (balance >= 0),
  total_earned INT DEFAULT 100 NOT NULL,
  total_spent INT DEFAULT 0 NOT NULL,
  last_recharged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_credits_user ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_balance ON user_credits(balance);

-- ============================================
-- 2. CREDIT TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT CHECK (type IN ('grant', 'purchase', 'usage', 'refund', 'bonus')) NOT NULL,
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  reason TEXT,
  tool_name TEXT,
  admin_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at DESC);

-- ============================================
-- 3. CREDIT PACKAGES TABLE (Energy Cells)
-- ============================================

CREATE TABLE IF NOT EXISTS credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  credits INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bonus_credits INT DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  features JSONB,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_packages_active ON credit_packages(is_active, sort_order);

-- ============================================
-- 4. CREDIT USAGE LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS credit_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tool_name TEXT NOT NULL,
  credits_used INT NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_user ON credit_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_tool ON credit_usage_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_created ON credit_usage_logs(created_at DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage_logs ENABLE ROW LEVEL SECURITY;

-- User Credits Policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user credits" ON user_credits
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Credit Transactions Policies
CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON credit_transactions
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() = user_id);

-- Credit Packages Policies (public read)
CREATE POLICY "Anyone can view active packages" ON credit_packages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON credit_packages
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Credit Usage Logs Policies
CREATE POLICY "Users can view own usage logs" ON credit_usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs" ON credit_usage_logs
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to initialize credits for new user
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, balance, total_earned)
  VALUES (NEW.id, 100, 100); -- 100 free Morphin Energy
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create credits on user signup
DROP TRIGGER IF EXISTS trigger_init_user_credits ON auth.users;
CREATE TRIGGER trigger_init_user_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_credits();

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION check_credits(p_user_id UUID, p_amount INT)
RETURNS BOOLEAN AS $$
DECLARE
  v_balance INT;
BEGIN
  SELECT balance INTO v_balance
  FROM user_credits
  WHERE user_id = p_user_id;
  
  RETURN v_balance >= p_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INT,
  p_tool_name TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_balance INT;
  v_new_balance INT;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Check if enough credits
  IF v_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient Morphin Energy',
      'balance', v_balance,
      'required', p_amount
    );
  END IF;
  
  -- Deduct credits
  UPDATE user_credits
  SET 
    balance = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, type, amount, balance_after, reason, tool_name
  ) VALUES (
    p_user_id, 'usage', -p_amount, v_new_balance, p_reason, p_tool_name
  );
  
  -- Log usage
  INSERT INTO credit_usage_logs (
    user_id, tool_name, credits_used, success
  ) VALUES (
    p_user_id, p_tool_name, p_amount, true
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'balance', v_new_balance,
    'deducted', p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (grant/purchase)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INT,
  p_type TEXT, -- 'grant', 'purchase', 'bonus'
  p_reason TEXT DEFAULT NULL,
  p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_new_balance INT;
BEGIN
  -- Add credits
  UPDATE user_credits
  SET 
    balance = balance + p_amount,
    total_earned = total_earned + p_amount,
    last_recharged_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, type, amount, balance_after, reason, admin_id
  ) VALUES (
    p_user_id, p_type, p_amount, v_new_balance, p_reason, p_admin_id
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'balance', v_new_balance,
    'added', p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user credit stats
CREATE OR REPLACE FUNCTION get_credit_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'balance', balance,
    'total_earned', total_earned,
    'total_spent', total_spent,
    'percentage_remaining', ROUND((balance::DECIMAL / NULLIF(total_earned, 0)) * 100, 2),
    'last_recharged_at', last_recharged_at
  ) INTO v_stats
  FROM user_credits
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(v_stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. SEED DATA - Credit Packages
-- ============================================

INSERT INTO credit_packages (name, display_name, credits, price, bonus_credits, is_popular, features, icon, sort_order)
VALUES
  (
    'rookie_ranger',
    'Rookie Ranger',
    100,
    9.99,
    0,
    false,
    '["Perfect for trying out", "10 AI generations", "Email support"]'::jsonb,
    '⚡',
    1
  ),
  (
    'red_ranger',
    'Red Ranger',
    500,
    39.99,
    50,
    true,
    '["Most popular choice", "50+ AI generations", "+10% bonus energy", "Priority support"]'::jsonb,
    '🔴',
    2
  ),
  (
    'mega_ranger',
    'Mega Ranger',
    1500,
    99.99,
    300,
    false,
    '["For power users", "150+ AI generations", "+20% bonus energy", "Premium support", "Early access to features"]'::jsonb,
    '⚡🔴⚡',
    3
  ),
  (
    'legendary_ranger',
    'Legendary Ranger',
    5000,
    299.99,
    1500,
    false,
    '["Ultimate power", "500+ AI generations", "+30% bonus energy", "Dedicated support", "VIP features", "Custom training"]'::jsonb,
    '👑',
    4
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES (commented)
-- ============================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_name IN ('user_credits', 'credit_transactions', 'credit_packages', 'credit_usage_logs');

-- View credit packages
-- SELECT * FROM credit_packages ORDER BY sort_order;

-- Check a user's credits
-- SELECT * FROM get_credit_stats('user-uuid-here');
