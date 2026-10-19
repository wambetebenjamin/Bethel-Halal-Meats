"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, RotateCcw } from "lucide-react";
import { CleaverIcon } from "@/components/BrandMark";
import { SITE, WHATSAPP_LINK } from "@/lib/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Bethel Halal Meats error boundary:", error);
  }, [error]);

  return (
    <section className="bh-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bethel-sand">
        <CleaverIcon className="h-11 w-11" />
      </span>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-bethel-clay-soft">Error 500</p>
      <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-bethel-charcoal">
        Something went wrong in the kitchen.
      </h1>
      <p className="mt-3 max-w-md text-bethel-ink/70">
        We could not load this page. Try again, or message the butchery on WhatsApp and we will take
        your order by hand.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="bh-btn bh-btn-primary">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bh-btn bh-btn-outline"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp {SITE.whatsappDisplay}
        </a>
        <Link href="/shop" className="bh-btn bh-btn-outline">
          Back to Shop
        </Link>
      </div>
    </section>
  );
}
