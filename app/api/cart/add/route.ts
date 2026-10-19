import { NextResponse } from "next/server";
import { z } from "zod";
import { PRODUCTS } from "@/lib/products";
import { priceForWeight } from "@/lib/format";

const bodySchema = z.object({
  productId: z.string().min(1),
  weight: z.union([z.number().int().min(100).max(20000), z.string().min(2)]),
  quantity: z.number().int().min(1).max(20).default(1),
});

function resolveGrams(weight: number | string, options: { grams: number; label: string }[]) {
  if (typeof weight === "number") return weight;
  const match = options.find((option) => option.label.toLowerCase() === weight.toLowerCase());
  if (match) return match.grams;
  const parsed = Number(weight.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(parsed)) return null;
  if (weight.toLowerCase().includes("kg")) return Math.round(parsed * 1000);
  return Math.round(parsed);
}

/**
 * POST /api/cart/add
 * The basket lives in localStorage on the client, so this endpoint validates the
 * line and returns the priced item that the client should persist.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart payload", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { productId, weight, quantity } = parsed.data;
  const product = PRODUCTS.find((item) => item.id === productId || item.slug === productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const grams = resolveGrams(weight, product.weights);
  if (!grams || grams < 100 || grams > 20000) {
    return NextResponse.json(
      { error: "Choose a weight between 100g and 20kg" },
      { status: 422 },
    );
  }

  const weightLabel =
    product.weights.find((option) => option.grams === grams)?.label ?? `${grams}g`;
  const unitPrice = priceForWeight(product.pricePerKg, grams);

  return NextResponse.json({
    storage: "localStorage",
    item: {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      imageAlt: product.imageAlt,
      weightGrams: grams,
      weightLabel,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    },
  });
}
