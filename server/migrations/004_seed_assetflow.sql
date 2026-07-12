-- Seed default admin and starter organization data for AssetFlow

INSERT INTO departments (name, code, status)
VALUES
  ('Information Technology', 'IT', 'active'),
  ('Operations', 'OPS', 'active'),
  ('Facilities', 'FAC', 'active'),
  ('Finance', 'FIN', 'active')
ON CONFLICT (name) DO NOTHING;

INSERT INTO asset_categories (name, description, custom_fields)
VALUES
  ('Electronics', 'Computers, phones, and peripherals', '{"warranty_period_months": 24}'::jsonb),
  ('Furniture', 'Desks, chairs, and office furniture', '{}'::jsonb),
  ('Vehicles', 'Cars, vans, and fleet equipment', '{"odometer_required": true}'::jsonb),
  ('Rooms', 'Meeting rooms and shared spaces', '{"capacity": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (email, name, password_hash, department, role_id, auth_provider, is_active, email_verified_at)
SELECT
  'admin@assetflow.local',
  'System Admin',
  '$2b$10$f9oWrTWMpp5xh3apff7QGu5Y0hAJ8KgZkv5Ts8TTS9C7t4b72n8ja',
  'Information Technology',
  r.id,
  'local',
  TRUE,
  NOW()
FROM roles r
WHERE r.slug = 'admin'
ON CONFLICT (email) DO NOTHING;

UPDATE users u
SET department_id = d.id
FROM departments d
WHERE u.email = 'admin@assetflow.local'
  AND d.name = 'Information Technology'
  AND u.department_id IS NULL;

UPDATE departments
SET head_user_id = (SELECT id FROM users WHERE email = 'admin@assetflow.local' LIMIT 1)
WHERE name = 'Information Technology'
  AND head_user_id IS NULL;
