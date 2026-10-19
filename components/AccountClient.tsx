"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Heart, Loader2, LogOut, MapPin, Package, Plus, Trash2 } from "lucide-react";
import { formatDate, formatKES } from "@/lib/format";
import { DELIVERY_ZONES, SITE, findZone } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";

type OrderRow = {
  ref: string;
  createdAt: string;
  status: string;
  total: number;
  eta: string;
  items: { name: string; weightLabel: string; quantity: number }[];
};

type Address = {
  id: string;
  label: string;
  address: string;
  zone: string;
};

const ADDRESS_KEY = "bethel_halal_addresses";
const FAVOURITES_KEY = "bethel_halal_favourites";

export function AccountClient({ name, email }: { name: string; email: string }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [addressForm, setAddressForm] = useState({ label: "", address: "", zone: "" });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data: { orders?: OrderRow[]; error?: string }) => {
        if (!active) return;
        if (data.orders) setOrders(data.orders);
        else setError(data.error ?? "Could not load your orders.");
      })
      .catch(() => {
        if (active) setError("Could not load your orders right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const storedAddresses = window.localStorage.getItem(ADDRESS_KEY);
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses) as Address[]);
      const storedFavourites = window.localStorage.getItem(FAVOURITES_KEY);
      if (storedFavourites) setFavourites(JSON.parse(storedFavourites) as string[]);
    } catch {
      // ignore malformed local storage
    }
  }, []);

  const persistAddresses = useCallback((next: Address[]) => {
    setAddresses(next);
    try {
      window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(next));
    } catch {
      // storage may be blocked
    }
  }, []);

  function addAddress() {
    if (!addressForm.label.trim() || !addressForm.address.trim() || !addressForm.zone) return;
    const next = [
      ...addresses,
      {
        id: `addr_${Date.now()}`,
        label: addressForm.label.trim(),
        address: addressForm.address.trim(),
        zone: addressForm.zone,
      },
    ];
    persistAddresses(next);
    setAddressForm({ label: "", address: "", zone: "" });
    setAddingAddress(false);
  }

  function removeAddress(id: string) {
    persistAddresses(addresses.filter((address) => address.id !== id));
  }

  const favouriteProducts = PRODUCTS.filter((product) => favourites.includes(product.slug));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-bethel-clay-soft">Signed in as</p>
          <h2 className="text-2xl font-semibold text-bethel-charcoal">{name}</h2>
          <p className="text-sm text-bethel-ink/65">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bh-btn bh-btn-outline px-4 py-2.5 text-sm"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <section aria-labelledby="orders-heading">
        <div className="flex items-end justify-between gap-3">
          <h2 id="orders-heading" className="text-xl font-semibold text-bethel-charcoal">
            Past orders
          </h2>
          <Link href="/shop" className="text-xs uppercase tracking-[0.14em] text-bethel-red hover:underline">
            Order again
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 text-sm text-bethel-ink/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your orders
          </div>
        ) : error ? (
          <p className="mt-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 text-sm text-bethel-ink/70">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6">
            <p className="flex items-center gap-2 text-sm text-bethel-ink/70">
              <Package className="h-4 w-4 text-bethel-clay" />
              You have not placed an order yet. Your first one will appear here.
            </p>
            <Link href="/shop" className="bh-btn bh-btn-primary mt-4">
              Browse the shop
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.ref} className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-semibold text-bethel-charcoal">{order.ref}</p>
                    <p className="text-xs text-bethel-clay-soft">
                      {formatDate(order.createdAt)}. {order.items.length}{" "}
                      {order.items.length === 1 ? "line" : "lines"}.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-bethel-red">{formatKES(order.total)}</p>
                    <p className="text-xs capitalize text-bethel-clay-soft">{order.status}</p>
                  </div>
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-bethel-ink/70">
                  {order.items.map((item, index) => (
                    <li key={`${order.ref}-${index}`}>
                      {item.name} ({item.weightLabel} x {item.quantity})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="addresses-heading">
        <div className="flex items-end justify-between gap-3">
          <h2 id="addresses-heading" className="text-xl font-semibold text-bethel-charcoal">
            Saved delivery addresses
          </h2>
          <button
            type="button"
            onClick={() => setAddingAddress((value) => !value)}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-bethel-red hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add address
          </button>
        </div>

        {addingAddress ? (
          <div className="mt-4 grid gap-3 rounded-2xl border border-bethel-line bg-[#fffdf9] p-5 sm:grid-cols-2">
            <label>
              <span className="bh-label">Label</span>
              <input
                value={addressForm.label}
                onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })}
                className="bh-input"
                placeholder="Home or office"
              />
            </label>
            <label>
              <span className="bh-label">Zone</span>
              <select
                value={addressForm.zone}
                onChange={(event) => setAddressForm({ ...addressForm, zone: event.target.value })}
                className="bh-input"
              >
                <option value="">Choose a zone</option>
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.slug} value={zone.slug}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="bh-label">Address</span>
              <input
                value={addressForm.address}
                onChange={(event) => setAddressForm({ ...addressForm, address: event.target.value })}
                className="bh-input"
                placeholder="Building, street and house number"
              />
            </label>
            <div className="sm:col-span-2">
              <button type="button" onClick={addAddress} className="bh-btn bh-btn-primary px-4 py-2.5 text-sm">
                Save address
              </button>
            </div>
          </div>
        ) : null}

        {addresses.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 text-sm text-bethel-ink/70">
            No saved addresses yet. Addresses are stored on this device only.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-bethel-line bg-[#fffdf9] p-5"
              >
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bethel-red" />
                  <div>
                    <p className="text-sm font-semibold text-bethel-charcoal">{address.label}</p>
                    <p className="text-sm text-bethel-ink/70">{address.address}</p>
                    <p className="text-xs text-bethel-clay-soft">
                      {findZone(address.zone)?.name ?? address.zone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  className="text-bethel-ink/45 transition hover:text-bethel-red"
                  aria-label={`Remove ${address.label} address`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="favourites-heading">
        <h2 id="favourites-heading" className="flex items-center gap-2 text-xl font-semibold text-bethel-charcoal">
          <Heart className="h-5 w-5 text-bethel-red" />
          Favourite products
        </h2>

        {favouriteProducts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-bethel-line bg-[#fffdf9] p-6 text-sm text-bethel-ink/70">
            No favourites saved yet. Tap the heart on any cut to keep it here.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favouriteProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-3 rounded-2xl border border-bethel-line bg-[#fffdf9] p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bethel-sand">
                  <Image src={product.image} alt={product.imageAlt} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="block truncate font-semibold text-bethel-charcoal hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-bethel-clay-soft">
                    {formatKES(product.pricePerKg)} per kg
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs leading-relaxed text-bethel-ink/50">
        Need help with an order? WhatsApp {SITE.whatsappDisplay}. Saved addresses and favourites are
        stored in this browser and can be cleared at any time from your browser settings.
      </p>
    </div>
  );
}
