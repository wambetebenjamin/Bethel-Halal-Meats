import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrder } from "@/lib/orders";

/** GET /api/orders/[ref]. Requires a signed in session that owns the order. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to view this order" }, { status: 401 });
  }

  const { ref } = await params;
  const order = await getOrder(ref.toUpperCase());

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.email !== session.user.email) {
    return NextResponse.json({ error: "This order belongs to another account" }, { status: 403 });
  }

  return NextResponse.json({ order });
}
