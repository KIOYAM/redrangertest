-- Debug: Check if your profile exists and what the values are
SELECT id, email, role, can_use_ai, created_at
FROM profiles 
WHERE email = 'kannansin784yg0@gmail.com';

-- If the above returns NO rows, then the profile doesn't exist yet
-- In that case, create it manually:
INSERT INTO profiles (id, email, role, can_use_ai)
VALUES ('7a71dd46-7c1b-493d-b86c-9253135aa891', 'kannansin784yg0@gmail.com', 'admin', true)
ON CONFLICT (id) DO UPDATE 
SET can_use_ai = true, role = 'admin';

-- Then verify again:
SELECT id, email, role, can_use_ai 
FROM profiles 
WHERE email = 'kannansin784yg0@gmail.com';
