-- =============================================================================
-- 09: ADD EMAIL VERIFICATION SUPPORT
-- =============================================================================
-- Adds columns to support 6-digit OTP email verification on sign-up.
-- Run this against your Neon database after 08-add-password-auth.sql.
-- =============================================================================

-- 1. Add email_verified flag (defaults false for new credential users,
--    but Google users are implicitly verified)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- 2. Add verification code + expiry columns
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6),
  ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMP WITH TIME ZONE;

-- 3. Mark all existing Google users as verified (they used OAuth)
UPDATE users
  SET email_verified = TRUE
  WHERE google_id IS NOT NULL;

-- 4. Index for quick lookups when verifying
CREATE INDEX IF NOT EXISTS idx_users_verification_code
  ON users (email, verification_code)
  WHERE verification_code IS NOT NULL;

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('email_verified', 'verification_code', 'verification_code_expires')
ORDER BY ordinal_position;
