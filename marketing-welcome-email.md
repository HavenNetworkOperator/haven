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
> Welcome to Haven, and thank you for adding your name.
>
> Quick reminder of what you've actually signed up to: **nothing financial, no commitment.** You're on the waitlist. That's it. We're using the waitlist to prove there's enough demand from parents who want this network to exist — every name helps us get to 1,000 and on to launch.
>
> If you're one of the first 1,000 to sign up, here's what you'll be **offered** at launch (your option, not a commitment):
>
> — A £25 one-time eSIM and £8 a month, **locked for life.** Not for the first year. For as long as you stay with Haven.
> — Priority access on launch day. The first 1,000 SIMs go before anyone else.
> — Tell us what you most want blocked. We build for the founding families first.
> — A direct line to me and the rest of the founding team. Reply to this email and I'll see it.
> — Founding member status on every milestone we hit — when we're on the news, on Crowdcube, when we launch, you're named.
>
> If at launch you decide it isn't for you, that's fine. There's nothing to pay until you say yes.
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
> ---
>
> **One last thing — please share this to help us build the network.**
>
> Get us to 1,000 names and Haven officially launches. If you know a parent who'd want this network to exist too, here's your link:
>
> {{share_url}}
>
> No commitment for them either — every name just helps prove the demand is real.
>
> ---
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

- No "click to confirm your spot" double opt-in friction (the signup is the opt-in)
- No social share buttons or marketing graphics — the invite link sits in body copy as a sentence, not a CTA bar. Reads like "here's the link if you want it", not "RECRUIT YOUR FRIENDS"
- No product roadmap — fortnightly updates carry that
- No discount code or upsell — they already have the best offer Haven will ever make

## When to revisit

- After the first 50 replies come in: rewrite the question prompt if it's not pulling honest answers
- At signup #500: add a P.S. about the upcoming Crowdcube round — not before
- At signup #1,000: replace this entirely with a "founding cohort closed" version for waitlist 2

---

## Beehiiv-ready HTML (paste into a Custom HTML block)

This is the styled version of the body above. Inline styles only (Beehiiv strips `<style>` blocks in some templates, and email clients don't load remote fonts). Falls back to Georgia / system serif since Fraunces won't render in Gmail / Outlook anyway.

Merge tags use the `{{first_name}}`, `{{signup_number}}`, `{{share_url}}` syntax — adjust to whatever Beehiiv exposes.

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4efe6;margin:0;padding:0;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#f4efe6;">

        <!-- ── Brand mark ── -->
        <tr>
          <td style="padding:0 0 28px 0;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:10px;vertical-align:middle;">
                  <div style="width:24px;height:24px;border-radius:50%;background:#c14a1f;"></div>
                </td>
                <td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#0f1b2d;font-weight:500;letter-spacing:-0.01em;vertical-align:middle;">
                  Haven
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Accent rule ── -->
        <tr>
          <td style="padding:0 0 24px 0;">
            <div style="width:48px;height:2px;background:#c14a1f;"></div>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#0f1b2d;">
            <p style="margin:0 0 18px 0;">Hi {{first_name|"there"}},</p>
            <p style="margin:0 0 18px 0;">Welcome to Haven, and thank you for adding your name.</p>
            <p style="margin:0 0 18px 0;">Quick reminder of what you've actually signed up to: <strong>nothing financial, no commitment.</strong> You're on the waitlist. That's it. We're using the waitlist to prove there's enough demand from parents who want this network to exist — every name helps us get to 1,000 and on to launch.</p>

            <p style="margin:0 0 12px 0;font-weight:600;">If you're one of the first 1,000 to sign up, here's what you'll be <em style="color:#c14a1f;font-style:italic;">offered</em> at launch (your option, not a commitment):</p>

            <p style="margin:0 0 10px 0;"><span style="color:#c14a1f;">—</span> A £25 one-time eSIM and £8 a month, <strong>locked for life.</strong> Not for the first year. For as long as you stay with Haven.</p>
            <p style="margin:0 0 10px 0;"><span style="color:#c14a1f;">—</span> Priority access on launch day. The first 1,000 SIMs go before anyone else.</p>
            <p style="margin:0 0 10px 0;"><span style="color:#c14a1f;">—</span> Tell us what you most want blocked. We build for the founding families first.</p>
            <p style="margin:0 0 10px 0;"><span style="color:#c14a1f;">—</span> A direct line to me and the rest of the founding team. Reply to this email and I'll see it.</p>
            <p style="margin:0 0 18px 0;"><span style="color:#c14a1f;">—</span> Founding member status on every milestone — when we're on the news, on Crowdcube, when we launch, you're named.</p>
            <p style="margin:0 0 24px 0;color:#2a3a52;font-size:15px;">If at launch you decide it isn't for you, that's fine. There's nothing to pay until you say yes.</p>

            <!-- ── Divider ── -->
            <p style="margin:24px 0;border-top:1px solid #d8cfbc;font-size:0;line-height:0;">&nbsp;</p>

            <p style="margin:0 0 18px 0;font-weight:600;">One favour, while we're at the start.</p>
            <p style="margin:0 0 18px 0;">What made you look this up today? Was it something you read, something your child said, a moment that made you think <em>we need to do this differently?</em></p>
            <p style="margin:0 0 24px 0;">Hit reply and tell me. Even one line helps. The more honest you are, the better I can build this for the families who actually need it.</p>

            <p style="margin:24px 0;border-top:1px solid #d8cfbc;font-size:0;line-height:0;">&nbsp;</p>

            <p style="margin:0 0 18px 0;">A quick word on what's next.</p>
            <p style="margin:0 0 18px 0;">I'll write to you every other Friday with one short update — what we built or decided that fortnight, one child-safety story worth knowing about, and how many founding places remain. No marketing fluff. If a fortnight goes by where there's nothing real to say, I won't send a thing.</p>
            <p style="margin:0 0 24px 0;">Targeted launch is <strong>September 2026.</strong> I'll tell you first if anything changes — with the reason and the revised plan, not spin.</p>

            <p style="margin:24px 0;border-top:1px solid #d8cfbc;font-size:0;line-height:0;">&nbsp;</p>

            <p style="margin:0 0 18px 0;font-weight:600;">One last thing — please share this to help us build the network.</p>
            <p style="margin:0 0 18px 0;">Get us to 1,000 names and Haven officially launches. If you know a parent who'd want this network to exist too, here's your link:</p>
            <p style="margin:0 0 18px 0;font-family:'Courier New',monospace;font-size:14px;background:#ebe4d4;padding:12px 16px;border-left:3px solid #c14a1f;color:#0f1b2d;word-break:break-all;">{{share_url}}</p>
            <p style="margin:0 0 24px 0;color:#2a3a52;font-size:15px;">No commitment for them either — every name just helps prove the demand is real.</p>

            <p style="margin:24px 0;border-top:1px solid #d8cfbc;font-size:0;line-height:0;">&nbsp;</p>

            <p style="margin:0 0 18px 0;">Thank you for backing this before it exists. That's the part that matters.</p>

            <p style="margin:0 0 4px 0;font-weight:600;">Rich</p>
            <p style="margin:0 0 4px 0;color:#2a3a52;font-style:italic;font-size:15px;">Founder, Haven</p>
            <p style="margin:0 0 0 0;color:#2a3a52;font-style:italic;font-size:14px;">Britain's first mobile network designed around families — safety at the SIM, not an app they can delete.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
```

**Beehiiv build steps:**
1. New automation → trigger: subscriber added (signup webhook).
2. First action: send email → editor → Custom HTML block → paste the above.
3. Subject: pick option **A** (`You're #{{signup_number}} of 1,000 — welcome to Haven`) if Beehiiv supports merge in subject; otherwise **B** (`Welcome to Haven — you're a founding member`).
4. Preheader: `The founding members shape the network. Here's what that means and what happens next.`
5. Custom merge field: ensure `share_url` is being set to `https://gethavenmobile.com/waitlist?ref={{ref_code}}` in the signup payload sent to Beehiiv.
6. Send a test to your own inbox before turning the automation on. Open in Gmail, Outlook web, and on iOS Mail — the editorial-letter feel should hold across all three.
