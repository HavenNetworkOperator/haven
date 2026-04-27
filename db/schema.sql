-- Haven viral waitlist schema
-- Run once after provisioning Postgres (Vercel Postgres / Neon / Supabase).
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS waitlist (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL,
  ref_code      TEXT NOT NULL,
  referred_by   TEXT,
  position      INT,
  signed_up_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip            TEXT,
  user_agent    TEXT
);

-- Backfill `position` column for tables created before the column existed.
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS position INT;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_idx     ON waitlist (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_ref_code_idx  ON waitlist (ref_code);
CREATE INDEX        IF NOT EXISTS waitlist_referred_by_idx ON waitlist (referred_by);
CREATE INDEX        IF NOT EXISTS waitlist_signed_up_idx ON waitlist (signed_up_at);
CREATE INDEX        IF NOT EXISTS waitlist_position_idx ON waitlist (position);
