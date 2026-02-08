import { NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/admin-auth';
import { pool } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check admin access
    await requireAdminAccess();

    // Test basic database connection
    const client = await pool.connect();
    
    try {
      // Test simple query
      const testQuery = await client.query('SELECT COUNT(*) as total FROM users');
      const totalUsers = testQuery.rows[0].total;

      // Test subscription status query
      const statusQuery = await client.query(`
        SELECT 
          subscription_status,
          COUNT(*) as count
        FROM users 
        GROUP BY subscription_status
      `);

      // Test credits query
      const creditsQuery = await client.query('SELECT SUM(credits) as total_credits FROM users');
      const totalCredits = creditsQuery.rows[0].total_credits;

      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: {
          totalUsers: parseInt(totalUsers),
          usersByStatus: statusQuery.rows,
          totalCredits: parseInt(totalCredits) || 0,
          timestamp: new Date().toISOString()
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Test analytics error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
