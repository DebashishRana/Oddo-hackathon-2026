import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { getUserById, updateUserSubscription, addCredits, incrementDiscountUsage } from '@/lib/database';
import { sendEmail, createSubscriptionConfirmationEmail } from '@/lib/resend';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing razorpay signature header');
      return NextResponse.json({ error: 'Missing razorpay signature' }, { status: 400 });
    }

    try {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.error('Invalid Razorpay signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } catch (error) {
      console.error('Signature verification error (check RAZORPAY_WEBHOOK_SECRET):', error);
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 500 });
    }

    const event = JSON.parse(rawBody);
    console.log('Razorpay Webhook received event type:', event.event);
    
    // We handle exactly payment.captured or order.paid
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.event === 'payment.captured' ? event.payload.payment.entity : event.payload.order.entity;
      
      const notes = paymentEntity.notes || {};
      const paymentId = event.event === 'payment.captured' ? paymentEntity.id : (paymentEntity.receipt || paymentEntity.id);
      
      if (notes.userId) {
        const userId = parseInt(notes.userId);
        const user = await getUserById(userId);
        
        if (user) {
          try {
            // Update subscription using the existing database function.
            // We use subscription_id to store the Razorpay payment ID.
            await updateUserSubscription(userId, {
              subscription_status: 'pro',
              subscription_id: paymentId,
            });

            // Add credits for Pro plan
            await addCredits(userId, 1000);

            // Output logs for tracking
            console.log(`✅ User ${user.email} successfully upgraded to Pro plan via Razorpay.`);

            // Handle discount tracking if a discount was applied
            if (notes.discountCode) {
              const discountCode = notes.discountCode.toUpperCase();
              try {
                await incrementDiscountUsage(discountCode);
              } catch (e) {
                console.error(`Error tracking discount usage for ${discountCode}:`, e);
              }
            }

            // Send subscription confirmation email
            if (user.name && user.email) {
              try {
                const emailData = createSubscriptionConfirmationEmail(user.name, user.email, 'Pro');
                await sendEmail(emailData);
              } catch (emailError) {
                console.error("Failed to send subscription confirmation email:", emailError);
              }
            }

          } catch (updateError) {
            console.error(`❌ Error upgrading user ${user.email}:`, updateError);
          }
        } else {
          console.error(`❌ No user found for userId: ${notes.userId}`);
        }
      } else {
        console.error('Webhook event missing userId in notes.');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay Webhook handler failed:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
