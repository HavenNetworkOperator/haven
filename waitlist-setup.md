# Viral Waitlist — Setup & Deploy Guide

The `/waitlist` page is live in code. This document covers what you need to do **once** in the Vercel dashboard before deploying so the API endpoints work.

## What was built

| File | Purpose |
|---|---|
| [waitlist/index.html](waitlist/index.html) | The `/waitlist` page — signup state + post-signup status state in one URL |
| [api/signup.js](api/signup.js) | `POST /api/signup` — creates a signup, assigns ref code, recomputes positions, fans out to Formspree + Beehiiv + Resend |
| [api/status.js](api/status.js) | `GET /api/status?ref=CODE` — returns current position, total signups, referral count |
| [api/_lib.js](api/_lib.js) | Shared helpers (Postgres queries, ref-code generator, position recompute, Formspree + Beehiiv fan-outs) |
| [api/_emails.js](api/_emails.js) | Transactional email templates + Resend senders (welcome + referrer notification) |
| [db/schema.sql](db/schema.sql) | One-time Postgres table creation (idempotent — safe to re-run) |
| [package.json](package.json) | `@vercel/postgres`, `nanoid`, `resend` |

The homepage form on `/` is **untouched** — it still posts to Formspree exactly as before. Only `/waitlist` uses the new viral mechanic.

## What happens on every signup

1. Validate email + optional referrer code
2. Insert row into Postgres (idempotent on email — re-submitting returns the existing standing)
3. **Recompute position for every row** — single `UPDATE` ranking by `(referrals_count DESC, signed_up_at ASC)`. The `position` column is materialised and indexed so reads are O(1).
4. Fan out in parallel (failures logged but never block the signup):
   - **Formspree** — POST to form `mpqkabdk` with `source: waitlist-page` and the signup's position/ref-code, so waitlist signups appear in the same inbox as homepage signups
   - **Beehiiv** — subscribe to the publication (skipped if env vars missing; configurable via `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID`)
   - **Welcome email via Resend** — full founding-member welcome with their position number and invite link
   - **Referrer notification via Resend** — only when this signup was referred — tells the referrer their new position and how many places they jumped

---

## How the mechanic works

1. New visitor lands at `/waitlist` — they see a clean signup form.
2. Visitor arriving via someone's referral link (`/waitlist?ref=ABC123XY`) sees a small banner: *"A Haven founding member sent you here."* The referrer code is captured.
3. On submit, `/api/signup` writes them to Postgres, generates a unique 8-character ref code, attaches their referrer (if any), and (optionally) subscribes them to Beehiiv.
4. The page switches to the **status state** showing their position number, total signups so far, friends invited, their unique invite link, and one-tap WhatsApp / X / Email share buttons.
5. Their position is stored in `localStorage`, so when they revisit `/waitlist` they go straight back to status (no need to remember a code).
6. **Position formula:** ranked by `(referrals_count DESC, signed_up_at ASC)`. Refer one person, jump above everyone with zero referrals who signed up after you. Refer five, jump above everyone with four or fewer. Pure Monzo mechanic.

---

## One-time setup steps

### 1. Provision Postgres on Vercel

1. Open the project in Vercel: https://vercel.com/rich-bowdlers-projects/haven-waitlist
2. Go to **Storage → Create Database → Postgres**
3. Pick a region (London / `lhr1` is closest to your audience)
4. Name it `haven-waitlist-db` and create
5. Vercel auto-injects the connection env vars (`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.) into the project — **no manual env config needed**

> The free tier covers 60 hours of compute and 256 MB storage per month. A 1,000-row waitlist with light traffic will use a tiny fraction of that.

### 2. Run the schema migration

Easiest way: from the Vercel Postgres dashboard, open the **Query** tab and paste the contents of [db/schema.sql](db/schema.sql), then run.

Alternative (CLI):
```bash
# pull env vars locally
vercel env pull .env.development.local

# run schema
psql "$POSTGRES_URL" -f db/schema.sql
```

The schema is idempotent — safe to run again if you ever need to.

### 3. Set up Resend (for transactional emails)

This is what sends the welcome email to new signups and the "you've moved up" notification to referrers. Without these env vars, signups still work but no emails go out.

1. Sign up at https://resend.com (free tier: 3,000 emails/mo, 100/day — covers waitlist scale ~30×)
2. **Add domain** → `gethavenmobile.com` → Resend shows the DNS records to add
3. Add the records in your domain registrar (or wherever DNS is managed). Three records:
   - One `TXT` for SPF (or update your existing SPF record)
   - One `TXT` for DKIM
   - One `MX` for return-path tracking (optional but recommended)
4. Wait for verification — usually under 5 minutes
5. **API Keys** → Create new key, scoped to *Sending access only* on `gethavenmobile.com`
6. In Vercel → **Settings → Environment Variables** (apply to **Production**):
   - `RESEND_API_KEY` = the key from step 5
   - `RESEND_FROM` = e.g. `Rich at Haven <rich@gethavenmobile.com>` (the angle-bracket form lets you set a friendly display name)
   - `RESEND_REPLY_TO` *(optional)* = where replies should land if different from the FROM address
7. Redeploy: `vercel --prod`

> **Why Resend** over Beehiiv's transactional API: Resend is purpose-built for this (referral notifications need to fire instantly when a row is inserted, not on a marketing automation schedule). Beehiiv handles the broader email list — Resend handles the per-event sends. Both can run side-by-side: the signup endpoint subscribes the user to Beehiiv (for fortnightly updates) and sends the welcome via Resend (for immediate confirmation with their dynamic position).

### 4. (Optional) Wire Beehiiv directly

If you want each `/waitlist` signup to also be added to your Beehiiv list and get the welcome email automatically (no Zapier needed for this path):

1. Beehiiv dashboard → **Settings → Integrations → API**
2. Create a new API key, copy it
3. Get your publication ID from the URL bar (looks like `pub_xxxxxxxx-xxxx-...`)
4. In Vercel → **Settings → Environment Variables**, add:
   - `BEEHIIV_API_KEY` = your key
   - `BEEHIIV_PUBLICATION_ID` = your pub ID
5. Redeploy

If these env vars are missing, the signup endpoint silently skips the Beehiiv call — Postgres is still the source of truth.

Beehiiv subscribes are now created with `send_welcome_email: false` because Resend handles the immediate welcome (with the dynamic position number). Beehiiv still owns the ongoing newsletter sends.

> **Note on Formspree:** The homepage form continues to use Formspree independently. The waitlist API now also fans out to the same Formspree form (`mpqkabdk`), so all signups appear in one inbox tagged `source: waitlist-page` vs `source: homepage`. If you want a separate inbox, set `FORMSPREE_FORM_ID` to a different form ID.

### 5. Deploy

```bash
cd "/Users/admin/Downloads/ClaudeCode - mf - GoodPhone - Haven"
vercel --prod
```

Vercel auto-detects:
- Static files at root → served as-is
- `/api/*.js` → Vercel Functions (Node 20)
- `/waitlist/index.html` → served at `/waitlist` (clean URLs already on)

---

## End-to-end test plan

After deploy, do this from a real browser (not curl) so you exercise the page logic:

1. **Cold signup**
   - Open https://gethavenmobile.com/waitlist in an Incognito window
   - Sign up with a real email (e.g. `rich+test1@gethavenmobile.com`)
   - Confirm the page flips to the status state showing position #1 (or whatever it is), referral count 0, and a copyable invite link
   - Confirm the link looks like `https://gethavenmobile.com/waitlist?ref=XXXXXXXX`

2. **Referred signup**
   - Copy the invite link from step 1
   - Open it in a fresh Incognito window
   - Confirm the orange "A Haven founding member sent you here" banner shows
   - Sign up with a different email (`rich+test2@…`)
   - Confirm the page flips to the new user's status state with position N+1

3. **Position update for referrer**
   - Go back to the first window
   - Click "Refresh"
   - Confirm referral count is now 1 and position has moved up

4. **Returning visitor**
   - Close and reopen the first window (same browser, not Incognito)
   - Visit `/waitlist` directly with no `?ref=`
   - Confirm it skips the form and shows the user's status state (driven by `localStorage`)

5. **Beehiiv (if configured)**
   - Confirm both test emails appear in the Beehiiv subscriber list
   - Confirm welcome email arrived for at least one of them

6. **Cleanup test rows**
   ```sql
   DELETE FROM waitlist WHERE email LIKE 'rich+test%';
   ```

---

## Where to look when something breaks

| Symptom | Where to look |
|---|---|
| Page loads but signup spins forever | Vercel → project → **Logs** → look for `/api/signup` errors |
| "Something went wrong" on submit | Same place — most likely Postgres connection or schema not migrated |
| Position shows `—` after signup | The signup succeeded but `getStanding` returned null — check that `db/schema.sql` ran |
| Referrer banner never shows | Check that the `?ref=CODE` URL has 8 chars from `[2-9A-HJ-NP-Z]` |
| Beehiiv subscribers not appearing | Check Vercel logs for `Beehiiv subscribe failed`; verify env vars set on **Production** environment, not just Preview |

## What's intentionally not in v1

- **No CAPTCHA / rate limiting** — Vercel's edge protection plus the unique-email constraint is enough at this scale; revisit if abuse becomes a real signal in logs
- **No email-confirmation step** — single opt-in to maximise conversion; Beehiiv welcome email is the receipt
- **No leaderboard** — the share-and-watch-your-number-tick-down mechanic is the whole game; a public leaderboard adds complexity without real lift
- **No personalised OG share image** — same OG card as the rest of the site (which still needs an image — that's [marketing-beehiiv-wiring.md](marketing-beehiiv-wiring.md)'s deferred Track A item)

## When to revisit

- **At 100 signups:** check the position formula feels right — if early signups feel demotivated when overtaken, consider a "you can't drop below your initial position" rule
- **At 250 signups:** add an OG image generator that renders a personalised "I'm #847" card per ref code (Vercel OG library does this in 30 lines)
- **At 500 signups:** announce to the list that the queue is deciding launch-day order; this is the second viral push moment
