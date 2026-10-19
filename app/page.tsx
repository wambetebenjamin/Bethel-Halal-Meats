import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Leaf,
  MapPin,
  MessageCircle,
  PartyPopper,
  Scissors,
  Truck,
  Users,
} from "lucide-react";
import { HeroHeading } from "@/components/HeroHeading";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { QuoteForm } from "@/components/QuoteForm";
import { CATEGORIES, getBestSellers } from "@/lib/products";
import { DELIVERY_ZONES, SITE, whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/format";

const TRUST_BADGES = [
  { icon: BadgeCheck, title: "Halal Certified", copy: "Certified at the abattoir and checked again in store." },
  { icon: Leaf, title: "Farm Fresh", copy: "Cut to order each morning, never held overnight." },
  { icon: Truck, title: "Same-Day Delivery", copy: "Packed cold and sent out across Nairobi." },
  { icon: Scissors, title: "Free Cut of Choice", copy: "Any cut, cubed, sliced or boned at no charge." },
];

const TESTIMONIALS = [
  {
    quote:
      "The goat shoulder arrived cubed exactly as I asked and still cold. It was on the grill within an hour of delivery.",
    name: "Wanjiru M.",
    area: "Westlands",
  },
  {
    quote:
      "I order for our staff kitchen every Thursday. The invoice is clear, the weights are honest and the driver calls ahead.",
    name: "Yusuf A.",
    area: "South B",
  },
  {
    quote:
      "We used Bethel for a wedding of 180 guests. The team helped us work out the kilos and delivered on the morning itself.",
    name: "Grace N.",
    area: "Kasarani",
  },
];

const CUSTOM_ORDERS = [
  {
    icon: Users,
    title: "Bulk family orders",
    copy: "Ten kilos and above, packed in meal sized portions and labelled for the freezer.",
  },
  {
    icon: PartyPopper,
    title: "Wedding orders",
    copy: "Whole carcasses and mixed platters, planned by the kilo with your caterer.",
  },
  {
    icon: Building2,
    title: "Event catering",
    copy: "Choma nights, birthdays and corporate functions with chilled delivery on site.",
  },
  {
    icon: MessageCircle,
    title: "Corporate supply",
    copy: "Standing weekly orders for staff kitchens, hotels and restaurants across Nairobi.",
  },
];

export default function HomePage() {
  const bestSellers = getBestSellers().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-bethel-clay">
        <Image
          src="/images/hero-butcher.jpg"
          alt="A butcher cutting fresh halal meat at a market counter in East Africa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#241207]/92 via-[#2b1a11]/72 to-[#3a2418]/30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bethel-cream to-transparent" />

        <div className="bh-container relative z-10 grid gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div className="max-w-xl text-bethel-cream">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-bethel-amber-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-bethel-amber" />
              Halal butchery, Nairobi
            </p>

            <HeroHeading
              lines={["Fresh. Halal.", "Delivered to", "your door."]}
              className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.2rem]"
            />

            <p className="mt-5 max-w-md text-base leading-relaxed text-bethel-cream/85 sm:text-lg">
              Beef, goat, chicken and lamb, cut to your weight by our butchers each morning and
              packed cold for same day delivery across Nairobi.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="bh-btn bh-btn-primary px-6 py-3.5">
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shop#catalogue" className="bh-btn bh-btn-cream px-6 py-3.5">
                View Menu
              </Link>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-bethel-cream/60">
              Free delivery on orders over {formatKES(SITE.freeDeliveryThreshold)}
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-x-0 bottom-2 rounded-2xl border border-white/20 bg-[#fff8ee]/95 p-5 shadow-2xl backdrop-blur">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-bethel-clay-soft">
                On the counter today
              </p>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  { name: "Beef ribeye", price: 1600, note: "Hand trimmed" },
                  { name: "Goat shoulder", price: 950, note: "Bone in, cubed" },
                  { name: "Lamb chops", price: 1700, note: "French trimmed" },
                ].map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-3">
                    <span>
                      <span className="block font-semibold text-bethel-charcoal">{item.name}</span>
                      <span className="text-xs text-bethel-ink/60">{item.note}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-bethel-red">
                      {formatKES(item.price)}
                      <span className="text-[0.65rem] font-normal text-bethel-ink/60"> /kg</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-bethel-red hover:underline"
              >
                Shop the counter
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section aria-label="Why buy from Bethel Halal Meats" className="border-b border-bethel-line bg-bethel-cream">
        <div className="bh-container py-8">
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <StaggerItem key={badge.title}>
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-bethel-line bg-[#fffdf9] px-4 py-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bethel-sand text-bethel-clay">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-bethel-charcoal">{badge.title}</p>
                      <p className="mt-0.5 text-xs leading-snug text-bethel-ink/65">{badge.copy}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bh-container py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="bh-eyebrow">Shop by animal</p>
          <h2 className="bh-title bh-rule mt-3">Meat categories</h2>
          <p className="text-bethel-ink/70">
            Six counters, one standard. Every cut is weighed in front of you, labelled with its cut
            and packed on ice for the trip home.
          </p>
        </Reveal>

        <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <StaggerItem key={category.slug}>
              <article className="group relative h-full overflow-hidden rounded-[18px] border border-bethel-line bg-bethel-charcoal shadow-[var(--shadow-card)]">
                <div className="relative aspect-[5/4] w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241207]/90 via-[#241207]/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-bethel-cream">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-1 max-w-xs text-sm leading-snug text-bethel-cream/80">
                    {category.blurb}
                  </p>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-bethel-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-bethel-clay transition hover:bg-white"
                  >
                    Shop This Category
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Best sellers */}
      <section className="bg-bethel-sand/45 py-16 sm:py-20">
        <div className="bh-container">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="bh-eyebrow">Ordered most this week</p>
              <h2 className="bh-title bh-rule-left mt-3">Best sellers</h2>
              <p className="max-w-lg text-bethel-ink/70">
                The cuts our Nairobi customers come back for, priced per kilo with a one kilo pack
                ready to add to your basket.
              </p>
            </div>
            <Link href="/shop" className="bh-btn bh-btn-outline shrink-0">
              See the full catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Halal promise */}
      <section id="our-halal-promise" className="bh-container py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-[22px] border border-bethel-line">
              <Image
                src="/images/butcher-portrait.jpg"
                alt="A halal butcher preparing cuts at a market counter"
                width={563}
                height={750}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#fffdf9]/95 px-4 py-3 shadow-lg">
                <p className="text-xs uppercase tracking-[0.16em] text-bethel-clay-soft">
                  Our standard
                </p>
                <p className="text-sm font-semibold text-bethel-charcoal">
                  One certification, checked at every step
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="bh-eyebrow">Our halal promise</p>
            <h2 className="bh-title bh-rule-left mt-3">From farm to table, without shortcuts</h2>
            <p className="mt-2 text-bethel-ink/75">
              We buy from named farms in Laikipia, Kajiado, Kitui and Kiambu, and every animal is
              slaughtered at a licensed halal abattoir under the supervision of a trained Muslim
              slaughterer. The Shahada is recited over each animal, the knife is sharp, and the
              welfare checks happen before the animal is laid down.
            </p>
            <p className="mt-4 text-bethel-ink/75">
              In the butchery, our team keeps halal and non halal tools, boards and storage
              completely separate. Nothing is sold as halal unless it carries the certificate, and
              the certificate is displayed on the counter for anyone who asks. Cold chain records
              travel with every delivery.
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { term: "Sourcing", detail: "Named farms, traceable batches, no brokers." },
                { term: "Slaughter", detail: "Licensed halal abattoir, hand slaughtered daily." },
                { term: "Certification", detail: "Certificate displayed and checked each quarter." },
              ].map((item) => (
                <div key={item.term} className="rounded-xl border border-bethel-line bg-[#fffdf9] p-3.5">
                  <dt className="text-xs uppercase tracking-[0.14em] text-bethel-red">{item.term}</dt>
                  <dd className="mt-1 text-sm leading-snug text-bethel-ink/75">{item.detail}</dd>
                </div>
              ))}
            </dl>

            <Link href="/shop" className="bh-btn bh-btn-dark mt-7">
              Order with confidence
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Delivery zones */}
      <section id="delivery-zones" className="bg-bethel-charcoal py-16 text-bethel-cream sm:py-20">
        <div className="bh-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="bh-eyebrow text-bethel-amber-soft">Delivery zones</p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.85rem)] font-semibold leading-tight text-bethel-cream">
              Across Nairobi, same day
            </h2>
            <p className="mt-4 max-w-md text-bethel-cream/75">
              Orders placed before 3pm go out the same day. Each zone has a flat fee, and delivery
              is free once your basket passes {formatKES(SITE.freeDeliveryThreshold)}. Our rider
              calls when they reach your gate.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-bethel-cream/75">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-bethel-amber" />
                Chilled van and insulated bags on every route
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-bethel-amber" />
                Delivery fee confirmed before you pay
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-bethel-amber" />
                Pickup from the Kangundo Road counter is free
              </li>
            </ul>
            <a
              href={whatsappLink("Hello Bethel Halal Meats, I would like to confirm delivery to my area.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bh-btn bh-btn-cream mt-7"
            >
              <MessageCircle className="h-4 w-4" />
              Ask about your area
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {DELIVERY_ZONES.map((zone) => (
                <li
                  key={zone.slug}
                  className="bh-zone-row flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3"
                >
                  <span className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bethel-amber" />
                    <span>
                      <span className="block text-sm font-semibold text-bethel-cream">{zone.name}</span>
                      <span className="block text-[0.7rem] leading-snug text-bethel-cream/55">
                        {zone.note}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-bethel-amber-soft">
                      {formatKES(zone.fee)}
                    </span>
                    <span className="block text-[0.65rem] text-bethel-cream/50">{zone.eta}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-bethel-cream/50">
              Outside these areas? Message us on WhatsApp and we will quote a rider.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Custom orders */}
      <section id="custom-orders" className="bh-container py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[22px] border border-bethel-line">
              <Image
                src="/images/grilled-meat.jpg"
                alt="A street vendor grilling marinated meat over charcoal in Kenya"
                width={563}
                height={750}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="bh-eyebrow">Custom orders</p>
              <h2 className="bh-title bh-rule-left mt-3">Feeding a crowd? Start with a plan</h2>
              <p className="text-bethel-ink/70">
                Tell us the headcount and the menu and we will work out the kilos, the cuts and a
                delivery window that fits your kitchen. Bulk pricing starts at ten kilos.
              </p>
            </Reveal>

            <StaggerGroup className="mt-6 grid gap-3 sm:grid-cols-2">
              {CUSTOM_ORDERS.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full rounded-2xl border border-bethel-line bg-[#fffdf9] p-4">
                      <Icon className="h-5 w-5 text-bethel-red" strokeWidth={1.7} />
                      <h3 className="mt-2 text-base font-semibold text-bethel-charcoal">{item.title}</h3>
                      <p className="mt-1 text-sm leading-snug text-bethel-ink/70">{item.copy}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(
                  "Hello Bethel Halal Meats, I would like a quote for a bulk or event meat order.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bh-btn bh-btn-primary"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp for a quote
              </a>
              <span className="text-sm text-bethel-ink/60">
                Or call {SITE.whatsappDisplay}
              </span>
            </div>

            <Reveal>
              <QuoteForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-bethel-sand/45 py-16 sm:py-20">
        <div className="bh-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="bh-eyebrow">From our customers</p>
            <h2 className="bh-title bh-rule mt-3">What Nairobi says</h2>
          </Reveal>

          <StaggerGroup className="mt-9 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <StaggerItem key={item.name}>
                <figure className="flex h-full flex-col rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 shadow-[var(--shadow-card)]">
                  <blockquote className="flex-1 text-[0.98rem] leading-relaxed text-bethel-ink/80">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-bethel-line pt-4">
                    <span className="block text-sm font-semibold text-bethel-charcoal">{item.name}</span>
                    <span className="block text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
                      {item.area}, Nairobi
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bh-container py-16 sm:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-[24px] border border-bethel-line bg-bethel-sand px-6 py-10 text-center sm:px-12">
            <p className="bh-eyebrow justify-center">Ready when you are</p>
            <h2 className="mx-auto mt-3 max-w-xl text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-tight text-bethel-charcoal">
              Choose your cuts, pick a weight, and we will do the rest
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-bethel-ink/70">
              Pay with M-Pesa or cash on delivery. A butcher checks every order before it leaves the
              counter.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="bh-btn bh-btn-primary px-6 py-3.5">
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bh-btn bh-btn-outline px-6 py-3.5"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
