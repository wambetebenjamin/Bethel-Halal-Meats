const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type RecaptchaResult = {
  ok: boolean;
  skipped: boolean;
  score?: number;
  action?: string;
  requiresV2: boolean;
  errors?: string[];
};

/**
 * Verifies a reCAPTCHA token on the server.
 * When RECAPTCHA_SECRET_KEY is not configured the check is skipped so that the
 * site stays usable in local development. In production the key must be set.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return { ok: true, skipped: true, requiresV2: false };
  }

  if (!token) {
    return {
      ok: false,
      skipped: false,
      requiresV2: false,
      errors: ["missing-input-response"],
    };
  }

  // A v2 fallback token is sent as "v2:<token>", which we verify with the same secret.
  const isV2 = token.startsWith("v2:");
  const responseToken = isV2 ? token.slice(3) : token;

  try {
    const body = new URLSearchParams({ secret, response: responseToken });
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        ok: false,
        skipped: false,
        requiresV2: false,
        errors: data["error-codes"] ?? ["verification-failed"],
      };
    }

    // v2 responses have no score and are treated as a pass once verified.
    if (isV2 || typeof data.score !== "number") {
      return { ok: true, skipped: false, requiresV2: false, action: data.action };
    }

    const actionMatches = !expectedAction || data.action === expectedAction;
    if (data.score < 0.5) {
      return {
        ok: false,
        skipped: false,
        score: data.score,
        action: data.action,
        requiresV2: true,
        errors: ["low-score"],
      };
    }

    if (!actionMatches) {
      return {
        ok: false,
        skipped: false,
        score: data.score,
        action: data.action,
        requiresV2: false,
        errors: ["action-mismatch"],
      };
    }

    return {
      ok: true,
      skipped: false,
      score: data.score,
      action: data.action,
      requiresV2: false,
    };
  } catch {
    return {
      ok: false,
      skipped: false,
      requiresV2: false,
      errors: ["verification-unavailable"],
    };
  }
}

export function recaptchaPublicConfig() {
  return {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
    configured: Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
  };
}
