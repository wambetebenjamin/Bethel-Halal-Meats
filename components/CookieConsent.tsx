"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useUI } from "@/lib/ui";

const STORAGE_KEY = "bethel_halal_consent";
const VERSION = 1;

type Consent = {
  version: number;
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed.version !== VERSION) return null;
    return {
      version: VERSION,
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      savedAt: parsed.savedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeConsent(consent: Omit<Consent, "version" | "necessary" | "savedAt">) {
  const payload: Consent = {
    version: VERSION,
    necessary: true,
    savedAt: new Date().toISOString(),
    ...consent,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // storage can be blocked, the banner will simply show again next visit
  }
}

const TOGGLES = [
  {
    key: "necessary" as const,
    label: "Necessary",
    description: "Basket, checkout and security. These cannot be switched off.",
  },
  {
    key: "functional" as const,
    label: "Functional",
    description: "Saved delivery addresses and favourite cuts on this device.",
  },
  {
    key: "analytics" as const,
    label: "Analytics",
    description: "Anonymous page counts that show us which cuts are popular.",
  },
  {
    key: "marketing" as const,
    label: "Marketing",
    description: "Lets us measure WhatsApp and campaign links. Off by default.",
  },
];

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const setConsentBannerOpen = useUI((state) => state.setConsentBannerOpen);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setFunctional(stored.functional);
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      setConsentBannerOpen(false);
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [setConsentBannerOpen]);

  useEffect(() => {
    setConsentBannerOpen(open);
    return () => setConsentBannerOpen(false);
  }, [open, setConsentBannerOpen]);

  function save(next: { functional: boolean; analytics: boolean; marketing: boolean }) {
    writeConsent(next);
    setFunctional(next.functional);
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9996] px-3 pb-3 sm:px-5 sm:pb-5">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-title"
        className="mx-auto max-w-3xl rounded-2xl border border-bethel-line bg-[#fffdf9] p-5 shadow-[0_30px_60px_-30px_rgba(58,36,24,0.6)]"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bethel-sand text-bethel-clay">
            <Cookie className="h-4.5 w-4.5" />
          </span>
          <div className="flex-1">
            <h2 id="cookie-title" className="text-base font-semibold text-bethel-charcoal">
              Cookies and your data
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-bethel-ink/75">
              We use cookies to keep your basket, remember your delivery address and understand how
              the shop is used. Under the Kenya Data Protection Act 2019 you choose what we may
              store. Read the{" "}
              <Link
                href="/legal/cookie-policy"
                className="text-bethel-red underline underline-offset-2"
              >
                cookie policy
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => save({ functional: false, analytics: false, marketing: false })}
            className="text-bethel-ink/45 transition hover:text-bethel-charcoal"
            aria-label="Dismiss and keep only necessary cookies"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {TOGGLES.map((toggle) => {
            const checked =
              toggle.key === "necessary"
                ? true
                : toggle.key === "functional"
                  ? functional
                  : toggle.key === "analytics"
                    ? analytics
                    : marketing;
            const disabled = toggle.key === "necessary";
            return (
              <label
                key={toggle.key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-bethel-line px-3 py-2.5 text-sm transition hover:border-bethel-sand-deep"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={(event) => {
                    if (toggle.key === "functional") setFunctional(event.target.checked);
                    if (toggle.key === "analytics") setAnalytics(event.target.checked);
                    if (toggle.key === "marketing") setMarketing(event.target.checked);
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#ed0121]"
                />
                <span>
                  <span className="block font-semibold text-bethel-charcoal">{toggle.label}</span>
                  <span className="block text-xs leading-snug text-bethel-ink/65">
                    {toggle.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => save({ functional: false, analytics: false, marketing: false })}
            className="bh-btn bh-btn-outline px-4 py-2 text-sm"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => save({ functional, analytics, marketing })}
            className="bh-btn bh-btn-outline px-4 py-2 text-sm"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={() => save({ functional: true, analytics: true, marketing: true })}
            className="bh-btn bh-btn-primary px-4 py-2 text-sm"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
