"use client";

import { useState } from "react";

type QuickBuyButtonProps = {
  itemId: string;
  disabled?: boolean;
};

export default function QuickBuyButton({
  itemId,
  disabled = false,
}: QuickBuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleBuyNow() {
    if (disabled) return;

    try {
      setIsLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (!res.ok) {
  console.error("Checkout API error:", data);
  throw new Error(JSON.stringify(data) || "Unable to start checkout.");
}

      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Quick buy error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong starting checkout."
      );
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={disabled || isLoading}
      className="rounded-2xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Redirecting..." : "Buy Now"}
    </button>
  );
}