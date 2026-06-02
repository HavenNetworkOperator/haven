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
    // No caching: during launch we want every page load to reflect the
    // true count. Postgres COUNT(*) on this table is cheap at our scale.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    return res.status(200).json({ total, goal: 250 });
  } catch (err) {
    return serverError(res, err);
  }
}
