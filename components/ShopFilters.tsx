"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, CUT_TYPES, WEIGHT_RANGES } from "@/lib/products";

const PRICE_PRESETS = [
  { label: "Any price", min: "", max: "" },
  { label: "Under 700", min: "", max: "700" },
  { label: "700 to 1000", min: "700", max: "1000" },
  { label: "1000 to 1500", min: "1000", max: "1500" },
  { label: "Over 1500", min: "1500", max: "" },
];

export function ShopFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  const currentCategory = params.get("category") ?? "";
  const currentCut = params.get("cut") ?? "";
  const currentWeight = params.get("weight") ?? "";

  const update = useCallback(
    (key: string, value: string, extra?: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      Object.entries(extra ?? {}).forEach(([extraKey, extraValue]) => {
        if (extraValue) next.set(extraKey, extraValue);
        else next.delete(extraKey);
      });
      const query = next.toString();
      router.push(query ? `/shop?${query}#catalogue` : "/shop#catalogue", { scroll: false });
    },
    [params, router],
  );

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop#catalogue", { scroll: false });
  };

  const activeCount = ["category", "cut", "weight", "minPrice", "maxPrice"].filter((key) =>
    params.get(key),
  ).length;

  const body = (
    <div className="space-y-6">
      <fieldset>
        <legend className="bh-label">Category</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update("category", "")}
            className={`bh-chip ${!currentCategory ? "bh-chip-active" : ""}`}
            aria-pressed={!currentCategory}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => update("category", category.slug)}
              className={`bh-chip ${currentCategory === category.slug ? "bh-chip-active" : ""}`}
              aria-pressed={currentCategory === category.slug}
            >
              {category.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="bh-label">Cut type</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update("cut", "")}
            className={`bh-chip ${!currentCut ? "bh-chip-active" : ""}`}
            aria-pressed={!currentCut}
          >
            Any cut
          </button>
          {CUT_TYPES.map((cut) => (
            <button
              key={cut.value}
              type="button"
              onClick={() => update("cut", cut.value)}
              className={`bh-chip ${currentCut === cut.value ? "bh-chip-active" : ""}`}
              aria-pressed={currentCut === cut.value}
            >
              {cut.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="bh-label">Weight range</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update("weight", "")}
            className={`bh-chip ${!currentWeight ? "bh-chip-active" : ""}`}
            aria-pressed={!currentWeight}
          >
            Any weight
          </button>
          {WEIGHT_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => update("weight", range.value)}
              className={`bh-chip ${currentWeight === range.value ? "bh-chip-active" : ""}`}
              aria-pressed={currentWeight === range.value}
            >
              {range.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="bh-label">Price per kg</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              (params.get("minPrice") ?? "") === preset.min &&
              (params.get("maxPrice") ?? "") === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setMinPrice(preset.min);
                  setMaxPrice(preset.max);
                  update("minPrice", preset.min, { maxPrice: preset.max });
                }}
                className={`bh-chip ${active ? "bh-chip-active" : ""}`}
                aria-pressed={active}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <form
          className="mt-3 flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            update("minPrice", minPrice, { maxPrice });
          }}
        >
          <label className="flex-1">
            <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.12em] text-bethel-clay-soft">
              Min KES
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="bh-input py-2 text-sm"
              placeholder="0"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.12em] text-bethel-clay-soft">
              Max KES
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="bh-input py-2 text-sm"
              placeholder="2000"
            />
          </label>
          <button type="submit" className="bh-btn bh-btn-dark px-4 py-2.5 text-sm">
            Apply
          </button>
        </form>
      </fieldset>

      <div className="flex items-center justify-between border-t border-bethel-line pt-4">
        <p className="text-xs uppercase tracking-[0.12em] text-bethel-clay-soft">
          {resultCount} {resultCount === 1 ? "cut" : "cuts"} found
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-bethel-red hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="bh-btn bh-btn-outline px-4 py-2.5 text-sm"
          aria-expanded={open}
          aria-controls="shop-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeCount > 0 ? `(${activeCount})` : ""}
        </button>
        <p className="text-xs uppercase tracking-[0.12em] text-bethel-clay-soft">
          {resultCount} results
        </p>
      </div>

      <div
        id="shop-filters"
        className={`${open ? "block" : "hidden"} mb-6 rounded-2xl border border-bethel-line bg-[#fffdf9] p-5 lg:mb-0 lg:block lg:sticky lg:top-[calc(var(--bh-header-height)+1rem)]`}
      >
        {body}
      </div>
    </>
  );
}
