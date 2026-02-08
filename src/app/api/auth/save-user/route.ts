import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { upsertUser } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Save user to database
    const userData = {
      google_id: session.user.id,
      email: session.user.email!,
      name: session.user.name || undefined,
      image_url: session.user.image || undefined,
    };

    const savedUser = await upsertUser(userData);

    return NextResponse.json({ 
      success: true, 
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        created_at: savedUser.created_at,
        last_login: savedUser.last_login
      }
    });

  } catch (error) {
    console.error('Save user API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
