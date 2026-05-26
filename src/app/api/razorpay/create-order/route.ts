import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createOrder, RAZORPAY_CONFIG } from '@/lib/razorpay';
import { getUserByGoogleId, validateDiscountCode, getDiscountCodeByCode } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, discountCode } = await request.json();

    if (plan !== 'pro') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const user = await getUserByGoogleId(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.subscription_status === 'pro') {
      return NextResponse.json({ error: 'User already has Pro subscription' }, { status: 400 });
    }

    let finalAmount = RAZORPAY_CONFIG.PRO_PLAN.price;
    
    // Apply discount logic if discountCode is given
    if (discountCode) {
      const validation = await validateDiscountCode(discountCode.toUpperCase());
      if (!validation.is_valid) {
        return NextResponse.json({ error: validation.error_message || 'Invalid discount code' }, { status: 400 });
      }

      const discountDetails = await getDiscountCodeByCode(discountCode.toUpperCase());
      if (discountDetails) {
        if (discountDetails.discount_type === 'percentage') {
          const discountPercentage = Number(discountDetails.discount_value);
          finalAmount = Math.round(finalAmount * (1 - (discountPercentage / 100)));
        } else {
          // If fixed amount is in standard units (INR), convert to paise
          const discountPaise = Number(discountDetails.discount_value) * 100;
          finalAmount = Math.max(0, finalAmount - discountPaise);
        }
      }
    }

    const order = await createOrder(user.id, user.email, finalAmount, RAZORPAY_CONFIG.PRO_PLAN.currency, discountCode);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      userName: user.name || '',
      userEmail: user.email || ''
    });

  } catch (error) {
    console.error('Razorpay Create Order API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
