import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { CleaverIcon } from "@/components/BrandMark";
import { SITE, WHATSAPP_LINK } from "@/lib/site";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="bh-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bethel-sand">
        <CleaverIcon className="h-11 w-11" />
      </span>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-bethel-clay-soft">Error 404</p>
      <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-bethel-charcoal">
        This cut does not exist.
      </h1>
      <p className="mt-3 max-w-md text-bethel-ink/70">
        The page you asked for has been trimmed away. Head back to the counter and choose from the
        cuts we have today.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="bh-btn bh-btn-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bh-btn bh-btn-outline"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp {SITE.whatsappDisplay}
        </a>
      </div>
    </section>
  );
}
