// Founding-council feature vote data. Replaced by Postgres reads from
// founding_votes once auth is wired. See plan §Data model.

export type CouncilFeature = {
  id: string;
  title: string;
  oneLiner: string;
  detail: string;
  voteCount: number;
};

export const councilFeatures: CouncilFeature[] = [
  {
    id: "grooming-detection",
    title: "On-device grooming-pattern detection",
    oneLiner:
      "Detect concerning conversation patterns on the device itself, then surface a flagged-incident notice to the parent — never the raw text.",
    detail:
      "Conversation analysis runs locally on the child's phone. If a pattern matches the model — pressure to keep secrets, requests to move off-platform, age-faking — the parent receives a short notice with a token they can redeem on the child's device to see redacted context. No conversation data ever leaves the phone, and no third party ever sees it.",
    voteCount: 247,
  },
  {
    id: "stranger-call-screening",
    title: "Stranger-call screening",
    oneLiner:
      "Calls from numbers outside the whitelist go to a Haven voicemail that asks for the caller's name and reason before the phone can ring.",
    detail:
      "Today, anyone not on the whitelist is silently held. This feature softens that: a stranger can leave a 30-second voice note explaining who they are, which the parent reviews. If approved, the contact is added and the call returns. School trip coaches, scout leaders, sports clubs — the real-world long tail.",
    voteCount: 198,
  },
  {
    id: "bullying-language",
    title: "On-device bullying-language detection",
    oneLiner:
      "Flag harassment patterns in incoming messages and surface a private note to both child and parent — privately, separately, so the child can speak first.",
    detail:
      "Built on the same on-device pipeline as grooming detection, but tuned for peer harassment — group exclusion, escalating insults, threats. The child gets a quiet note offering a way to talk about it. The parent gets a private heads-up the following week. The aim is to make space, not to alarm.",
    voteCount: 219,
  },
];
