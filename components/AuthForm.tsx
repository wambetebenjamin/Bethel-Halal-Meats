"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { executeRecaptcha, recaptchaConfigured } from "@/lib/recaptcha-client";
import { RecaptchaV2 } from "./RecaptchaV2";
import { signInSchema, signUpSchema } from "@/lib/validation";

type Mode = "signin" | "signup";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function AuthForm({ mode, googleEnabled }: { mode: Mode; googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/account";
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    setSubmitting(true);

    try {
      const token = await executeRecaptcha(mode === "signup" ? "signup" : "signin");

      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ ...values, recaptchaToken: token });
        if (!parsed.success) {
          const issues = parsed.error.flatten().fieldErrors;
          (["email", "password"] as const).forEach((key) => {
            const message = issues[key]?.[0];
            if (message) setError(key, { message });
          });
          setSubmitting(false);
          return;
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const data = (await response.json()) as { error?: string; code?: string };

        if (!response.ok) {
          if (data.code === "CAPTCHA_V2_REQUIRED") {
            setNeedsV2(true);
            setServerError("Complete the visible security check, then submit again.");
          } else {
            setServerError(data.error ?? "We could not create that account.");
          }
          setSubmitting(false);
          return;
        }
      } else {
        const parsed = signInSchema.safeParse({
          email: values.email,
          password: values.password,
          recaptchaToken: token,
        });
        if (!parsed.success) {
          const issues = parsed.error.flatten().fieldErrors;
          (["email", "password"] as const).forEach((key) => {
            const message = issues[key]?.[0];
            if (message) setError(key, { message });
          });
          setSubmitting(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(
          mode === "signup"
            ? "Account created, but the automatic sign in failed. Try signing in."
            : "That email and password do not match an account.",
        );
        setSubmitting(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[22px] border border-bethel-line bg-[#fffdf9] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h1 className="text-2xl font-semibold text-bethel-charcoal">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-bethel-ink/70">
          {mode === "signup"
            ? "Save your delivery addresses and follow every order in one place."
            : "Sign in to see past orders and saved addresses."}
        </p>

        {googleEnabled ? (
          <>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="bh-btn bh-btn-outline mt-5 w-full"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1a7 7 0 0 1-6.6-4.8H1.4v3.1A12 12 0 0 0 12 24Z"
                />
                <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.6l4-2.9Z" />
                <path
                  fill="#EA4335"
                  d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1A7 7 0 0 1 12 4.8Z"
                />
              </svg>
              Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-bethel-ink/45">
              <span className="h-px flex-1 bg-bethel-line" />
              or use email
              <span className="h-px flex-1 bg-bethel-line" />
            </div>
          </>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {mode === "signup" ? (
            <div>
              <label className="bh-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                autoComplete="name"
                className="bh-input"
                placeholder="Amina Hassan"
                {...register("name", { required: mode === "signup" ? "Enter your name" : false })}
              />
              {errors.name ? <p className="mt-1 text-xs text-bethel-red">{errors.name.message}</p> : null}
            </div>
          ) : null}

          <div>
            <label className="bh-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="bh-input"
              placeholder="you@example.com"
              {...register("email", { required: "Enter your email address" })}
            />
            {errors.email ? <p className="mt-1 text-xs text-bethel-red">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="bh-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="bh-input"
              placeholder={mode === "signup" ? "At least 8 characters with a number" : "Your password"}
              {...register("password", { required: "Enter your password" })}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-bethel-red">{errors.password.message}</p>
            ) : null}
          </div>

          {mode === "signup" ? (
            <div>
              <label className="bh-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="bh-input"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                })}
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-bethel-red">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          ) : null}

          {needsV2 ? <RecaptchaV2 onToken={setV2Token} onExpired={() => setV2Token("")} /> : null}

          {serverError ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-[#fdecec] px-3 py-2.5 text-xs leading-snug text-[#8a1420]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {serverError}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="bh-btn bh-btn-primary w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                {mode === "signup" ? "Create account" : "Sign in"}
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-bethel-ink/70">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-semibold text-bethel-red hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/auth/signup" className="font-semibold text-bethel-red hover:underline">
                Create an account
              </Link>
            </>
          )}
        </p>

        <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-bethel-ink/50">
          {recaptchaConfigured()
            ? "Protected by reCAPTCHA. Google's privacy and terms apply."
            : "reCAPTCHA keys are not configured in this environment."}
        </p>
      </div>

      {mode === "signin" ? (
        <div className="mt-4 rounded-xl border border-dashed border-bethel-line bg-bethel-sand/40 px-4 py-3 text-xs leading-relaxed text-bethel-clay">
          <span className="font-semibold">Preview account. </span>
          demo@bethelhalalmeats.co.ke with password BethelDemo1, available until KV storage is
          configured.
        </div>
      ) : null}
    </div>
  );
}
