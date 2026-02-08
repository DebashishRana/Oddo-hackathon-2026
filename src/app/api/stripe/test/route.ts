import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is reachable',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    return NextResponse.json({
      message: 'Test webhook received',
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      headers: {
        'stripe-signature': headers['stripe-signature'] || 'Not present',
        'content-type': headers['content-type'] || 'Not present',
        'user-agent': headers['user-agent'] || 'Not present'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process test webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
