import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllUsers } from '@/lib/database';

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

    // Get all users
    const users = await getAllUsers();

    // Remove sensitive information before sending
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image_url: user.image_url,
      created_at: user.created_at,
      last_login: user.last_login
    }));

    return NextResponse.json(sanitizedUsers);

  } catch (error) {
    console.error('Users API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
