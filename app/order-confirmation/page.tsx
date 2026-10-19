import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your Bethel Halal Meats order reference, delivery window and receipt.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <div className="bh-container py-10 sm:py-14">
      <div className="border-b border-bethel-line pb-8">
        <p className="bh-eyebrow">Order confirmed</p>
        <h1 className="bh-title bh-rule-left mt-3">Your order is with the butchery</h1>
        <p className="max-w-xl text-bethel-ink/70">
          We have your cuts, your address and your payment choice. Keep the reference below for any
          follow up on WhatsApp.
        </p>
      </div>

      <div className="mt-8">
        <OrderConfirmationClient />
      </div>
    </div>
  );
}
