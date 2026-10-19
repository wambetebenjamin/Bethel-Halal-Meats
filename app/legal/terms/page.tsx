import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms that apply when you order halal meat from Bethel Halal Meats for delivery in Nairobi.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="These terms apply when you place an order through this website or by WhatsApp with Bethel Halal Meats."
      updated="19 October 2026"
    >
      <h2>Ordering</h2>
      <p>
        An order is an offer to buy. It is accepted when we confirm your cuts by phone or message. If
        a cut is unavailable we will offer a substitute or remove it and adjust the total.
      </p>

      <h2>Prices and weights</h2>
      <ul>
        <li>All prices are in Kenyan shillings and include VAT where it applies.</li>
        <li>Meat is priced per kilogram. Pack weights are cut to order and may vary by up to five percent.</li>
        <li>Where a pack weighs slightly more or less, the final total is adjusted to the actual weight.</li>
        <li>Delivery fees depend on the zone you choose and are shown before you pay.</li>
        <li>Delivery is free on orders above KES {SITE.freeDeliveryThreshold}.</li>
      </ul>

      <h2>Delivery</h2>
      <p>
        We deliver within {SITE.serviceArea}. Same day delivery applies to orders placed before 3pm
        and confirmed by our team. Timings are estimates and can move during heavy rain, traffic or
        public holidays. Please make sure someone can receive the order and that the phone number you
        give us is reachable.
      </p>

      <h2>Payment</h2>
      <ul>
        <li>M-Pesa is our primary payment method. A prompt is sent when the rider leaves the butchery.</li>
        <li>Cash on delivery is available for most zones. Please have the exact total ready.</li>
        <li>We do not store card numbers or M-Pesa credentials on this website.</li>
      </ul>

      <h2>Cancellation and changes</h2>
      <p>
        You can change or cancel an order free of charge before it is cut. Once a cut is prepared,
        cancellation may not be possible. Call or message us as early as you can on{" "}
        {SITE.whatsappDisplay}.
      </p>

      <h2>Quality and returns</h2>
      <p>
        Meat is perishable, so we cannot accept returns of chilled product once it has left our
        counter. If something is wrong with your order, tell us within 24 hours with a photograph and
        we will replace the item or refund it. This does not limit your rights under the Consumer
        Protection Act 2012.
      </p>

      <h2>Halal standards</h2>
      <p>
        We sell only meat slaughtered at licensed halal abattoirs under supervision, and we keep halal
        tools and storage separate from any non halal product. Certificates are available for
        inspection at our counter. If you believe a product does not meet halal standards, contact us
        immediately so we can investigate.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your password private and for activity on your account. Tell
        us at once if you think someone else has access. We may suspend an account used for
        fraudulent orders.
      </p>

      <h2>Liability</h2>
      <p>
        We are responsible for loss you suffer as a direct result of our failure to meet these terms.
        We are not responsible for indirect losses, such as lost profits or events beyond our
        reasonable control. Nothing in these terms excludes liability that cannot be excluded by law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Kenya, and disputes are subject to the exclusive
        jurisdiction of the Kenyan courts.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.name}, {SITE.address}. WhatsApp {SITE.whatsappDisplay}. Email {SITE.email}.
      </p>
    </LegalPage>
  );
}
