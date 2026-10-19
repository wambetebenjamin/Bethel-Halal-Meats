import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "How Bethel Halal Meats uses cookies and local storage, and how to change your choices under the Kenya Data Protection Act 2019.",
  alternates: { canonical: "/legal/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="This page lists what we store on your device, why we store it and how you can change your mind."
      updated="19 October 2026"
    >
      <h2>Your choice</h2>
      <p>
        When you first visit, a banner asks which categories of storage you allow. Necessary storage
        is always on because the basket and checkout cannot work without it. Functional, analytics
        and marketing storage stay off until you switch them on. Your choice is saved in local
        storage under the key <strong>bethel_halal_consent</strong>.
      </p>

      <h2>Necessary storage</h2>
      <ul>
        <li>
          <strong>bethel_halal_cart</strong> keeps the cuts, weights and quantities in your basket.
        </li>
        <li>
          <strong>bethel_halal_last_order</strong> keeps your order summary for the confirmation page
          during this browser session.
        </li>
        <li>
          <strong>bethel_halal_visited</strong> remembers that the loading screen has already played
          in this session.
        </li>
        <li>
          <strong>Authentication cookies</strong> keep you signed in to your account. These are set
          only when you choose to sign in.
        </li>
      </ul>

      <h2>Functional storage</h2>
      <ul>
        <li>
          <strong>bethel_halal_addresses</strong> saves delivery addresses you add on your account
          page so you can reuse them.
        </li>
        <li>
          <strong>bethel_halal_favourites</strong> saves the cuts you mark with a heart.
        </li>
      </ul>

      <h2>Analytics</h2>
      <p>
        If you allow analytics, Vercel Analytics and Speed Insights record anonymous page views and
        performance timings. They do not receive your name, phone number or address. If you decline,
        no analytics scripts run.
      </p>

      <h2>Marketing</h2>
      <p>
        Marketing storage is off by default. We do not run advertising pixels on this site. If we add
        campaign measurement later, it will only run after you switch marketing on.
      </p>

      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Google reCAPTCHA</strong> runs on forms to stop automated orders. Google may set
          cookies as part of that check. See Google&apos;s privacy policy for details.
        </li>
        <li>
          <strong>M-Pesa</strong> processes payments outside this website. Payment prompts are handled
          by Safaricom and are not controlled by us.
        </li>
      </ul>

      <h2>How long storage lasts</h2>
      <p>
        The consent record is kept for twelve months or until you change it. Basket contents last
        until you clear the basket or your browser data. Favourite and address records last until you
        delete them. Session storage clears when you close the browser tab.
      </p>

      <h2>Changing your choice</h2>
      <p>
        Clear this site&apos;s data in your browser settings and the consent banner will appear again
        on your next visit. You can also email {SITE.email} and ask us to record a new choice for any
        account you hold.
      </p>

      <h2>More information</h2>
      <p>
        Our <a href="/legal/privacy-policy">privacy policy</a> explains your wider rights under the
        Kenya Data Protection Act 2019, including how to complain to the Office of the Data
        Protection Commissioner.
      </p>
    </LegalPage>
  );
}
