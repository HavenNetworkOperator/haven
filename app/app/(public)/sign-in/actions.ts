"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { issueMagicLink } from "@/lib/auth";

export async function submitSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/.+@.+\..+/.test(email)) {
    redirect(`/sign-in?error=invalid_email&email=${encodeURIComponent(email)}`);
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "gethavenmobile.com";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? null;
  const userAgent = h.get("user-agent") ?? null;

  const result = await issueMagicLink({ email, origin, ip, userAgent });
  if (!result.ok) {
    redirect(`/sign-in?error=${result.error}&email=${encodeURIComponent(email)}`);
  }

  redirect(`/sign-in/check-email?email=${encodeURIComponent(email)}`);
}
