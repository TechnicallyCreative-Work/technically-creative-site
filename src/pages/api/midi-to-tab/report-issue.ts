export const prerender = false;

import type { APIRoute } from 'astro';

// Issue reports from the Midi to Tab page: a description plus an optional
// screenshot. We validate here, attach trusted account info from the session,
// and forward to an n8n intake workflow that logs the report to the Error
// Logger sheet. Proxying (rather than posting from the browser) keeps the
// webhook URL out of the client, avoids CORS, and means the reporter's
// identity comes from the session instead of whatever the form claims.
const DEFAULT_WEBHOOK = 'https://technicallycreative.app.n8n.cloud/webhook/midi-to-tab-report';

// Netlify functions cap request bodies at ~6MB; keep the screenshot well under it.
const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clip = (value: FormDataEntryValue | null, max: number) => String(value ?? '').trim().slice(0, max);

export const POST: APIRoute = async ({ request, locals }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Could not read the report. Please try again.' }, 400);
  }

  // Honeypot: real users never see or fill this field. Pretend success so bots
  // get no signal.
  if (clip(form.get('website'), 100)) return json({ ok: true });

  const description = clip(form.get('description'), 2000);
  if (description.length < 10) {
    return json({ error: 'Please describe the issue in a few more words (at least 10 characters).' }, 400);
  }

  const screenshot = form.get('screenshot');
  const hasScreenshot = screenshot instanceof File && screenshot.size > 0;
  if (hasScreenshot) {
    if (!ALLOWED_IMAGE_TYPES.has(screenshot.type)) {
      return json({ error: 'Screenshot must be a PNG, JPG, WebP or GIF image.' }, 400);
    }
    if (screenshot.size > MAX_SCREENSHOT_BYTES) {
      return json({ error: 'Screenshot is too large — please keep it under 4 MB.' }, 400);
    }
  }

  // Prefer the signed-in account email; fall back to an email they typed.
  const typedEmail = clip(form.get('contact_email'), 200);
  const contactEmail = locals.user?.email ?? (EMAIL_PATTERN.test(typedEmail) ? typedEmail : '');

  const reportId = crypto.randomUUID().slice(0, 8);
  const payload = new FormData();
  payload.append('report_id', reportId);
  payload.append('app', 'Midi to Tab');
  payload.append('submitted_at', new Date().toISOString());
  payload.append('description', description);
  payload.append('contact_email', contactEmail);
  payload.append('signed_in', locals.user ? 'yes' : 'no');
  payload.append('user_id', locals.user?.id ?? '');
  payload.append('page_url', clip(form.get('page_url'), 300));
  payload.append('file_name', clip(form.get('file_name'), 200));
  payload.append('tuning', clip(form.get('tuning'), 40));
  payload.append('user_agent', clip(request.headers.get('user-agent'), 300));
  if (hasScreenshot) {
    payload.append('screenshot', screenshot, screenshot.name || 'screenshot.png');
  }

  const webhookUrl = import.meta.env.N8N_MIDI_TO_TAB_REPORT_WEBHOOK || DEFAULT_WEBHOOK;
  try {
    const resp = await fetch(webhookUrl, { method: 'POST', body: payload });
    if (!resp.ok) throw new Error(`n8n webhook responded ${resp.status}`);
  } catch (err) {
    console.error('Midi to Tab issue report failed to reach n8n:', err);
    return json({ error: "Couldn't send your report right now. Please try again in a bit, or email contact@technicallycreative.work." }, 502);
  }

  return json({ ok: true, reportId });
};
