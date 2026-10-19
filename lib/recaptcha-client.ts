"use client";

let scriptPromise: Promise<boolean> | null = null;

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

export function getSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
}

export function recaptchaConfigured() {
  return Boolean(getSiteKey());
}

function loadScript(src: string, id: string) {
  return new Promise<boolean>((resolve) => {
    if (typeof document === "undefined") return resolve(false);
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve(true);
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve(true);
    });
    script.addEventListener("error", () => resolve(false));
    document.head.appendChild(script);
  });
}

export function loadRecaptchaV3() {
  if (!recaptchaConfigured()) return Promise.resolve(false);
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!scriptPromise) {
    scriptPromise = loadScript(
      `https://www.google.com/recaptcha/api.js?render=${getSiteKey()}`,
      "recaptcha-v3",
    );
  }
  return scriptPromise;
}

export function loadRecaptchaV2() {
  if (!recaptchaConfigured()) return Promise.resolve(false);
  return loadScript("https://www.google.com/recaptcha/api.js?render=explicit", "recaptcha-v2");
}

/**
 * Runs an invisible reCAPTCHA v3 check. When no site key is configured the
 * function returns an empty string and the server treats the check as skipped.
 */
export async function executeRecaptcha(action: string) {
  if (!recaptchaConfigured()) return "";
  const loaded = await loadRecaptchaV3();
  if (!loaded || !window.grecaptcha) return "";

  return new Promise<string>((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(getSiteKey(), { action });
        resolve(token);
      } catch {
        resolve("");
      }
    });
    window.setTimeout(() => resolve(""), 8000);
  });
}
