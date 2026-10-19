import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Bethel Halal Meats account to save addresses and follow your orders.",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/account");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="bh-container flex flex-col items-center py-14 sm:py-20">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-bethel-sand/50" />}>
        <AuthForm mode="signup" googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
