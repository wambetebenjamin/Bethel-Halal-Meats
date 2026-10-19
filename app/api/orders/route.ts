import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listOrders, seedDemoOrders } from "@/lib/orders";

/** GET /api/orders. Returns the signed in customer's recent orders. */
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Sign in to view your orders" }, { status: 401 });
  }

  const stored = await listOrders(email);
  const seeded = seedDemoOrders(email).filter(
    (demo) => !stored.some((order) => order.ref === demo.ref),
  );

  return NextResponse.json({ orders: [...stored, ...seeded] });
}
