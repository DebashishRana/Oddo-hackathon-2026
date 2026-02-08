import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/admin-auth';
import { getAnalyticsData, getGrowthMetrics } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
  try {
    // Check admin access
    await requireAdminAccess();

    // Get analytics data
    const [analyticsData, growthMetrics] = await Promise.all([
      getAnalyticsData(),
      getGrowthMetrics()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...analyticsData,
        growth: growthMetrics
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
