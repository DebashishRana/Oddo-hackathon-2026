-- Demo users, sample assets, and starter operational data

-- Shared password for all seeded accounts: Admin1234!
-- Hash matches 004_seed_assetflow.sql admin password

INSERT INTO users (email, name, password_hash, department, department_id, role_id, auth_provider, is_active, email_verified_at)
SELECT
  v.email,
  v.name,
  '$2b$10$f9oWrTWMpp5xh3apff7QGu5Y0hAJ8KgZkv5Ts8TTS9C7t4b72n8ja',
  v.department,
  d.id,
  r.id,
  'local',
  TRUE,
  NOW()
FROM (
  VALUES
    ('manager@assetflow.local', 'Alex Manager', 'Information Technology', 'asset_manager'),
    ('head@assetflow.local', 'Priya Head', 'Operations', 'department_head'),
    ('employee@assetflow.local', 'Sam Employee', 'Operations', 'employee')
) AS v(email, name, department, role_slug)
JOIN roles r ON r.slug = v.role_slug
LEFT JOIN departments d ON d.name = v.department
ON CONFLICT (email) DO NOTHING;

UPDATE departments
SET head_user_id = (SELECT id FROM users WHERE email = 'head@assetflow.local' LIMIT 1)
WHERE name = 'Operations'
  AND head_user_id IS NULL;

-- Sample assets (tags via sequence)
INSERT INTO assets (
  name, asset_tag, serial_number, category_id, department_id, status, condition,
  location, acquisition_date, acquisition_cost, is_shared_bookable, created_by
)
SELECT
  v.name,
  'AF-' || LPAD(nextval('asset_tag_seq')::text, 4, '0'),
  v.serial_number,
  c.id,
  d.id,
  v.status::varchar,
  v.condition::varchar,
  v.location,
  CURRENT_DATE - (v.days_ago || ' days')::interval,
  v.cost,
  v.bookable,
  (SELECT id FROM users WHERE email = 'manager@assetflow.local' LIMIT 1)
FROM (
  VALUES
    ('MacBook Pro 16"', 'MBP-16-001', 'Electronics', 'Information Technology', 'available', 'excellent', 'HQ - Floor 3', 120, 2499.00, FALSE),
    ('Dell Latitude 5540', 'DLL-5540-12', 'Electronics', 'Operations', 'available', 'good', 'HQ - Floor 2', 90, 1299.00, FALSE),
    ('Standing Desk A12', 'DESK-A12', 'Furniture', 'Operations', 'available', 'good', 'HQ - Floor 2', 200, 450.00, FALSE),
    ('Conference Room B2', 'ROOM-B2', 'Rooms', 'Facilities', 'available', 'excellent', 'HQ - Floor 1', 365, 0.00, TRUE),
    ('Delivery Van 02', 'VAN-02', 'Vehicles', 'Operations', 'available', 'fair', 'Warehouse Bay 1', 400, 28000.00, TRUE),
    ('Projector Unit 4', 'PROJ-04', 'Electronics', 'Facilities', 'available', 'good', 'AV Closet', 60, 899.00, TRUE)
) AS v(name, serial_number, category, department, status, condition, location, days_ago, cost, bookable)
JOIN asset_categories c ON c.name = v.category
JOIN departments d ON d.name = v.department
WHERE NOT EXISTS (
  SELECT 1 FROM assets a WHERE a.serial_number = v.serial_number
);
