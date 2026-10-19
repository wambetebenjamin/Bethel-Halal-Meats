import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Bethel Halal Meats account to see past orders and saved addresses.",
  robots: { index: false, follow: false },
};

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/account");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="bh-container flex flex-col items-center py-14 sm:py-20">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-bethel-sand/50" />}>
        <AuthForm mode="signin" googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
