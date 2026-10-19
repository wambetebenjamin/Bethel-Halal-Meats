import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Bethel Halal Meats collects, uses and protects your personal data under the Kenya Data Protection Act 2019.",
  alternates: { canonical: "/legal/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This policy explains what Bethel Halal Meats collects when you order meat from us, why we need it and the choices you have."
      updated="19 October 2026"
    >
      <h2>Who we are</h2>
      <p>
        {SITE.name} is a halal butchery and meat delivery business operating from {SITE.address}. We
        are the data controller for the information described here. You can reach us on WhatsApp at{" "}
        {SITE.whatsappDisplay} or by email at {SITE.email}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Order details.</strong> Your name, phone number, delivery address, delivery zone,
          preferred delivery date, special instructions, items ordered and the amount payable.
        </li>
        <li>
          <strong>Account details.</strong> If you create an account, your name, email address and a
          hashed password. We never store passwords in plain text.
        </li>
        <li>
          <strong>Messages.</strong> Anything you send through the contact form, by email or on
          WhatsApp, including the phone number you message us from.
        </li>
        <li>
          <strong>Technical data.</strong> Security signals from reCAPTCHA, basic device information
          and anonymous page counts if you allow analytics cookies.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To prepare, pack and deliver your order, and to call you about substitutions or arrival.</li>
        <li>To take payment and keep the records we are required to keep.</li>
        <li>To answer your questions and handle complaints or refunds.</li>
        <li>To keep the shop secure and prevent fraudulent orders.</li>
        <li>To improve the shop, only where you have agreed to analytics cookies.</li>
      </ul>

      <h2>Our lawful basis</h2>
      <p>
        We rely on the performance of our contract with you for order and delivery data, on our
        legitimate interests for security and service improvement, on consent for optional cookies
        and marketing, and on legal obligation for tax and food safety records. This mirrors the
        lawful bases in the Kenya Data Protection Act 2019.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>Delivery riders and drivers, limited to the name, phone number and address needed to deliver.</li>
        <li>Payment providers, including M-Pesa, to confirm payment.</li>
        <li>Our email and hosting providers, which process data on our instructions.</li>
        <li>Google reCAPTCHA, which receives security signals when a form is submitted.</li>
        <li>Law enforcement or regulators, where the law requires it.</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>How long we keep it</h2>
      <p>
        Order and payment records are kept for seven years to meet tax and food safety requirements.
        Account details are kept until you ask us to close the account. Contact messages are kept for
        two years. Local cookies and storage on your device follow the periods described in our{" "}
        <a href="/legal/cookie-policy">cookie policy</a>.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Data Protection Act 2019 you may ask for a copy of your data, ask us to correct it,
        ask us to delete it where we no longer need it, object to certain processing, or withdraw
        consent for optional cookies. Send your request to {SITE.email} and we will respond within
        the period allowed by law. We may ask you to confirm your identity first.
      </p>

      <h2>Complaints</h2>
      <p>
        If you are unhappy with how we handled your data, contact us first so we can put it right. You
        may also complain to the Office of the Data Protection Commissioner in Kenya.
      </p>

      <h2>Security</h2>
      <p>
        Data is sent over encrypted connections. Access to order records is limited to staff who need
        it to fulfil your order. Passwords are hashed with a salted key derivation function.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a material way we will update the date above and, where
        appropriate, tell you before the change takes effect.
      </p>
    </LegalPage>
  );
}
