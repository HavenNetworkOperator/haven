# Haven — Waitlist Launch Plan

## Strategic Frame

The Smartphone Free Childhood movement has organised tens of thousands of UK parents who've delayed giving their child a phone and are now asking: *what does responsible look like when we finally do?* Haven is the answer. Every channel decision should lead with that angle.

**The goal:** 1,000 founding members. Everything below serves that number.

---

## Phase 1 — Foundation
*Complete before driving any traffic*

### Objective
Get the infrastructure right so no signups are lost and every subscriber is captured into a nurture flow from day one.

### Tasks

- [ ] **Fix the waitlist form** — sign up at formspree.io, create a form, replace `YOUR_FORM_ID` in `index.html` line 535, redeploy with `vercel --prod`, test end-to-end
- [ ] **Add founder name** — replace `[FOUNDER NAME]` on line 651 of `index.html`, redeploy
- [ ] **Update contact email** — replace `hello@haven.example` in the footer with a real address
- [ ] **Add OG image** — create a 1200×630px social preview image, host it, uncomment the `og:image` meta tag on line 13
- [ ] **Set up analytics** — add Plausible or Google Analytics snippet to `index.html` before `</head>`
- [ ] **Set up email sender** — create a Beehiiv account (free up to 2,500 subs), connect to Formspree via Zapier so every signup auto-adds to the list
- [ ] **Write and activate welcome email** — see email spec below
- [ ] **Verify full user journey** — sign up with a real email, confirm welcome email arrives, check Beehiiv subscriber count increments

### Welcome Email Spec
Send immediately on signup. Written as the founder, not "the Haven team."

> Subject: You're #[N] of 1,000 — welcome to Haven
>
> - Confirm their founding member place with a number
> - Name the 5 founding benefits concretely
> - Ask one question: *"What made you look this up today?"* — replies are copy research
> - Sign off with founder name and a one-line mission reminder

---

## Phase 2 — Owned Channel
*Ongoing from launch day*

### Objective
Turn the waitlist into an invested audience, not a cold list. By launch day, founding members should feel like they've been on a journey with you.

### Tasks

- [ ] **Set up founder update cadence** — commit to fortnightly email; block time in calendar
- [ ] **Write first founder update** — introduce yourself properly, explain why Haven exists, share where you are in the build, state the current signup count
- [ ] **Create a simple signup counter** — manually update the hero eyebrow or meta text as milestones hit (e.g. "482 of 1,000 founding places claimed")
- [ ] **Draft milestone emails** — write templates for 100, 250, 500, and 1,000 signups to send to the list as each lands

### Fortnightly Update Template
Short, no design required. Three sections:
1. What we built / decided this week
2. A child safety stat or news story (ties to the problem)
3. How many founding spots remain

---

## Phase 3 — Rented Channels (Social)
*Start this week, maintain ongoing*

### Objective
Build a visible founder presence on Twitter/X and LinkedIn. Both have the parent/tech/policy audience Haven needs. Organic authority now reduces paid spend needed at launch.

### Platforms
- **Twitter/X** — punchy, reactive, news-tied; aim for virality and conversation
- **LinkedIn** — thoughtful, founder journey, industry credibility

### Tasks

**Setup**
- [ ] Create/optimise Twitter/X profile — bio references Haven + family safety, link to waitlist
- [ ] Create/optimise LinkedIn profile/page — same treatment
- [ ] Add social links to footer of `index.html` (replace `#` placeholder on Privacy and Twitter links)

**Content — Week 1 (post in this order)**
- [ ] **Post 1: Founding story** — why you started Haven, personal, no product pitch, 3–5 sentences
- [ ] **Post 2: Problem stat** — one of the three stats from the landing page with your take on what it means
- [ ] **Post 3: Educational thread** — "Why parental control apps don't work (and what would)" — 5–7 tweets, builds authority, links to waitlist at the end
- [ ] **Post 4: Day 1 milestone** — screenshot of the live site with signup count, "Here we go."

**Ongoing content calendar**
- [ ] Set up a simple content calendar (Notion or a spreadsheet) — plan 2–3 posts per week per platform
- [ ] Bank 10 content ideas before going live so you never miss a week

**Content pillars to rotate through:**
1. Building in public (decisions made, features being designed, honest challenges)
2. Problem education (child safety stats, news stories, research)
3. Founder perspective (parenting moments, why this matters personally)
4. Product glimpses (wireframes, copy drafts, early UI)
5. Community (repost/engage with SFC movement content)

---

## Phase 4 — Borrowed Channels
*Begin outreach in week 2, ongoing*

### Objective
Tap into established audiences to shortcut the hardest part of cold growth. One mention from the right account is worth weeks of organic posting.

### 4a — Smartphone Free Childhood UK

- [ ] **Research SFC** — review @smartphonefreechildhood on Instagram, understand their messaging and community
- [ ] **Draft outreach message** — founder-to-founder DM, not a pitch; position Haven as "the responsible option for when families in your community do say yes to a phone"
- [ ] **Send DM** on Instagram
- [ ] **Follow up** if no response after 10 days

### 4b — Parent Influencers

- [ ] **Build a target list** — identify 15 UK parenting accounts (Instagram/YouTube/Substack) who post about screen time, digital safety, or SFC movement; aim for 20k–200k followers
- [ ] **Personalise outreach** — one-line reference to their specific content in each DM, not a copy-paste pitch
- [ ] **Offer** — founding member status + priority SIM access at launch, no payment
- [ ] **Send first 5 DMs** — start small, refine message based on replies before scaling
- [ ] **Send remaining 10 DMs** once message is refined

### 4c — Mumsnet

- [ ] **Create a Mumsnet account** if you don't have one
- [ ] **Spend one week reading** the Children's Technology and AIBU boards before posting — understand the community norms
- [ ] **Draft a genuine thread** — "I'm building a mobile network specifically for kids' safety, AMA" or "Would you switch your child's SIM for one with built-in AI safety?" — genuine engagement, no link in the opening post
- [ ] **Post the thread** and respond to every reply within the first 2 hours
- [ ] **Add waitlist link** in a reply only after the thread has organic momentum

### 4d — Podcasts

- [ ] **Research 10 UK parenting/education podcasts** that have covered screen time, smartphone bans, or digital safety
- [ ] **Write a 3-paragraph pitch email** — your personal story, the problem, why now (tie to SFC momentum)
- [ ] **Send to first 5 shows** — prioritise shows with 5k–50k listeners over huge shows where you'll get lost
- [ ] **Follow up** after 2 weeks if no response

### 4e — Press

- [ ] **Write a 3-paragraph press release** — lead with the problem and timing (SFC movement, Ofcom data), not the product
- [ ] **Identify 8 target journalists** — Guardian Family, Times Tech, BBC News Technology, Wired UK, plus 4 parenting/education vertical writers
- [ ] **Personalise each pitch** — reference a recent article they wrote, one sentence
- [ ] **Send press pitches** — time to a news hook if possible (new school term, Ofcom report, viral screen time story)
- [ ] **Follow up once** after 5 working days

---

## Phase 5 — Crowdfunding Launch
*Trigger at 500+ signups*

### Objective
Use the equity crowdfunding round as a marketing event, not just a fundraising mechanism. Crowdcube/Seedrs campaigns are inherently promotional — the platform promotes to their investor base and press loves the story.

### Tasks

**Preparation (start at 250 signups)**
- [ ] **Choose platform** — research Crowdcube vs Seedrs; compare fees, audience size, and campaign support
- [ ] **Prepare campaign materials** — pitch deck, financial model, company story video (2–3 min)
- [ ] **Draft "you can now own a piece of Haven" email** to waitlist — this is the announcement, frame it as something they unlocked by being early
- [ ] **Set funding target** — be realistic; an overfunded campaign at £150k is better than a stalled one at £500k

**Launch (at 500 signups)**
- [ ] **Submit campaign to chosen platform** for review (allow 4–6 weeks for approval)
- [ ] **Announce crowdfunding to waitlist** — "Waitlist members hear first"
- [ ] **Post crowdfunding launch across social** — this is a major content moment
- [ ] **Pitch press** with the crowdfunding angle — "Family MVNO opens investment to the parents it serves"

---

## Milestones & What They Unlock

| Signups | Target timing | What it unlocks |
|---|---|---|
| 100 | Week 2–3 | First press pitch; proof-of-concept for influencer outreach |
| 250 | Month 1 | Begin Mumsnet thread; scale influencer outreach; start crowdfunding prep |
| 500 | Month 2 | Crowdfunding announcement; "halfway" content moment |
| 1,000 | Month 3–4 | "Founding cohort closed" announcement; open waitlist 2; major press push |

---

## Metrics to Track Weekly

| Metric | Where to find it |
|---|---|
| Waitlist signups (total + weekly) | Formspree dashboard + Beehiiv |
| Email open rate | Beehiiv |
| Top traffic sources | Plausible / Google Analytics |
| Social follower growth | Twitter/X + LinkedIn native analytics |
| Referral sources (which posts drove clicks) | UTM parameters on shared links |

### UTM tagging
Add UTM parameters to every link you share so Analytics shows which channel drove signups:
```
https://haven-waitlist-two.vercel.app?utm_source=twitter&utm_medium=social&utm_campaign=launch
https://haven-waitlist-two.vercel.app?utm_source=mumsnet&utm_medium=forum&utm_campaign=launch
https://haven-waitlist-two.vercel.app?utm_source=podcast&utm_medium=audio&utm_campaign=[show-name]
```

---

## This Week's Priority Order

1. - [ ] Fix Formspree + add founder name → redeploy
2. - [ ] Add analytics to `index.html`
3. - [ ] Set up Beehiiv and write the welcome email
4. - [ ] Post the founding story on Twitter/X and LinkedIn
5. - [ ] DM Smartphone Free Childhood UK on Instagram
