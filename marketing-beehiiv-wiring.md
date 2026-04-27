# Beehiiv Setup + Formspree → Beehiiv Wiring

This is the spec for B1 in the marketing-foundation track. Two halves:
1. Beehiiv account + welcome automation (always required)
2. Wiring Formspree submissions into Beehiiv (two options — pick one)

---

## Step 1 — Beehiiv account + publication

**Cost:** free up to 2,500 subscribers. No card needed to start.

1. Sign up at beehiiv.com with the same `rich@gethavenmobile.com` (or whichever address Haven mail is sending from)
2. Create publication:
   - **Name:** `Haven`
   - **Subdomain:** `haven` (`haven.beehiiv.com`) — change to a custom domain later if desired
   - **Description:** *Britain's first mobile network designed around families. Fortnightly updates from the founder.*
   - **From name:** `Rich at Haven`
   - **Reply-to:** real inbox you check (replies are copy research)
3. Customise the publication:
   - **Logo:** upload Haven `favicon.svg` (or a PNG export at 512×512)
   - **Brand colours:** primary `#0f1b2d` (Ink), accent `#c14a1f` (Terracotta), background `#f4efe6` (Paper)
   - **Fonts:** Beehiiv won't load Fraunces by default — use `Georgia` as the serif fallback so emails still feel editorial
4. Set up **automation → "When subscriber added → Send email"**
   - Pull copy from `marketing-welcome-email.md`
   - Test by adding your own personal email manually before wiring up Formspree

## Step 2 — Wire Formspree to Beehiiv

**Two options. Pick one based on the trade-offs below.**

### Option A — Zapier (recommended if you want this live today)

**Cost:** Zapier Starter ~£15/mo (sufficient for waitlist scale; the free tier is too restrictive on tasks/month)
**Time to live:** 15 minutes
**Pros:** No site changes, no redeploy, working in minutes. If you ever switch off Formspree, you swap the trigger and keep the rest.
**Cons:** Recurring cost. One more service to keep alive. Slight delay (typically <30s) between signup and welcome email.

**Zap config:**
- **Trigger:** Formspree → "New Submission" → form `mpqkabdk`
- **Action 1 (optional but recommended):** Filter — only continue if `email` field exists and is not empty
- **Action 2:** Beehiiv → "Create Subscriber"
  - `email` → from Formspree submission
  - `referring_site` → `https://gethavenmobile.com`
  - `utm_source` → if Formspree is capturing UTMs from query strings, map them; otherwise leave blank
  - `subscription_tier` → `free`
  - `send_welcome_email` → `true` (this is what triggers the welcome automation)
- Test the Zap with a real submission before turning it on

### Option B — Beehiiv embedded form on the site

**Cost:** £0 ongoing
**Time to live:** ~1 hour (HTML edits + redeploy + cross-page testing)
**Pros:** No middleware. Free. Lower latency. One fewer SaaS to manage.
**Cons:** Requires editing the form snippet on **all four pages** (`index.html`, `story/`, `privacy/`, `compliance/`). Loses Formspree's spam protection (Beehiiv has its own, but you'd want to verify it's adequate).

**Steps if choosing this option:**
1. In Beehiiv → Grow → Subscribe Forms → create a form, copy the embed code
2. Replace the existing `<form>` block in [index.html](index.html) (the form posts to `https://formspree.io/f/mpqkabdk` — find that URL, swap the surrounding form for Beehiiv's)
3. Repeat for `story/index.html`, `privacy/index.html`, `compliance/index.html`
4. Critical: **keep the existing CSS classes** so the design doesn't break — only swap the form's `action`/`method` and submit handler
5. `vercel --prod` from the project root
6. Test: submit a real address from each page, confirm subscriber lands in Beehiiv and welcome email fires
7. After a week of clean operation, decommission the Formspree form (don't delete it — set it to inactive in case you need to roll back)

## Step 3 — Verify end-to-end

Regardless of option chosen, verify with a real (non-test) email address you can check:

- [ ] Submit at https://gethavenmobile.com — get the success state shown by the page
- [ ] Within 60 seconds, welcome email arrives in inbox (not spam, not promotions)
- [ ] Subscriber appears in Beehiiv with correct source attribution
- [ ] Reply to the welcome email lands in your real inbox
- [ ] Repeat from one of the subpages (`/story`) to confirm wiring isn't only on the homepage

## Step 4 — Once it's live

- Add a single line to [project_haven.md](../../.claude/projects/-Users-admin-Downloads-ClaudeCode---mf---GoodPhone---Haven/memory/project_haven.md) noting Beehiiv is wired and which option was chosen, so the project memory stays current
- Manually add the first 5–10 friendly subscribers (council candidates, family) so the list isn't empty when public traffic arrives
- Schedule the first fortnightly founder update for two weeks out — block the calendar slot now or it won't happen

---

## What this *doesn't* cover (deliberately)

- Custom sending domain (e.g. `news.gethavenmobile.com`) — fine to defer until ~250 subscribers; Beehiiv's default sender is reliable enough at small scale
- Double opt-in — Formspree submission is the opt-in; adding a confirmation step here would tank conversion
- Segmentation — too early; revisit when there's enough list to slice
