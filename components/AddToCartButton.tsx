"use client";

import { useRef } from "react";
import { Plus, ShoppingBasket } from "lucide-react";
import gsap from "gsap";
import { useCart } from "@/lib/cart";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    imageAlt: string;
    pricePerKg: number;
  };
  weightGrams: number;
  weightLabel: string;
  quantity?: number;
  className?: string;
  label?: string;
  compact?: boolean;
};

/** Adds a cut to the basket and gives the button a short GSAP confirmation pulse. */
export function AddToCartButton({
  product,
  weightGrams,
  weightLabel,
  quantity = 1,
  className = "",
  label = "Add to Cart",
  compact = false,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const addItem = useCart((state) => state.addItem);

  function handleClick() {
    addItem(product, weightGrams, weightLabel, quantity);
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 1 },
        {
          scale: 0.93,
          duration: 0.11,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
          clearProps: "scale",
        },
      );
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={`bh-btn ${compact ? "bh-btn-outline w-full px-3 py-2 text-sm" : "bh-btn-primary w-full"} ${className}`}
      aria-label={`${label}: ${product.name}, ${weightLabel}`}
    >
      {compact ? <Plus className="h-4 w-4" /> : <ShoppingBasket className="h-4 w-4" />}
      {label}
    </button>
  );
}
