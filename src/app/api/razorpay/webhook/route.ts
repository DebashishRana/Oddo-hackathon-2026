import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { getUserById, getUserByEmail, updateUserSubscription, addCredits } from '@/lib/database';
import { sendEmail, createSubscriptionConfirmationEmail } from '@/lib/resend';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing x-razorpay-signature header');
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    if (!verifyWebhookSignature(body, signature)) {
      console.error('Razorpay Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    
    console.log('Razorpay webhook event:', event);

    if (event === 'payment.captured' || event === 'order.paid') {
      const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      const notes = entity.notes;
      
      let user = null;
      if (notes?.userId) {
        user = await getUserById(parseInt(notes.userId, 10));
      } else if (notes?.userEmail) {
        user = await getUserByEmail(notes.userEmail);
      }

      if (user) {
        try {
          // Update user to Pro subscription
          await updateUserSubscription(user.id, {
            subscription_status: 'pro',
            subscription_id: entity.order_id || entity.id, // reference order id for idempotency tracking
            // For one-time payment, no end date (lifetime access)
          });

          // Add bonus credits for Pro users (1000 credits)
          await addCredits(user.id, 1000);

          // Note: Discount usage tracking can be similarly added if a discount code is mapped in notes

          // Send subscription confirmation email
          if (user.name && user.email) {
            try {
              const subscriptionEmailData = createSubscriptionConfirmationEmail(user.name, user.email, 'Pro');
              await sendEmail(subscriptionEmailData);
            } catch (emailError) {
              console.error("Failed to send subscription confirmation email:", emailError);
            }
          }

          console.log(`✅ User ${user.email} successfully upgraded to Pro plan via Razorpay`);
        } catch (updateError) {
          console.error(`❌ Error upgrading user ${user.email} to Pro via Razorpay:`, updateError);
        }
      } else {
        console.error(`❌ No user found for razorpay event:`, notes);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
