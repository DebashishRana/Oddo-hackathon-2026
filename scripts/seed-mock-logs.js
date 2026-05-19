#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Mock data for verification events
const mockEvents = [
  // Verified entries (10)
  { userId: 1, docType: 'Aadhaar', status: 'verified', confidence: 0.98, riskScore: 'Low', userName: 'Rajesh Kumar', userEmail: 'rajesh.kumar@example.com', hourOffset: 2 },
  { userId: 2, docType: 'PAN', status: 'verified', confidence: 0.95, riskScore: 'Low', userName: 'Priya Sharma', userEmail: 'priya.sharma@example.com', hourOffset: 1.5 },
  { userId: 3, docType: 'Passport', status: 'verified', confidence: 0.99, riskScore: 'Low', userName: 'Ahmed Hassan', userEmail: 'ahmed.hassan@example.com', hourOffset: 1 },
  { userId: 4, docType: 'Aadhaar', status: 'verified', confidence: 0.96, riskScore: 'Low', userName: 'Meera Patel', userEmail: 'meera.patel@example.com', hourOffset: 0.75 },
  { userId: 5, docType: 'Driving License', status: 'verified', confidence: 0.94, riskScore: 'Low', userName: 'Vikram Singh', userEmail: 'vikram.singh@example.com', hourOffset: 0.5 },
  { userId: 14, docType: 'PAN', status: 'verified', confidence: 0.97, riskScore: 'Low', userName: 'Deepak Gupta', userEmail: 'deepak.gupta@example.com', hourOffset: 0.83 },
  { userId: 15, docType: 'Aadhaar', status: 'verified', confidence: 0.93, riskScore: 'Low', userName: 'Nisha Kapoor', userEmail: 'nisha.kapoor@example.com', hourOffset: 1.08 },
  { userId: 16, docType: 'Driving License', status: 'verified', confidence: 0.96, riskScore: 'Low', userName: 'Rohan Bhat', userEmail: 'rohan.bhat@example.com', hourOffset: 1.25 },
  { userId: 18, docType: 'Passport', status: 'verified', confidence: 0.98, riskScore: 'Low', userName: 'Sophie Laurent', userEmail: 'sophie.laurent@example.com', hourOffset: 2.66 },
  { userId: 20, docType: 'Aadhaar', status: 'verified', confidence: 0.99, riskScore: 'Low', userName: 'Divya Nair', userEmail: 'divya.nair@example.com', hourOffset: 3.25 },

  // Flagged entries (5)
  { userId: 6, docType: 'PAN', status: 'flagged', confidence: 0.62, riskScore: 'High', userName: 'John Doe', userEmail: 'john.doe@example.com', hourOffset: 3.5, flagReason: 'Low confidence score' },
  { userId: 7, docType: 'Aadhaar', status: 'flagged', confidence: 0.58, riskScore: 'Medium', userName: 'Sarah Johnson', userEmail: 'sarah.johnson@example.com', hourOffset: 5, flagReason: 'Duplicate entry detected' },
  { userId: 8, docType: 'Passport', status: 'flagged', confidence: 0.71, riskScore: 'High', userName: 'Michael Chen', userEmail: 'michael.chen@example.com', hourOffset: 6, flagReason: 'Document image quality poor' },
  { userId: 9, docType: 'PAN', status: 'flagged', confidence: 0.68, riskScore: 'High', userName: 'Lisa Anderson', userEmail: 'lisa.anderson@example.com', hourOffset: 7.5, flagReason: 'Suspicious pattern detected' },
  { userId: 17, docType: 'Driving License', status: 'flagged', confidence: 0.65, riskScore: 'High', userName: 'Carlos Rodriguez', userEmail: 'carlos.rodriguez@example.com', hourOffset: 2.16, flagReason: 'Expired document' },

  // Pending entries (5)
  { userId: 10, docType: 'Aadhaar', status: 'pending', confidence: 0.85, riskScore: 'Medium', userName: 'Arjun Desai', userEmail: 'arjun.desai@example.com', hourOffset: 0.08 },
  { userId: 11, docType: 'Driving License', status: 'pending', confidence: 0.92, riskScore: 'Low', userName: 'Emma Wilson', userEmail: 'emma.wilson@example.com', hourOffset: 0.16 },
  { userId: 12, docType: 'PAN', status: 'pending', confidence: 0.88, riskScore: 'Low', userName: 'Sunil Verma', userEmail: 'sunil.verma@example.com', hourOffset: 0.33 },
  { userId: 13, docType: 'Passport', status: 'pending', confidence: 0.91, riskScore: 'Medium', userName: 'Fatima Al-Rashid', userEmail: 'fatima.rashid@example.com', hourOffset: 0.58 },
  { userId: 19, docType: 'PAN', status: 'pending', confidence: 0.89, riskScore: 'Medium', userName: 'Aditya Puri', userEmail: 'aditya.puri@example.com', hourOffset: 0.016 }
]

async function seedMockLogs() {
  try {
    console.log('📝 Setting up verification_events table...')
    // Create table
    await pool.query(`
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
      
      CREATE INDEX idx_verification_events_user_id ON verification_events(user_id);
      CREATE INDEX idx_verification_events_received_at ON verification_events(received_at DESC);
      CREATE INDEX idx_verification_events_status ON verification_events((metadata->>'status'));
      CREATE INDEX idx_verification_events_document_type ON verification_events((metadata->>'document_type'));
    `)
    console.log('✅ Table created/verified')

    console.log('📝 Inserting 20 mock verification logs...')
    // Insert each event
    for (const event of mockEvents) {
      const metadata = {
        status: event.status,
        document_type: event.docType,
        confidence: event.confidence,
        risk_score: event.riskScore,
        scanner_version: '2.1.0',
        scan_time: new Date(Date.now() - event.hourOffset * 3600000).toISOString(),
        value_type: ['Aadhaar', 'PAN'].includes(event.docType) ? 'numeric' : 'alphanumeric',
        method: 'OCR',
        user_name: event.userName,
        user_email: event.userEmail,
        ...(event.flagReason && { flag_reason: event.flagReason })
      }

      const receivedAt = new Date(Date.now() - event.hourOffset * 3600000)

      await pool.query(
        `INSERT INTO verification_events (user_id, document_type, metadata, received_at, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [event.userId, event.docType, JSON.stringify(metadata), receivedAt, new Date()]
      )
    }

    console.log('✅ Mock logs inserted successfully!')
    console.log('📊 Verification events table is now populated with 20 test cases')
    console.log('\n   Distribution:')
    console.log('   ✓ 10 Verified entries')
    console.log('   ⚠ 5 Flagged entries')
    console.log('   ⏳ 5 Pending entries')
    console.log('\nYou can now navigate to /dashboard/logs to review the visuals!')
  } catch (err) {
    console.error('❌ Error seeding mock logs:')
    console.error(err.message)
    if (err.detail) console.error('Details:', err.detail)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedMockLogs()
