"use client";

import { useState } from "react";

type BuyNowButtonProps = {
  itemId: string;
  sellerReady: boolean;
};

export default function BuyNowButton({
  itemId,
  sellerReady,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleBuyNow() {
    if (!sellerReady) return;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong starting checkout."
      );
      setIsLoading(false);
    }
  }

  if (!sellerReady) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-6 py-4 text-amber-300">
        Seller is setting up payouts. This item will be available soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isLoading}
        className="rounded-2xl bg-green-500 px-6 py-4 font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Redirecting to Checkout..." : "Buy Now"}
      </button>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}