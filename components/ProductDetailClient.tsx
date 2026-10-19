"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, Snowflake, Truck } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { FavouriteButton } from "./FavouriteButton";
import { categoryLabel, type Product } from "@/lib/products";
import { formatKES, formatWeight, priceForWeight } from "@/lib/format";
import { SITE } from "@/lib/site";

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [weightGrams, setWeightGrams] = useState(product.weights[1]?.grams ?? 1000);
  const [customGrams, setCustomGrams] = useState("1500");
  const [customMode, setCustomMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const grams = customMode ? Math.max(100, Math.min(20000, Number(customGrams) || 0)) : weightGrams;
  const label = customMode ? formatWeight(grams) : (product.weights.find((w) => w.grams === weightGrams)?.label ?? formatWeight(grams));
  const unitPrice = priceForWeight(product.pricePerKg, grams);
  const image = product.gallery[activeImage] ?? product.gallery[0];

  const savingsNote = useMemo(() => {
    if (grams >= 5000) return "Bulk pack pricing applied at checkout on orders over 10kg.";
    if (grams >= 2000) return "Packed in a cold box for the trip home.";
    return "Cut fresh on the morning of delivery.";
  }, [grams]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-bethel-line bg-bethel-sand">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {product.gallery.map((shot, index) => (
            <button
              key={shot.src + index}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1} of ${product.name}`}
              aria-pressed={activeImage === index}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${
                activeImage === index ? "border-bethel-red" : "border-transparent hover:border-bethel-sand-deep"
              }`}
            >
              <Image src={shot.src} alt="" fill sizes="180px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-bethel-sand px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-bethel-clay">
            {categoryLabel(product.category)}
          </span>
          {product.badge ? (
            <span className="rounded-full bg-bethel-red px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
              {product.badge}
            </span>
          ) : null}
          <FavouriteButton slug={product.slug} name={product.name} />
        </div>

        <h1 className="mt-3 text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-tight text-bethel-charcoal">
          {product.name}
        </h1>
        <p className="mt-2 text-bethel-ink/75">{product.shortDescription}</p>

        <div className="mt-4 flex items-end gap-4">
          <p className="text-2xl font-semibold text-bethel-red">
            {formatKES(product.pricePerKg)}
            <span className="ml-1 text-xs font-normal uppercase tracking-[0.1em] text-bethel-ink/55">
              per kg
            </span>
          </p>
          <p className="text-sm text-bethel-clay-soft">
            {label} pack: <span className="font-semibold text-bethel-charcoal">{formatKES(unitPrice)}</span>
          </p>
        </div>

        <div className="mt-6">
          <p className="bh-label">Choose weight</p>
          <div className="flex flex-wrap gap-2">
            {product.weights.map((option) => (
              <button
                key={option.grams}
                type="button"
                onClick={() => {
                  setWeightGrams(option.grams);
                  setCustomMode(false);
                }}
                aria-pressed={!customMode && weightGrams === option.grams}
                className={`bh-chip ${!customMode && weightGrams === option.grams ? "bh-chip-active" : ""}`}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomMode(true)}
              aria-pressed={customMode}
              className={`bh-chip ${customMode ? "bh-chip-active" : ""}`}
            >
              Custom
            </button>
          </div>

          {customMode ? (
            <div className="mt-3 flex items-end gap-2">
              <label className="flex-1">
                <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.12em] text-bethel-clay-soft">
                  Weight in grams, 100 to 20000
                </span>
                <input
                  type="number"
                  min={100}
                  max={20000}
                  step={50}
                  value={customGrams}
                  onChange={(event) => setCustomGrams(event.target.value)}
                  className="bh-input py-2.5"
                  aria-describedby="custom-weight-help"
                />
              </label>
              <p id="custom-weight-help" className="pb-2.5 text-sm text-bethel-ink/70">
                {formatKES(priceForWeight(product.pricePerKg, Number(customGrams) || 0))}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <p className="bh-label">Quantity</p>
          <div className="inline-flex items-center rounded-full border border-bethel-line bg-[#fffdf9]">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-bethel-sand"
              aria-label="Reduce quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-bethel-sand"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-bethel-line bg-[#fffdf9] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bethel-ink/70">
              {quantity} x {label}
            </span>
            <span className="text-lg font-semibold text-bethel-charcoal">
              {formatKES(unitPrice * quantity)}
            </span>
          </div>
          <p className="mt-1 text-xs text-bethel-clay-soft">{savingsNote}</p>
          <div className="mt-3">
            <AddToCartButton
              product={product}
              weightGrams={grams}
              weightLabel={label}
              quantity={quantity}
              label="Add to Cart"
            />
          </div>
          <a
            href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
              `Hello Bethel Halal Meats, I would like to ask about ${product.name} before ordering.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs uppercase tracking-[0.14em] text-bethel-clay-soft underline-offset-4 transition hover:text-bethel-red hover:underline"
          >
            Ask the butcher about this cut
          </a>
        </div>

        <ul className="mt-5 grid gap-2 text-sm text-bethel-ink/75">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-bethel-red" />
            Halal certified at the abattoir and checked in store
          </li>
          <li className="flex items-center gap-2">
            <Snowflake className="h-4 w-4 text-bethel-red" />
            Packed on ice and sealed before it leaves the counter
          </li>
          <li className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-bethel-red" />
            Same day delivery across Nairobi, free over {formatKES(SITE.freeDeliveryThreshold)}
          </li>
        </ul>
      </div>
    </div>
  );
}
