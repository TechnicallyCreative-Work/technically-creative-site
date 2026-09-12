export const prerender = false;

import type { APIRoute } from 'astro';

// "TechCre8 General" group in MailerLite — same list used by the contact page's newsletter form.
const MAILERLITE_GROUP_ID = '189906690472150665';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = typeof body?.email === 'string' ? body.email.trim() : undefined;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Newsletter signup is not configured yet.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, groups: [MAILERLITE_GROUP_ID] }),
  });

  if (!mailerliteResponse.ok) {
    return new Response(JSON.stringify({ error: 'Could not subscribe right now. Please try again later.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
