"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Character stagger reveal for the hero headline. Runs on load only and is
 * skipped entirely for visitors who prefer reduced motion.
 */
export function HeroHeading({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const chars = node.querySelectorAll<HTMLSpanElement>("[data-char]");
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    const timeline = gsap.timeline({ delay: 0.15 });
    timeline.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.62,
      ease: "power3.out",
      stagger: { each: 0.018, from: "start" },
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <h1 ref={containerRef} className={className}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-1">
          <span className="block">
            {line.split(" ").map((word, wordIndex) => (
              <span key={`${line}-${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={`${word}-${charIndex}`}
                    data-char
                    className="inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
                {wordIndex < line.split(" ").length - 1 ? <span>&nbsp;</span> : null}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
