"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useUI } from "@/lib/ui";

const SCRIPT = `Welcome to Bethel Halal Meats. We supply fresh, halal-certified beef, goat, chicken, and lamb, delivered straight to your home or business in Nairobi. Order online, choose your cuts and weight, and we will deliver the same day. Every cut we sell meets full halal standards from farm to table.`;

export function VoiceTour() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const consentOpen = useUI((state) => state.consentBannerOpen);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = "en-KE";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, []);

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  if (!supported) return null;

  const label = speaking
    ? "Stop the audio tour"
    : hasPlayed
      ? "Replay the audio tour"
      : "Hear what this site is about";

  return (
    <div
      className="fixed left-4 z-[9998] flex flex-col items-start gap-2 transition-[bottom] duration-300 sm:left-6"
      style={{ bottom: consentOpen ? "calc(env(safe-area-inset-bottom) + 15rem)" : "1.5rem" }}
    >
      <div
        role="tooltip"
        className={`max-w-[220px] rounded-xl border border-bethel-line bg-[#fffdf9] px-3 py-2 text-xs leading-snug text-bethel-charcoal shadow-lg transition-all duration-200 ${
          showTooltip || hasPlayed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
        }`}
      >
        {hasPlayed ? "Replay the audio tour" : "Hear what this site is about"}
      </div>
      <button
        type="button"
        onClick={() => (speaking ? stop() : speak())}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={label}
        aria-pressed={speaking}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-bethel-charcoal text-bethel-cream shadow-[0_18px_30px_-18px_rgba(33,45,57,0.9)] transition hover:bg-[#16202a]"
      >
        {speaking ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-bethel-amber"
            style={{ animation: "bh-ring 1.8s ease-out infinite" }}
          />
        ) : null}
        {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      {hasPlayed && !speaking ? (
        <span className="rounded-full bg-[#fffdf9] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-bethel-clay-soft shadow">
          Replay
        </span>
      ) : null}
    </div>
  );
}
