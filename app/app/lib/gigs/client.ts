// Thin HTTP client for the Gigs Mobile Operator API.
//   • Bearer token auth from env (`GIGS_API_KEY`).
//   • Project-scoped paths (`/projects/${GIGS_PROJECT_ID}/...`).
//   • Returns Result<T> — UI never sees a thrown error.
//   • When `GIGS_API_KEY` is unset, falls back to the local mock layer
//     so the rest of the app can develop offline.
//
// Refs:
//   • https://developers.gigs.com/api/introduction
//   • https://developers.gigs.com/api/authentication
//   • https://developers.gigs.com/api/pagination

import type {
  GigsItemResponse,
  GigsListResponse,
  PaginationParams,
  Result,
  ResultPaged,
} from "./types";

const GIGS_BASE_URL = process.env.GIGS_BASE_URL ?? "https://api.gigs.com";

function env(): { apiKey: string | null; projectId: string | null } {
  return {
    apiKey: process.env.GIGS_API_KEY ?? null,
    projectId: process.env.GIGS_PROJECT_ID ?? null,
  };
}

export function isLive(): boolean {
  const { apiKey, projectId } = env();
  return Boolean(apiKey && projectId);
}

function projectPath(path: string): string {
  const { projectId } = env();
  if (!projectId) throw new Error("GIGS_PROJECT_ID is not set");
  return `/projects/${projectId}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>): string {
  const url = new URL(`${GIGS_BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

type RequestOpts = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  signal?: AbortSignal;
};

async function request<T>(path: string, opts: RequestOpts = {}): Promise<Result<T>> {
  const { apiKey } = env();
  if (!apiKey) {
    return { ok: false, error: "GIGS_API_KEY not set", retryable: false };
  }

  const url = buildUrl(path, opts.query);
  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "network error",
      retryable: true,
    };
  }

  let parsed: GigsItemResponse<T> | null = null;
  try {
    parsed = (await res.json()) as GigsItemResponse<T>;
  } catch {
    // Empty body or malformed JSON — surface raw status only.
  }

  if (!res.ok) {
    return {
      ok: false,
      error: parsed?.error ?? `gigs ${res.status} ${res.statusText}`,
      retryable: res.status >= 500 || res.status === 429,
      status: res.status,
    };
  }

  if (!parsed || parsed.data === undefined) {
    return { ok: false, error: "gigs response missing data", retryable: false };
  }
  return { ok: true, value: parsed.data };
}

export const gigsClient = {
  /** Project-scoped GET returning a single resource. */
  async get<T>(path: string, query?: RequestOpts["query"]): Promise<Result<T>> {
    return request<T>(projectPath(path), { method: "GET", query });
  },

  /** Project-scoped POST. */
  async post<T>(path: string, body: unknown): Promise<Result<T>> {
    return request<T>(projectPath(path), { method: "POST", body });
  },

  /** Project-scoped PATCH. */
  async patch<T>(path: string, body: unknown): Promise<Result<T>> {
    return request<T>(projectPath(path), { method: "PATCH", body });
  },

  /** Project-scoped DELETE. */
  async del<T>(path: string): Promise<Result<T>> {
    return request<T>(projectPath(path), { method: "DELETE" });
  },

  /** Project-scoped paginated list. */
  async list<T>(
    path: string,
    query: PaginationParams & Record<string, string | number | undefined> = {},
  ): Promise<ResultPaged<T>> {
    const { apiKey } = env();
    if (!apiKey) {
      return { ok: false, error: "GIGS_API_KEY not set", retryable: false };
    }

    const url = buildUrl(projectPath(path), query);
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
      });
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "network error",
        retryable: true,
      };
    }

    let parsed: GigsListResponse<T> | null = null;
    try {
      parsed = (await res.json()) as GigsListResponse<T>;
    } catch {
      /* ignore */
    }

    if (!res.ok) {
      return {
        ok: false,
        error: parsed?.error ?? `gigs ${res.status} ${res.statusText}`,
        retryable: res.status >= 500 || res.status === 429,
        status: res.status,
      };
    }

    return {
      ok: true,
      value: parsed?.data ?? [],
      moreItemsAfter: parsed?.moreItemsAfter ?? false,
      moreItemsBefore: parsed?.moreItemsBefore ?? false,
    };
  },

  /** Raw, project-agnostic request — used by `/users/search` etc. */
  async raw<T>(path: string, opts: RequestOpts = {}): Promise<Result<T>> {
    return request<T>(path, opts);
  },
};
