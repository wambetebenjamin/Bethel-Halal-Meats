"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Loader2, MessageCircle, Truck } from "lucide-react";
import { formatKES } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";

type ConfirmationOrder = {
  ref: string;
  eta: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "mpesa" | "cash";
  paymentStatus: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    zoneName: string;
    deliveryDate: string;
    instructions: string;
  };
  items: {
    name: string;
    weightLabel: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
};

const STORAGE_KEY = "bethel_halal_last_order";

export function OrderConfirmationClient() {
  const [order, setOrder] = useState<ConfirmationOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setOrder(JSON.parse(raw) as ConfirmationOrder);
    } catch {
      setOrder(null);
    }
    setLoaded(true);
  }, []);

  async function downloadReceipt() {
    if (!order) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;
      let cursor = 64;

      doc.setFillColor(255, 248, 238);
      doc.rect(0, 0, pageWidth, 842, "F");

      doc.setFillColor(237, 1, 33);
      doc.rect(0, 0, pageWidth, 8, "F");

      doc.setTextColor(33, 45, 57);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Bethel Halal Meats", margin, cursor);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(91, 58, 40);
      doc.text(SITE.tagline, margin, cursor + 16);
      doc.text(SITE.address, margin, cursor + 30);
      doc.text(`WhatsApp ${SITE.whatsappDisplay}`, margin, cursor + 44);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(33, 45, 57);
      doc.text("Order receipt", pageWidth - margin, cursor, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Reference ${order.ref}`, pageWidth - margin, cursor + 16, { align: "right" });
      doc.text(
        new Date(order.createdAt).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        pageWidth - margin,
        cursor + 30,
        { align: "right" },
      );

      cursor += 78;
      doc.setDrawColor(232, 211, 186);
      doc.line(margin, cursor, pageWidth - margin, cursor);
      cursor += 26;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Deliver to", margin, cursor);
      doc.text("Order details", pageWidth / 2 + 10, cursor);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const leftLines = [
        order.customer.name,
        order.customer.phone,
        order.customer.address,
        `${order.customer.zoneName}, Nairobi`,
        `Date: ${order.customer.deliveryDate}`,
      ];
      const rightLines = [
        `Status: ${order.status}`,
        `Payment: ${order.paymentMethod === "mpesa" ? "M-Pesa" : "Cash on delivery"}`,
        `Payment state: ${order.paymentStatus}`,
        `Delivery: ${order.eta}`,
      ];
      leftLines.forEach((line, index) => {
        doc.text(doc.splitTextToSize(line, pageWidth / 2 - margin - 20), margin, cursor + 16 + index * 14);
      });
      rightLines.forEach((line) => {
        doc.text(line, pageWidth / 2 + 10, cursor + 16 + rightLines.indexOf(line) * 14);
      });

      cursor += 104;

      doc.setFillColor(244, 231, 214);
      doc.rect(margin, cursor, pageWidth - margin * 2, 24, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(58, 36, 24);
      doc.text("Item", margin + 10, cursor + 16);
      doc.text("Pack", margin + 250, cursor + 16);
      doc.text("Qty", margin + 330, cursor + 16);
      doc.text("Unit", margin + 380, cursor + 16);
      doc.text("Total", pageWidth - margin - 10, cursor + 16, { align: "right" });

      cursor += 24;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(46, 46, 46);

      order.items.forEach((item) => {
        if (cursor > 720) {
          doc.addPage();
          cursor = 60;
        }
        doc.text(item.name, margin + 10, cursor + 16);
        doc.text(item.weightLabel, margin + 250, cursor + 16);
        doc.text(String(item.quantity), margin + 335, cursor + 16);
        doc.text(formatKES(item.unitPrice), margin + 380, cursor + 16);
        doc.text(formatKES(item.lineTotal), pageWidth - margin - 10, cursor + 16, {
          align: "right",
        });
        cursor += 22;
        doc.setDrawColor(238, 226, 212);
        doc.line(margin, cursor, pageWidth - margin, cursor);
      });

      cursor += 18;
      const totals: [string, string][] = [
        ["Subtotal", formatKES(order.subtotal)],
        ["Delivery", order.deliveryFee === 0 ? "Free" : formatKES(order.deliveryFee)],
        ["Total", formatKES(order.total)],
      ];
      totals.forEach(([label, value], index) => {
        const isTotal = index === totals.length - 1;
        doc.setFont("helvetica", isTotal ? "bold" : "normal");
        doc.setFontSize(isTotal ? 12 : 10);
        if (isTotal) {
          doc.setTextColor(237, 1, 33);
        } else {
          doc.setTextColor(46, 46, 46);
        }
        doc.text(label, pageWidth - margin - 150, cursor + index * 18);
        doc.text(value, pageWidth - margin - 10, cursor + index * 18, { align: "right" });
      });

      cursor += 76;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(91, 58, 40);
      if (order.customer.instructions) {
        doc.text(`Instructions: ${order.customer.instructions}`, margin, cursor);
        cursor += 16;
      }
      doc.text(
        "Every cut in this order is halal certified at a licensed abattoir. Keep refrigerated and cook within 48 hours.",
        margin,
        cursor,
        { maxWidth: pageWidth - margin * 2 },
      );
      cursor += 26;
      doc.text(`Questions? WhatsApp ${SITE.whatsappDisplay} or email ${SITE.email}.`, margin, cursor);

      doc.save(`bethel-order-${order.ref}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-2xl bg-bethel-sand/50" aria-hidden="true" />;
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold text-bethel-charcoal">No recent order on this device</h2>
        <p className="mx-auto mt-2 max-w-md text-bethel-ink/70">
          Your order confirmation is kept in this browser session. If you have just placed an order
          and this page is blank, message the butchery on WhatsApp with your name and we will find it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="bh-btn bh-btn-primary">
            <MessageCircle className="h-4 w-4" />
            WhatsApp the butchery
          </a>
          <Link href="/shop" className="bh-btn bh-btn-outline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const orderMessage = `Hello Bethel Halal Meats, I would like to follow up on order ${order.ref}.`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[22px] border border-bethel-line bg-[#fffdf9] p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bethel-sand">
            <CheckCircle2 className="h-6 w-6 text-bethel-red" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-bethel-clay-soft">Order received</p>
            <h2 className="text-2xl font-semibold text-bethel-charcoal">
              Thank you, {order.customer.name.split(" ")[0]}
            </h2>
            <p className="mt-1 text-sm text-bethel-ink/70">
              A butcher will confirm your cuts by phone shortly. Keep your reference handy.
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-bethel-sand/60 px-4 py-3">
            <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-bethel-clay-soft">
              Order reference
            </dt>
            <dd className="text-lg font-semibold tracking-wide text-bethel-charcoal">{order.ref}</dd>
          </div>
          <div className="rounded-xl bg-bethel-sand/60 px-4 py-3">
            <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-bethel-clay-soft">
              Estimated delivery
            </dt>
            <dd className="flex items-center gap-2 text-sm font-semibold text-bethel-charcoal">
              <Truck className="h-4 w-4 text-bethel-red" />
              {order.eta}
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-bethel-clay">
          Order summary
        </h3>
        <ul className="mt-2 divide-y divide-bethel-line">
          {order.items.map((item) => (
            <li key={`${item.name}-${item.weightLabel}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span>
                <span className="block font-medium text-bethel-charcoal">{item.name}</span>
                <span className="block text-xs text-bethel-clay-soft">
                  {item.weightLabel} x {item.quantity}
                </span>
              </span>
              <span className="font-semibold text-bethel-charcoal">{formatKES(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-3 space-y-1.5 border-t border-bethel-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-bethel-ink/70">Subtotal</dt>
            <dd>{formatKES(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bethel-ink/70">Delivery to {order.customer.zoneName}</dt>
            <dd>{order.deliveryFee === 0 ? "Free" : formatKES(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold text-bethel-charcoal">
            <dt>Total</dt>
            <dd className="text-bethel-red">{formatKES(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-xl border border-bethel-line px-4 py-3 text-sm text-bethel-ink/75">
          <p className="font-semibold text-bethel-charcoal">
            {order.paymentMethod === "mpesa" ? "M-Pesa payment" : "Cash on delivery"}
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            {order.paymentMethod === "mpesa"
              ? `We will send an M-Pesa prompt to ${order.customer.phone} when the rider leaves. You can also pay to our till number and quote ${order.ref}.`
              : `Please have ${formatKES(order.total)} ready for the rider. A receipt is issued on delivery.`}
          </p>
        </div>

        {order.customer.instructions ? (
          <p className="mt-3 text-xs text-bethel-ink/65">
            <span className="font-semibold text-bethel-charcoal">Your instructions: </span>
            {order.customer.instructions}
          </p>
        ) : null}
      </motion.div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
          <h2 className="text-base font-semibold text-bethel-charcoal">What happens next</h2>
          <ol className="mt-3 space-y-3 text-sm text-bethel-ink/75">
            {[
              "The butchery checks stock and calls you if a cut needs substituting.",
              "Your order is cut, weighed and packed on ice.",
              "The rider calls when they are close, then hands over at your gate.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bethel-sand text-[0.65rem] font-semibold text-bethel-clay">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-bethel-line bg-[#fffdf9] p-5">
          <h2 className="text-base font-semibold text-bethel-charcoal">Your receipt</h2>
          <p className="mt-1 text-xs text-bethel-ink/65">
            Download a PDF copy for your records or to share with your household.
          </p>
          <button
            type="button"
            onClick={downloadReceipt}
            disabled={downloading}
            className="bh-btn bh-btn-dark mt-3 w-full"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing PDF
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download order receipt
              </>
            )}
          </button>
          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="bh-btn bh-btn-primary mt-2 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp about this order
          </a>
          <Link href="/shop" className="mt-2 block text-center text-xs uppercase tracking-[0.14em] text-bethel-clay-soft hover:text-bethel-red">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
