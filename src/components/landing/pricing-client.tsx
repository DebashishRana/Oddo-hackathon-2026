"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import { cn } from "@/lib/utils";

interface PricingClientProps {
  plan: {
    name: string;
    popular: boolean;
    variant: "default" | "outline";
    cta: string;
    action?: "checkout" | "signin" | "contact";
    checkoutPlan?: string;
    contactEmail?: string;
  };
  isAuthenticated: boolean;
  highlighted?: boolean;
}

export function PricingClient({ plan, isAuthenticated, highlighted }: PricingClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  // const [appliedDiscount, setAppliedDiscount] = useState<{ code: string } | null>(null);
  // const [showDiscountInput] = useState(false);

  const handlePurchase = async () => {
    const action = plan.action || 'checkout';

    if (action === 'signin') {
      window.location.href = '/auth/signin';
      return;
    }

    if (action === 'contact') {
      const email = plan.contactEmail || 'support@dectra.com';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${plan.name} Plan Inquiry`)}`;
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=/dashboard/billing';
      return;
    }

    setIsLoading(true);
    
    try {
      const requestBody: { plan: string } = { plan: plan.checkoutPlan || 'pro' };

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
          // Instead of redirecting strictly to checkout session, we just go to billing success
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

  return (
    <Button 
      className={cn(
        "w-full rounded-lg font-medium",
        highlighted
          ? "bg-[#d4854e] hover:bg-[#c07843] text-white border-0"
          : "bg-muted/50 hover:bg-muted text-foreground border border-border/40"
      )}
      variant={highlighted ? "default" : "outline"}
      size="lg"
      onClick={handlePurchase}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        plan.cta
      )}
    </Button>
  );
}
