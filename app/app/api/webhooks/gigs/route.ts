// Inbound Gigs webhook endpoint.
//
//   POST /api/webhooks/gigs
//
// Gigs would be configured (via dashboard or API) to deliver events
// here. This handler:
//   1. Reads the raw body (signature is computed over the bytes, not
//      a re-serialised JSON).
//   2. Verifies the signature against GIGS_WEBHOOK_SECRET.
//   3. Acknowledges with 200 quickly — the actual side effects (insert
//      into usage_events, kick weekly_digest regen, etc.) run on cron
//      reading from the event log. This decouples handler latency from
//      Gigs' retry semantics.
//
// NOTE: the signature algorithm + header name used by Gigs is NOT
// publicly documented at the time of writing. See @/lib/gigs/webhooks
// for the placeholder Stripe-style verifier — to be confirmed once we
// receive an actual delivery.

import { NextResponse } from "next/server";
import { isKnownEvent, verifySignature } from "@/lib/gigs";

// Always run on the server — never edge — so we can use node:crypto.
export const runtime = "nodejs";

const SIG_HEADER = process.env.GIGS_WEBHOOK_SIG_HEADER ?? "gigs-signature";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get(SIG_HEADER);
  const secret = process.env.GIGS_WEBHOOK_SECRET ?? null;

  const verified = verifySignature(rawBody, sigHeader, secret);
  if (!verified.ok) {
    return NextResponse.json(
      { error: `webhook rejected: ${verified.reason}` },
      { status: 400 },
    );
  }

  const { event } = verified;

  // TODO: insert into usage_events / events_log table once Postgres
  // schema is migrated. For now, surface to the server logs so we can
  // see deliveries during integration testing.
  console.log("[gigs.webhook]", event.type, event.id, {
    known: isKnownEvent(event.type),
    createdAt: event.createdAt,
  });

  // Always ack 200 once the signature is good — downstream work is
  // async and idempotent on event.id.
  return NextResponse.json({ ok: true, id: event.id });
}

// Reject every other verb explicitly so Gigs gets a clear signal if
// they misconfigure the delivery method.
export async function GET() {
  return NextResponse.json({ error: "method not allowed" }, { status: 405 });
}
