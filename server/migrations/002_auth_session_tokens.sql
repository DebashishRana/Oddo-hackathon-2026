ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS provider_account_id TEXT,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_verification_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS email_verification_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_reset_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_token_expires_at TIMESTAMPTZ;

ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_account_id
  ON users(provider_account_id)
  WHERE provider_account_id IS NOT NULL;

