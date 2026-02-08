import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserCredits } from '@/lib/database';

export const runtime = 'nodejs';

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

    // Get user credits
    const credits = await getUserCredits(session.user.id);

    return NextResponse.json({ 
      credits,
      user: session.user.email 
    });

  } catch (error) {
    console.error('Credits API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
