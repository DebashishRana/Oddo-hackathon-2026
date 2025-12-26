import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin-auth';
import { getCreditStats } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { isAdmin, user } = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const stats = await getCreditStats();

    return NextResponse.json({
      ...stats,
      admin: user?.email || 'unknown',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin credits stats API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
