import { NextResponse } from "next/server";
import { getProduct, getRelatedProducts } from "@/lib/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product,
    related: getRelatedProducts(product, 4).map((item) => ({
      slug: item.slug,
      name: item.name,
      pricePerKg: item.pricePerKg,
    })),
  });
}
