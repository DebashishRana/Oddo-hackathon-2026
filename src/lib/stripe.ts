import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

export const STRIPE_CONFIG = {
  PRO_PLAN: {
    name: 'Pro Plan',
    price: 9900, // $99.00 in cents
    currency: 'usd',
    description: 'One-time payment for Pro features',
  },
} as const;

// Create Stripe customer
export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name: name || undefined,
  });
}

// Create checkout session for Pro plan
export async function createCheckoutSession(
  customerId: string,
  userId: number,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: STRIPE_CONFIG.PRO_PLAN.currency,
          product_data: {
            name: STRIPE_CONFIG.PRO_PLAN.name,
            description: STRIPE_CONFIG.PRO_PLAN.description,
          },
          unit_amount: STRIPE_CONFIG.PRO_PLAN.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // One-time payment
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      plan: 'pro',
      userId: userId.toString(),
      userEmail: userEmail,
    },
  });
}

// Create Stripe coupon for discount code
export async function createStripeCoupon(
  discountCode: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number
) {
  try {
    const couponData: Stripe.CouponCreateParams = {
      id: `discount_${discountCode.toLowerCase()}`,
      name: `Discount Code: ${discountCode}`,
      duration: 'once', // One-time use discount
    };

    if (discountType === 'percentage') {
      // Ensure percentage is a whole number between 1-100
      couponData.percent_off = Math.round(discountValue);
    } else {
      // For fixed amount, convert dollars to cents if needed
      // If value is less than 100, assume it's in dollars and convert to cents
      const amountInCents = discountValue < 100 ? discountValue * 100 : discountValue;
      couponData.amount_off = Math.round(amountInCents);
      couponData.currency = STRIPE_CONFIG.PRO_PLAN.currency;
    }

    console.log('Creating Stripe coupon with data:', couponData);
    return await stripe.coupons.create(couponData);
  } catch (error) {
    console.error('Stripe coupon creation error:', error);
    throw error;
  }
}

// Delete Stripe coupon
export async function deleteStripeCoupon(couponId: string) {
  try {
    return await stripe.coupons.del(couponId);
  } catch (error) {
    console.error('Error deleting Stripe coupon:', error);
    throw error;
  }
}

// Create checkout session with optional discount
export async function createCheckoutSessionWithDiscount(
  customerId: string,
  userId: number,
  userEmail: string,
  successUrl: string,
  cancelUrl: string,
  discountCouponId?: string
) {
  const sessionData: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: STRIPE_CONFIG.PRO_PLAN.currency,
          product_data: {
            name: STRIPE_CONFIG.PRO_PLAN.name,
            description: STRIPE_CONFIG.PRO_PLAN.description,
          },
          unit_amount: STRIPE_CONFIG.PRO_PLAN.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // One-time payment
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      plan: 'pro',
      userId: userId.toString(),
      userEmail: userEmail,
    },
  };

  // Apply discount if provided
  if (discountCouponId) {
    sessionData.discounts = [
      {
        coupon: discountCouponId,
      },
    ];
  }

  return await stripe.checkout.sessions.create(sessionData);
}

// Verify webhook signature
export function verifyWebhookSignature(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
