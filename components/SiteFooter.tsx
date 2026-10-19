import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { BrandMark } from "./BrandMark";
import {
  FOOTER_CATEGORIES,
  LEGAL_LINKS,
  SITE,
  WHATSAPP_LINK,
  whatsappLink,
} from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-bethel-clay text-bethel-cream">
      <div className="bh-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-12 w-12" />
            <div>
              <p className="text-lg font-semibold">{SITE.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-bethel-amber-soft">
                Halal butchery, Nairobi
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bethel-cream/80">
            {SITE.tagline} Cut to order, packed cold and sent out across Nairobi the same day.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bh-btn bh-btn-primary mt-5 px-4 py-2.5 text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-bethel-amber-soft">
            Shop by category
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_CATEGORIES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-bethel-amber-soft">
            Delivery and orders
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/#delivery-zones"
                className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Delivery zones and fees
              </Link>
            </li>
            <li>
              <Link
                href="/#custom-orders"
                className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Bulk, wedding and event orders
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Your basket
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
              >
                Order history
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm text-bethel-cream/70">{SITE.hours}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-bethel-amber-soft">
            Talk to the butchery
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-bethel-cream/85 transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2 text-bethel-cream/70">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{SITE.address}</span>
            </li>
          </ul>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-bethel-amber-soft">
            Legal
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-bethel-cream/80 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="bh-container flex flex-col gap-2 py-5 text-xs text-bethel-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {SITE.name}. Halal certified. Serving {SITE.serviceArea}.
          </p>
          <p>Photography sourced from Pexels under the free licence.</p>
        </div>
      </div>
    </footer>
  );
}
