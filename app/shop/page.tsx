import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS, type CategorySlug, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop halal meat by cut and weight",
  description:
    "Browse beef, goat, chicken, lamb, offal and sausages. Filter by category, cut type, weight and price, then order for same day delivery in Nairobi.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const WEIGHT_RANGES: Record<string, { min: number; max: number }> = {
  "under-1kg": { min: 0, max: 999 },
  "1kg-2kg": { min: 1000, max: 2000 },
  "2kg-5kg": { min: 2000, max: 5000 },
  "over-5kg": { min: 5000, max: 100000 },
};

function read(param: string | string[] | undefined) {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

function filterProducts(params: { [key: string]: string | string[] | undefined }): Product[] {
  const category = read(params.category);
  const cut = read(params.cut);
  const weight = read(params.weight);
  const minPrice = Number(read(params.minPrice));
  const maxPrice = Number(read(params.maxPrice));

  return PRODUCTS.filter((product) => {
    if (category && product.category !== (category as CategorySlug)) return false;
    if (cut && product.cutType !== cut) return false;
    if (weight && WEIGHT_RANGES[weight]) {
      const range = WEIGHT_RANGES[weight];
      if (!product.weights.some((option) => option.grams >= range.min && option.grams <= range.max)) {
        return false;
      }
    }
    if (!Number.isNaN(minPrice) && read(params.minPrice) && product.pricePerKg < minPrice) {
      return false;
    }
    if (!Number.isNaN(maxPrice) && read(params.maxPrice) && product.pricePerKg > maxPrice) {
      return false;
    }
    return true;
  });
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const products = filterProducts(params);

  return (
    <div className="bh-container py-10 sm:py-14">
      <Reveal>
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
          <Link href="/" className="hover:text-bethel-red">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-bethel-charcoal">Shop</span>
        </nav>
        <div className="mt-4 flex flex-col gap-4 border-b border-bethel-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="bh-eyebrow">The counter</p>
            <h1 className="bh-title bh-rule-left mt-3">Product catalogue</h1>
            <p className="max-w-xl text-bethel-ink/70">
              Every cut is priced per kilo and packed to the weight you choose. Filter by animal,
              cut, pack size or price, then open a cut for its origin and cooking notes.
            </p>
          </div>
          <p className="text-sm text-bethel-clay-soft">
            Same day delivery on orders before 3pm
          </p>
        </div>
      </Reveal>

      <div id="catalogue" className="mt-8 grid gap-8 lg:grid-cols-[290px_1fr]">
        <aside aria-label="Product filters">
          <Suspense fallback={<div className="h-24 rounded-2xl bg-bethel-sand/60" />}>
            <ShopFilters resultCount={products.length} />
          </Suspense>
        </aside>

        <section aria-label="Products">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-10 text-center">
              <h2 className="text-xl font-semibold text-bethel-charcoal">No cuts match those filters</h2>
              <p className="mt-2 text-bethel-ink/70">
                Try a wider price range or a different cut type. Our butchers can also cut something
                specific for you.
              </p>
              <Link href="/shop" className="bh-btn bh-btn-primary mt-5">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index, 5) * 0.05}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
