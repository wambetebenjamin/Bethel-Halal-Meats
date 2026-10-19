import { NextResponse } from "next/server";
import { PRODUCTS, type CategorySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Filters: category, cut, weight (range key), minPrice, maxPrice, q.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const cut = searchParams.get("cut");
  const weight = searchParams.get("weight");
  const minPrice = Number(searchParams.get("minPrice") ?? "");
  const maxPrice = Number(searchParams.get("maxPrice") ?? "");
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  let results = [...PRODUCTS];

  if (category) {
    results = results.filter((product) => product.category === (category as CategorySlug));
  }

  if (cut) {
    results = results.filter((product) => product.cutType === cut);
  }

  if (weight) {
    const ranges: Record<string, { min: number; max: number }> = {
      "under-1kg": { min: 0, max: 999 },
      "1kg-2kg": { min: 1000, max: 2000 },
      "2kg-5kg": { min: 2000, max: 5000 },
      "over-5kg": { min: 5000, max: 100000 },
    };
    const range = ranges[weight];
    if (range) {
      results = results.filter((product) =>
        product.weights.some(
          (option) => option.grams >= range.min && option.grams <= range.max,
        ),
      );
    }
  }

  if (!Number.isNaN(minPrice) && searchParams.get("minPrice")) {
    results = results.filter((product) => product.pricePerKg >= minPrice);
  }

  if (!Number.isNaN(maxPrice) && searchParams.get("maxPrice")) {
    results = results.filter((product) => product.pricePerKg <= maxPrice);
  }

  if (query) {
    results = results.filter((product) =>
      `${product.name} ${product.shortDescription} ${product.category}`.toLowerCase().includes(query),
    );
  }

  return NextResponse.json({
    count: results.length,
    filters: {
      category: category ?? null,
      cut: cut ?? null,
      weight: weight ?? null,
      minPrice: searchParams.get("minPrice") ?? null,
      maxPrice: searchParams.get("maxPrice") ?? null,
      q: query || null,
    },
    products: results,
  });
}
