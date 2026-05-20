-- Haven product app schema.
--
-- Lives alongside the marketing-site `waitlist` table on the same
-- Postgres instance. Idempotent — safe to re-run via /api/migrate.
--
-- Scope of this migration: just the auth foundation (accounts +
-- magic-link tokens). Households / children / contacts / etc. are
-- still served from the in-memory mock fixtures and will be added
-- in a follow-up migration once we're ready to wire the dashboard
-- to real data.

CREATE TABLE IF NOT EXISTS accounts (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  founding_member BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_signed_in_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS accounts_email_idx
  ON accounts (LOWER(email));

CREATE TABLE IF NOT EXISTS magic_link_tokens (
  token         TEXT PRIMARY KEY,
  account_id    TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip            TEXT,
  user_agent    TEXT
);

CREATE INDEX IF NOT EXISTS magic_link_tokens_account_idx
  ON magic_link_tokens (account_id);

CREATE INDEX IF NOT EXISTS magic_link_tokens_expires_idx
  ON magic_link_tokens (expires_at);
