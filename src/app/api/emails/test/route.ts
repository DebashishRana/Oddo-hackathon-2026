import { NextResponse } from 'next/server';
import { sendEmail, createWelcomeEmail } from '@/lib/resend';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Test email data
    const testEmailData = createWelcomeEmail('Test User', 'test@example.com');
    
    // Send test email
    const result = await sendEmail(testEmailData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint. Use POST to send a test email.',
    endpoints: {
      welcome: '/api/emails/welcome',
      subscription: '/api/emails/subscription',
      contact: '/api/emails/contact',
      test: '/api/emails/test'
    }
  });
}
