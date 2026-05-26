# Brand Guardrails — Haven

## Purpose

A short rejection-rule list that the auto-research workflows (`conversion-audit.md`, `viral-coefficient-audit.md`) cross-check every recommendation against. Keeps generic CRO / referral / growth-marketing skills honest to Haven's voice and mission.

If a recommendation violates one of the rules below, **drop it from the audit output**. Don't rewrite it to almost-fit; drop it.

---

## Rule 1 — Mission framing first; one simple reciprocity offer allowed

Haven's customers came in through Smartphone Free Childhood. The motivation that brought them is parent-to-parent collective action against a crisis that's hurting their kids. That motivation has to lead every ask. The one financial element we allow is a **flat, symmetric, untiered free-month-per-signup offer** — both the new signup and the inviter get one free month at launch, no cap. Mission framing in the headline, the free-month reciprocity as the practical mechanic alongside it.

**Reject:**
- Tiered referral reward ladders (5 → bronze, 10 → silver, etc.)
- Discount codes for invitees
- Cash credit / store credit / loyalty points
- "Share to unlock" or any gated content/feature
- Variable rewards that change based on volume or speed
- "$X off your first SIM"

**Accept:**
- "Your first month is on us — and one more free month for every parent you invite"
- "You both get a free month of Haven when they sign up"
- "Help us reach 1,000 — then Haven launches"
- "Every parent you invite is one more vote that this needs to exist"
- "Send this to the parent at the school gate who's also been waiting"
- Milestone framing tied to Crowdcube / launch
- Local-pact framing (school WhatsApps, year groups, friendship circles)

**Why:** the original rule rejected all financial incentives because Hannah and Al said tiered/transactional framing felt wrong for mission-driven parents. A single symmetric reciprocity — both sides get the same thing, no ladders, no exclusion — keeps the parent-to-parent voice intact while removing the friction that pure mission framing left on the table. We are still running a movement; the free month is the thank-you, not the bait.

---

## Rule 2 — Parent-to-parent voice, never telco-startup voice

**Reject:**
- "Unlock the future of family connectivity"
- "Disrupting the mobile industry"
- "AI-powered protection"
- "Industry-leading"
- "Game-changing"
- Hero copy structured as feature → benefit → CTA
- Product-tour videos
- Stat-stacked above-the-fold hero ("10x safer · 50+ controls · 99.9% uptime")
- Emoji-heavy headlines
- Hype words: revolutionary, ultimate, supercharged, next-gen

**Accept:**
- Direct, declarative sentences a real parent would say at the school gate
- Editorial-print weight: full sentences, em-dashes, italics for emotional emphasis
- Honest limits (the four-layers section, the "won't do — ever" panel)
- One clear claim per section, sourced
- The founder writing in first person

**Why:** the editorial print aesthetic is a strategic moat. Every other MVNO sounds like a telco. The reason warm contacts trusted us enough to share is that we don't sound like one.

---

## Rule 3 — Honesty about limits, never glossing

**Reject:**
- "Total protection"
- "Complete safety"
- "Block everything"
- "100% safe"
- Any wording that implies Haven solves the whole problem

**Accept:**
- "We block X reliably, Y imperfectly, and we won't pretend to do Z"
- Published detection rates ("we'll publish ours once live")
- Acknowledging the second-SIM problem head-on
- "It's a very good tool. It isn't a substitute for you."

**Why:** SFC parents have been lied to by every device manufacturer, every parental-control app, every Wi-Fi filter. The competitive advantage is being the first product that admits what it can't do.

---

## Rule 4 — Don't reduce the parent's agency, don't demand work

**Reject:**
- "Vote on which features ship" (Barbara: "feels daunting, I don't know enough")
- "Co-design the product with us"
- "Help us decide between X and Y" (the parent didn't sign up to do strategy)
- "Earn your way to the top of the queue"
- Anything that frames the parent as labour we extract from

**Accept:**
- "Tell us what you most want blocked — we build for the founding families first" (gives them a low-bar way to contribute, frames us as the ones doing the work)
- "Reply with anything" (open-ended, optional)
- Optional surveys, never required

**Why:** these parents are already doing the work of waiting on smartphones, defending the choice to extended family, holding the line at school gates. We add to their load at our peril.

---

## Rule 5 — Queue position is a scoreboard, not a motivation

**Reject:**
- Queue position as the headline reason to share
- Position-jumping tier mechanics
- Gamified leaderboards
- "Move up the queue" framed as the hero benefit

**Accept:**
- Position number visible as a personal scoreboard for the parents who *do* care about it (some do)
- Mission-led copy as the primary share rationale
- Position #1 mention only as a factual aside ("Position #1 still gets their SIM first on launch day")

**Why:** Al said it directly — "I don't really care if I move up the queue". Hannah said the SFC pact is what motivates sharing. Two of six warm contacts told us this; assume it generalises until we have data otherwise.

---

## How to use this file

When running an audit workflow, the agent must:
1. Generate a candidate list of recommendations using the relevant skills (`page-cro`, `signup-flow-cro`, `referral-program`, `marketing-psychology`, etc.).
2. For each candidate, check against the five rules above.
3. If a candidate violates any rule, drop it. Don't rewrite to fit — the rule exists because the rewrite tends to smuggle the violation back in.
4. The final audit output should include a **"Recommendations rejected on guardrails"** section that lists what was dropped and which rule killed it. This makes the guardrails visible and lets us refine them over time.

## Updating this file

If a real test result contradicts a rule (e.g. a financial incentive A/B-tests as 2x more effective and we're comfortable with the audience drift), update the rule with a dated note. Don't silently override.
