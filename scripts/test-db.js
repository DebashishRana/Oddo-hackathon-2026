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

async function test() {
  try {
    const result = await pool.query("SELECT jsonb_build_object('test', 'value') as data")
    console.log('✓ jsonb_build_object works!')
    console.log(result.rows[0])
    
    // Now try a simpler INSERT
    const insertResult = await pool.query(`
      INSERT INTO verification_events (user_id, document_type, metadata, received_at, created_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id
    `, [1, 'Aadhaar', JSON.stringify({ status: 'verified', confidence: 0.98 })])
    console.log('✓ Simple insert works!')
    console.log('Inserted ID:', insertResult.rows[0].id)
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await pool.end()
  }
}

test()
