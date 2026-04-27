# Welcome Email — Founding Member

**Trigger:** Sent immediately on Formspree submission (via Beehiiv automation).
**From:** Rich Bowdler `<rich@gethavenmobile.com>` (or whichever sending address is set up)
**Reply-to:** Same — replies should land in a real inbox; they're free copy research.

---

## Subject line options

Pick one (A is the recommendation — concrete, specific, signals the scarcity without trying):

- **A.** You're #{{signup_number}} of 1,000 — welcome to Haven
- **B.** Welcome to Haven — you're a founding member
- **C.** You just claimed a founding place at Haven

> If Beehiiv can't merge a live signup number, fall back to **B**. Don't fake a number.

---

## Preheader (preview text)

> The founding members shape the network. Here's what that means and what happens next.

---

## Body

> Hi {{first_name|"there"}},
>
> Welcome to Haven.
>
> You're one of the first 1,000 parents who've put their name down — which makes you a founding member of Britain's first mobile network designed around families.
>
> I want to be straight with you about what that actually means, because "founding member" gets thrown around a lot and usually means very little.
>
> **As a founding member you get:**
>
> — A £25 one-time eSIM and £8 a month, **locked for life.** Not for the first year. For as long as you stay with Haven.
> — Priority access on launch day. The first 1,000 SIMs go to founding members before anyone else.
> — A vote on the first three AI safety features we ship. We're building the network, but you're shaping what it does first.
> — A direct line to me and the rest of the founding team. Reply to this email and I'll see it.
> — Founding member status on every milestone we hit — when we're on the news, on Kickstarter, on Crowdcube, you're named.
>
> ---
>
> **One favour, while we're at the start.**
>
> What made you look this up today? Was it something you read, something your child said, a moment that made you think *we need to do this differently?*
>
> Hit reply and tell me. Even one line helps. The more honest you are, the better I can build this for the families who actually need it.
>
> ---
>
> A quick word on what's next.
>
> I'll write to you every other Friday with one short update — what we built or decided that fortnight, one child-safety story worth knowing about, and how many founding places remain. No marketing fluff. If a fortnight goes by where there's nothing real to say, I won't send a thing.
>
> Targeted launch is **September 2026.** I'll tell you first if anything changes — with the reason and the revised plan, not spin.
>
> Thank you for backing this before it exists. That's the part that matters.
>
> **Rich**
> Founder, Haven
> *Britain's first mobile network designed around families — safety at the SIM, not an app they can delete.*

---

## Design notes for Beehiiv build

Goal: feel like a letter, not a marketing email. Editorial restraint, plenty of whitespace.

| Element | Spec |
|---|---|
| Container width | 560–600px max |
| Background | `#f4efe6` (Paper) — match the site |
| Body text | Inter Tight 16/24, `#0f1b2d` (Ink) |
| Headings (none in this email) | Reserved for future updates |
| Bold callouts | `#0f1b2d`, weight 600 |
| Em-dashes | Use real `—` (not `--`) |
| Bullet character | `—` (em-dash) used as the bullet for the founding-member list — matches the editorial voice |
| Sign-off block | Founder name in bold, role + tagline italic and one shade muted (`#2a3a52`) |
| Footer | Beehiiv-mandatory unsubscribe + Haven address. No social icons (founder-letter feel). |
| Images | None in v1. The whole point is that this reads as a personal note. |
| Links | None in body except Beehiiv's compulsory footer. The CTA is the reply. |

## What this email is *deliberately* not doing

- No "click to confirm your spot" double opt-in friction (the Formspree submission is the opt-in)
- No social share buttons — this is the welcome moment, not a recruit-your-friends moment (that comes at signup #500)
- No product roadmap — fortnightly updates carry that
- No discount code or upsell — they already have the best offer Haven will ever make

## When to revisit

- After the first 50 replies come in: rewrite the question prompt if it's not pulling honest answers
- At signup #500: add a P.S. about the upcoming Crowdcube round — not before
- At signup #1,000: replace this entirely with a "founding cohort closed" version for waitlist 2
