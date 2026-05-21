// TEMPORARY admin endpoint — returns the latest unexpired, unused
// magic-link URL for a given email. Gated on AUTH_SECRET so only the
// project owner can hit it.
//
// Exists ONLY while RESEND_API_KEY is unconfigured. Delete this file
// (and remove the rewrite) once email is live.
//
//   curl -H "Authorization: Bearer $AUTH_SECRET" \
//        "https://haven-app-lilac.vercel.app/api/auth/_admin/latest-link?email=foo@bar.com&origin=https://haven-app-lilac.vercel.app"

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const secret = process.env.AUTH_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const origin = url.searchParams.get("origin") ?? url.origin;
  if (!email) {
    return NextResponse.json({ error: "email param required" }, { status: 400 });
  }

  const { rows } = await sql<{ token: string; expires_at: string; used_at: string | null }>`
    SELECT token, expires_at, used_at
    FROM magic_link_tokens
    WHERE LOWER(email) = LOWER(${email})
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (!rows[0]) {
    return NextResponse.json({ found: false, message: "no unused, unexpired token" });
  }
  return NextResponse.json({
    found: true,
    url: `${origin}/api/auth/verify?token=${encodeURIComponent(rows[0].token)}`,
    expiresAt: rows[0].expires_at,
  });
}
