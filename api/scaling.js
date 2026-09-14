// Haven scaling roadmap — private checklist state for /scaling.
// GET:  returns the saved state.
// PUT:  replaces the saved state.
// Both gated by `Authorization: Bearer <SCALING_PASSCODE>` (env var).
//
// State is one JSON blob in the existing Neon Postgres instance, so ticks,
// notes and custom items sync across every device Rich opens the page on.

import { sql } from '@vercel/postgres';
import { timingSafeEqual } from 'node:crypto';

const ROW_ID = 'default';
const MAX_BYTES = 256 * 1024;

let ready;
function ensureTable() {
  if (!ready) {
    ready = sql`
      CREATE TABLE IF NOT EXISTS scaling_roadmap (
        id          TEXT PRIMARY KEY,
        state       JSONB NOT NULL,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch(err => { ready = undefined; throw err; });
  }
  return ready;
}

function authorised(req) {
  const expected = process.env.SCALING_PASSCODE || '';
  const header = String(req.headers.authorization || '');
  if (!expected || !header.startsWith('Bearer ')) return false;
  const given = Buffer.from(header.slice(7));
  const want = Buffer.from(expected);
  return given.length === want.length && timingSafeEqual(given, want);
}

async function handleGet(res) {
  const { rows } = await sql`
    SELECT state, updated_at FROM scaling_roadmap WHERE id = ${ROW_ID} LIMIT 1
  `;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    state: rows[0]?.state ?? null,
    updated_at: rows[0]?.updated_at ?? null,
  });
}

async function handlePut(req, res) {
  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }
  const state = payload?.state;
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return res.status(400).json({ error: 'state must be an object.' });
  }
  const serialised = JSON.stringify(state);
  if (Buffer.byteLength(serialised) > MAX_BYTES) {
    return res.status(413).json({ error: 'state too large.' });
  }
  const { rows } = await sql`
    INSERT INTO scaling_roadmap (id, state, updated_at)
    VALUES (${ROW_ID}, ${serialised}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()
    RETURNING updated_at
  `;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, updated_at: rows[0]?.updated_at ?? null });
}

export default async function handler(req, res) {
  if (!process.env.SCALING_PASSCODE) {
    return res.status(500).json({ error: 'SCALING_PASSCODE is not configured.' });
  }
  if (!authorised(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await ensureTable();
    if (req.method === 'GET') return await handleGet(res);
    if (req.method === 'PUT') return await handlePut(req, res);
  } catch (err) {
    console.error('scaling handler failed', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
