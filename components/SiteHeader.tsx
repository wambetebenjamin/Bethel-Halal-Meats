"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBasket, UserRound, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { useCart, cartCount } from "@/lib/cart";
import { NAV_LINKS, SITE, WHATSAPP_LINK } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  const openDrawer = useCart((state) => state.openDrawer);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-[9990]">
      <div className="bg-bethel-charcoal text-bethel-cream">
        <div className="bh-container flex h-9 items-center justify-between gap-4 text-[0.7rem] tracking-[0.08em] uppercase">
          <p className="truncate">
            Same day delivery in Nairobi. Free over KES {SITE.freeDeliveryThreshold.toLocaleString("en-KE")}.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 text-bethel-amber-soft transition hover:text-white sm:block"
          >
            WhatsApp {SITE.whatsappDisplay}
          </a>
        </div>
      </div>

      <div className="border-b border-bethel-line bg-bethel-cream/95 backdrop-blur supports-[backdrop-filter]:bg-bethel-cream/85">
        <div className="bh-container flex h-[var(--bh-header-height)] items-center justify-between gap-3">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE.name} home`}>
            <BrandMark className="h-11 w-11 transition-transform duration-300 group-hover:rotate-[-6deg]" />
            <span className="leading-tight">
              <span className="block font-semibold text-lg tracking-tight text-bethel-charcoal">
                Bethel Halal Meats
              </span>
              <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-bethel-clay-soft">
                Nairobi butchery
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-bethel-sand text-bethel-charcoal"
                      : "text-bethel-ink/80 hover:bg-bethel-sand/70 hover:text-bethel-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-bethel-charcoal transition hover:bg-bethel-sand sm:flex"
              aria-label="Your account"
            >
              <UserRound className="h-5 w-5" strokeWidth={1.7} />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-bethel-charcoal transition hover:bg-bethel-sand"
              aria-label={`Open basket, ${count} items`}
            >
              <ShoppingBasket className="h-5 w-5" strokeWidth={1.7} />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-bethel-red px-1 text-[0.65rem] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>

            <Link href="/shop" className="bh-btn bh-btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
              Order now
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-bethel-charcoal transition hover:bg-bethel-sand lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div id="mobile-nav" className="border-t border-bethel-line bg-bethel-cream lg:hidden">
            <nav aria-label="Mobile" className="bh-container flex flex-col py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-3 text-base text-bethel-charcoal transition hover:bg-bethel-sand/70"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/shop" className="bh-btn bh-btn-primary mt-3">
                Order now
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
