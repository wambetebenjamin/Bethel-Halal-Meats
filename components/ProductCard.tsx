import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { categoryLabel, type Product } from "@/lib/products";
import { formatKES, priceForWeight } from "@/lib/format";

export function ProductCard({
  product,
  defaultWeightGrams = 1000,
}: {
  product: Product;
  defaultWeightGrams?: number;
}) {
  const weight = product.weights.find((option) => option.grams === defaultWeightGrams) ?? product.weights[1];

  return (
    <article className="bh-product-card group flex h-full flex-col overflow-hidden rounded-[18px] border border-bethel-line bg-[#fffdf9] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      <Link
        href={`/shop/${product.slug}`}
        className="bh-product-media relative block aspect-[4/3] overflow-hidden bg-bethel-sand"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffdf9]/95 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-bethel-clay">
          {categoryLabel(product.category)}
        </span>
        {product.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-bethel-red px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-snug text-bethel-charcoal">
          <Link href={`/shop/${product.slug}`} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-bethel-ink/70">
          {product.shortDescription}
        </p>

        <dl className="mt-3 flex items-end justify-between gap-2">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-bethel-clay-soft">
              Price per kg
            </dt>
            <dd className="font-semibold text-bethel-charcoal">{formatKES(product.pricePerKg)}</dd>
          </div>
          <div className="text-right">
            <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-bethel-clay-soft">
              {weight.label} pack
            </dt>
            <dd className="font-semibold text-bethel-red">
              {formatKES(priceForWeight(product.pricePerKg, weight.grams))}
            </dd>
          </div>
        </dl>

        <div className="mt-4 grid gap-2">
          <AddToCartButton
            product={product}
            weightGrams={weight.grams}
            weightLabel={weight.label}
            compact
            label="Add to Cart"
          />
          <Link
            href={`/shop/${product.slug}`}
            className="text-center text-xs uppercase tracking-[0.14em] text-bethel-clay-soft underline-offset-4 transition hover:text-bethel-red hover:underline"
          >
            Choose weight
          </Link>
        </div>
      </div>
    </article>
  );
}
