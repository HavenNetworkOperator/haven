import { sql } from '@vercel/postgres';
import { WAITLIST_BASELINE, serverError } from './_lib.js';

// Public count endpoint for the homepage progress bar.
// No ref required — returns just the community-wide total (with the
// same baseline offset applied as getStanding(), so the homepage bar
// agrees with the post-signup confirmation bar).
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS total FROM waitlist`;
    const total = (rows[0]?.total ?? 0) + WAITLIST_BASELINE;
    // Short edge cache so the homepage doesn't hit Postgres on every
    // visit, but stays close to live for new signups.
    res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=15, stale-while-revalidate=60');
    return res.status(200).json({ total, goal: 1000 });
  } catch (err) {
    return serverError(res, err);
  }
}
