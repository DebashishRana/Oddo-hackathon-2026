-- Create verification_events table for scanner logs
-- Drop existing table to recreate without foreign key constraint
DROP TABLE IF EXISTS verification_events CASCADE;

CREATE TABLE verification_events (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  document_type VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_events_user_id ON verification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_events_received_at ON verification_events(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_events_status ON verification_events((metadata->>'status'));
CREATE INDEX IF NOT EXISTS idx_verification_events_document_type ON verification_events((metadata->>'document_type'));
CREATE INDEX IF NOT EXISTS idx_verification_events_api_source ON verification_events((metadata->>'api_source'));
CREATE INDEX IF NOT EXISTS idx_verification_events_risk_score ON verification_events((metadata->>'risk_score'));
CREATE INDEX IF NOT EXISTS idx_verification_events_scanner_event_id ON verification_events((metadata->>'scanner_event_id'));

-- Verify table was created
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'verification_events';
