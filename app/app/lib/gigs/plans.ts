import { gigsClient, isLive } from "./client";
import { mockGigs } from "./mock";
import type { GigsPlan, ResultPaged, Result } from "./types";

/**
 * List plans for the project. Supports cursor pagination.
 * `GET /projects/:p/plans?status=available`
 */
export async function listPlans(opts: {
  status?: "available" | "archived" | "pending" | "draft";
  after?: string;
  limit?: number;
} = {}): Promise<ResultPaged<GigsPlan>> {
  if (!isLive()) {
    return {
      ok: true,
      value: mockGigs.plans.filter((p) => !opts.status || p.status === opts.status),
      moreItemsAfter: false,
      moreItemsBefore: false,
    };
  }
  return gigsClient.list<GigsPlan>("/plans", opts);
}

export async function getPlan(id: string): Promise<Result<GigsPlan | null>> {
  if (!isLive()) {
    return { ok: true, value: mockGigs.plan(id) };
  }
  return gigsClient.get<GigsPlan>(`/plans/${encodeURIComponent(id)}`);
}
