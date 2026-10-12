export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '~/lib/supabase-server';

// Only same-site absolute paths are allowed as a post-login destination —
// "//evil.com" and "/\evil.com" are treated by browsers as other origins.
function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return null;
  return raw;
}

// Supabase redirects here after email confirmation and after a password-reset
// link is clicked, with a `?code=...` to exchange for a session.
export const GET: APIRoute = async ({ request, cookies, url, redirect }) => {
  const next = safeNext(url.searchParams.get('next')) ?? '/account';
  const isRecovery = next.startsWith('/reset-password');

  // Where to send people when the link can't be used. A failed reset link goes
  // back to "request a new one"; a failed confirmation link goes to login, since
  // Supabase has usually already confirmed the email by this point.
  const fail = (reason: 'confirmation_failed' | 'link_expired' | 'missing_code') =>
    redirect(isRecovery ? '/forgot-password?error=link_expired' : `/login?error=${reason}`);

  // Supabase reports expired/used links as ?error=...&error_code=otp_expired
  // instead of a code.
  if (url.searchParams.get('error') || url.searchParams.get('error_code')) {
    return fail('link_expired');
  }

  const code = url.searchParams.get('code');
  if (!code) {
    return fail('missing_code');
  }

  const { supabase, applyPendingHeaders } = createSupabaseServerClient(request, cookies);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  const response = error ? fail('confirmation_failed') : redirect(next);
  applyPendingHeaders(response);
  return response;
};
