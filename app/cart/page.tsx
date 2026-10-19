import type { Metadata } from "next";
import Link from "next/link";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Your basket",
  description: "Review your halal meat order, choose a delivery zone and continue to checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="bh-container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
        <Link href="/" className="hover:text-bethel-red">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-bethel-red">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bethel-charcoal">Basket</span>
      </nav>

      <div className="mt-4 border-b border-bethel-line pb-8">
        <p className="bh-eyebrow">Almost there</p>
        <h1 className="bh-title bh-rule-left mt-3">Shopping cart</h1>
        <p className="max-w-xl text-bethel-ink/70">
          Adjust quantities, remove anything you changed your mind about, and choose a delivery zone
          to see the fee before you check out.
        </p>
      </div>

      <div className="mt-8">
        <CartClient />
      </div>
    </div>
  );
}
