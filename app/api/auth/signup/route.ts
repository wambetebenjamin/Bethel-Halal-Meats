import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validation";
import { createUser } from "@/lib/users";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "signup");
  if (!captcha.ok) {
    return NextResponse.json(
      {
        error: captcha.requiresV2
          ? "Please complete the visible security check"
          : "The security check did not pass. Please try again.",
        code: captcha.requiresV2 ? "CAPTCHA_V2_REQUIRED" : "CAPTCHA_FAILED",
      },
      { status: 400 },
    );
  }

  const result = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: { email: [result.error] } },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { ok: true, user: { id: result.user.id, name: result.user.name, email: result.user.email } },
    { status: 201 },
  );
}
