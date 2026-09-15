import type { SupabaseClient } from '@supabase/supabase-js';

export interface NotemapperUsageRow {
  id: string;
  anon_id: string;
  user_id: string | null;
  email: string | null;
  use_count: number;
  email_captured_at: string | null;
}

// Looks up (or creates) the notemapper_usage row for the current visitor,
// preferring a signed-in user's row and backfilling `user_id` onto an
// anonymous row from before they had an account — see the "Identity/tracking
// model" section of the NoteMapper plan for why this ordering matters.
// Expects a service-role client (this table has no client-role RLS policies).
export async function getOrCreateUsageRow(
  supabase: SupabaseClient,
  { anonId, userId }: { anonId: string; userId: string | null }
): Promise<NotemapperUsageRow> {
  if (userId) {
    const { data: byUser } = await supabase
      .from('notemapper_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (byUser) return byUser;

    const { data: byAnon } = await supabase
      .from('notemapper_usage')
      .select('*')
      .eq('anon_id', anonId)
      .maybeSingle();
    if (byAnon) {
      const { data: linked } = await supabase
        .from('notemapper_usage')
        .update({ user_id: userId })
        .eq('id', byAnon.id)
        .select('*')
        .single();
      return linked!;
    }

    const { data: created } = await supabase
      .from('notemapper_usage')
      .insert({ anon_id: anonId, user_id: userId })
      .select('*')
      .single();
    return created!;
  }

  const { data: byAnon } = await supabase
    .from('notemapper_usage')
    .select('*')
    .eq('anon_id', anonId)
    .maybeSingle();
  if (byAnon) return byAnon;

  const { data: created } = await supabase
    .from('notemapper_usage')
    .insert({ anon_id: anonId })
    .select('*')
    .single();
  return created!;
}
