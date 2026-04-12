---
name: Haven — Project Overview
description: Core context for Haven, a UK family MVNO launching in 2026 — product, positioning, tech stack, deployment, and open tasks
type: project
---

## What Haven Is

**Haven** is a UK MVNO (Mobile Virtual Network Operator) targeting families with children aged 9–17. It is positioned as Britain's first mobile network designed around families — not adults selling adults more data.

**Core differentiators:**
1. Safety at the network/SIM layer (not an app — can't be uninstalled or bypassed)
2. AI safety that detects grooming patterns and age-inappropriate content in real time, on-device
3. Privacy-first: parents get weekly insight summaries, not surveillance dashboards
4. Equity crowdfunding round planned — waitlist members invest first

**Positioning hook:** The Smartphone Free Childhood (SFC) movement has activated tens of thousands of UK parents who delayed giving their child a phone. Haven is the responsible option for when they finally do.

**Why:** Founded because no existing mobile network was designed with children as the primary user. Every option forced a choice between safety and freedom, trust and surveillance.

---

## Status (as of April 2026)

- Pre-launch, building waitlist toward 1,000 founding members
- Landing page live at **https://haven-waitlist-two.vercel.app**
- Vercel project: `rich-bowdlers-projects/haven-waitlist` (account: `richbowdler-3826`)
- Formspree not yet configured — `YOUR_FORM_ID` placeholder still in `index.html:535`
- `[FOUNDER NAME]` placeholder still in `index.html:651`
- Contact email `hello@haven.example` is a placeholder
- Analytics not yet added to the page

---

## Tech Stack

- **Single file:** `index.html` — fully self-contained, no framework, no build step
- **Fonts:** Fraunces (serif display) + Inter Tight (sans) via Google Fonts
- **Form backend:** Formspree (not yet configured)
- **Deployment:** Vercel (static), CLI deploy via `vercel --prod` from project directory
- **Email/waitlist:** Beehiiv recommended (not yet set up)

---

## Founding Member Offer

First 1,000 signups receive:
- Founding member pricing locked for life
- Priority access on launch day
- A vote on the first 3 AI safety features shipped
- Direct line to the founding team
- Founding member status at every milestone

---

## Key Files in the Project

| File | Purpose |
|---|---|
| `index.html` | Entire landing page (self-contained) |
| `style-guide.md` | Full design system: colours, typography, spacing, components, animation |
| `launch-plan.md` | Phased waitlist launch plan with checkbox task lists |
| `context.md` | This file — project context for Claude |
| `CLAUDE.md` | Agent instructions (WAT framework) |
| `haven-kickstarter-philosophy.md` | Campaign video script and creative brief |
| `haven-kickstarter.png` | Campaign hero image |
| `haven-video/` | Remotion project — Kickstarter campaign video |

---

## Design Identity (summary — full details in style-guide.md)

- **Aesthetic:** Warm editorial print — broadsheet supplement, not tech startup
- **Colours:** Paper (`#f4efe6`), ink navy (`#0f1b2d`), terracotta accent (`#c14a1f`)
- **Type:** Fraunces (serif, italic for emotional emphasis) + Inter Tight (sans, UI/body)
- **Tone:** Direct, honest, parent-to-parent register

---

## Launch Plan (summary — full details in launch-plan.md)

**5 phases:**
1. Foundation — fix form, analytics, Beehiiv, welcome email
2. Owned channel — fortnightly founder update email to list
3. Rented channels — Twitter/X + LinkedIn (building in public)
4. Borrowed channels — Smartphone Free Childhood UK DM, parent influencers, Mumsnet thread, podcasts, press
5. Crowdfunding — Crowdcube or Seedrs, trigger at 500 signups

**Milestone targets:** 100 (week 2–3) → 250 (month 1) → 500 (month 2) → 1,000 (month 3–4)

---

## Kickstarter Campaign Video (April 2026)

A cinematic motion graphics video has been built in Remotion (`haven-video/`), designed for the Kickstarter campaign page.

**Tech:** Remotion 4.0.448 · 1920×1080 · 30fps · 75s (2250 frames)
**Fonts:** Fraunces (serif display) + Inter Tight (sans) via `@remotion/google-fonts`
**Style:** Documentary film title card aesthetic — full-bleed, sparse, editorial. One powerful statement per scene. Dark/light alternating backgrounds.

**5 scenes:**
1. **Opening Stat** — "98% of UK mobile networks were designed for adults." Staged reveal on black.
2. **Founder Story** — 3 full-bleed statements, alternating paper/ink bg, word-by-word stagger animation.
3. **The Product** — 4 dark cards with self-drawing SVG icons (SIM, Lock, Shield, Document). strokeDashoffset animation.
4. **The Campaign** — Paper bg, sequential stat blocks (£25, £8/mo, 500 slots). Opening quote + closing copy.
5. **End Card** — Haven logo mark, wordmark, tagline, Kickstarter CTA.

**Dev server:** `cd haven-video && npm run dev` → http://localhost:3001
**Render:** `npx remotion render src/index.ts HavenVideo out/haven-kickstarter.mp4`

**Pending:** Update `kickstarter.com/projects/haven` placeholder URL in `Scene5EndCard.tsx:173` once live.

---

## Immediate Next Actions (Phase 1 priority)

1. Configure Formspree → update `index.html:535` → `vercel --prod`
2. Replace `[FOUNDER NAME]` on `index.html:651`
3. Add analytics snippet to `index.html`
4. Set up Beehiiv + welcome email sequence
5. Post founding story on Twitter/X and LinkedIn
6. DM Smartphone Free Childhood UK on Instagram
7. Render Kickstarter video MP4 and upload to campaign page
