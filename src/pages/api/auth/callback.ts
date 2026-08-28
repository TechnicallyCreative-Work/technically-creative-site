export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '~/lib/supabase-server';

// Supabase redirects here after email confirmation (and would for password
// reset, if added later) with a `?code=...` to exchange for a session.
export const GET: APIRoute = async ({ request, cookies, url, redirect }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/login?error=missing_code');
  }

  const { supabase, applyPendingHeaders } = createSupabaseServerClient(request, cookies);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  const response = error ? redirect('/login?error=confirmation_failed') : redirect('/account');
  applyPendingHeaders(response);
  return response;
};
