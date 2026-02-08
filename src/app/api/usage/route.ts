import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { formatUsageForAPI } from '@/lib/usage-tracking';

export async function GET(_request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get usage stats for the user
    const usageData = formatUsageForAPI(userId);

    return NextResponse.json(usageData);

  } catch (error) {
    console.error('Usage API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
