// One-off admin endpoint: find-or-create the Resend audience, then back-fill
// every existing waitlist row into it. Idempotent — safe to hit multiple times.
//
// Auth: Bearer ADMIN_TOKEN (env var set in Vercel for the one-off run).
//
// Removed in the follow-up commit once the audience is provisioned + back-filled.

import { Resend } from 'resend';
import { sql } from '@vercel/postgres';

const AUDIENCE_NAME = 'Haven founding members';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.ADMIN_TOKEN;
  const auth = req.headers.authorization || '';
  if (!expected || !auth.startsWith('Bearer ') || auth.slice(7) !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY missing' });

  const resend = new Resend(apiKey);

  // Find-or-create the audience.
  const listed = await resend.audiences.list();
  if (listed.error) return res.status(500).json({ step: 'list', error: listed.error });
  let audience = listed.data?.data?.find(a => a.name === AUDIENCE_NAME);
  if (!audience) {
    const created = await resend.audiences.create({ name: AUDIENCE_NAME });
    if (created.error) return res.status(500).json({ step: 'create', error: created.error });
    audience = created.data;
  }

  // Back-fill every existing waitlist row.
  const { rows } = await sql`SELECT email FROM waitlist ORDER BY id ASC`;

  let added = 0;
  let skipped = 0;
  const errors = [];
  for (const { email } of rows) {
    const result = await resend.contacts.create({
      audienceId: audience.id,
      email,
      unsubscribed: false,
    });
    if (result.error) {
      const msg = String(result.error?.message ?? result.error);
      if (/already exists/i.test(msg) || /conflict/i.test(msg)) {
        skipped++;
      } else {
        errors.push({ email, error: msg });
      }
    } else {
      added++;
    }
  }

  return res.status(200).json({
    audience_id: audience.id,
    audience_name: audience.name,
    total_waitlist: rows.length,
    added,
    skipped,
    errors,
  });
}
