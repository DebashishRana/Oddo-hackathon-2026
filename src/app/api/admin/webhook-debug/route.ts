import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/admin-auth';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check admin access
    await requireAdminAccess();

    // Get recent webhook events from Stripe
    const events = await getStripe().events.list({
      limit: 10,
      types: ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed']
    });

    // Get recent checkout sessions
    const sessions = await getStripe().checkout.sessions.list({
      limit: 10
    });

    return NextResponse.json({
      webhook_events: events.data.map(event => ({
        id: event.id,
        type: event.type,
        created: new Date(event.created * 1000).toISOString(),
        data: event.data.object
      })),
      checkout_sessions: sessions.data.map(session => ({
        id: session.id,
        payment_status: session.payment_status,
        customer: session.customer,
        amount_total: session.amount_total,
        metadata: session.metadata,
        created: new Date(session.created * 1000).toISOString()
      }))
    });

  } catch (error) {
    console.error('Webhook debug error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    await requireAdminAccess();

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get specific checkout session details
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer: session.customer,
        amount_total: session.amount_total,
        metadata: session.metadata,
        created: new Date(session.created * 1000).toISOString(),
        success_url: session.success_url,
        cancel_url: session.cancel_url
      }
    });

  } catch (error) {
    console.error('Session debug error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
