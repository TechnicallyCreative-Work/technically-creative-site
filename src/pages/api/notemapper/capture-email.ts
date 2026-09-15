export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServiceRoleClient } from '~/lib/supabase-server';
import { getOrCreateUsageRow } from '~/lib/notemapper-usage';
import { subscribeToMailerLite } from '~/lib/mailerlite';
import { upsertHubspotContact } from '~/lib/hubspot';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const anonId = cookies.get('nm_uid')?.value;

  if (!anonId) {
    return new Response(JSON.stringify({ error: 'Missing visitor cookie.' }), { status: 400 });
  }

  const { email } = await request.json().catch(() => ({ email: null }));

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
    return new Response(JSON.stringify({ error: 'Enter a valid email address.' }), { status: 400 });
  }

  const { user } = locals;
  const service = createSupabaseServiceRoleClient();
  const row = await getOrCreateUsageRow(service, { anonId, userId: user?.id ?? null });

  const { error } = await service
    .from('notemapper_usage')
    .update({ email, email_captured_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', row.id);

  if (error) {
    console.error('NoteMapper usage row update failed:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again later.' }), { status: 500 });
  }

  // Best-effort marketing side-effects — the row write above is the actual
  // gate state, so a MailerLite/HubSpot hiccup shouldn't block the visitor.
  const results = await Promise.allSettled([
    subscribeToMailerLite(email, import.meta.env.MAILERLITE_GROUP_ID_NOTEMAPPER),
    upsertHubspotContact(email, { referralSource: 'NoteMapper' }),
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('NoteMapper lead routing failed:', result.reason);
    }
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
