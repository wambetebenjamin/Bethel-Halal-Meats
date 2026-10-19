"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS, type Product } from "./products";
import { priceForWeight } from "./format";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  weightGrams: number;
  weightLabel: string;
  quantity: number;
  unitPrice: number;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  zone: string;
  lastAddedKey: string | null;
  addItem: (
    product: Product | Pick<Product, "id" | "slug" | "name" | "image" | "imageAlt" | "pricePerKg">,
    weightGrams: number,
    weightLabel: string,
    quantity?: number,
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  setZone: (zone: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      zone: "",
      lastAddedKey: null,
      addItem: (product, weightGrams, weightLabel, quantity = 1) => {
        const key = `${product.id}:${weightGrams}`;
        const unitPrice = priceForWeight(product.pricePerKg, weightGrams);
        set((state) => {
          const existing = state.items.find((item) => item.key === key);
          const items = existing
            ? state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: Math.min(item.quantity + quantity, 20) }
                  : item,
              )
            : [
                ...state.items,
                {
                  key,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  imageAlt: product.imageAlt,
                  weightGrams,
                  weightLabel,
                  quantity,
                  unitPrice,
                },
              ];
          return { items, lastAddedKey: key, isDrawerOpen: true };
        });
      },
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key
                    ? { ...item, quantity: Math.min(quantity, 20) }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [], lastAddedKey: null }),
      setZone: (zone) => set({ zone }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "bethel_halal_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, zone: state.zone }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function hydrateItemNames(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) return item;
    return { ...item, name: product.name, image: product.image, imageAlt: product.imageAlt };
  });
}
