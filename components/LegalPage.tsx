import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_LINKS, SITE } from "@/lib/site";

export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="bh-container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
        <Link href="/" className="hover:text-bethel-red">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bethel-charcoal">Legal</span>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-4 lg:sticky lg:top-[calc(var(--bh-header-height)+1rem)]">
          <p className="text-[0.65rem] uppercase tracking-[0.16em] text-bethel-clay-soft">Legal pages</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-2 py-1.5 transition ${
                    item.label === title
                      ? "bg-bethel-sand font-semibold text-bethel-charcoal"
                      : "text-bethel-ink/70 hover:bg-bethel-sand/60 hover:text-bethel-charcoal"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-bethel-line pt-3 text-xs leading-relaxed text-bethel-ink/60">
            Questions about this page? WhatsApp {SITE.whatsappDisplay} or email {SITE.email}.
          </p>
        </aside>

        <article>
          <p className="bh-eyebrow">Legal</p>
          <h1 className="bh-title bh-rule-left mt-3">{title}</h1>
          <p className="text-bethel-ink/70">{intro}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-bethel-clay-soft">
            Last updated {updated}
          </p>
          <div className="bh-prose mt-6">{children}</div>
        </article>
      </div>
    </div>
  );
}
