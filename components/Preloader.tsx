"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "bethel_halal_visited";

/**
 * Loading screen added on top of the template, which shipped without one.
 * A geometric crescent and star mark, a percentage counter, a three second
 * ceiling and a skip control that appears after one second.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const doneRef = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    window.setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // storage can be unavailable in private mode
      }
    }, 320);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    let alreadyVisited = false;
    try {
      alreadyVisited = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyVisited = false;
    }

    if (alreadyVisited) {
      doneRef.current = true;
      setVisible(false);
      return;
    }

    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const next = Math.min(96, Math.round((elapsed / 1600) * 100));
      setProgress((current) => (current > next ? current : next));
    }, 60);

    timers.current.push(window.setTimeout(() => setCanSkip(true), 1000));
    timers.current.push(window.setTimeout(finish, 3000));

    return () => {
      window.clearInterval(tick);
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [finish]);

  useEffect(() => {
    if (progress >= 96 && !doneRef.current) {
      const timer = window.setTimeout(finish, 260);
      return () => window.clearTimeout(timer);
    }
  }, [progress, finish]);

  useEffect(() => {
    if (!visible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading Bethel Halal Meats, ${progress} percent`}
      className="bh-preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bethel-cream px-6"
    >
      {reducedMotion ? (
        <p className="text-center text-sm font-semibold tracking-[0.18em] text-bethel-charcoal">
          Loading {progress} percent
        </p>
      ) : (
        <>
          <svg
            viewBox="0 0 120 120"
            className="h-24 w-24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="60" cy="60" r="54" stroke="#e8d3ba" strokeWidth="3" />
            <g className="bh-preloader-rotate">
              <path
                d="M78 26c-15-7-31-2-39 10-9 13-5 31 9 38 13 7 29 2 35-11 2-5 3-10 2-15-6 9-19 12-28 5-9-7-10-20-3-28 5-6 14-8 21-4l3-5Z"
                fill="#ed0121"
              />
              <path d="M84 22l4 8 8 3-7 5 1 9-7-4-8 4 2-9-6-6 9-2 4-8Z" fill="#f0a830" />
            </g>
          </svg>
          <p className="mt-6 text-4xl font-semibold tabular-nums text-bethel-charcoal">
            {progress}
            <span className="text-xl align-super">%</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-bethel-clay-soft">
            Preparing the counter
          </p>
        </>
      )}

      <div className="mt-7 h-1 w-48 overflow-hidden rounded-full bg-bethel-sand-deep">
        <div
          className="h-full rounded-full bg-bethel-red transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {canSkip ? (
        <button
          type="button"
          onClick={finish}
          className="mt-5 rounded-full border border-bethel-line px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-bethel-clay-soft transition hover:border-bethel-red hover:text-bethel-red"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
