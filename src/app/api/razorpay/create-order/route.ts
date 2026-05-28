import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createOrder } from '@/lib/razorpay';
import { getUserByGoogleId, validateDiscountCode, getDiscountCodeByCode } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan, discountCode } = await request.json();

    if (plan !== 'pro') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByGoogleId(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has pro subscription
    if (user.subscription_status === 'pro') {
      return NextResponse.json(
        { error: 'User already has Pro subscription' },
        { status: 400 }
      );
    }

    let amount = 9900; // Expected amount in Paise for $99 equivalent, or customize for INR logic

    // Handle discount code if provided
    if (discountCode) {
      const validation = await validateDiscountCode(discountCode.toUpperCase());

      if (!validation.is_valid) {
        return NextResponse.json(
          { error: validation.error_message || 'Invalid discount code' },
          { status: 400 }
        );
      }

      const discountDetails = await getDiscountCodeByCode(discountCode.toUpperCase());
      if (discountDetails) {
        // Apply discount calculation based on percentage or fixed. Assuming 9900 as base.
        if (discountDetails.discount_type === 'percentage') {
          const discountAmt = Math.floor((amount * discountDetails.discount_value) / 100);
          amount -= discountAmt;
        } else if (discountDetails.discount_type === 'fixed') {
          amount = Math.max(0, amount - (discountDetails.discount_value * 100)); // convert value to paise
        }
      }
    }

    // Create Razorpay order
    const order = await createOrder(amount, "INR", `rec_${Date.now()}`, { userId: user.id.toString(), userEmail: user.email });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      userName: user.name || "Dectra User",
      userEmail: user.email || ""
    });

  } catch (error) {
    console.error('Razorpay Create Order API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error processing the order' },
      { status: 500 }
    );
  }
}
