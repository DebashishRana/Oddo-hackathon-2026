import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayClient: Razorpay | null = null;

export function getRazorpay() {
  if (razorpayClient) {
    return razorpayClient;
  }

  // Use live keys if they are set, otherwise fallback
  const key_id = process.env.RAZORPAY_LIVE_API || process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not configured');
  }

  razorpayClient = new Razorpay({
    key_id,
    key_secret,
  });

  return razorpayClient;
}

export const RAZORPAY_CONFIG = {
  PRO_PLAN: {
    name: 'Pro Plan',
    // 99 USD converted to INR (Example: ~8300 INR). Razorpay expects smallest unit (paise). 
    // 8300 INR = 830000 paise. Adjust as needed.
    price: 830000, 
    currency: 'INR',
    description: 'One-time payment for Pro features',
  },
} as const;

export async function createOrder(
  userId: number,
  userEmail: string,
  amountInPaise: number = RAZORPAY_CONFIG.PRO_PLAN.price,
  currency: string = RAZORPAY_CONFIG.PRO_PLAN.currency,
  discountCode?: string
) {
  const notes: any = {
    userId: userId.toString(),
    userEmail: userEmail,
    plan: 'pro'
  };
  
  if (discountCode) {
    notes.discountCode = discountCode;
  }

  const options = {
    amount: amountInPaise,
    currency,
    receipt: `rcpt_u${userId}_${Date.now()}`,
    notes
  };
  
  return await getRazorpay().orders.create(options);
}

export function verifyWebhookSignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  return expectedSignature === signature;
}
