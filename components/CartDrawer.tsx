"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatKES } from "@/lib/format";
import { SITE } from "@/lib/site";

export function CartDrawer() {
  const isOpen = useCart((state) => state.isDrawerOpen);
  const close = useCart((state) => state.closeDrawer);
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);

  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, SITE.freeDeliveryThreshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[9995]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close basket"
            className="absolute inset-0 bg-bethel-charcoal/45 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your basket"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bethel-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.42 }}
          >
            <div className="flex items-center justify-between border-b border-bethel-line px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="h-5 w-5 text-bethel-red" />
                <h2 className="text-lg font-semibold text-bethel-charcoal">Your basket</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-full text-bethel-charcoal transition hover:bg-bethel-sand"
                aria-label="Close basket"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBasket className="h-10 w-10 text-bethel-clay-soft" strokeWidth={1.4} />
                <p className="text-bethel-ink/75">
                  Your basket is empty. Start with a cut from the shop.
                </p>
                <Link href="/shop" onClick={close} className="bh-btn bh-btn-primary">
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.key} className="flex gap-3 border-b border-bethel-line pb-4 last:border-none">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-bethel-sand">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-bethel-charcoal">{item.name}</p>
                              <p className="text-xs text-bethel-clay-soft">{item.weightLabel}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              className="text-bethel-ink/45 transition hover:text-bethel-red"
                              aria-label={`Remove ${item.name} from basket`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-bethel-line">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-bethel-sand"
                                aria-label={`Reduce quantity of ${item.name}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-bethel-sand"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-bethel-charcoal">
                              {formatKES(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-bethel-line px-5 py-4">
                  <div className="flex items-center justify-between text-sm text-bethel-ink/75">
                    <span>Subtotal</span>
                    <span className="text-base font-semibold text-bethel-charcoal">
                      {formatKES(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-bethel-clay-soft">
                    {remaining > 0
                      ? `Add ${formatKES(remaining)} for free delivery in Nairobi.`
                      : "Free delivery unlocked."}
                  </p>
                  <div className="mt-4 grid gap-2">
                    <Link href="/checkout" onClick={close} className="bh-btn bh-btn-primary w-full">
                      Proceed to checkout
                    </Link>
                    <Link href="/cart" onClick={close} className="bh-btn bh-btn-outline w-full">
                      View basket
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
