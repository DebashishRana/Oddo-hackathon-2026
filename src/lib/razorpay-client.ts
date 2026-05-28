/* eslint-disable @typescript-eslint/no-explicit-any */
export async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if ((window as any).Razorpay) return true;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.head.appendChild(script);
  });
}

interface RazorpayCheckoutOptions {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  name?: string;
  email?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export async function openRazorpayCheckout({ key, orderId, amount, currency, name, email, onSuccess, onError }: RazorpayCheckoutOptions) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onError?.({ error: "Razorpay SDK failed to load" });
    return;
  }

  const options: any = {
    key,
    order_id: orderId,
    amount,
    currency,
    name: name || "Dectra",
    description: "Subscription Upgrade",
    prefill: {
      name: name || "",
      email: email || "",
    },
    handler: function (response: any) {
      onSuccess?.(response);
    },
    modal: {
      ondismiss: function () {
        onError?.({ dismissed: true });
      }
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", function (response: any) {
    onError?.(response.error);
  });
  rzp.open();
}
