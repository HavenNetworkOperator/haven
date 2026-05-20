// Placeholder children registry.
// Replaced by Postgres queries (households + children + subscriptions + ...)
// once auth and the Gigs provisioning loop are wired. See plan §Data model.
//
// Haven-side fields only. Anything Gigs owns — phone number, SIM type,
// activation date, plan allowances, subscription status — is fetched
// via the Gigs adapter at @/lib/gigs using `gigsSubscriptionId`.

export type AppUsage = { name: string; minutes: number };

export type Contact = {
  name: string;
  phone: string;
  allowCall: boolean;
  allowSms: boolean;
};

export type PastWeek = {
  range: string;
  ofLabel: string;
  summary: string;
};

export type Child = {
  id: string;
  /** Opaque token for the child's possession-based /me URL. */
  deviceToken: string;
  /** Foreign key into Gigs. UI reads phone number, SIM, plan, status from here. */
  gigsSubscriptionId: string;
  name: string;
  age: number;
  /** Used on /me to phrase the "ask … to add them" prompt naturally. */
  parentSmsName: string;
  /** 2–3 sentence editorial lead for the insights page. */
  weekLead: string;
  /** Per-app screen time — sourced from the on-device agent, not Gigs. */
  apps: AppUsage[];
  /** Network-level social-app block attempts. Always 0 if the line is holding. */
  blockedAttempts: number;
  callsCount: number;
  smsCount: number;
  /** Data used in the current billing period, in MB. Cached from Gigs usage records. */
  dataUsedMb: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  contacts: Contact[];
  history: PastWeek[];
};

export const week = {
  ofLabel: "Week of 11 May",
  range: "11–17 May",
  publishedLabel: "Tue 19 May",
};

// The categories blocked at the network. Shown on every Insights page
// as the proof-of-protection block — the "what couldn't reach them" list.
export const blockedCategories = [
  "Instagram",
  "TikTok",
  "Snapchat",
  "X / Twitter",
  "BeReal",
  "Discord",
  "Facebook",
  "Reddit",
];

export const children: Child[] = [
  {
    id: "maya",
    deviceToken: "maya-aBc7d2",
    gigsSubscriptionId: "sub_mayaPhone",
    name: "Maya",
    age: 16,
    parentSmsName: "Mum",
    weekLead:
      "A quiet, sociable week. Messages dominated screen time — most of it to Saskia and " +
      "the Year 12 chat — and the evenings landed earlier than they have all term. " +
      "Five nights of phone down by 9pm. Nothing tried, nothing through.",
    apps: [
      { name: "Messages", minutes: 134 },
      { name: "Spotify", minutes: 91 },
      { name: "Phone", minutes: 62 },
      { name: "YouTube", minutes: 38 },
      { name: "Camera", minutes: 28 },
      { name: "Notes", minutes: 11 },
    ],
    blockedAttempts: 0,
    callsCount: 18,
    smsCount: 246,
    dataUsedMb: 3140,
    quietHoursStart: "21:30",
    quietHoursEnd: "07:00",
    contacts: [
      { name: "Mum", phone: "+44 7700 900001", allowCall: true, allowSms: true },
      { name: "Dad", phone: "+44 7700 900002", allowCall: true, allowSms: true },
      { name: "Nana", phone: "+44 7700 900003", allowCall: true, allowSms: true },
      { name: "Theo (brother)", phone: "+44 7700 900143", allowCall: true, allowSms: true },
      { name: "Saskia", phone: "+44 7700 900512", allowCall: true, allowSms: true },
      { name: "Tom", phone: "+44 7700 900513", allowCall: true, allowSms: true },
      { name: "Year 12 chat", phone: "+44 7700 900702", allowCall: false, allowSms: true },
      { name: "Hockey team", phone: "+44 7700 900703", allowCall: false, allowSms: true },
    ],
    history: [
      {
        range: "4–10 May",
        ofLabel: "Week of 4 May",
        summary: "Bank-holiday week — lighter usage, almost no evening screen time after 8pm.",
      },
      {
        range: "27 Apr–3 May",
        ofLabel: "Week of 27 April",
        summary: "Back to a school rhythm. First Spotify-heavy revision week of the term.",
      },
      {
        range: "20–26 April",
        ofLabel: "Week of 20 April",
        summary: "Easter holiday. Mostly camera, messages, and a long FaceTime call on Friday.",
      },
    ],
  },
  {
    id: "theo",
    deviceToken: "theo-K9rPq4",
    gigsSubscriptionId: "sub_theoPhone",
    name: "Theo",
    age: 14,
    parentSmsName: "Mum",
    weekLead:
      "The data cap was reached on Wednesday — not a surprise after a YouTube-heavy weekend. " +
      "Calls were almost entirely family. Six nights of phone down by 9pm. " +
      "Nothing tried, nothing through.",
    apps: [
      { name: "YouTube", minutes: 107 },
      { name: "Messages", minutes: 58 },
      { name: "Phone", minutes: 22 },
      { name: "Music", minutes: 18 },
      { name: "Camera", minutes: 14 },
      { name: "Maps", minutes: 6 },
    ],
    blockedAttempts: 0,
    callsCount: 9,
    smsCount: 88,
    dataUsedMb: 3920,
    quietHoursStart: "21:00",
    quietHoursEnd: "07:00",
    contacts: [
      { name: "Mum", phone: "+44 7700 900001", allowCall: true, allowSms: true },
      { name: "Dad", phone: "+44 7700 900002", allowCall: true, allowSms: true },
      { name: "Nana", phone: "+44 7700 900003", allowCall: true, allowSms: true },
      { name: "Maya (sister)", phone: "+44 7700 900142", allowCall: true, allowSms: true },
      { name: "Jonah", phone: "+44 7700 900611", allowCall: true, allowSms: true },
      { name: "Year 10 friends", phone: "+44 7700 900804", allowCall: false, allowSms: true },
    ],
    history: [
      {
        range: "4–10 May",
        ofLabel: "Week of 4 May",
        summary: "Bank-holiday week — football tournament Saturday meant lots of Maps + Phone.",
      },
      {
        range: "27 Apr–3 May",
        ofLabel: "Week of 27 April",
        summary: "Light week. First time the data cap held comfortably under 4GB.",
      },
      {
        range: "20–26 April",
        ofLabel: "Week of 20 April",
        summary: "Easter holiday. Calls home from Nana's most days.",
      },
    ],
  },
];

export function findChild(id: string): Child | undefined {
  return children.find((c) => c.id === id);
}

export function findChildByToken(token: string): Child | undefined {
  return children.find((c) => c.deviceToken === token);
}

export function homeNotableItems() {
  return [
    {
      lead: "Maya — first quiet evening of the term.",
      detail: "Phone down by 9pm on five of seven nights.",
    },
    {
      lead: "Theo — data cap reached Wednesday.",
      detail: "Nothing dramatic. A pattern to watch.",
    },
    {
      lead: "Across both — zero blocked-app attempts.",
      detail: "The line is holding.",
    },
  ];
}
