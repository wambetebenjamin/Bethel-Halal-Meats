import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS, getProduct, getRelatedProducts } from "@/lib/products";
import { formatKES } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Cut not found" };

  return {
    title: `${product.name} from ${formatKES(product.pricePerKg)} per kg`,
    description: `${product.shortDescription} ${product.origin}`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <div className="bh-container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
        <Link href="/" className="hover:text-bethel-red">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-bethel-red">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-bethel-red">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bethel-charcoal">{product.name}</span>
      </nav>

      <div className="mt-6">
        <ProductDetailClient product={product} />
      </div>

      <section className="mt-14 grid gap-8 border-t border-bethel-line pt-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <h2 className="bh-title bh-rule-left text-2xl">About this cut</h2>
          <p className="text-bethel-ink/80">{product.description}</p>

          <h3 className="mt-6 text-base font-semibold text-bethel-charcoal">Cooking suggestions</h3>
          <ol className="mt-2 space-y-2 text-bethel-ink/75">
            {product.cooking.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bethel-sand text-[0.65rem] font-semibold text-bethel-clay">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
            <h2 className="text-base font-semibold text-bethel-charcoal">Cut details</h2>
            <dl className="mt-3 divide-y divide-bethel-line text-sm">
              {[
                { term: "Cut name", detail: product.name },
                { term: "Origin", detail: product.origin },
                { term: "Fat content", detail: product.fatContent },
                { term: "Pack options", detail: product.weights.map((w) => w.label).join(", ") },
                { term: "Cut type", detail: product.cutType },
              ].map((row) => (
                <div key={row.term} className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-3">
                  <dt className="text-xs uppercase tracking-[0.12em] text-bethel-clay-soft">{row.term}</dt>
                  <dd className="capitalize text-bethel-ink/80">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="bh-title bh-rule-left text-2xl">Related cuts</h2>
          <Link href="/shop" className="text-xs uppercase tracking-[0.14em] text-bethel-red hover:underline">
            All products
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <ProductCard product={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
