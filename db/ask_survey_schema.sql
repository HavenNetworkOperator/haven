-- Haven "Ask" survey — response capture.
-- Run once after provisioning (same Neon/Vercel Postgres instance as the waitlist table).
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS ask_survey_responses (
  id              SERIAL PRIMARY KEY,
  question        TEXT NOT NULL,
  weight          INT,
  year            TEXT,
  wand            TEXT,
  other_concerns  TEXT,
  name            TEXT,
  contact         TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip              TEXT,
  user_agent      TEXT
);

-- Backfill for tables created before the bonus question existed.
ALTER TABLE ask_survey_responses ADD COLUMN IF NOT EXISTS other_concerns TEXT;

CREATE INDEX IF NOT EXISTS ask_survey_responses_submitted_at_idx ON ask_survey_responses (submitted_at);
