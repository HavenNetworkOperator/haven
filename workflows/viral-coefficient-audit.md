# Workflow — Viral Coefficient Audit

## Objective

Generate a prioritised list of hypotheses + concrete diffs to improve the *viral coefficient* — the rate at which a new signup brings in additional signups via their invite link. Output is a markdown file in `.tmp/` for the founder to review.

The viral coefficient `K` we care about: `K = (share-clicks per signup) × (conversion rate of clicked-through visitors)`. `K > 1` is exponential growth from sharing alone; we don't expect that pre-launch, but every 0.1 increase materially shortens the path to 1,000 signups.

This workflow does **not** make site edits. Output is a recommendation document.

---

## When to run

- Every two weeks, or after any change to `/waitlist` confirmation state.
- When PostHog `share_clicked` events show a >20% week-over-week swing.
- When new qualitative feedback specifically critiques the share UX or motivation (e.g. another Pete-style "put share front and centre").

---

## Inputs

| Source | What | Where |
|---|---|---|
| Live waitlist HTML | The confirmation state, share blurb, share buttons | `waitlist/index.html` lines containing `status-state` through `share-footnote` |
| Brand context | Voice, mission, why we don't do financial incentives | `context.md`, `manifesto.md`, `workflows/brand-guardrails.md` (Rule 1 especially) |
| Qualitative feedback | What real signups said about sharing | `Haven - Launch feedback _ iterations - Sheet1.csv` (rows from Hannah, Al, Pete, Barbara are the load-bearing ones for this audit) |
| Share-event metrics | PostHog `share_clicked`, `share_copy_succeeded`, `share_native_completed` | `.tmp/metrics-{date}.md` |
| Referral conversion | Signups with `referred_by` set in `api/signup.js` | Same metrics file |

If `share_clicked` events are missing or below 20 in the window, the audit runs on qualitative inputs only and notes "share-event volume too low for quantitative analysis".

---

## Steps

### 1. Snapshot + metrics

Same as the conversion audit:
- `python tools/site_snapshot.py`
- `python tools/posthog_metrics.py --window 30d --focus share`

The `--focus share` flag tells the metrics tool to compute:
- `share_clicked` count, broken down by channel (native / whatsapp / email / copy / twitter)
- `share_clicked` ÷ `waitlist_signed_up` (intent rate — what fraction of signups even attempt a share)
- `share_copy_succeeded` ÷ `share_clicked` for `channel=copy` (a sanity check for clipboard failures)
- `referred_by` non-null signups ÷ all signups (the realised viral coefficient)
- Channel-attributed conversion: for each channel, what fraction of clicks led to a signup with that referrer

### 2. Skill-driven analysis

For each, invoke the named skill against the snapshot:

1. **`referral-program`** — but **constrain it explicitly** at invocation time: "Apply mission/participation framing only. No financial incentives. No tier mechanics. No gamified leaderboards. Read `workflows/brand-guardrails.md` Rule 1 before generating any recommendations."
2. **`marketing-psychology`** — focus on share-motivation models (social identity, collective efficacy, reciprocity, in-group signalling). For SFC parents specifically, *collective efficacy* and *moral identity* are the load-bearing models. Keep recommendations within those.
3. **`copy-editing`** — for the share blurb specifically. Test against three contexts: a school WhatsApp group, an SFC local-area Facebook group, and a one-to-one text to a friend. Each context has different acceptable lengths and tones.
4. **`signup-flow-cro`** — for the share UI itself: button hierarchy, native-share availability, friction in the copy-link flow.

### 3. Brand-guardrail cross-check

Walk every candidate through `workflows/brand-guardrails.md`. Rule 1 (mission framing only, never financial) and Rule 5 (queue position is a scoreboard, not a motivation) will do most of the rejection work here. Rule 4 (don't reduce parent agency) catches recommendations that would frame the parent as a referral-program participant rather than a movement member.

Drop violators. Keep the rejected list visible in the output.

### 4. Prioritise

Rank by **(channel volume × intent-rate lift × on-brand fit) ÷ effort**. WhatsApp is by far the highest-volume channel for SFC parents — a 5% improvement to the WhatsApp flow beats a 50% improvement to the Twitter flow.

Specifically de-prioritise:
- Twitter/X improvements (low volume, wrong audience)
- Adding new channels (Instagram, Telegram) before the existing ones are optimal
- Anything that touches financial mechanics (rule 1 will already have killed it, but double-check at this stage)

Top 5 surviving candidates only.

### 5. Output

Write to `.tmp/viral-audit-{YYYY-MM-DD}.md` with this structure:

```markdown
# Viral Coefficient Audit — {date}

## TL;DR
{2–3 sentences: current K estimate, where the leak is, what to try first}

## Share funnel
| Stage | Count (30d) |
|---|---|
| Signups | ... |
| `share_clicked` (any channel) | ... |
| `share_clicked` (whatsapp) | ... |
| `share_clicked` (native) | ... |
| `share_clicked` (email) | ... |
| `share_clicked` (copy) | ... |
| Signups with `referred_by` | ... |
| Estimated K | ... |

## Top 5 hypotheses
{Same structure as conversion-audit: Where / Current / Proposed / Why / Rests on / Confidence / Effort / How to test}

## Rejected on guardrails
- {Rejected candidate} — violated Rule N: {one-line why}

## Notes
{Future-audit improvements — append below.}
```

### 6. Stop

Don't implement. Founder reviews and decides.

---

## Edge cases & learnings

1. *Reserved for first real run.*

---

## Why no financial incentive testing

Rule 1 of `workflows/brand-guardrails.md` rejects financial mechanics. This is a deliberate constraint, not an oversight. If a future audit run *really* wants to test "first month free for 3 referrals" or similar, the right move is to update the guardrail with a dated note ("revisited 2026-XX-XX after K stagnated below 0.1 for two months — testing limited financial incentive") — not to silently include it.

---

## Recurring schedule

```
/schedule create "weekly viral audit" --cron "0 9 * * MON" --prompt "Run workflows/viral-coefficient-audit.md and post the output as a PR comment"
```
Not enabled by default.
