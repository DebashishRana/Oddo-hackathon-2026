import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpay() {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_LIVE_API || "",
    key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET || "",
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
