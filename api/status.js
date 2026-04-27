import { REF_CODE_RE, badRequest, serverError, getStanding } from './_lib.js';
import { getPostHog } from './_posthog.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ref = String(req.query?.ref ?? '').trim().toUpperCase();
  if (!REF_CODE_RE.test(ref)) {
    return badRequest(res, 'Invalid referral code.');
  }

  try {
    const standing = await getStanding(ref);
    if (!standing) {
      return res.status(404).json({ error: 'Not found' });
    }
    getPostHog().capture({
      distinctId: standing.email,
      event: 'waitlist_status_checked',
      properties: {
        ref_code: ref,
        position: standing.position,
        referrals: standing.referrals,
        total: standing.total,
      },
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ref_code: ref, ...standing });
  } catch (err) {
    return serverError(res, err);
  }
}
