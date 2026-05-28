"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import { DiscountInput, PriceDisplay } from "@/components/checkout/discount-input";

interface DiscountDetails {
  discount_id: number
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  code: string
}

interface BillingClientProps {
  currentPlan: string;
}

export function BillingClient({ currentPlan }: BillingClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountDetails | null>(null);

  const handleUpgrade = async () => {
    if (currentPlan === 'pro') {
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session with optional discount
      const requestBody: { plan: string; discountCode?: string } = { plan: 'pro' };
      if (appliedDiscount) {
        requestBody.discountCode = appliedDiscount.code;
      }

      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Razorpay order');
      }

      const orderData = await response.json();

      await openRazorpayCheckout({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.userName,
        email: orderData.userEmail,
        onSuccess: (res) => {
          // Success redirect
          window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard/billing?success=true`;
        },
        onError: (err) => {
          console.error("Razorpay Error:", err);
          if (!err.dismissed) {
             alert('Payment failed. Please try again.');
          }
        }
      });

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPlan === 'pro') {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
        <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
        <h3 className="font-medium text-green-800">You&apos;re a Pro Member!</h3>
        <p className="text-sm text-green-600">
          Thank you for supporting our platform. Enjoy unlimited access to all features.
        </p>
      </div>
    );
  }

  const originalPrice = 99; // $99 Pro plan price

  return (
    <div className="space-y-6">
      {/* Discount Input */}
      <DiscountInput
        onDiscountApplied={setAppliedDiscount}
        disabled={isLoading}
      />

      {/* Price Display */}
      <div className="text-center">
        <PriceDisplay
          originalPrice={originalPrice}
          discount={appliedDiscount}
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground">
          One-time payment, lifetime access
        </p>
      </div>

      {/* Upgrade Button */}
      <Button
        onClick={handleUpgrade}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="mr-2 h-4 w-4" />
            {appliedDiscount ? 'Upgrade to Pro with Discount' : 'Upgrade to Pro'}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by Razorpay. {appliedDiscount && 'Discount will be applied at checkout.'}
      </p>
    </div>
  );
}
