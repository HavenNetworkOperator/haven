// Inbound webhook helpers.
//
// IMPORTANT: The signature header name and algorithm are NOT publicly
// documented at the time of writing. The verifier below uses the
// industry-standard HMAC-SHA256 of `${timestamp}.${rawBody}` keyed on
// `GIGS_WEBHOOK_SECRET`, with the signature delivered in
// `Gigs-Signature: t=<ts>,v1=<hex>` — modelled on the Stripe convention.
// Replace `verifySignature` with the real algorithm once we receive an
// API key and a documented webhook delivery.

import crypto from "node:crypto";
import type { GigsWebhookEnvelope, GigsWebhookEventName } from "./types";

const TOLERANCE_SECONDS = 60 * 5;

export type VerifyResult =
  | { ok: true; event: GigsWebhookEnvelope }
  | { ok: false; reason: string };

export function parseSignatureHeader(header: string | null): { t?: number; v1?: string } {
  if (!header) return {};
  const parts = header.split(",").map((p) => p.trim());
  const out: { t?: number; v1?: string } = {};
  for (const p of parts) {
    const [k, v] = p.split("=", 2);
    if (k === "t") out.t = Number(v);
    if (k === "v1") out.v1 = v;
  }
  return out;
}

export function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string | null,
): VerifyResult {
  if (!secret) {
    return { ok: false, reason: "GIGS_WEBHOOK_SECRET not set" };
  }

  const { t, v1 } = parseSignatureHeader(header);
  if (!t || !v1) {
    return { ok: false, reason: "malformed signature header" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > TOLERANCE_SECONDS) {
    return { ok: false, reason: "signature timestamp outside tolerance" };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`, "utf8")
    .digest("hex");

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    valid = false;
  }
  if (!valid) {
    return { ok: false, reason: "signature mismatch" };
  }

  let parsed: GigsWebhookEnvelope;
  try {
    parsed = JSON.parse(rawBody) as GigsWebhookEnvelope;
  } catch {
    return { ok: false, reason: "body is not valid JSON" };
  }

  if (!parsed.type || !parsed.id) {
    return { ok: false, reason: "envelope missing type/id" };
  }
  return { ok: true, event: parsed };
}

/** Best-known catalog of event names. Update once docs are accessible. */
export const KNOWN_EVENTS: readonly GigsWebhookEventName[] = [
  "subscription.created",
  "subscription.activated",
  "subscription.canceled",
  "subscription.ended",
  "subscription.firstUsage",
  "subscription.updated",
  "porting.created",
  "porting.requested",
  "porting.declined",
  "porting.completed",
  "porting.canceled",
  "sim.activated",
  "sim.deactivated",
  "user.created",
  "user.updated",
  "usage.recorded",
  "invoice.created",
  "invoice.paid",
  "invoice.payment_failed",
] as const;

export function isKnownEvent(name: string): name is GigsWebhookEventName {
  return (KNOWN_EVENTS as readonly string[]).includes(name);
}
