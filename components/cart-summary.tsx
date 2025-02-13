"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import { Button } from "@/components/ui/button";
import Script from "next/script"; // Import Next.js Script component

export function CartSummary() {
  const { formattedTotalPrice, totalPrice, cartDetails, cartCount } =
    useShoppingCart();
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = isLoading || cartCount! === 0;
  const totalAmount = totalPrice!;

  async function onCheckout() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartDetails),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to the PayChangu payment page
        window.location.href = data.url;
      } else {
        console.error("Failed to initiate payment:", data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">Order summary</h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">{formattedTotalPrice}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">
            {formatCurrencyString({ value: totalAmount, currency: "MWK" })}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button onClick={onCheckout} className="w-full" disabled={isDisabled}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Checkout"}
        </Button>
      </div>

      {/* PayChangu Script */}
      <Script
        src="https://in.paychangu.com/js/popup.js"
        strategy="afterInteractive" 
      />
    </section>
  );
}
