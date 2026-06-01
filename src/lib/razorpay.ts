import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpay() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_LIVE_API;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(`Razorpay credentials not configured. Check env vars: NEXT_PUBLIC_RAZORPAY_KEY_ID=${!!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}, RAZORPAY_KEY_SECRET=${!!process.env.RAZORPAY_KEY_SECRET}`);
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function createOrder(amountInPaise: number, currency = "INR", receipt?: string, notes?: Record<string, string>) {
  const razorpay = getRazorpay();
  const options = {
    amount: amountInPaise,
    currency,
    receipt: receipt ?? `rcpt_${Date.now()}`,
    payment_capture: 1, // Auto capture
    notes,
  };
  const order = await razorpay.orders.create(options);
  return order;
}

export function verifyWebhookSignature(payload: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}
