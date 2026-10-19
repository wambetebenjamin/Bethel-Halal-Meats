import type { Metadata, Viewport } from "next";
import "@fontsource/kreon/latin-300.css";
import "@fontsource/kreon/latin-400.css";
import "@fontsource/kreon/latin-500.css";
import "@fontsource/kreon/latin-600.css";
import "@fontsource/kreon/latin-700.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { CookieConsent } from "@/components/CookieConsent";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { VoiceTour } from "@/components/VoiceTour";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SITE } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bethelhalalmeats.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Bethel Halal Meats is an online halal butchery in Nairobi. Order beef, goat, chicken, lamb, offal and sausages by cut and weight for same day delivery.",
  keywords: [
    "halal butchery Nairobi",
    "halal meat delivery Nairobi",
    "goat meat Nairobi",
    "beef delivery Kenya",
    "halal certified meat Kenya",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description:
      "Halal certified beef, goat, chicken and lamb, cut to order and delivered across Nairobi the same day.",
    images: [{ url: "/images/hero-butcher.jpg", width: 1125, height: 750, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: "Halal certified meat, cut to order and delivered across Nairobi.",
    images: ["/images/hero-butcher.jpg"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fff8ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Butcher",
    name: SITE.name,
    image: `${siteUrl}/images/hero-butcher.jpg`,
    description: SITE.description,
    telephone: `+${SITE.whatsappNumber}`,
    priceRange: "KES",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kangundo Road",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    areaServed: SITE.serviceArea,
    servesCuisine: "Halal meat",
    openingHours: "Mo-Sa 06:30-20:00, Su 08:00-16:00",
  };

  return (
    <html lang="en-KE">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('bethel_halal_visited')==='1'){document.documentElement.dataset.bhVisited='1'}}catch(e){}",
          }}
        />
        <noscript>
          <style>{`.bh-preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-bethel-cream text-bethel-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-full focus:bg-bethel-charcoal focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <SmoothScroll />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <CookieConsent />
          <VoiceTour />
          <WhatsAppButton />
        </Providers>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
