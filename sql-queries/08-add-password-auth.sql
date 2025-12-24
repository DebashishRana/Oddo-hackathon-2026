-- Make google_id nullable since password users won't have one
ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL;

-- Add password_hash column
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
