export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServiceRoleClient } from '~/lib/supabase-server';
import { getOrCreateUsageRow } from '~/lib/notemapper-usage';

const FREE_USES = 3;

export const POST: APIRoute = async ({ cookies, locals }) => {
  const anonId = cookies.get('nm_uid')?.value;

  if (!anonId) {
    return new Response(JSON.stringify({ error: 'Missing visitor cookie.' }), { status: 400 });
  }

  const { user, supabase } = locals;
  const service = createSupabaseServiceRoleClient();

  let isPaidMember = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('membership_tier').eq('id', user.id).single();
    isPaidMember = profile?.membership_tier === 'paid';
  }

  const row = await getOrCreateUsageRow(service, { anonId, userId: user?.id ?? null });

  // Paying members and anyone who's already captured an email get unlimited
  // use — still counted for analytics, but never blocked.
  if (isPaidMember || row.email_captured_at) {
    await service
      .from('notemapper_usage')
      .update({ use_count: row.use_count + 1, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    return new Response(JSON.stringify({ allowed: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (row.use_count < FREE_USES) {
    await service
      .from('notemapper_usage')
      .update({ use_count: row.use_count + 1, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    return new Response(JSON.stringify({ allowed: true, remaining: FREE_USES - (row.use_count + 1) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Blocked attempt doesn't consume a use — nothing to increment here.
  return new Response(JSON.stringify({ allowed: false, reason: 'email_required' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
