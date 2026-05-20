import { gigsClient, isLive } from "./client";
import { mockGigs } from "./mock";
import type { GigsUser, Result } from "./types";

/**
 * Find a Gigs user by email. The public endpoint is `POST /users/search`
 * (per gigs/connect-sessions-buy-manage-example). Returns `{ value: null }`
 * if no user exists — callers can then create one via Connect Sessions
 * or `POST /users`.
 */
export async function findUserByEmail(email: string): Promise<Result<GigsUser | null>> {
  if (!isLive()) {
    return { ok: true, value: mockGigs.user(email) };
  }
  const res = await gigsClient.raw<GigsUser>("/users/search", {
    method: "POST",
    body: { email },
  });
  if (res.ok) return { ok: true, value: res.value };
  if (res.status === 404) return { ok: true, value: null };
  return res;
}
