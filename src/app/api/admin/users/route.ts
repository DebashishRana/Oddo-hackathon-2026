import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin-auth';
import { getAllUsers, searchUsers } from '@/lib/database';

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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let users;
    if (search) {
      users = await searchUsers(search);
    } else {
      users = await getAllUsers();
    }

    return NextResponse.json({
      users,
      total: users.length,
      admin: user?.email || 'unknown'
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
