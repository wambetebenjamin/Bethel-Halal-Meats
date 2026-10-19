"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const KEY = "bethel_halal_favourites";

export function FavouriteButton({ slug, name }: { slug: string; name: string }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      setSaved(list.includes(slug));
    } catch {
      setSaved(false);
    }
    setReady(true);
  }, [slug]);

  function toggle() {
    let list: string[] = [];
    try {
      const raw = window.localStorage.getItem(KEY);
      list = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      list = [];
    }
    const next = saved ? list.filter((item) => item !== slug) : [...new Set([...list, slug])];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      return;
    }
    setSaved(!saved);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition ${
        saved
          ? "border-bethel-red bg-bethel-red text-white"
          : "border-bethel-line text-bethel-clay hover:border-bethel-red hover:text-bethel-red"
      }`}
      disabled={!ready}
    >
      <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save cut"}
    </button>
  );
}
