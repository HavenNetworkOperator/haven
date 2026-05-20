// Thin wrapper around @vercel/postgres. Exports `sql` for tagged-template
// queries and a typed query helper so route handlers don't import the
// library directly.

import { sql } from "@vercel/postgres";

export { sql };

export type AccountRow = {
  id: string;
  email: string;
  email_verified_at: string | null;
  founding_member: boolean;
  created_at: string;
  last_signed_in_at: string | null;
};

export type MagicLinkRow = {
  token: string;
  account_id: string;
  email: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  ip: string | null;
  user_agent: string | null;
};

export async function findAccountByEmail(email: string): Promise<AccountRow | null> {
  const { rows } = await sql<AccountRow>`
    SELECT * FROM accounts WHERE LOWER(email) = LOWER(${email}) LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function findAccountById(id: string): Promise<AccountRow | null> {
  const { rows } = await sql<AccountRow>`
    SELECT * FROM accounts WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function insertAccount(id: string, email: string): Promise<AccountRow> {
  const { rows } = await sql<AccountRow>`
    INSERT INTO accounts (id, email)
    VALUES (${id}, ${email})
    RETURNING *
  `;
  return rows[0];
}

export async function markSignedIn(id: string): Promise<void> {
  await sql`
    UPDATE accounts
    SET last_signed_in_at = NOW(), email_verified_at = COALESCE(email_verified_at, NOW())
    WHERE id = ${id}
  `;
}

export async function insertMagicLink(
  token: string,
  accountId: string,
  email: string,
  expiresAt: Date,
  ip: string | null,
  userAgent: string | null,
): Promise<void> {
  await sql`
    INSERT INTO magic_link_tokens (token, account_id, email, expires_at, ip, user_agent)
    VALUES (${token}, ${accountId}, ${email}, ${expiresAt.toISOString()}, ${ip}, ${userAgent})
  `;
}

export async function consumeMagicLink(token: string): Promise<MagicLinkRow | null> {
  // Atomic single-use claim — only the first concurrent request wins.
  const { rows } = await sql<MagicLinkRow>`
    UPDATE magic_link_tokens
    SET used_at = NOW()
    WHERE token = ${token}
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING *
  `;
  return rows[0] ?? null;
}
