# Bethel Halal Meats

Fresh. Halal. Delivered to your door.

A halal butchery and meat delivery website for Nairobi, built on top of the uploaded MeatKing template. Beef, goat, chicken, lamb, offal and sausages can be ordered by cut and weight, paid for with M-Pesa or cash on delivery, and delivered the same day across eight Nairobi zones.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4.2 (App Router, Turbopack build) |
| UI | React 19.2.0, Tailwind CSS 4.1.10, Framer Motion 12.18.0, GSAP 3.12.7, Lenis 1.3.4 |
| Language | TypeScript 5.8.3 |
| Auth | next-auth 5.0.0-beta.32 (credentials plus Google) |
| Validation | zod 3.25.67 with react-hook-form 7.57.0 |
| Storage | localStorage basket, optional Vercel KV for orders and users |
| Files | Vercel Blob token reserved for future product uploads |
| Mail | nodemailer 10.1.7 |
| PDF | jsPDF 4.2.1 |
| Analytics | Vercel Analytics and Speed Insights |
| Node | 24 (.nvmrc) |

## Getting started

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The site runs at http://localhost:3000.

### Preview account

When KV storage is not configured, user accounts live in memory and a demo account is seeded:

```
demo@bethelhalalmeats.co.ke
BethelDemo1
```

Orders are stored in memory in that mode, so they reset when the dev server restarts.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values you use. Nothing is required to browse the site or place an order in preview mode.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, prefilled as 254112272061 |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA server key. When empty, captcha checks are skipped |
| `NEXTAUTH_SECRET` | Session signing secret |
| `NEXTAUTH_URL` | Auth base URL |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth. The Google button only renders when both are set |
| `PEXELS_API_KEY` | Reserved for image search. Images are served locally |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Enables persistent users and orders |
| `BLOB_READ_WRITE_TOKEN` | Reserved for product image uploads |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Contact form email. Without these the message is logged |

## Routes

### Pages

`/`, `/shop`, `/shop/[slug]`, `/cart`, `/checkout`, `/order-confirmation`, `/account`, `/auth/signin`, `/auth/signup`, `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, plus branded `not-found`, `error` and `global-error` screens and a route level `loading`.

### API

| Route | Method | Notes |
|---|---|---|
| `/api/products` | GET | Filters by category, cut, weight, minPrice, maxPrice, q |
| `/api/products/[slug]` | GET | Full detail plus related products |
| `/api/cart/add` | POST | Validates a line and returns the priced item for localStorage |
| `/api/orders/create` | POST | zod validated, captcha verified, returns an order reference |
| `/api/orders/[ref]` | GET | Session gated, owner only |
| `/api/orders` | GET | Session gated list for the account page |
| `/api/contact` | POST | Captcha verified, nodemailer |
| `/api/recaptcha/verify` | POST | Server side token verification |
| `/api/auth/[...nextauth]` | GET, POST | Auth handlers |
| `/api/auth/signup` | POST | Credentials registration |

## Project structure

```
app/                 routes, API handlers, metadata, sitemap, robots
components/          header, footer, cart drawer, preloader, consent, voice tour, forms
lib/                 products, cart store, orders, users, validation, recaptcha, mailer
auth.ts              next-auth configuration
public/images/       Pexels photography, credits in image-credits.md
public/css, public/fonts  FontAwesome from the original template
css/, fonts/, img/, icons/, js/, index.html  original MeatKing template, untouched
```

## Template preservation

The uploaded zip was a static Bootstrap 3 restaurant theme with no package manifest, routes, API layer, environment file, loader, consent banner, captcha or legal pages.

Every original file is kept at the repository root exactly as supplied: `index.html`, `css/*.css`, `fonts/*`, `icons/svg 2/*`, `img/**`, `js/**`, `LICENSE` and this README's original section below.

The template declared **zero CSS custom properties** and **two @font-face rules**:

1. FontAwesome 4.3.0 in `css/font-awesome.min.css`, reproduced unchanged and copied to `public/css/font-awesome.min.css` with its font files in `public/fonts/`.
2. Glyphicons Halflings in `css/bootstrap.min.css`. The font files were missing from the zip. The rule is reproduced verbatim in `public/css/legacy-fonts.css` without alteration.

Kreon, the template's body font, is loaded locally from `@fontsource/kreon` at weights 300 to 700, replacing the original insecure `http://fonts.googleapis.com` link. The new interface reuses the template palette: `#ed0121` red, `#F0A830` amber, `#212d39` charcoal, `#fbfbfb` light and `#2e2e2e` ink. Design tokens are added in `app/globals.css` without changing any original value.

## Interaction notes

- GSAP: hero character reveal and add to cart confirmation pulse.
- Framer Motion: category stagger, cart drawer slide in, trust badge fade in, receipt scale reveal.
- CSS: product image zoom on hover, delivery zone highlight, WhatsApp entrance pulse.
- Lenis: smooth scrolling, disabled under `prefers-reduced-motion`.
- Loading screen: three second ceiling, skip after one second, once per session, plain percentage text under reduced motion.
- Voice tour: Web Speech API at rate 0.92, pitch 1.05, `en-KE`. Never autoplays.
- Cookie consent: `bethel_halal_consent` with necessary, functional, analytics and marketing categories.

## Build verification

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

Dependency notes:

- `@vercel/blob` is set to 2.8.2 because 0.29.4 is not published on npm.
- `motion-dom` and `motion-utils` are pinned in `overrides` because later 12.x releases removed an export that framer-motion 12.18.0 imports.
- `next-auth`, `nodemailer` and `jspdf` were moved to 5.0.0-beta.32, 10.1.7 and 4.2.1 to clear the high and critical advisories that affect the originally requested versions. With those three patches, `npm audit --audit-level=high` reports zero vulnerabilities. Every other version is exactly as specified.

## Original template

```
MeatKing
========

Restaurant Theme based on Twitter Bootstrap 3
```
