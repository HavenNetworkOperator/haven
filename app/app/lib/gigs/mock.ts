// Mock fixtures shaped exactly like Gigs API responses.
// Used by every helper in this folder when `GIGS_API_KEY` is unset, so
// the rest of the app can develop and demo offline. Swap to live mode
// by populating `.env.local` with `GIGS_API_KEY` + `GIGS_PROJECT_ID`.
//
// Three plans seeded — Lite / Standard / Plus — modelled on the founding-
// member offer. Two demo subscriptions — Maya (Standard, 8 GB) and Theo
// (Lite, 4 GB) — keyed by their device tokens.

import type {
  GigsPlan,
  GigsSubscription,
  GigsUser,
} from "./types";

const HAVEN_LITE: GigsPlan = {
  object: "plan",
  id: "plan_havenLite",
  name: "Haven Lite",
  description: "First phone. Lighter use. Same line.",
  image: null,
  coverage: { countries: ["GB", "FR", "DE", "ES", "IT", "NL", "IE", "PT"] },
  allowances: {
    data: 4_000_000_000, // 4 GB
    voice: 60 * 60 * 1000, // unlimited (1000h placeholder)
    sms: 5000,
  },
  price: { amount: 800, currency: "GBP" }, // founding £8/mo
  provider: "p3",
  validity: { duration: 1, durationUnit: "month", renewalType: "recurring" },
  status: "available",
  simTypes: ["eSIM"],
  requiresAddressVerification: true,
  requiresBirthdayVerification: true,
  requiresFullNameVerification: true,
  requiresDevice: false,
};

const HAVEN_STANDARD: GigsPlan = {
  ...HAVEN_LITE,
  id: "plan_havenStandard",
  name: "Haven Standard",
  description: "The default. What we'd choose for our own.",
  allowances: { ...HAVEN_LITE.allowances, data: 8_000_000_000 },
  price: { amount: 1000, currency: "GBP" }, // founding £10/mo
};

const HAVEN_PLUS: GigsPlan = {
  ...HAVEN_LITE,
  id: "plan_havenPlus",
  name: "Haven Plus",
  description: "More data. Travel-ready.",
  allowances: { ...HAVEN_LITE.allowances, data: 20_000_000_000 },
  price: { amount: 1400, currency: "GBP" }, // founding £14/mo
};

const PARENT_USER: GigsUser = {
  object: "user",
  id: "usr_alex_bowdler",
  email: "alex.bowdler@example.com",
  emailVerified: true,
  fullName: "Alex Bowdler",
  birthday: "1984-03-12",
  preferredLocale: "en-GB",
  createdAt: "2026-02-12T09:14:22Z",
};

const MAYA_SUBSCRIPTION: GigsSubscription = {
  object: "subscription",
  id: "sub_mayaPhone",
  plan: HAVEN_STANDARD,
  user: PARENT_USER,
  sim: {
    object: "sim",
    id: "sim_mayaPhone",
    type: "eSIM",
    iccid: "8944501912345678901",
    provider: "p3",
    status: "active",
    createdAt: "2026-02-12T09:18:00Z",
  },
  phoneNumber: "+447700900142",
  currentPeriod: {
    number: 4,
    start: "2026-05-12T00:00:00Z",
    end: "2026-06-11T23:59:59Z",
  },
  status: "active",
  porting: null,
  activatedAt: "2026-02-12T09:22:01Z",
  canceledAt: null,
  createdAt: "2026-02-12T09:18:00Z",
  endedAt: null,
  firstUsageAt: "2026-02-12T11:04:18Z",
};

const THEO_SUBSCRIPTION: GigsSubscription = {
  object: "subscription",
  id: "sub_theoPhone",
  plan: HAVEN_LITE,
  user: PARENT_USER,
  sim: {
    object: "sim",
    id: "sim_theoPhone",
    type: "eSIM",
    iccid: "8944501912345678929",
    provider: "p3",
    status: "active",
    createdAt: "2026-02-12T09:20:00Z",
  },
  phoneNumber: "+447700900143",
  currentPeriod: {
    number: 4,
    start: "2026-05-12T00:00:00Z",
    end: "2026-06-11T23:59:59Z",
  },
  status: "active",
  porting: null,
  activatedAt: "2026-02-12T09:24:48Z",
  canceledAt: null,
  createdAt: "2026-02-12T09:20:00Z",
  endedAt: null,
  firstUsageAt: "2026-02-12T13:42:11Z",
};

const subscriptionsById: Record<string, GigsSubscription> = {
  [MAYA_SUBSCRIPTION.id]: MAYA_SUBSCRIPTION,
  [THEO_SUBSCRIPTION.id]: THEO_SUBSCRIPTION,
};

const subscriptionByDeviceToken: Record<string, GigsSubscription> = {
  "maya-aBc7d2": MAYA_SUBSCRIPTION,
  "theo-K9rPq4": THEO_SUBSCRIPTION,
};

export const mockGigs = {
  parentUser: PARENT_USER,
  plans: [HAVEN_LITE, HAVEN_STANDARD, HAVEN_PLUS] as GigsPlan[],

  user(email: string): GigsUser | null {
    return email === PARENT_USER.email ? PARENT_USER : null;
  },

  plan(id: string): GigsPlan | null {
    return [HAVEN_LITE, HAVEN_STANDARD, HAVEN_PLUS].find((p) => p.id === id) ?? null;
  },

  subscription(id: string): GigsSubscription | null {
    return subscriptionsById[id] ?? null;
  },

  subscriptionByDeviceToken(token: string): GigsSubscription | null {
    return subscriptionByDeviceToken[token] ?? null;
  },

  subscriptionsForUser(userId: string): GigsSubscription[] {
    return Object.values(subscriptionsById).filter((s) => s.user.id === userId);
  },
};
