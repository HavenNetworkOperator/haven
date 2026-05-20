// Types for the Gigs Mobile Operator API.
// Sources:
//   • https://developers.gigs.com/api/introduction
//   • https://developers.gigs.com/api/authentication
//   • https://developers.gigs.com/api/pagination
//   • https://github.com/gigs/connect-sessions-buy-manage-example
//     (Gigs' own reference Next.js app — canonical schemas)
//
// Anything not publicly documented (webhook event catalog, signature
// verification, billing/usage/device shapes) is marked TODO and will
// be filled in once Haven has an API key from `support@gigs.com`.

/* ────────────────────────────────────────────────────────────────────
   Common
   ──────────────────────────────────────────────────────────────────── */

export type Money = {
  /** Smallest currency unit (e.g. pence for GBP). */
  amount: number;
  /** ISO 4217 currency code, e.g. "GBP", "USD", "EUR". */
  currency: string;
};

export type Allowances = {
  /** Data in bytes. */
  data?: number;
  /** Voice in seconds. */
  voice?: number;
  /** SMS count. */
  sms?: number;
};

export type Coverage = {
  /** ISO 3166-1 alpha-2 country codes. */
  countries: string[];
};

export type Validity = {
  duration: number;
  durationUnit: "day" | "month";
  renewalType: "oneTime" | "recurring";
};

/** Anonymised carrier identifier — `"p1"` through `"p9"`, or `"test"`. */
export type SimProvider = `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | "test";

/* ────────────────────────────────────────────────────────────────────
   User
   ──────────────────────────────────────────────────────────────────── */

export type GigsUser = {
  object: "user";
  id: string;
  email: string;
  emailVerified: boolean;
  fullName: string | null;
  birthday: string | null;
  preferredLocale: string;
  createdAt: string;
};

/* ────────────────────────────────────────────────────────────────────
   Plan
   ──────────────────────────────────────────────────────────────────── */

export type PlanStatus = "available" | "archived" | "pending" | "draft";
export type SimType = "eSIM" | "pSIM";

export type GigsPlan = {
  object: "plan";
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  coverage: Coverage;
  allowances: Allowances;
  price: Money;
  provider: SimProvider;
  validity: Validity;
  status: PlanStatus;
  simTypes: SimType[];
  requiresAddressVerification: boolean;
  requiresBirthdayVerification: boolean;
  requiresFullNameVerification: boolean;
  requiresDevice: boolean;
};

/* ────────────────────────────────────────────────────────────────────
   SIM
   ──────────────────────────────────────────────────────────────────── */

export type SimStatus = "active" | "inactive" | "deleted" | "retired";

export type GigsSim = {
  object: "sim";
  id: string;
  type: SimType;
  iccid: string;
  provider: SimProvider;
  status: SimStatus;
  createdAt: string;
};

/* ────────────────────────────────────────────────────────────────────
   Porting
   ──────────────────────────────────────────────────────────────────── */

export type PortingStatus =
  | "draft"
  | "informationRequired"
  | "pending"
  | "requested"
  | "declined"
  | "canceled"
  | "expired"
  | "completed";

export type GigsPorting = {
  object: "porting";
  id: string;
  status: PortingStatus;
  firstName: string | null;
  lastName: string | null;
  birthday: string | null;
  phoneNumber: string | null;
  accountNumber: string | null;
  accountPinExists: boolean;
  donorProvider: SimProvider | null;
  recipientProvider: SimProvider | null;
  createdAt: string;
  lastRequestedAt: string | null;
  lastDeclinedAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  expiredAt: string | null;
  declinedAttempts: number;
  declinedCode: string | null;
  declinedMessage: string | null;
};

/* ────────────────────────────────────────────────────────────────────
   Subscription
   ──────────────────────────────────────────────────────────────────── */

export type SubscriptionStatus = "pending" | "active" | "ended";

export type SubscriptionPeriod = {
  number: number;
  start: string;
  end: string;
};

export type GigsSubscription = {
  object: "subscription";
  id: string;
  plan: GigsPlan;
  user: GigsUser;
  sim: GigsSim | null;
  phoneNumber: string | null;
  currentPeriod: SubscriptionPeriod | null;
  status: SubscriptionStatus;
  porting: GigsPorting | null;
  activatedAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  endedAt: string | null;
  firstUsageAt: string | null;
};

/* ────────────────────────────────────────────────────────────────────
   Add-on
   ──────────────────────────────────────────────────────────────────── */

export type AddonType = "topUp" | "other";
export type AddonStatus = "draft" | "available" | "archived";
export type RecurrenceType = "oneTime" | "recurring";

export type GigsAddon = {
  object: "addon";
  id: string;
  name: string;
  description: string | null;
  status: AddonStatus;
  type: AddonType;
  price: Money;
  recurrenceType: RecurrenceType;
  allowances: Allowances;
  provider: SimProvider;
  validity: Pick<Validity, "duration" | "durationUnit"> | null;
  createdAt: string;
};

/* ────────────────────────────────────────────────────────────────────
   Connect Session — hosted checkout / management
   ──────────────────────────────────────────────────────────────────── */

export type ConnectSessionIntent =
  | "checkoutNewSubscription"
  | "checkoutAddon"
  | "changeSubscription"
  | "cancelSubscription"
  | "resumeSubscription"
  | "updateUserAddress"
  | "updateUserFullName"
  | "updatePaymentMethod"
  | "completePorting"
  | "viewSubscription"
  | "viewSubscriptions"
  | "viewEsimInstallation";

export type ConnectSessionUserDetails = {
  email: string;
  fullName?: string;
  preferredLocale?: string;
  birthday?: string;
};

export type ConnectSessionCreate = {
  callbackUrl: string;
  intent: ConnectSessionIntent;
  user: { id: string } | ConnectSessionUserDetails;
  userDetails?: ConnectSessionUserDetails;
};

export type GigsConnectSession = {
  object: "connectSession";
  id: string;
  intent: ConnectSessionIntent;
  url: string;
  callbackUrl: string;
  createdAt: string;
};

/* ────────────────────────────────────────────────────────────────────
   Response envelopes
   ──────────────────────────────────────────────────────────────────── */

export type GigsItemResponse<T> = {
  data?: T;
  error?: string;
};

export type GigsListResponse<T> = {
  data?: T[];
  error?: string;
  moreItemsAfter?: boolean;
  moreItemsBefore?: boolean;
};

export type PaginationParams = {
  /** Cursor ID to fetch items after. Mutually exclusive with `before`. */
  after?: string;
  before?: string;
  /** 0–200; default 10. */
  limit?: number;
};

/* ────────────────────────────────────────────────────────────────────
   Webhook events
   ────────────────────────────────────────────────────────────────────
   Event names below are documented in support tickets and the Gigs
   blog, but the full catalog + payload shapes are auth-gated. Treat
   this list as best-known. Update once we receive real deliveries. */

export type GigsWebhookEventName =
  | "subscription.created"
  | "subscription.activated"
  | "subscription.canceled"
  | "subscription.ended"
  | "subscription.firstUsage"
  | "subscription.updated"
  | "porting.created"
  | "porting.requested"
  | "porting.declined"
  | "porting.completed"
  | "porting.canceled"
  | "sim.activated"
  | "sim.deactivated"
  | "user.created"
  | "user.updated"
  | "usage.recorded"
  | "invoice.created"
  | "invoice.paid"
  | "invoice.payment_failed";

export type GigsWebhookEnvelope<T = unknown> = {
  id: string;
  type: GigsWebhookEventName;
  createdAt: string;
  data: T;
};

/* ────────────────────────────────────────────────────────────────────
   Result helper — used throughout the adapter so UI routes never throw.
   ──────────────────────────────────────────────────────────────────── */

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; retryable: boolean; status?: number };

export type ResultPaged<T> =
  | { ok: true; value: T[]; moreItemsAfter: boolean; moreItemsBefore: boolean }
  | { ok: false; error: string; retryable: boolean; status?: number };
