// Magic-link landing page.
//   GET /api/auth/verify?token=<token>
//
// Atomically consumes the token (single-use, 15-minute expiry), sets
// the session cookie, and redirects to /account.

import { NextResponse } from "next/server";
import { consumeMagicLink, markSignedIn } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_token", url.origin));
  }

  let row;
  try {
    row = await consumeMagicLink(token);
  } catch (err) {
    console.error("[haven.auth] consume threw:", err);
    return NextResponse.redirect(new URL("/sign-in?error=server", url.origin));
  }

  if (!row) {
    // Token doesn't exist, already used, or expired.
    return NextResponse.redirect(new URL("/sign-in?error=expired", url.origin));
  }

  await markSignedIn(row.account_id);
  await setSessionCookie(row.account_id);

  return NextResponse.redirect(new URL("/account", url.origin));
}
