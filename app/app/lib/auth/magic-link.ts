// Magic-link generation, email send, and consumption.
//
// Flow:
//   1. User submits email at /sign-in.
//   2. We find-or-create the account, generate a random 32-char token,
//      store it in `magic_link_tokens` with a 15-minute expiry, and
//      email the recipient a link of the form `/api/auth/verify?token=<>`.
//   3. The user clicks the link. /api/auth/verify atomically marks the
//      token used, sets the session cookie, redirects to /account.
//
// In dev (no RESEND_API_KEY) the link is logged to the server console
// so testing locally doesn't need email infrastructure.

import { nanoid } from "nanoid";
import { Resend } from "resend";
import {
  findAccountByEmail,
  insertAccount,
  insertMagicLink,
} from "@/lib/db";

const TOKEN_LIFETIME_MS = 15 * 60 * 1000; // 15 minutes
const FROM_ADDRESS = process.env.AUTH_FROM_ADDRESS ?? "Haven <hello@gethavenmobile.com>";

export type IssueResult =
  | { ok: true; emailSent: boolean; devLink?: string }
  | { ok: false; error: string };

export async function issueMagicLink(opts: {
  email: string;
  origin: string;
  ip: string | null;
  userAgent: string | null;
}): Promise<IssueResult> {
  const email = opts.email.trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  let account = await findAccountByEmail(email);
  if (!account) {
    account = await insertAccount(`acc_${nanoid(16)}`, email);
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS);
  await insertMagicLink(token, account.id, email, expiresAt, opts.ip, opts.userAgent);

  const url = `${opts.origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const sent = await sendMagicLinkEmail({ to: email, url });

  if (!sent) {
    // No Resend yet — log the link so the user (project owner) can fish
    // it out of `vercel logs` and sign themselves in. Tokens are still
    // single-use + 15-minute expiry, and Vercel logs are project-scoped.
    // Remove this branch once RESEND_API_KEY is set for real.
    console.log(`[haven.auth] magic link (email-fallback) for ${email} → ${url}`);
    return { ok: true, emailSent: false, devLink: url };
  }

  return { ok: true, emailSent: sent };
}

async function sendMagicLinkEmail({ to, url }: { to: string; url: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Your Haven sign-in link",
      text: `Hi —\n\nClick the link to sign in to Haven:\n\n${url}\n\nThe link is good for 15 minutes and works once. If you didn't ask for this, you can safely ignore the email.\n\n— Haven`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; padding: 24px; color: #0f1b2d;">
          <p>Hi —</p>
          <p>Click the button to sign in to Haven.</p>
          <p style="margin: 28px 0;">
            <a href="${url}" style="display:inline-block;padding:14px 24px;background:#0f1b2d;color:#f4efe6;text-decoration:none;border-radius:100px;font-weight:500;">Sign in to Haven →</a>
          </p>
          <p style="color:#6a6253;font-size:13px;">The link is good for 15 minutes and works once. If you didn't ask for this, you can safely ignore the email.</p>
          <p style="color:#6a6253;font-size:13px;">— Haven</p>
        </div>
      `,
    });
    if (error) {
      console.error("[haven.auth] resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[haven.auth] resend threw:", err);
    return false;
  }
}
