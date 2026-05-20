// DDL inlined so the /api/migrate route works in the serverless bundle
// without needing the raw .sql file at runtime. The mirror in
// schema.sql is the source-of-truth for humans; this is what runs.

export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS accounts (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL,
    email_verified_at TIMESTAMPTZ,
    founding_member BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_signed_in_at TIMESTAMPTZ
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS accounts_email_idx
    ON accounts (LOWER(email))`,

  `CREATE TABLE IF NOT EXISTS magic_link_tokens (
    token         TEXT PRIMARY KEY,
    account_id    TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    email         TEXT NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    used_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip            TEXT,
    user_agent    TEXT
  )`,

  `CREATE INDEX IF NOT EXISTS magic_link_tokens_account_idx
    ON magic_link_tokens (account_id)`,

  `CREATE INDEX IF NOT EXISTS magic_link_tokens_expires_idx
    ON magic_link_tokens (expires_at)`,
];
