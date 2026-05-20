import { gigsClient, isLive } from "./client";
import { mockGigs } from "./mock";
import type {
  GigsSubscription,
  Result,
  ResultPaged,
  SubscriptionStatus,
} from "./types";

/**
 * Fetch a single subscription by Gigs ID.
 * `GET /projects/:p/subscriptions/:id`
 */
export async function getSubscription(id: string): Promise<Result<GigsSubscription | null>> {
  if (!isLive()) {
    return { ok: true, value: mockGigs.subscription(id) };
  }
  return gigsClient.get<GigsSubscription>(`/subscriptions/${encodeURIComponent(id)}`);
}

/**
 * List subscriptions for a user. Optionally filter by status.
 * `GET /projects/:p/subscriptions?user=:userId&status=:status`
 */
export async function listSubscriptionsForUser(
  userId: string,
  opts: {
    status?: SubscriptionStatus;
    after?: string;
    limit?: number;
  } = {},
): Promise<ResultPaged<GigsSubscription>> {
  if (!isLive()) {
    const value = mockGigs
      .subscriptionsForUser(userId)
      .filter((s) => !opts.status || s.status === opts.status);
    return { ok: true, value, moreItemsAfter: false, moreItemsBefore: false };
  }
  return gigsClient.list<GigsSubscription>("/subscriptions", { user: userId, ...opts });
}

/**
 * Cancel a subscription. The public docs gate the exact request body,
 * but the typical Gigs pattern is `POST /subscriptions/:id/cancel`.
 */
export async function cancelSubscription(id: string): Promise<Result<GigsSubscription>> {
  if (!isLive()) {
    // In mock mode we just echo the current subscription with status="ended".
    const sub = mockGigs.subscription(id);
    if (!sub) {
      return { ok: false, error: "subscription not found", retryable: false };
    }
    return {
      ok: true,
      value: { ...sub, status: "ended", canceledAt: new Date().toISOString() },
    };
  }
  return gigsClient.post<GigsSubscription>(
    `/subscriptions/${encodeURIComponent(id)}/cancel`,
    {},
  );
}
