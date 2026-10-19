"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema } from "@/lib/validation";
import { executeRecaptcha } from "@/lib/recaptcha-client";
import { RecaptchaV2 } from "./RecaptchaV2";
import { whatsappLink } from "@/lib/site";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  orderType: "bulk" | "wedding" | "event" | "corporate" | "general";
  message: string;
};

const ORDER_TYPES: { value: FormValues["orderType"]; label: string }[] = [
  { value: "bulk", label: "Bulk family order" },
  { value: "wedding", label: "Wedding order" },
  { value: "event", label: "Event catering" },
  { value: "corporate", label: "Corporate supply" },
  { value: "general", label: "Something else" },
];

const labelClass = "block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-bethel-clay-soft";
const fieldClass =
  "mt-1.5 w-full rounded-xl border border-bethel-line bg-white px-3.5 py-2.5 text-sm text-bethel-charcoal outline-none transition focus:border-bethel-red focus:ring-2 focus:ring-bethel-red/15";

export function QuoteForm() {
  const [serverError, setServerError] = useState("");
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      orderType: "bulk",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    setSubmitting(true);

    try {
      const token = await executeRecaptcha("contact");
      const payload = {
        ...values,
        recaptchaToken: token,
        captchaV2Token: v2Token || undefined,
      };

      const parsed = contactSchema.safeParse(payload);
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        (["name", "email", "phone", "message"] as const).forEach((key) => {
          const message = fieldErrors[key]?.[0];
          if (message) setError(key, { message });
        });
        setServerError("Please check the highlighted fields.");
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        error?: string;
        code?: string;
        message?: string;
      };

      if (!response.ok) {
        if (data.code === "CAPTCHA_V2_REQUIRED") {
          setNeedsV2(true);
          setServerError("A quick visible check is needed before we can send this.");
        } else {
          setServerError(data.error ?? "We could not send that. Please try WhatsApp instead.");
        }
        setSubmitting(false);
        return;
      }

      setSentMessage(
        data.message ??
          "Thank you. Your message is with the butchery and we will reply shortly.",
      );
      setSubmitting(false);
    } catch {
      setServerError("Something went wrong on the way to the butchery. Please try again.");
      setSubmitting(false);
    }
  }

  if (sentMessage) {
    return (
      <div
        role="status"
        className="mt-6 rounded-2xl border border-bethel-line bg-[#fffdf9] p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bethel-red" strokeWidth={1.8} />
          <div>
            <p className="font-semibold text-bethel-charcoal">Message received</p>
            <p className="mt-1 text-sm leading-relaxed text-bethel-ink/70">{sentMessage}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={whatsappLink(
                  "Hello Bethel Halal Meats, I have just sent a quote request through the website.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bh-btn bh-btn-primary px-4 py-2 text-sm"
              >
                Continue on WhatsApp
              </a>
              <Link href="/shop" className="bh-btn bh-btn-outline px-4 py-2 text-sm">
                Browse the counter
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-6 rounded-2xl border border-bethel-line bg-[#fffdf9] p-5"
    >
      <p className="text-sm font-semibold text-bethel-charcoal">Tell us about the order</p>
      <p className="mt-1 text-xs leading-relaxed text-bethel-ink/60">
        We reply within one working hour, Monday to Saturday. For same day delivery, message us on
        WhatsApp.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className={labelClass}>
            Name
          </label>
          <input
            id="quote-name"
            type="text"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={errors.name ? true : undefined}
            {...register("name")}
          />
          {errors.name ? <p className="mt-1 text-xs text-bethel-red">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="quote-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            className={fieldClass}
            {...register("phone")}
          />
        </div>

        <div>
          <label htmlFor="quote-email" className={labelClass}>
            Email
          </label>
          <input
            id="quote-email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-bethel-red">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="quote-type" className={labelClass}>
            Order type
          </label>
          <select id="quote-type" className={fieldClass} {...register("orderType")}>
            {ORDER_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="quote-message" className={labelClass}>
            Headcount, cuts and date
          </label>
          <textarea
            id="quote-message"
            rows={3}
            placeholder="For example, 60 guests on 14 November, 25kg goat and 15kg beef, delivered to Karen by 9am."
            className={`${fieldClass} resize-y`}
            aria-invalid={errors.message ? true : undefined}
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-bethel-red">{errors.message.message}</p>
          ) : null}
        </div>
      </div>

      {needsV2 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-bethel-clay-soft">
            Security check
          </p>
          <RecaptchaV2 onToken={setV2Token} onExpired={() => setV2Token("")} />
        </div>
      ) : null}

      {serverError ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-bethel-red/5 px-3 py-2 text-xs text-bethel-red">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
          {serverError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bh-btn bh-btn-primary px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {submitting ? "Sending" : "Request a quote"}
        </button>
        <p className="text-xs text-bethel-ink/55">
          We use these details to answer your enquiry only. See the{" "}
          <Link href="/legal/privacy-policy" className="underline decoration-bethel-line underline-offset-2 hover:text-bethel-red">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
