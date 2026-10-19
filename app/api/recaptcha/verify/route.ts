import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { recaptchaVerifySchema } from "@/lib/validation";

/** POST /api/recaptcha/verify. Server side verification for any form token. */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = recaptchaVerifySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A token is required", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const result = await verifyRecaptcha(parsed.data.token, parsed.data.action);

  return NextResponse.json(
    {
      success: result.ok,
      skipped: result.skipped,
      score: result.score ?? null,
      action: result.action ?? null,
      requiresV2: result.requiresV2,
      errors: result.errors ?? [],
    },
    { status: result.ok ? 200 : 400 },
  );
}
