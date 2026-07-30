// Haven "Ask" survey — capture + notify.
// POST: stores a response in Postgres, emails Rich via Resend, pings Slack.
// GET:  organiser view, gated behind ?passcode= (env ASK_SURVEY_PASSCODE).
//
// Reuses the site's existing free resources — same Neon Postgres, same
// Resend account, same Slack webhook as the waitlist flow. No new services.

import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const YEARS = [
  'Not near this yet',
  'Year 4 or below',
  'Year 5',
  'Year 6',
  'Year 7',
  'Year 8 or above',
];

const NOTIFY_EMAIL = process.env.ASK_SURVEY_NOTIFY_EMAIL || 'richbowdler@gmail.com';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clip(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

async function notifyEmail({ question, weight, year, wand, name, contact }) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = [
      weight ? `<p><strong>Weight:</strong> ${weight}/5</p>` : '',
      year ? `<p><strong>Eldest's year:</strong> ${escapeHtml(year)}</p>` : '',
      wand ? `<p><strong>Magic wand:</strong> ${escapeHtml(wand).replace(/\n/g, '<br>')}</p>` : '',
      (name || contact) ? `<p><strong>From:</strong> ${escapeHtml([name, contact].filter(Boolean).join(' · '))}</p>` : '',
    ].join('');
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: NOTIFY_EMAIL,
      replyTo: contact && contact.includes('@') ? contact : (process.env.RESEND_REPLY_TO || undefined),
      subject: `Ask survey reply${name ? ` — ${name}` : ''}`,
      html: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#1a1a2e;max-width:560px;margin:0 auto;padding:24px;">
        <p>"${escapeHtml(question)}"</p>
        ${rows}
      </div>`,
      text: [
        question,
        weight ? `Weight: ${weight}/5` : '',
        year ? `Eldest's year: ${year}` : '',
        wand ? `Magic wand: ${wand}` : '',
        (name || contact) ? `From: ${[name, contact].filter(Boolean).join(' · ')}` : '',
      ].filter(Boolean).join('\n\n'),
    });
  } catch (err) {
    console.error('ask-survey notifyEmail failed', err);
  }
}

async function notifySlack({ question, weight, year, name, contact }) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    const fields = [{ type: 'mrkdwn', text: `*Question*\n${question}` }];
    if (year) fields.push({ type: 'mrkdwn', text: `*Year*\n${year}` });
    if (weight) fields.push({ type: 'mrkdwn', text: `*Weight*\n${weight}/5` });
    if (name || contact) fields.push({ type: 'mrkdwn', text: `*From*\n${[name, contact].filter(Boolean).join(' · ')}` });
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New Ask survey reply: ${question}`,
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: 'New *Ask survey* reply' } },
          { type: 'section', fields },
        ],
      }),
    });
  } catch (err) {
    console.error('ask-survey notifySlack failed', err);
  }
}

async function handlePost(req, res) {
  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  // Honeypot: real visitors never fill this hidden field in.
  if (clip(payload?.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const question = clip(payload?.question, 4000);
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const weightRaw = Number(payload?.weight);
  const weight = Number.isInteger(weightRaw) && weightRaw >= 1 && weightRaw <= 5 ? weightRaw : null;
  const yearRaw = clip(payload?.year, 40);
  const year = YEARS.includes(yearRaw) ? yearRaw : null;
  const wand = clip(payload?.wand, 4000) || null;
  const name = clip(payload?.name, 200) || null;
  const contact = clip(payload?.contact, 200) || null;
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null;
  const userAgent = clip(req.headers['user-agent'], 300) || null;

  try {
    await sql`
      INSERT INTO ask_survey_responses (question, weight, year, wand, name, contact, ip, user_agent)
      VALUES (${question}, ${weight}, ${year}, ${wand}, ${name}, ${contact}, ${ip}, ${userAgent})
    `;
  } catch (err) {
    console.error('ask-survey insert failed', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  await Promise.all([
    notifyEmail({ question, weight, year, wand, name, contact }),
    notifySlack({ question, weight, year, name, contact }),
  ]);

  return res.status(200).json({ ok: true });
}

async function handleGet(req, res) {
  const expected = process.env.ASK_SURVEY_PASSCODE || 'haven';
  const passcode = String(req.query?.passcode ?? '').trim().toLowerCase();
  if (passcode !== expected.toLowerCase()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { rows } = await sql`
      SELECT question, weight, year, wand, name, contact, submitted_at
      FROM ask_survey_responses
      ORDER BY submitted_at DESC
    `;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ rows });
  } catch (err) {
    console.error('ask-survey list failed', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'GET') return handleGet(req, res);
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
