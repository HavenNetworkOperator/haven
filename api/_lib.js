import { sql } from '@vercel/postgres';
import { customAlphabet } from 'nanoid';
import { getPostHog } from './_posthog.js';

const REF_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const REF_LENGTH = 8;
export const newRefCode = customAlphabet(REF_ALPHABET, REF_LENGTH);

export const REF_CODE_RE = new RegExp(`^[${REF_ALPHABET}]{${REF_LENGTH}}$`);
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phantom baseline added to displayed position and total so the list doesn't
// feel empty to early visitors. Real rank logic is unchanged — referral
// movement (delta between old/new position) still works because both values
// receive the same offset.
export const WAITLIST_BASELINE = 73;

export function badRequest(res, message) {
  res.status(400).json({ error: message });
}

export function serverError(res, err) {
  console.error(err);
  getPostHog().captureException(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

// ───────────────────────────────────────────────────────────
// Position management
// ───────────────────────────────────────────────────────────
//
// Position is materialised in the `position` column of `waitlist`. It is
// recomputed for every row after every signup. Ordering rules:
//   1. More referrals = better (lower-numbered) position
//   2. Earlier signup wins ties
//
// At 1,000 rows this single UPDATE runs in single-digit milliseconds. If
// volume grows past ~50k we'd switch to incremental updates, but the math
// at that point would be a very nice problem to have.

export async function recomputePositions() {
  await sql`
    WITH ref_counts AS (
      SELECT w.id, COUNT(r.id) AS referrals
      FROM waitlist w
      LEFT JOIN waitlist r ON r.referred_by = w.ref_code
      GROUP BY w.id
    ),
    ranked AS (
      SELECT
        w.id,
        RANK() OVER (
          ORDER BY rc.referrals DESC, w.signed_up_at ASC
        ) AS new_pos
      FROM waitlist w
      JOIN ref_counts rc ON rc.id = w.id
    )
    UPDATE waitlist w
    SET position = r.new_pos
    FROM ranked r
    WHERE w.id = r.id
      AND (w.position IS DISTINCT FROM r.new_pos)
  `;
}

// Returns standing for a ref_code, or null if not found.
export async function getStanding(refCode) {
  const { rows } = await sql`
    SELECT
      w.ref_code,
      w.email,
      w.position::int AS position,
      (SELECT COUNT(*)::int FROM waitlist r WHERE r.referred_by = w.ref_code) AS referrals,
      (SELECT COUNT(*)::int FROM waitlist) AS total
    FROM waitlist w
    WHERE w.ref_code = ${refCode}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    ...row,
    position: row.position + WAITLIST_BASELINE,
    total: row.total + WAITLIST_BASELINE,
  };
}

// ───────────────────────────────────────────────────────────
// Optional fan-outs: Formspree, Beehiiv
// All return promises but are safe to fire-and-forget.
// ───────────────────────────────────────────────────────────

export async function sendToFormspree({ email, refCode, referredBy, position, total }) {
  const formId = process.env.FORMSPREE_FORM_ID || 'mpqkabdk';
  if (!formId) return;
  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        source: 'waitlist-page',
        ref_code: refCode,
        referred_by: referredBy ?? '',
        position,
        total,
        signed_up_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Formspree fan-out failed', res.status, body);
    }
  } catch (err) {
    console.error('Formspree fan-out threw', err);
  }
}

export async function sendToSlack({ email, refCode, referredBy, position, total, referrals }) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  const milestone = position % 25 === 0 ? ' 🎉' : '';
  const headline = `New waitlist signup${milestone} — *#${position}* of ${total}`;
  const fields = [
    { type: 'mrkdwn', text: `*Email*\n${email}` },
    { type: 'mrkdwn', text: `*Ref code*\n\`${refCode}\`` },
  ];
  if (referredBy) {
    fields.push({ type: 'mrkdwn', text: `*Referred by*\n\`${referredBy}\`` });
  }
  if (typeof referrals === 'number') {
    fields.push({ type: 'mrkdwn', text: `*Their referrals*\n${referrals}` });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New waitlist signup: ${email} (#${position} of ${total})`,
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: headline } },
          { type: 'section', fields },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Slack fan-out failed', res.status, body);
    }
  } catch (err) {
    console.error('Slack fan-out threw', err);
  }
}

export async function maybeSubscribeBeehiiv({ email, refCode, referredBy }) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) return;

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          send_welcome_email: false, // we send our own welcome via Resend
          utm_source: 'waitlist',
          referring_site: 'https://gethavenmobile.com/waitlist',
          custom_fields: [
            { name: 'haven_ref_code', value: refCode },
            ...(referredBy ? [{ name: 'haven_referred_by', value: referredBy }] : []),
          ],
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error('Beehiiv subscribe failed', res.status, body);
    }
  } catch (err) {
    console.error('Beehiiv subscribe threw', err);
  }
}
