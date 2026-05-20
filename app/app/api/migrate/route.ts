// One-off schema runner.
//
//   curl -X POST -H "Authorization: Bearer $AUTH_SECRET" \
//        https://gethavenmobile.com/api/migrate
//
// Idempotent — every statement uses IF NOT EXISTS so calling this
// repeatedly is safe. Gated on AUTH_SECRET so random visitors can't
// trigger DDL.

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { SCHEMA_STATEMENTS } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.AUTH_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: { ok: boolean; statement: string; error?: string }[] = [];
  for (const stmt of SCHEMA_STATEMENTS) {
    try {
      await sql.query(stmt);
      results.push({ ok: true, statement: stmt.slice(0, 60).replace(/\s+/g, " ") + "…" });
    } catch (err) {
      results.push({
        ok: false,
        statement: stmt.slice(0, 60).replace(/\s+/g, " ") + "…",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json(
    { ok: allOk, ran: results.length, results },
    { status: allOk ? 200 : 500 },
  );
}
