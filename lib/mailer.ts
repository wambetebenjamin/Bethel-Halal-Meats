import nodemailer from "nodemailer";
import { SITE } from "./site";

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

export async function sendMail(payload: MailPayload) {
  if (!smtpConfigured()) {
    // Without SMTP credentials the message is logged and the request still succeeds,
    // so the contact form remains usable in preview environments.
    console.info("[bethel-mail] SMTP not configured. Message not sent:", payload.subject);
    return { sent: false, reason: "smtp-not-configured" as const };
  }

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `${SITE.name} <${process.env.SMTP_USER}>`,
    to: SITE.email,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
  });

  return { sent: true, reason: "sent" as const };
}
