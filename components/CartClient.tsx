"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatKES } from "@/lib/format";
import { DELIVERY_ZONES, SITE, findZone } from "@/lib/site";

export function CartClient() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  const zone = useCart((state) => state.zone);
  const setZone = useCart((state) => state.setZone);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);

  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(items);
  const selectedZone = findZone(zone);
  const deliveryFee =
    subtotal >= SITE.freeDeliveryThreshold ? 0 : selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-2xl bg-bethel-sand/50" aria-hidden="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] px-6 py-14 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bethel-sand">
          <ShoppingBasket className="h-7 w-7 text-bethel-clay" strokeWidth={1.5} />
        </span>
        <h2 className="mt-5 text-2xl font-semibold text-bethel-charcoal">Your basket is empty</h2>
        <p className="mx-auto mt-2 max-w-sm text-bethel-ink/70">
          Start with a cut from the counter. You can choose the weight and quantity on each product
          page.
        </p>
        <Link href="/shop" className="bh-btn bh-btn-primary mt-6">
          Browse the shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex flex-col gap-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-bethel-sand sm:h-24 sm:w-28">
              <Image src={item.image} alt={item.imageAlt} fill sizes="120px" className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-bethel-charcoal">
                    <Link href={`/shop/${item.slug}`} className="hover:underline underline-offset-4">
                      {item.name}
                    </Link>
                  </h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-bethel-clay-soft">
                    {item.weightLabel} pack
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="inline-flex items-center gap-1 text-xs text-bethel-ink/50 transition hover:text-bethel-red"
                  aria-label={`Remove ${item.name} from basket`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-bethel-line">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-bethel-sand"
                    aria-label={`Reduce quantity of ${item.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.key, Number(event.target.value))}
                    aria-label={`Quantity of ${item.name}`}
                    className="w-10 border-none bg-transparent text-center text-sm font-semibold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-bethel-sand"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-bethel-ink/55">
                    {formatKES(item.unitPrice)} each
                  </p>
                  <p className="font-semibold text-bethel-charcoal">
                    {formatKES(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5 lg:sticky lg:top-[calc(var(--bh-header-height)+1rem)]">
        <h2 className="text-lg font-semibold text-bethel-charcoal">Order summary</h2>

        <label className="mt-4 block">
          <span className="bh-label">Delivery zone</span>
          <select
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            className="bh-input"
          >
            <option value="">Choose your area</option>
            {DELIVERY_ZONES.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name} ({formatKES(entry.fee)})
              </option>
            ))}
          </select>
        </label>
        <p className="mt-1 text-xs text-bethel-clay-soft">
          {zone
            ? `${selectedZone?.eta ?? "Same day"}. ${selectedZone?.note ?? ""}`
            : "The fee is calculated from the zone you choose."}
        </p>

        <dl className="mt-4 space-y-2 border-t border-bethel-line pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-bethel-ink/70">Subtotal</dt>
            <dd className="font-semibold text-bethel-charcoal">{formatKES(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-bethel-ink/70">Delivery</dt>
            <dd className="font-semibold text-bethel-charcoal">
              {!zone ? "Choose a zone" : deliveryFee === 0 ? "Free" : formatKES(deliveryFee)}
            </dd>
          </div>
          {subtotal < SITE.freeDeliveryThreshold ? (
            <p className="rounded-lg bg-bethel-sand/70 px-3 py-2 text-xs text-bethel-clay">
              Spend {formatKES(SITE.freeDeliveryThreshold - subtotal)} more for free delivery.
            </p>
          ) : null}
          <div className="flex items-center justify-between border-t border-bethel-line pt-3 text-base">
            <dt className="font-semibold text-bethel-charcoal">Total</dt>
            <dd className="font-semibold text-bethel-red">{formatKES(total)}</dd>
          </div>
        </dl>

        <Link href="/checkout" className="bh-btn bh-btn-primary mt-5 w-full">
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/shop"
          className="mt-2 block text-center text-xs uppercase tracking-[0.14em] text-bethel-clay-soft underline-offset-4 hover:text-bethel-red hover:underline"
        >
          Add more cuts
        </Link>
      </aside>
    </div>
  );
}
