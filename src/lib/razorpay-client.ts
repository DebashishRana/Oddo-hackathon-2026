"use client"

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (
  orderId: string,
  amount: number,
  currency: string,
  userName: string,
  userEmail: string,
  onSuccess?: () => void,
  onCancel?: () => void
) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    if (onCancel) onCancel();
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount,
    currency,
    name: 'Best SAAS Kit V2',
    description: 'Pro Plan Upgrade',
    order_id: orderId,
    handler: function (response: any) {
      // The payment is verified asynchronously via Webhook, 
      // but you can immediately redirect to success page
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard/billing?success=true';
      }
    },
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: '#3399cc',
    },
    modal: {
      ondismiss: function() {
        if (onCancel) {
          onCancel();
        } else {
          window.location.href = '/dashboard/billing?canceled=true';
        }
      }
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
