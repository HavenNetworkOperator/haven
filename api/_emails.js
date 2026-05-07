// Transactional email templates and senders.
// All sends are no-ops if RESEND_API_KEY / RESEND_FROM env vars are missing,
// so the signup flow continues to work in environments without email configured.

import { Resend } from 'resend';

let _resend = null;
function client() {
  if (_resend) return _resend;
  if (!process.env.RESEND_API_KEY) return null;
  _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const SITE = 'https://gethavenmobile.com';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const STYLE = {
  body:    'margin:0;padding:0;background:#F2EDE5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:#0f1b2d;-webkit-font-smoothing:antialiased;',
  wrap:    'max-width:560px;margin:0 auto;padding:48px 32px;',
  h1:      'font-family:Georgia,"Times New Roman",serif;font-size:28px;font-weight:400;line-height:1.2;letter-spacing:-0.02em;color:#0f1b2d;margin:0 0 24px 0;',
  p:       'font-size:16px;line-height:1.55;color:#0f1b2d;margin:0 0 18px 0;',
  pSoft:   'font-size:16px;line-height:1.55;color:#2a3a52;margin:0 0 18px 0;',
  hr:      'border:0;border-top:1px solid #d8cfbc;margin:32px 0;',
  position:'font-family:Georgia,"Times New Roman",serif;font-size:64px;font-weight:400;line-height:1;letter-spacing:-0.03em;color:#0f1b2d;margin:0 0 8px 0;',
  positionEm: 'font-style:italic;color:#c14a1f;font-weight:300;',
  positionMeta: 'font-size:14px;color:#6a6253;letter-spacing:0.02em;margin:0 0 32px 0;',
  signoff: 'font-size:16px;line-height:1.55;color:#0f1b2d;margin:24px 0 4px 0;',
  signoffMeta: 'font-size:14px;font-style:italic;color:#2a3a52;line-height:1.55;margin:0;',
  cta:     'display:inline-block;background:#0f1b2d;color:#F2EDE5;text-decoration:none;padding:14px 26px;border-radius:100px;font-size:14px;font-weight:500;letter-spacing:0.02em;',
  link:    'color:#c14a1f;text-decoration:underline;',
  inviteBox: 'background:#ebe4d4;border:1px solid #d8cfbc;border-radius:12px;padding:18px 20px;margin:24px 0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;color:#0f1b2d;word-break:break-all;',
  footer:  'font-size:12px;color:#6a6253;line-height:1.55;margin:48px 0 0 0;border-top:1px solid #d8cfbc;padding-top:24px;',
};

// ───────────────────────────────────────────────────────────
// 1. Welcome / confirmation email — sent to every new signup
// ───────────────────────────────────────────────────────────

function welcomeEmailHtml({ email, position, total, shareUrl, personalUrl }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Welcome to Haven</title></head>
<body style="${STYLE.body}">
  <div style="${STYLE.wrap}">
    <p style="${STYLE.pSoft}">Hi there,</p>
    <h1 style="${STYLE.h1}">Welcome to Haven.</h1>
    <p style="${STYLE.p}">You're one of the first 1,000 parents who've put their name down — which makes you a founding member of Britain's first mobile network designed around families.</p>

    <div style="${STYLE.position}">#<span style="${STYLE.positionEm}">${position}</span></div>
    <p style="${STYLE.positionMeta}">YOUR PLACE IN THE FOUNDING QUEUE · ${total} signed up so far</p>

    <p style="${STYLE.p}">I want to be straight with you about what founding membership actually means, because the phrase gets thrown around a lot and usually means very little.</p>

    <p style="${STYLE.p}"><strong>As a founding member you get:</strong></p>
    <p style="${STYLE.pSoft}">— A £25 one-time eSIM and £8 a month, <strong>locked for life.</strong> Not for the first year. For as long as you stay with Haven.<br>
    — Priority access on launch day. The first 1,000 SIMs go to founding members in queue order.<br>
    — A vote on the first three AI safety features we ship. We're building the network, but you're shaping what it does first.<br>
    — A direct line to me and the rest of the founding team. Reply to this email and I'll see it.<br>
    — Founding member status on every milestone we hit.</p>

    <hr style="${STYLE.hr}">

    <p style="${STYLE.p}"><strong>Want to move up the queue?</strong></p>
    <p style="${STYLE.pSoft}">Every parent who joins via your link bumps you up. Position #1 gets their SIM first on launch day. This is your invite link to share:</p>

    <div style="${STYLE.inviteBox}">${escapeHtml(shareUrl)}</div>

    <p style="${STYLE.p}"><a href="${escapeHtml(personalUrl)}" style="${STYLE.cta}">Open your invite page →</a></p>

    <hr style="${STYLE.hr}">

    <p style="${STYLE.p}"><strong>One favour, while we're at the start.</strong></p>
    <p style="${STYLE.pSoft}">What made you look this up today? Was it something you read, something your child said, a moment that made you think <em>we need to do this differently?</em></p>
    <p style="${STYLE.pSoft}">Hit reply and tell me. Even one line helps. The more honest you are, the better I can build this for the families who actually need it.</p>

    <hr style="${STYLE.hr}">

    <p style="${STYLE.pSoft}">A quick word on what's next. I'll write to you every other Friday with one short update — what we built or decided that fortnight, one child-safety story worth knowing about, and how many founding places remain. No marketing fluff. If a fortnight goes by where there's nothing real to say, I won't send a thing.</p>
    <p style="${STYLE.pSoft}">Targeted launch is <strong>September 2026.</strong> I'll tell you first if anything changes — with the reason and the revised plan, not spin.</p>
    <p style="${STYLE.pSoft}">Thank you for backing this before it exists. That's the part that matters.</p>

    <p style="${STYLE.signoff}"><strong>Rich</strong></p>
    <p style="${STYLE.signoffMeta}">Founder, Haven<br>
    Britain's first mobile network designed around families — safety at the SIM, not an app they can delete.</p>

    <p style="${STYLE.footer}">You received this email because you joined the Haven waitlist at gethavenmobile.com. Reply to unsubscribe and we'll remove you from the list.</p>
  </div>
</body></html>`;
}

function welcomeEmailText({ position, total, shareUrl, personalUrl }) {
  return `Hi there,

Welcome to Haven.

You're one of the first 1,000 parents who've put their name down — which makes you a founding member of Britain's first mobile network designed around families.

YOUR PLACE IN THE FOUNDING QUEUE: #${position}
(${total} signed up so far.)

I want to be straight with you about what founding membership actually means, because the phrase gets thrown around a lot and usually means very little.

As a founding member you get:

— A £25 one-time eSIM and £8 a month, locked for life. Not for the first year. For as long as you stay with Haven.
— Priority access on launch day. The first 1,000 SIMs go to founding members in queue order.
— A vote on the first three AI safety features we ship. We're building the network, but you're shaping what it does first.
— A direct line to me and the rest of the founding team. Reply to this email and I'll see it.
— Founding member status on every milestone we hit.

---

Want to move up the queue?

Every parent who joins via your link bumps you up. Position #1 gets their SIM first on launch day.

Your invite link to share:
${shareUrl}

To open your invite page:
${personalUrl}

---

One favour, while we're at the start.

What made you look this up today? Was it something you read, something your child said, a moment that made you think we need to do this differently?

Hit reply and tell me. Even one line helps.

---

A quick word on what's next. I'll write to you every other Friday with one short update — what we built or decided that fortnight, one child-safety story worth knowing about, and how many founding places remain. No marketing fluff.

Targeted launch is September 2026. I'll tell you first if anything changes — with the reason and the revised plan, not spin.

Thank you for backing this before it exists. That's the part that matters.

Rich
Founder, Haven
Britain's first mobile network designed around families — safety at the SIM, not an app they can delete.

You received this email because you joined the Haven waitlist at gethavenmobile.com. Reply to unsubscribe and we'll remove you from the list.`;
}

export async function sendWelcomeEmail({ email, position, total, refCode }) {
  const c = client();
  if (!c || !process.env.RESEND_FROM) return { skipped: 'no_resend_config' };

  const shareUrl = `${SITE}/?ref=${refCode}`;             // for sharing with friends — lands on homepage
  const personalUrl = `${SITE}/waitlist?me=${refCode}`;   // for opening own status page
  try {
    const result = await c.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: `You're #${position} of 1,000 — welcome to Haven`,
      html: welcomeEmailHtml({ email, position, total, shareUrl, personalUrl }),
      text: welcomeEmailText({ position, total, shareUrl, personalUrl }),
      replyTo: process.env.RESEND_REPLY_TO || undefined,
    });
    return { id: result?.data?.id, error: result?.error };
  } catch (err) {
    console.error('sendWelcomeEmail failed', err);
    return { error: err.message };
  }
}

// ───────────────────────────────────────────────────────────
// 2. Referrer notification — sent to a referrer when someone joins via their link
// ───────────────────────────────────────────────────────────

function referrerEmailHtml({ position, total, referrals, shareUrl, personalUrl, oldPosition }) {
  const moved = oldPosition && oldPosition > position
    ? `You jumped <strong>${oldPosition - position} place${oldPosition - position === 1 ? '' : 's'}</strong>.`
    : '';
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Someone joined Haven via your link</title></head>
<body style="${STYLE.body}">
  <div style="${STYLE.wrap}">
    <p style="${STYLE.pSoft}">Quick one —</p>
    <h1 style="${STYLE.h1}">Another parent just joined Haven through your link.</h1>

    <div style="${STYLE.position}">#<span style="${STYLE.positionEm}">${position}</span></div>
    <p style="${STYLE.positionMeta}">YOUR NEW POSITION · ${total} signed up so far</p>

    <p style="${STYLE.p}">${moved} You've now invited <strong>${referrals}</strong> founding member${referrals === 1 ? '' : 's'}.</p>

    <p style="${STYLE.pSoft}">Position #1 gets their SIM first on launch day. Keep sharing your link with parents who'd want this too:</p>

    <div style="${STYLE.inviteBox}">${escapeHtml(shareUrl)}</div>

    <p style="${STYLE.p}"><a href="${escapeHtml(personalUrl)}" style="${STYLE.cta}">Open your invite page →</a></p>

    <p style="${STYLE.signoff}"><strong>Rich</strong></p>
    <p style="${STYLE.signoffMeta}">Founder, Haven</p>

    <p style="${STYLE.footer}">You're getting this because someone signed up to the Haven waitlist using your invite link. Reply to unsubscribe from these notifications.</p>
  </div>
</body></html>`;
}

function referrerEmailText({ position, total, referrals, shareUrl, personalUrl, oldPosition }) {
  const moved = oldPosition && oldPosition > position
    ? `You jumped ${oldPosition - position} place${oldPosition - position === 1 ? '' : 's'}.\n\n`
    : '';
  return `Quick one —

Another parent just joined Haven through your link.

YOUR NEW POSITION: #${position}
(${total} signed up so far.)

${moved}You've now invited ${referrals} founding member${referrals === 1 ? '' : 's'}.

Position #1 gets their SIM first on launch day. Keep sharing your link with parents who'd want this too:

${shareUrl}

To open your invite page:
${personalUrl}

Rich
Founder, Haven

You're getting this because someone signed up to the Haven waitlist using your invite link. Reply to unsubscribe from these notifications.`;
}

export async function sendReferrerNotification({ email, position, total, referrals, refCode, oldPosition }) {
  const c = client();
  if (!c || !process.env.RESEND_FROM) {
    console.log('[email] referrer notification skipped: env not set', { hasClient: !!c, hasFrom: !!process.env.RESEND_FROM });
    return { skipped: 'no_resend_config' };
  }
  if (!email) {
    console.log('[email] referrer notification skipped: no recipient email', { refCode, position });
    return { skipped: 'no_recipient' };
  }

  const shareUrl = `${SITE}/?ref=${refCode}`;             // for sharing with friends — lands on homepage
  const personalUrl = `${SITE}/waitlist?me=${refCode}`;   // for opening own status page
  try {
    console.log('[email] sending referrer notification', { to: email, position, oldPosition, referrals });
    const result = await c.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: `Someone joined Haven via your link — you're now #${position}`,
      html: referrerEmailHtml({ position, total, referrals, shareUrl, personalUrl, oldPosition }),
      text: referrerEmailText({ position, total, referrals, shareUrl, personalUrl, oldPosition }),
      replyTo: process.env.RESEND_REPLY_TO || undefined,
    });
    console.log('[email] referrer notification send result', { id: result?.data?.id, error: result?.error });
    return { id: result?.data?.id, error: result?.error };
  } catch (err) {
    console.error('[email] sendReferrerNotification threw', err);
    return { error: err.message };
  }
}
