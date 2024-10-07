"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import { Button } from "@/components/ui/button";

export function CartSummary() {
  const {
    formattedTotalPrice,
    totalPrice,
    cartCount,
  } = useShoppingCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isDisabled = isLoading || cartCount === 0;
  const shippingAmount = cartCount > 0 ? 500 : 0;
  const totalAmount = totalPrice + shippingAmount;

  // Add the PayChangu popup script only once when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('paychangu-script')) {
      const script = document.createElement('script');
      script.src = 'https://in.paychangu.com/js/popup.js';
      script.id = 'paychangu-script';
      document.head.appendChild(script);

      // Cleanup function to remove the script when the component unmounts
      return () => {
        const existingScript = document.getElementById('paychangu-script');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, []); // The empty dependency array ensures this runs only once

  // Function to initiate PayChangu Payment
  const onCheckout = async () => {
    setIsLoading(true);
    setError(null); // Reset error state

    const payChanguKey = process.env.NEXT_PUBLIC_PAYCHANGU_KEY;
    if (!payChanguKey) {
      console.error("PayChangu public key is missing.");
      setError("Payment configuration is incorrect.");
      setIsLoading(false);
      return;
    }

    try {
      await PaychanguCheckout({
        public_key: payChanguKey,
        tx_ref: Math.floor(Math.random() * 1000000000).toString(),
        amount: totalAmount,
        currency: "USD",
        callback_url: `${window.location.origin}/api/paychangu-callback`,
        return_url: `${window.location.origin}/success`, 
        customer: {
          email: "customer@example.com", // Replace with dynamic user data
          first_name: "John", // Replace with dynamic user data
          last_name: "Doe" // Replace with dynamic user data
        },
        customization: {
          title: "Order Payment",
          description: "Complete your order"
        },
        meta: {
          order_id: "12345", // Example metadata for tracking
          note: "Order payment"
        }
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError("Payment initiation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">
        Order summary
      </h2>

      {error && <div className="text-red-500">{error}</div>} {/* Display error message */}

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">{formattedTotalPrice}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">
            {formatCurrencyString({ value: totalAmount, currency: "USD" })}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button onClick={onCheckout} className="w-full" disabled={isDisabled}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Processing..." : "Pay with PayChangu"}
        </Button>
      </div>
    </section>
  );
}
