export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '~/lib/supabase-server';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { supabase, applyPendingHeaders } = createSupabaseServerClient(request, cookies);
  await supabase.auth.signOut();

  const response = redirect('/');
  applyPendingHeaders(response);
  return response;
};
