import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin-auth';
import { addCredits, setUserCredits, getUserById } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    const { isAdmin, user: adminUser } = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, amount } = body;

    if (!action || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request. Required: action (add/set), amount (number)' },
        { status: 400 }
      );
    }

    // Get user details for logging
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let result;
    if (action === 'add') {
      result = await addCredits(userId, amount);
    } else if (action === 'set') {
      result = await setUserCredits(userId, amount);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "set"' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      );
    }

    console.log(`Admin ${adminUser?.email || 'unknown'} ${action}ed ${amount} credits to user ${user.email} (ID: ${userId}). New balance: ${result.newBalance}`);

    return NextResponse.json({
      success: true,
      action,
      amount,
      newBalance: result.newBalance,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Admin credits management API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
