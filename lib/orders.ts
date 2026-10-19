import { randomBytes } from "node:crypto";
import { PRODUCTS } from "./products";
import { DELIVERY_ZONES, findZone, SITE } from "./site";
import { priceForWeight } from "./format";

export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  weightGrams: number;
  weightLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  ref: string;
  email: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    zone: string;
    zoneName: string;
    deliveryDate: string;
    instructions: string;
  };
  paymentMethod: "mpesa" | "cash";
  paymentStatus: "pending" | "paid on delivery";
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "received" | "preparing" | "out for delivery" | "delivered";
  eta: string;
  createdAt: string;
};

type MemoryStore = { orders: Map<string, Order> };

const globalStore = globalThis as typeof globalThis & {
  __bethelOrders?: MemoryStore;
  __bethelDemoSeeded?: boolean;
};

function memory(): MemoryStore {
  if (!globalStore.__bethelOrders) {
    globalStore.__bethelOrders = { orders: new Map() };
  }
  return globalStore.__bethelOrders;
}

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kv() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

export function makeOrderRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `BH-${code}`;
}

export function deliveryFeeFor(zoneSlug: string, subtotal: number) {
  if (subtotal >= SITE.freeDeliveryThreshold) return 0;
  const zone = findZone(zoneSlug);
  return zone ? zone.fee : 0;
}

export function resolveLines(
  items: { productId: string; weightGrams: number; quantity: number }[],
): OrderLine[] {
  return items.flatMap((item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) return [];
    const unitPrice = priceForWeight(product.pricePerKg, item.weightGrams);
    const weightLabel =
      product.weights.find((weight) => weight.grams === item.weightGrams)?.label ??
      `${item.weightGrams}g`;
    return [
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        weightGrams: item.weightGrams,
        weightLabel,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      },
    ];
  });
}

export function estimateEta(zoneSlug: string, deliveryDate?: string) {
  const zone = findZone(zoneSlug);
  const base = zone?.eta ?? "90 to 120 minutes";

  if (deliveryDate) {
    const target = new Date(`${deliveryDate}T12:00:00`);
    if (!Number.isNaN(target.getTime())) {
      const today = new Date();
      const sameDay = target.toDateString() === today.toDateString();
      if (!sameDay) {
        const label = new Intl.DateTimeFormat("en-KE", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(target);
        return `${label}, within ${base}`;
      }
    }
  }

  return `Today, within ${base}`;
}

export async function saveOrder(order: Order) {
  if (kvConfigured()) {
    const store = await kv();
    await store.set(`bethel:order:${order.ref}`, order);
    await store.lpush(`bethel:orders:${order.email}`, order.ref);
    return;
  }
  memory().orders.set(order.ref, order);
}

export async function getOrder(ref: string): Promise<Order | null> {
  if (kvConfigured()) {
    const store = await kv();
    return (await store.get<Order>(`bethel:order:${ref}`)) ?? null;
  }
  return memory().orders.get(ref) ?? null;
}

export async function listOrders(email: string): Promise<Order[]> {
  if (kvConfigured()) {
    const store = await kv();
    const refs = (await store.lrange<string>(`bethel:orders:${email}`, 0, 24)) ?? [];
    const orders = await Promise.all(refs.map((ref) => getOrder(ref)));
    return orders.filter((order): order is Order => Boolean(order));
  }
  return [...memory().orders.values()]
    .filter((order) => order.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * A small set of past orders for the demo account so the account page has
 * something meaningful to show before a first real order is placed.
 */
export function seedDemoOrders(email: string): Order[] {
  if (email !== "demo@bethelhalalmeats.co.ke") return [];

  const build = (
    ref: string,
    daysAgo: number,
    picks: { productId: string; weightGrams: number; quantity: number }[],
    zoneSlug: string,
  ): Order => {
    const items = resolveLines(picks);
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const zone = DELIVERY_ZONES.find((entry) => entry.slug === zoneSlug) ?? DELIVERY_ZONES[0];
    const deliveryFee = subtotal >= SITE.freeDeliveryThreshold ? 0 : zone.fee;
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);
    return {
      ref,
      email,
      customer: {
        name: "Demo Customer",
        phone: "+254 700 000 000",
        address: "Apartment 4B, Ring Road, Westlands",
        zone: zone.slug,
        zoneName: zone.name,
        deliveryDate: created.toISOString().slice(0, 10),
        instructions: "",
      },
      paymentMethod: "mpesa",
      paymentStatus: "paid on delivery",
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: "delivered",
      eta: "Delivered",
      createdAt: created.toISOString(),
    };
  };

  return [
    build("BH-DEMO42", 12, [{ productId: "bh-beef-ribeye", weightGrams: 2000, quantity: 1 }], "westlands"),
    build(
      "BH-DEMO17",
      34,
      [
        { productId: "bh-goat-shoulder", weightGrams: 2000, quantity: 1 },
        { productId: "bh-chicken-whole", weightGrams: 2000, quantity: 1 },
      ],
      "kasarani",
    ),
  ];
}
