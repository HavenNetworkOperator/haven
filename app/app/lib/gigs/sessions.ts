import { gigsClient, isLive } from "./client";
import type {
  ConnectSessionCreate,
  GigsConnectSession,
  Result,
} from "./types";

/**
 * Create a Gigs Connect session. Returns a hosted URL the user is
 * redirected to (or iframed into). On completion, Gigs redirects to
 * the `callbackUrl` we provide.
 *
 * `POST /projects/:p/connectSessions`
 *
 * Reference: https://github.com/gigs/connect-sessions-buy-manage-example
 */
export async function createConnectSession(
  params: ConnectSessionCreate,
): Promise<Result<GigsConnectSession>> {
  if (!isLive()) {
    // In mock mode, return a synthetic session URL pointing at our own
    // /setup/activate page — the wizard can render a "GIGS would handle
    // this in production" placeholder there.
    return {
      ok: true,
      value: {
        object: "connectSession",
        id: `cs_mock_${Date.now()}`,
        intent: params.intent,
        url: `/setup/activate?mockIntent=${params.intent}`,
        callbackUrl: params.callbackUrl,
        createdAt: new Date().toISOString(),
      },
    };
  }
  return gigsClient.post<GigsConnectSession>("/connectSessions", params);
}

/** `GET /projects/:p/connectSessions/:id` */
export async function getConnectSession(
  id: string,
): Promise<Result<GigsConnectSession | null>> {
  if (!isLive()) {
    return { ok: true, value: null };
  }
  return gigsClient.get<GigsConnectSession>(`/connectSessions/${encodeURIComponent(id)}`);
}
