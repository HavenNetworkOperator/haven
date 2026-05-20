// Server-side session helpers. Sessions are HMAC-signed cookies
// (no DB lookup per request) carrying `{ accountId, expiresAt }`.
// Signed with AUTH_SECRET, timing-safe verified on every read.

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "haven_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  accountId: string;
  expiresAt: number; // ms epoch
};

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET is not set or too short (min 16 chars)");
  }
  return s;
}

function b64urlEncode(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function b64urlDecode(s: string): Buffer {
  // Pad to length multiple of 4
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replaceAll("-", "+").replaceAll("_", "/") + pad, "base64");
}

export function signSession(payload: SessionPayload): string {
  const body = b64urlEncode(JSON.stringify(payload));
  const mac = crypto
    .createHmac("sha256", secret())
    .update(body)
    .digest();
  return `${body}.${b64urlEncode(mac)}`;
}

export function verifySession(raw: string): SessionPayload | null {
  const parts = raw.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;

  const expected = crypto.createHmac("sha256", secret()).update(body).digest();
  let provided: Buffer;
  try {
    provided = b64urlDecode(sig);
  } catch {
    return null;
  }
  if (expected.length !== provided.length) return null;
  if (!crypto.timingSafeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf8")) as SessionPayload;
    if (!payload.accountId || typeof payload.expiresAt !== "number") return null;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read the current session, or null if no/invalid/expired cookie. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifySession(raw);
}

/** Set the session cookie after successful sign-in. */
export async function setSessionCookie(accountId: string): Promise<void> {
  const expiresAt = Date.now() + COOKIE_MAX_AGE * 1000;
  const value = signSession({ accountId, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Clear the session cookie. */
export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
