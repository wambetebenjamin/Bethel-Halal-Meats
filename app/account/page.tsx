import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountClient } from "@/components/AccountClient";

export const metadata: Metadata = {
  title: "Your account",
  description: "Past orders, saved delivery addresses and favourite cuts.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  return (
    <div className="bh-container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-bethel-clay-soft">
        <Link href="/" className="hover:text-bethel-red">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bethel-charcoal">Account</span>
      </nav>

      <div className="mt-4 border-b border-bethel-line pb-8">
        <p className="bh-eyebrow">Your butchery file</p>
        <h1 className="bh-title bh-rule-left mt-3">Account</h1>
        <p className="max-w-xl text-bethel-ink/70">
          Orders, addresses and the cuts you keep coming back for, all in one place.
        </p>
      </div>

      <div className="mt-8">
        <AccountClient
          name={session.user.name ?? "Customer"}
          email={session.user.email ?? ""}
        />
      </div>
    </div>
  );
}
