import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Add your delivery details and pay with M-Pesa or cash on delivery.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="bh-container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
        <Link href="/cart" className="hover:text-bethel-red">
          Basket
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bethel-charcoal">Checkout</span>
      </nav>

      <div className="mt-4 border-b border-bethel-line pb-8">
        <p className="bh-eyebrow">Two minutes</p>
        <h1 className="bh-title bh-rule-left mt-3">Checkout</h1>
        <p className="max-w-xl text-bethel-ink/70">
          Confirm where the order goes, tell the butcher how you want it cut, and choose how you
          would like to pay.
        </p>
      </div>

      <div className="mt-8">
        <CheckoutClient />
      </div>
    </div>
  );
}
