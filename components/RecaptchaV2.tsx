"use client";

import { useEffect, useRef, useState } from "react";
import { getSiteKey, loadRecaptchaV2, recaptchaConfigured } from "@/lib/recaptcha-client";

type Grecaptcha = NonNullable<Window["grecaptcha"]>;

/**
 * Visible checkbox fallback. The server asks for this when a v3 score falls
 * below 0.5, so the visitor can still prove they are human and submit.
 */
export function RecaptchaV2({
  onToken,
  onExpired,
}: {
  onToken: (token: string) => void;
  onExpired?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const widgetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!recaptchaConfigured()) return;
    let cancelled = false;

    loadRecaptchaV2()
      .then((ok) => {
        if (cancelled) return;
        setLoaded(ok);
        if (!ok) setFailed(true);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const grecaptcha = window.grecaptcha as Grecaptcha | undefined;
    if (!grecaptcha || widgetRef.current !== null) return;

    const render = () => {
      if (!containerRef.current) return;
      widgetRef.current = grecaptcha.render(containerRef.current, {
        sitekey: getSiteKey(),
        theme: "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onExpired?.(),
      });
    };

    grecaptcha.ready(render);
  }, [loaded, onToken, onExpired]);

  if (!recaptchaConfigured()) {
    return (
      <p className="rounded-lg bg-bethel-sand/70 px-3 py-2 text-xs text-bethel-ink/70">
        reCAPTCHA is not configured in this environment.
      </p>
    );
  }

  if (failed) {
    return (
      <p className="rounded-lg bg-bethel-sand/70 px-3 py-2 text-xs text-bethel-ink/70">
        The security check could not load. Check your connection and try again.
      </p>
    );
  }

  return <div ref={containerRef} className="min-h-[70px]" />;
}
