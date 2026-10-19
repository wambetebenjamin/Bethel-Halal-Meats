"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { checkoutSchema } from "@/lib/validation";
import { executeRecaptcha, recaptchaConfigured } from "@/lib/recaptcha-client";
import { RecaptchaV2 } from "./RecaptchaV2";
import { formatKES } from "@/lib/format";
import { DELIVERY_ZONES, SITE, findZone } from "@/lib/site";

type FormValues = {
  name: string;
  phone: string;
  address: string;
  zone: string;
  deliveryDate: string;
  instructions: string;
  paymentMethod: "mpesa" | "cash";
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function CheckoutClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  const zone = useCart((state) => state.zone);
  const setZone = useCart((state) => state.setZone);
  const clearCart = useCart((state) => state.clearCart);

  const [serverError, setServerError] = useState("");
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      zone: zone ?? "",
      deliveryDate: tomorrow(),
      instructions: "",
      paymentMethod: "mpesa",
    },
  });

  useEffect(() => {
    setMounted(true);
    if (zone) setValue("zone", zone);
  }, [zone, setValue]);

  const subtotal = cartSubtotal(items);
  const selectedZone = findZone(zone);
  const deliveryFee = subtotal >= SITE.freeDeliveryThreshold ? 0 : selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  async function onSubmit(values: FormValues) {
    setServerError("");
    setSubmitting(true);

    try {
      const token = await executeRecaptcha("checkout");
      if (v2Token) setNeedsV2(false);

      const payload = {
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          weightGrams: item.weightGrams,
          quantity: item.quantity,
        })),
        recaptchaToken: token,
        captchaV2Token: v2Token || undefined,
      };

      const parsed = checkoutSchema.safeParse(payload);
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        (Object.keys(fieldErrors) as (keyof FormValues)[]).forEach((key) => {
          const message = fieldErrors[key]?.[0];
          if (message) setError(key, { message });
        });
        setServerError("Please check the highlighted fields.");
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
        code?: string;
        order?: unknown;
      };

      if (!response.ok) {
        if (data.code === "CAPTCHA_V2_REQUIRED") {
          setNeedsV2(true);
          setServerError("A quick visible check is needed before we can accept this order.");
        } else {
          setServerError(data.error ?? "We could not place this order. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.setItem("bethel_halal_last_order", JSON.stringify(data.order));
      } catch {
        // confirmation page falls back to the reference notice
      }

      setDone(true);
      clearCart();
      router.push("/order-confirmation");
    } catch {
      setServerError("Something went wrong on the way to the butchery. Please try again.");
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return <div className="h-72 animate-pulse rounded-2xl bg-bethel-sand/50" aria-hidden="true" />;
  }

  if (items.length === 0 && !done) {
    return (
      <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold text-bethel-charcoal">There is nothing to check out</h2>
        <p className="mx-auto mt-2 max-w-sm text-bethel-ink/70">
          Add a cut to your basket first. Delivery is calculated from the zone you choose here.
        </p>
        <Link href="/shop" className="bh-btn bh-btn-primary mt-6">
          Go to the shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
          <h2 className="text-lg font-semibold text-bethel-charcoal">Delivery details</h2>
          <p className="mt-1 text-sm text-bethel-ink/65">
            We only use these details to deliver this order and to reach you about it.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="bh-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                autoComplete="name"
                className="bh-input"
                placeholder="Amina Hassan"
                aria-invalid={errors.name ? "true" : "false"}
                {...register("name", { required: "Enter the full name for delivery" })}
              />
              {errors.name ? <p className="mt-1 text-xs text-bethel-red">{errors.name.message}</p> : null}
            </div>

            <div>
              <label className="bh-label" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="bh-input"
                placeholder="0712 345 678"
                aria-invalid={errors.phone ? "true" : "false"}
                {...register("phone", { required: "Enter a phone number" })}
              />
              {errors.phone ? <p className="mt-1 text-xs text-bethel-red">{errors.phone.message}</p> : null}
            </div>

            <div>
              <label className="bh-label" htmlFor="zone">
                Delivery zone
              </label>
              <select
                id="zone"
                className="bh-input"
                aria-invalid={errors.zone ? "true" : "false"}
                {...register("zone", {
                  required: "Choose your delivery zone",
                  onChange: (event) => setZone(event.target.value),
                })}
              >
                <option value="">Choose an area</option>
                {DELIVERY_ZONES.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name} ({formatKES(entry.fee)})
                  </option>
                ))}
              </select>
              {errors.zone ? <p className="mt-1 text-xs text-bethel-red">{errors.zone.message}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="bh-label" htmlFor="address">
                Delivery address
              </label>
              <input
                id="address"
                autoComplete="street-address"
                className="bh-input"
                placeholder="Building name, street, house or apartment number"
                aria-invalid={errors.address ? "true" : "false"}
                {...register("address", { required: "Add the building, street and house number" })}
              />
              {errors.address ? (
                <p className="mt-1 text-xs text-bethel-red">{errors.address.message}</p>
              ) : null}
            </div>

            <div>
              <label className="bh-label" htmlFor="deliveryDate">
                Delivery date
              </label>
              <input
                id="deliveryDate"
                type="date"
                min={today()}
                className="bh-input"
                aria-invalid={errors.deliveryDate ? "true" : "false"}
                {...register("deliveryDate", { required: "Choose a delivery date" })}
              />
              {errors.deliveryDate ? (
                <p className="mt-1 text-xs text-bethel-red">{errors.deliveryDate.message}</p>
              ) : null}
            </div>

            <div>
              <label className="bh-label" htmlFor="instructions">
                Special instructions
              </label>
              <input
                id="instructions"
                className="bh-input"
                placeholder="Diced small, skin removed, no bones"
                {...register("instructions")}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-bethel-sand/60 px-3 py-2.5 text-xs text-bethel-clay">
            Tell us how you want it cut, whether the skin should stay on, or if the driver should
            call on arrival.
          </div>
        </section>

        <fieldset className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
          <legend className="px-1 text-lg font-semibold text-bethel-charcoal">Payment</legend>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-bethel-line p-3.5 transition has-checked:border-bethel-red has-checked:bg-bethel-sand/40">
              <input
                type="radio"
                value="mpesa"
                className="mt-1 h-4 w-4 accent-[#ed0121]"
                {...register("paymentMethod")}
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-bethel-charcoal">
                  M-Pesa
                  <span className="rounded-full bg-bethel-red px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white">
                    Primary
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-snug text-bethel-ink/65">
                  Pay to our till number. The payment prompt is sent when the rider leaves the
                  butchery.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-bethel-line p-3.5 transition has-checked:border-bethel-red has-checked:bg-bethel-sand/40">
              <input
                type="radio"
                value="cash"
                className="mt-1 h-4 w-4 accent-[#ed0121]"
                {...register("paymentMethod")}
              />
              <span>
                <span className="block text-sm font-semibold text-bethel-charcoal">
                  Cash on delivery
                </span>
                <span className="mt-1 block text-xs leading-snug text-bethel-ink/65">
                  Pay the rider in cash when your order arrives. Please have the exact total ready.
                </span>
              </span>
            </label>
          </div>
          {errors.paymentMethod ? (
            <p className="mt-1 text-xs text-bethel-red">{errors.paymentMethod.message}</p>
          ) : null}
        </fieldset>

        <section className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-bethel-charcoal">
            <Lock className="h-4 w-4 text-bethel-red" />
            Security check
          </h2>
          <p className="mt-1 text-xs text-bethel-ink/60">
            {recaptchaConfigured()
              ? "This form is protected by reCAPTCHA v3. The check runs in the background."
              : "reCAPTCHA keys are not set in this environment, so the check is skipped."}
          </p>
          {needsV2 ? (
            <div className="mt-3">
              <RecaptchaV2 onToken={setV2Token} onExpired={() => setV2Token("")} />
            </div>
          ) : null}
        </section>
      </div>

      <aside className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5 lg:sticky lg:top-[calc(var(--bh-header-height)+1rem)]">
        <h2 className="text-lg font-semibold text-bethel-charcoal">Order summary</h2>
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bethel-sand">
                <Image src={item.image} alt={item.imageAlt} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-bethel-charcoal">{item.name}</p>
                <p className="text-xs text-bethel-clay-soft">
                  {item.weightLabel} x {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-bethel-charcoal">
                {formatKES(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-bethel-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-bethel-ink/70">Subtotal</dt>
            <dd className="font-semibold">{formatKES(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bethel-ink/70">Delivery</dt>
            <dd className="font-semibold">
              {!zone ? "Choose a zone" : deliveryFee === 0 ? "Free" : formatKES(deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-bethel-line pt-3 text-base">
            <dt className="font-semibold text-bethel-charcoal">Total</dt>
            <dd className="font-semibold text-bethel-red">{formatKES(total)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-bethel-ink/60">
          {selectedZone
            ? `Delivery to ${selectedZone.name}, ${selectedZone.eta} after the butcher confirms.`
            : "Choose a delivery zone to see the fee and timing."}
        </p>

        {serverError ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl bg-[#fdecec] px-3 py-2.5 text-xs leading-snug text-[#8a1420]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className="bh-btn bh-btn-primary mt-4 w-full">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing order
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Place order
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[0.68rem] leading-snug text-bethel-ink/55">
          By placing this order you agree to our{" "}
          <Link href="/legal/terms" className="text-bethel-red underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy-policy" className="text-bethel-red underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}
