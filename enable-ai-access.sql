-- Enable AI access for your account
-- User ID: 7a71dd46-7c1b-493d-b86c-9253135aa891
-- Email: kannansin784yg0@gmail.com

UPDATE profiles 
SET can_use_ai = true 
WHERE id = '7a71dd46-7c1b-493d-b86c-9253135aa891';

-- Verify the update
SELECT id, email, role, can_use_ai 
FROM profiles 
WHERE id = '7a71dd46-7c1b-493d-b86c-9253135aa891';
