"use client";

import Link from "next/link";
import { MessageCircle, RotateCcw } from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8ee",
          color: "#2e2e2e",
          fontFamily: "Georgia, serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p style={{ letterSpacing: "0.22em", fontSize: 12, textTransform: "uppercase", color: "#5b3a28" }}>
            Error 500
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, color: "#212d39", margin: "12px 0" }}>
            Something went wrong in the kitchen.
          </h1>
          <p style={{ lineHeight: 1.7, color: "#4a4238" }}>
            {error.message || "The application could not start."} Message the butchery on WhatsApp
            at {SITE.whatsappDisplay} and we will take your order by hand.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#ed0121",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "12px 22px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "-3px" }} />
              Try Again
            </button>
            <a
              href={WHATSAPP_LINK}
              style={{
                border: "1.5px solid rgba(33,45,57,0.25)",
                color: "#212d39",
                borderRadius: 999,
                padding: "12px 22px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <MessageCircle size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "-3px" }} />
              WhatsApp
            </a>
            <Link href="/shop" style={{ color: "#ed0121", alignSelf: "center" }}>
              Back to Shop
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
