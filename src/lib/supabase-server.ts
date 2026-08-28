import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

// Request-scoped Supabase client, backed by cookies on the Astro request/response.
// Use this in middleware and in server-rendered pages/API routes that act on
// behalf of the signed-in visitor (subject to their RLS policies).
//
// Returns `applyPendingHeaders(response)` alongside the client — Supabase may
// need to set Cache-Control/Expires/Pragma headers on the response whenever it
// writes auth cookies (token refresh, sign-in, sign-out), so a CDN/reverse
// proxy never caches a response carrying someone else's session cookie. Call
// it on every Response this client's request touches before returning it.
export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  let pendingHeaders: Record<string, string> = {};

  const supabase = createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
        pendingHeaders = headers;
      },
    },
  });

  return {
    supabase,
    applyPendingHeaders(response: Response) {
      Object.entries(pendingHeaders).forEach(([key, value]) => response.headers.set(key, value));
    },
  };
}

// Service-role client — bypasses Row Level Security entirely. Server-only,
// used exclusively by the Stripe webhook to write to a user's profile row
// outside of any user session. Never import this from client-side code or
// from anything that runs in the browser.
export function createSupabaseServiceRoleClient() {
  return createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
