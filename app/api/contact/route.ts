import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";

const ORDER_TYPES: Record<string, string> = {
  bulk: "Bulk family order",
  wedding: "Wedding order",
  event: "Event catering",
  corporate: "Corporate supply",
  general: "General enquiry",
};

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const captcha = await verifyRecaptcha(
    data.captchaV2Token ? `v2:${data.captchaV2Token}` : data.recaptchaToken,
    "contact",
  );

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

  const result = await sendMail({
    subject: `[Bethel Halal Meats] ${ORDER_TYPES[data.orderType] ?? "Enquiry"} from ${data.name}`,
    replyTo: data.email,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "not given"}`,
      `Order type: ${ORDER_TYPES[data.orderType] ?? data.orderType}`,
      "",
      data.message,
    ].join("\n"),
  });

  return NextResponse.json({
    ok: true,
    delivered: result.sent,
    message: result.sent
      ? "Thank you. Your message is with the butchery and we will reply shortly."
      : "Thank you. Your message has been recorded. Email delivery is not configured in this environment, so please also reach us on WhatsApp.",
  });
}
