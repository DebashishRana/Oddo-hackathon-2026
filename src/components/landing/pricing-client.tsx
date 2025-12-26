"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { redirectToCheckout } from "@/lib/stripe-client";

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
}

export function PricingClient({ plan, isAuthenticated }: PricingClientProps) {
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
      const email = plan.contactEmail || 'support@veriquick.com';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${plan.name} Plan Inquiry`)}`;
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=/dashboard/billing';
      return;
    }

    setIsLoading(true);
    
    try {
      // Create checkout session for Pro plan
      const requestBody: { plan: string } = { plan: plan.checkoutPlan || 'pro' };
      // Discount functionality can be added here if needed

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      variant={plan.variant}
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
        <>
          {plan.popular && <Zap className="w-4 h-4 mr-2" />}
          {plan.cta}
        </>
      )}
    </Button>
  );
}
