import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

export interface NotemapperUsageRow {
  id: string;
  anon_id: string;
  user_id: string | null;
  email: string | null;
  use_count: number;
  email_captured_at: string | null;
}

// Postgres "unique_violation" — see https://www.postgresql.org/docs/current/errcodes-appendix.html
const UNIQUE_VIOLATION = '23505';

function isUniqueViolation(error: PostgrestError | null): boolean {
  return error?.code === UNIQUE_VIOLATION;
}

// Looks up (or creates) the notemapper_usage row for the current visitor,
// preferring a signed-in user's row and backfilling `user_id` onto an
// anonymous row from before they had an account — see the "Identity/tracking
// model" section of the NoteMapper plan for why this ordering matters.
// Expects a service-role client (this table has no client-role RLS policies).
//
// `user_id` and `anon_id` both carry unique constraints, and this page is
// prefetched (Astro ClientRouter prefetches on link hover), so two requests
// for the same visitor's *first* visit can race here: both find no existing
// row and both attempt an insert, and the loser gets a unique-violation back
// instead of a row. Every insert/update below re-queries on that specific
// error rather than assuming it always returns a row.
export async function getOrCreateUsageRow(
  supabase: SupabaseClient,
  { anonId, userId }: { anonId: string; userId: string | null }
): Promise<NotemapperUsageRow> {
  if (userId) {
    const { data: byUser, error: byUserError } = await supabase
      .from('notemapper_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (byUserError) throw byUserError;
    if (byUser) return byUser;

    const { data: byAnon, error: byAnonError } = await supabase
      .from('notemapper_usage')
      .select('*')
      .eq('anon_id', anonId)
      .maybeSingle();
    if (byAnonError) throw byAnonError;

    if (byAnon) {
      const { data: linked, error: linkError } = await supabase
        .from('notemapper_usage')
        .update({ user_id: userId })
        .eq('id', byAnon.id)
        .select('*')
        .single();
      if (linkError) {
        // Lost the race to another request linking the same anon row (or a
        // concurrent insert already claimed this user_id) — re-fetch by
        // user_id rather than crashing on a null row.
        if (isUniqueViolation(linkError)) return getOrCreateUsageRow(supabase, { anonId, userId });
        throw linkError;
      }
      return linked;
    }

    const { data: created, error: insertError } = await supabase
      .from('notemapper_usage')
      .insert({ anon_id: anonId, user_id: userId })
      .select('*')
      .single();
    if (insertError) {
      // Another concurrent request (e.g. a prefetch + the real navigation)
      // already created this visitor's row — fetch it instead of failing.
      if (isUniqueViolation(insertError)) return getOrCreateUsageRow(supabase, { anonId, userId });
      throw insertError;
    }
    return created;
  }

  const { data: byAnon, error: byAnonError } = await supabase
    .from('notemapper_usage')
    .select('*')
    .eq('anon_id', anonId)
    .maybeSingle();
  if (byAnonError) throw byAnonError;
  if (byAnon) return byAnon;

  const { data: created, error: insertError } = await supabase
    .from('notemapper_usage')
    .insert({ anon_id: anonId })
    .select('*')
    .single();
  if (insertError) {
    if (isUniqueViolation(insertError)) return getOrCreateUsageRow(supabase, { anonId, userId });
    throw insertError;
  }
  return created;
}
