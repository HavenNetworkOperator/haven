import { sql } from '@vercel/postgres';
import {
  newRefCode,
  REF_CODE_RE,
  EMAIL_RE,
  badRequest,
  serverError,
  getStanding,
  recomputePositions,
  sendToFormspree,
  sendToSlack,
  maybeSubscribeBeehiiv,
} from './_lib.js';
import { sendWelcomeEmail, sendReferrerNotification } from './_emails.js';
import { getPostHog } from './_posthog.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return badRequest(res, 'Invalid JSON.');
  }

  const email = String(payload?.email ?? '').trim().toLowerCase();
  const refRaw = payload?.ref ? String(payload.ref).trim().toUpperCase() : null;
  const landingRaw = payload?.landing_page ? String(payload.landing_page).slice(0, 64) : null;
  const landingPage = landingRaw === '/' || landingRaw === '/waitlist' ? landingRaw : null;
  const landedAt = payload?.landed_at ? String(payload.landed_at).slice(0, 32) : null;

  if (!EMAIL_RE.test(email)) return badRequest(res, 'Please enter a valid email.');
  if (email.length > 254) return badRequest(res, 'Email too long.');

  // Validate referrer (silently ignored if invalid format or unknown)
  let referredBy = null;
  if (refRaw && REF_CODE_RE.test(refRaw)) {
    const { rows } = await sql`
      SELECT ref_code FROM waitlist WHERE ref_code = ${refRaw} LIMIT 1
    `;
    referredBy = rows[0]?.ref_code ?? null;
  }

  // Returning visitor: same email already on the list → return existing standing.
  const { rows: existing } = await sql`
    SELECT ref_code FROM waitlist WHERE LOWER(email) = ${email} LIMIT 1
  `;
  if (existing[0]) {
    const standing = await getStanding(existing[0].ref_code);
    getPostHog().capture({
      distinctId: email,
      event: 'waitlist_signup_duplicate',
      properties: {
        ref_code: existing[0].ref_code,
        position: standing.position,
        referrals: standing.referrals,
        total: standing.total,
      },
    });
    return res.status(200).json({
      already_signed_up: true,
      ref_code: existing[0].ref_code,
      position: standing.position,
      referrals: standing.referrals,
      total: standing.total,
    });
  }

  // Capture referrer's standing BEFORE the new signup, so we can show
  // them how far they've moved up in the notification email.
  let referrerBefore = null;
  if (referredBy) {
    referrerBefore = await getStanding(referredBy);
  }

  // New signup: assign a unique ref_code (retry on collision; effectively never).
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || null;
  const userAgent = req.headers['user-agent']?.toString().slice(0, 500) || null;

  let refCode = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = newRefCode();
    try {
      await sql`
        INSERT INTO waitlist (email, ref_code, referred_by, ip, user_agent)
        VALUES (${email}, ${candidate}, ${referredBy}, ${ip}, ${userAgent})
      `;
      refCode = candidate;
      break;
    } catch (err) {
      if (err?.code === '23505' && /waitlist_email_idx/.test(err?.message ?? '')) {
        // race-loss on email — return existing
        const { rows: again } = await sql`
          SELECT ref_code FROM waitlist WHERE LOWER(email) = ${email} LIMIT 1
        `;
        if (again[0]) {
          const standing = await getStanding(again[0].ref_code);
          return res.status(200).json({
            already_signed_up: true,
            ref_code: again[0].ref_code,
            position: standing.position,
            referrals: standing.referrals,
            total: standing.total,
          });
        }
      }
      if (err?.code === '23505' && /waitlist_ref_code_idx/.test(err?.message ?? '')) {
        continue; // try a fresh ref_code
      }
      return serverError(res, err);
    }
  }

  if (!refCode) {
    return serverError(res, new Error('Could not generate unique ref_code'));
  }

  // Recompute positions for everyone, then read the new standings.
  await recomputePositions();
  const standing = await getStanding(refCode);

  // PostHog: identify the new user and capture conversion events.
  const posthog = getPostHog();
  posthog.identify({
    distinctId: email,
    properties: {
      $set: {
        email,
        ref_code: refCode,
        waitlist_position: standing.position,
        waitlist_referrals: standing.referrals,
        referred_by: referredBy ?? null,
      },
      $set_once: { waitlist_signed_up_at: new Date().toISOString() },
    },
  });
  posthog.capture({
    distinctId: email,
    event: 'waitlist_signed_up',
    properties: {
      ref_code: refCode,
      position: standing.position,
      total: standing.total,
      referred_by: referredBy ?? null,
      landing_page: landingPage,
      landed_at: landedAt,
    },
  });
  if (referredBy) {
    posthog.capture({
      distinctId: email,
      event: 'referral_link_used',
      properties: {
        ref_code: refCode,
        referred_by: referredBy,
        position: standing.position,
      },
    });
  }

  // Fan-outs: do not block the response on these. Errors are logged inside helpers.
  const fanouts = [
    sendToFormspree({
      email,
      refCode,
      referredBy,
      position: standing.position,
      total: standing.total,
      landingPage,
      landedAt,
    }),
    sendToSlack({
      email,
      refCode,
      referredBy,
      position: standing.position,
      total: standing.total,
      referrals: standing.referrals,
    }),
    maybeSubscribeBeehiiv({ email, refCode, referredBy }),
    sendWelcomeEmail({
      email,
      position: standing.position,
      total: standing.total,
      refCode,
    }),
  ];

  if (referredBy && referrerBefore) {
    const referrerAfter = await getStanding(referredBy);
    console.log('[signup] referrer-notification check', {
      referredBy,
      referrerEmail: referrerAfter?.email ?? null,
      oldPosition: referrerBefore.position,
      newPosition: referrerAfter?.position ?? null,
      referrals: referrerAfter?.referrals ?? null,
      willSend: Boolean(referrerAfter),
    });
    if (referrerAfter) {
      fanouts.push(
        sendReferrerNotification({
          email: referrerAfter.email,
          position: referrerAfter.position,
          total: referrerAfter.total,
          referrals: referrerAfter.referrals,
          refCode: referredBy,
          oldPosition: referrerBefore.position,
        }).then(r => {
          console.log('[signup] referrer-notification result', r);
          return r;
        })
      );
    }
  } else {
    console.log('[signup] referrer-notification skipped', { referredBy, hasReferrerBefore: Boolean(referrerBefore) });
  }

  // On Vercel Functions, awaiting these guarantees they actually run before the
  // function suspends. Total added latency for waitlist scale: ~300-500ms.
  const fanoutResults = await Promise.allSettled(fanouts);

  const debug = req.headers['x-haven-debug'] === '1'
    ? {
        debug: fanoutResults.map((r, i) => ({
          idx: i,
          status: r.status,
          value: r.status === 'fulfilled' ? r.value : undefined,
          reason: r.status === 'rejected' ? String(r.reason) : undefined,
        })),
      }
    : {};

  return res.status(201).json({
    ref_code: refCode,
    position: standing.position,
    referrals: standing.referrals,
    total: standing.total,
    ...debug,
  });
}
