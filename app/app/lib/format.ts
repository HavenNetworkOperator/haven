// Formatting helpers that bridge Gigs-shaped data into Haven UI strings.

import type { GigsSubscription, SimProvider } from "@/lib/gigs";

/** Bytes → "x.x GB" or "x GB" once over 10. */
export function formatBytesAsGb(bytes: number | undefined | null): string {
  if (!bytes) return "0 GB";
  const gb = bytes / 1_000_000_000;
  return gb >= 10 ? `${Math.round(gb)} GB` : `${gb.toFixed(1)} GB`;
}

/** Megabytes → "x.x GB" — for Haven-side cached usage values. */
export function formatMbAsGb(mb: number | undefined | null): string {
  if (!mb) return "0 GB";
  const gb = mb / 1000;
  return gb >= 10 ? `${Math.round(gb)} GB` : `${gb.toFixed(1)} GB`;
}

/** Bytes → MB integer. */
export function bytesToMb(bytes: number | undefined | null): number {
  if (!bytes) return 0;
  return Math.round(bytes / 1_000_000);
}

/** ISO date → "12 February 2026" (en-GB). */
export function formatDateLong(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Format the anonymised provider code into something a parent can read. */
export function formatProvider(p: SimProvider | null | undefined): string {
  if (!p) return "—";
  if (p === "test") return "Sandbox carrier";
  // p1–p9 — the real mapping to UK carriers is not public. Once we have
  // Gigs' confirmed mapping (likely EE / Vodafone / Three / O2), update.
  return `Carrier ${p.slice(1)}`;
}

/** UK-style E.164 phone number → "+44 7700 900142" with spacing. */
export function formatUkPhone(e164: string | null | undefined): string {
  if (!e164) return "—";
  // +447700900142 → +44 7700 900142
  const m = e164.match(/^\+44(\d{4})(\d{6})$/);
  if (!m) return e164;
  return `+44 ${m[1]} ${m[2]}`;
}

/** "active" → "Active" with friendly casing. */
export function formatSubscriptionStatus(s: GigsSubscription["status"] | null): string {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Pretty plan-data-cap label for the Limits page. */
export function planDataCap(sub: GigsSubscription | null): {
  bytes: number;
  label: string;
  mb: number;
} {
  const bytes = sub?.plan.allowances.data ?? 0;
  return { bytes, label: formatBytesAsGb(bytes), mb: bytesToMb(bytes) };
}
