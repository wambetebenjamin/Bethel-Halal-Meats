import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkoutSchema } from "@/lib/validation";
import {
  deliveryFeeFor,
  estimateEta,
  makeOrderRef,
  resolveLines,
  saveOrder,
  type Order,
} from "@/lib/orders";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { findZone, SITE } from "@/lib/site";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the delivery details", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const zone = findZone(data.zone);
  if (!zone) {
    return NextResponse.json(
      { error: "We do not deliver to that zone yet", issues: { zone: ["Unknown zone"] } },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(
    data.captchaV2Token ? `v2:${data.captchaV2Token}` : data.recaptchaToken,
    "checkout",
  );

  if (!captcha.ok) {
    return NextResponse.json(
      {
        error: captcha.requiresV2
          ? "Please complete the visible security check"
          : "The security check did not pass. Please try again.",
        code: captcha.requiresV2 ? "CAPTCHA_V2_REQUIRED" : "CAPTCHA_FAILED",
        score: captcha.score,
      },
      { status: 400 },
    );
  }

  const items = resolveLines(data.items);
  if (items.length === 0) {
    return NextResponse.json(
      { error: "None of the items in this order are available", issues: { items: ["Empty order"] } },
      { status: 422 },
    );
  }

  const session = await auth();
  const email = session?.user?.email ?? `guest+${data.phone.replace(/\D/g, "")}@bethelhalalmeats.co.ke`;

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const deliveryFee = deliveryFeeFor(zone.slug, subtotal);

  const order: Order = {
    ref: makeOrderRef(),
    email,
    customer: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      zone: zone.slug,
      zoneName: zone.name,
      deliveryDate: data.deliveryDate,
      instructions: data.instructions ?? "",
    },
    paymentMethod: data.paymentMethod,
    paymentStatus: "pending",
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: "received",
    eta: estimateEta(zone.slug, data.deliveryDate),
    createdAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return NextResponse.json(
    {
      ref: order.ref,
      eta: order.eta,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      freeDeliveryThreshold: SITE.freeDeliveryThreshold,
      order,
    },
    { status: 201 },
  );
}
