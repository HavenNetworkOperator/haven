# Haven — 100 Sales Per Day Plan

The Ryan Daniel Moran "100 Sales Per Day" playbook, ported to a UK family MVNO.

The playbook was written for physical e-commerce (Amazon-led). Haven is a recurring service. Most principles port cleanly; a few don't. This doc is the translation, the math, and the actions.

---

## The playbook in one paragraph

A million-dollar business is just **100 sales per day** at $30 each. You don't need one product doing 100 — you need **4 products doing 25 each**. The reliable way there is to **sell to a person who is new at something** (yoga, parenting, podcasting, vegan…) because they buy multiple products from the same brand. Build the list first, launch into demand, get 100 reviews, hit 25/day, build 100 ambassadors, launch the next three products, and you're at 100/day in ~12 months. Then you have an asset you can sell.

---

## How it ports to Haven

| Playbook | E-com original | Haven version |
|---|---|---|
| The customer | "Person new at something" | **Parent giving their child their first phone** — the most-defining "new at something" moment in modern parenting |
| The "store" | Amazon (310M cards on file) | **Smartphone Free Childhood + Mumsnet + parent influencers + Crowdcube** — the audience is already organised |
| The unit | Physical product at $30 | **A SIM activation** — but recurring (£15–25 ARPU, 36+ month tenure, ~£540+ LTV) |
| 4 products at 25/day | 4 SKUs | **4 lines per family**: Kid SIM, Parent SIM, Family Bundle, Add-on (refurb phone, screen-time coach, location SIM) |
| 100 reviews | Amazon reviews | **Trustpilot + Mumsnet thread + Google reviews + founder-curated parent testimonials** |
| Build demand first | Email list / Facebook group | **The waitlist** (live; target 1,000 founding members) |
| Free traffic source | Amazon's algorithm | **SFC movement, parent press, Crowdcube's investor list, podcast guesting** |
| The exit | Sell the brand on Quiet Light / Empire Flippers | **Strategic acquisition by a Tier-1 telco / family-tech roll-up, or stay private and ride the recurring revenue** |

### The math, Haven version

- 100 SIMs/day × £15 ARPU = **£1,500/day = £45k MRR ≈ £540k ARR**
- That's the *first month*. Recurring stacks. Year 2 ARR is closer to **~£3M** if churn stays under 5%/month.
- LTV: £15 × 36 months = ~£540/SIM. 100 SIMs/day × 365 = 36,500 SIMs/yr × £540 = **£19.7M cumulative LTV** generated in year one alone.
- This is why MVNO is *better* than physical e-com once you cross 25/day — you're stacking annuities, not selling one-off units.

---

## The 4 "products" (Haven's shelf)

Each needs to clear **25 activations/day** to total 100/day. Each is sold to the same family — "people buy multiple products" maps to "families have multiple lines."

1. **Kid SIM** — the wedge. Network-level safety, AI grooming/abuse detection, no app to bypass. £8–15/mo founding price. *This is the lead product.*
2. **Parent SIM** — the same network, for the parent. Bundles a discount when added to a Kid SIM. Gives Haven the dashboard relationship with the bill-payer. £15–25/mo.
3. **Family Bundle (2–5 lines)** — flat-rate plan for whole household. The "Mary Ruth's wellness bundle" equivalent — once a family commits, every line goes Haven. £35–60/mo flat.
4. **Add-on / second-buy** — refurbished kid-friendly handset, "First Phone" starter kit (SIM + case + filter + parent guidebook), screen-time coaching subscription, smartwatch SIM for younger kids.

> **Mary Ruth's parallel:** she sold multivitamins to mums starting a wellness journey, then sold them kid vitamins, then a whole shelf. Haven sells the Kid SIM to a parent at the smartphone moment, then the Parent SIM, then the rest of the household.

---

## The 8-step process — Haven mapping

### Step 1 — Choose your customer ✅ done
**Customer:** UK parent of a 9–13-year-old who delayed the smartphone (often via SFC), now reaching the moment they have to say yes.
This is locked in (`context.md`, `launch-plan.md`). It's the *ideal* "new at something" customer because they're starting a multi-year journey (first phone → upgrade → second child → smartwatch → etc.) and they're highly active in an organised, opinion-led community (SFC).

### Step 2 — Build a 100-person list 🟡 in progress
**Status:** waitlist live at `haven-waitlist-two.vercel.app`, infrastructure half-wired (Formspree placeholder, no analytics, no Beehiiv).
**Playbook target:** 100–250 engaged people before launch. Haven's target is 1,000 founding members because the price point is recurring and the audience is concentrated.
**Gate:** finish Phase 1 of `launch-plan.md` (Formspree, analytics, Beehiiv, welcome email) — this is the unblocker for everything downstream.

### Step 3 — Launch ⏳ pending
**Playbook version:** ship a single product to your list, take the first 10–25 sales.
**Haven version:** the **Kickstarter / Crowdcube founding-member moment** is the launch. Per `kickstarter-campaign.md` and `kickstarter-rewards.md`, this already exists as a plan. The crowdfunding campaign is *both* the launch event and the funding mechanism — Miguel did $100k pre-orders before his product was ready (page 12 of the playbook); Haven does the same with founding member pledges (£25 reserve, £8/mo when live).
**The first sale = the first £25 founding pledge.** Not the first SIM activated.

### Step 4 — Get 100 reviews ⏳ pending
**Playbook:** Amazon reviews. Haven equivalents:
- **Trustpilot** — ask every founding member for a review at activation
- **Mumsnet** — seed an organic AMA thread; let the community generate it
- **Google reviews** for "Haven mobile network UK"
- **Founder-curated quotes** — parent testimonials in the Beehiiv founder updates and on the homepage
- **Press** — every time a journalist quotes a parent in a Haven piece, that's a review at scale

Target: 100 reviews across all channels before Step 5 begins. Many of these flow naturally if Step 6 (ambassadors) is doing its job.

### Step 5 — Achieve 25 sales/day ⏳ pending
**Definition for Haven:** 25 *new SIM activations* per day, sustained for 30 days. ~750/month. ~£11k MRR added per month at this run rate.
**This is the make-or-break milestone.** It's the proof point that the wedge product works *without* the founding-member halo effect.
**Levers:** Mumsnet evergreen thread, SFC affiliate-style partnership, parent-influencer codes, Trustpilot-fed Google ads, podcast guesting.

### Step 6 — Build 100 ambassadors ⏳ pending
**Playbook:** ambassadors send free traffic forever.
**Haven equivalents — three tiers:**
1. **Founding Council** (~25 people): already drafted in `founding-council-invitation.md`. SFC chapter leaders, parent-author voices, school heads, paediatricians. They get equity (per `business-model-options.md` — small founding allocation) and visible credit.
2. **School/PTA captains** (~25): one parent at a school evangelises Haven inside their PTA WhatsApp group. £25 referral credit per activation (legal in UK; check Ofcom marketing rules).
3. **Parent influencers** (~50): paid + free SIM for content. £100/post or affiliate code.

100 ambassadors × ~3 referrals/month = 300 free activations/month = ~10/day baseline. Combine with paid + organic and the 25/day target becomes mathematically reachable.

### Step 7 — Launch more products ⏳ pending
Roll out in this sequence. Each product = 25/day milestone before the next.
- **Q3 2026** — Kid SIM at 25/day (the wedge)
- **Q4 2026** — Parent SIM (offered to every Kid SIM bill-payer at activation)
- **Q1 2027** — Family Bundle (consolidate the whole household)
- **Q2 2027** — Add-on shelf (refurb phone, screen-time coach, smartwatch SIM)

### Step 8 — 100 sales/day ⏳ pending
**Target:** 100 SIM activations/day = ~3,000/month = £540k ARR run rate at month 12.
**Real value:** at this point the business is *acquirable* at a multiple a physical-products brand never sees. Recurring telco revenue at ~80% gross margin trades at 4–8× ARR. £540k ARR → **£2–4M valuation at the floor; substantially more if growth/retention are good.**
This is the "Step 8 unlocks the exit" moment from the playbook — but Haven also has the option to keep compounding because the LTV economics are so much better than the unit economics of an Amazon brand.

---

## Where the playbook *doesn't* port cleanly (and what we do instead)

1. **No Amazon equivalent for SIMs.** The "Amazon ranks you up if you send traffic" loop doesn't exist. Substitutes:
   - **uSwitch / MoneySavingExpert / Compare the Market** — once approved as a listed MVNO, these *are* the Amazon shelf. Big lift to get on but compounding once there.
   - **Crowdcube** — investor list of ~1M people who actively want to back UK challenger brands. The platform promotes its own campaigns. This is Haven's "free traffic from a platform with millions of users."
   - **Mumsnet** — small Amazon. Threads rank in Google and stay live for years.
2. **MVNO regulatory load.** Ofcom registration, MNO wholesale agreement, mobile-number-portability, GDPR-grade data handling. None of this exists for Amazon sellers. *None of this kills the playbook* — it just means Step 3's "launch" is gated by the wholesale deal closing.
3. **Service obligations.** Lost SIMs, broken phones, billing disputes. Not optional. Build the support function in parallel with Step 5, not after.
4. **Cash collection.** Stripe + Direct Debit + GoCardless, not Amazon Payments. Already on the roadmap — confirm it's being scoped alongside the wholesale deal.

---

## Current state vs the 8 steps (audit)

| Step | Status | What's blocking |
|---|---|---|
| 1. Choose customer | ✅ done | — |
| 2. Build 100-person list | 🟡 in progress | Formspree, analytics, Beehiiv, welcome email — Phase 1 of `launch-plan.md` |
| 3. Launch | ⏳ pending | Kickstarter/Crowdcube live; wholesale MNO deal signed |
| 4. Get 100 reviews | ⏳ pending | Trustpilot account + post-activation review request flow |
| 5. 25 SIMs/day | ⏳ pending | Step 3 done + paid acquisition channels open |
| 6. 100 ambassadors | 🟡 partially scoped | `founding-council-invitation.md` drafted; PTA + influencer tiers not yet scoped |
| 7. Launch more products | ⏳ pending | Step 5 done first |
| 8. 100/day | ⏳ pending | All of above |

---

## This week — the only 5 actions that matter

These compress every "Phase 1" item across the existing docs into the unblock-everything-else list.

1. **Wire Formspree** (`index.html:535`) — every signup is currently dropped. Single biggest leak.
2. **Add analytics** (Plausible recommended; one snippet before `</head>`).
3. **Connect Beehiiv** + ship the welcome email from `marketing-welcome-email.md`. New signups need to land in a nurture flow within 60 seconds.
4. **Replace `[FOUNDER NAME]`** on `index.html:651` and the placeholder contact email in the footer.
5. **Post the founding story** on Twitter/X and LinkedIn (`marketing-twitter-launch-thread.md`, `marketing-linkedin-launch-post.md`) and DM Smartphone Free Childhood UK.

Everything else in `launch-plan.md` is real and good — but it doesn't matter until these five are done. Then Phase 2–5 of `launch-plan.md` becomes the engine for Steps 4–8 of this plan.

---

## The 12-month picture

| Month | Playbook step | Haven milestone |
|---|---|---|
| Apr–Jun 2026 | Steps 1–2 | List → 1,000 founding members; founding council seated |
| Jul–Sep 2026 | Step 3 | Crowdcube live; Kid SIM wholesale deal signed; first activations |
| Oct–Dec 2026 | Steps 4–5 | 100 reviews; Kid SIM at 25 SIMs/day |
| Jan–Mar 2027 | Step 6 | 100 ambassadors active; PTA/influencer machine humming |
| Apr 2027 | Step 7 | Parent SIM + Family Bundle launched; tracking to 100/day |
| Q3 2027 | Step 8 | 100 SIMs/day → ~£550k ARR run rate → strategic optionality |

---

## What Ryan Moran would say if he read this

> "100 sales/day is enough. Stop trying to build a unicorn. Get one product to 25/day, repeat the process, and you'll be a millionaire in 12 months. Most people won't do it. The 1% who do — and Haven has all the ingredients to be in that 1% — get the multi-million-dollar exit *or* the financial freedom of running a real cash-flowing business. Pick one."

For Haven, the cash-flowing business *is* the exit, because telco revenue compounds. That's the upgrade.
