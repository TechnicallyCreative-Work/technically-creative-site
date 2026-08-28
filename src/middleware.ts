import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '~/lib/supabase-server';

// Route prefixes that require a signed-in user. Add future member-only
// sections (e.g. `/members`) here — everything else stays public.
const PROTECTED_PREFIXES = ['/account'];

// Pages a signed-in user shouldn't see (they'd just be redirected to sign
// in again) — send them to their account page instead.
const AUTH_ONLY_PAGES = ['/login', '/signup'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered (static) pages are built once, with no real per-request
  // Cookie header available — none of them read Astro.locals.user, so skip
  // the Supabase round-trip entirely rather than doing pointless work (and
  // triggering "Astro.request.headers is not available on prerendered pages"
  // during the build).
  if (context.isPrerendered) {
    return next();
  }

  const { supabase, applyPendingHeaders } = createSupabaseServerClient(context.request, context.cookies);
  context.locals.supabase = supabase;

  // getUser() revalidates the token against Supabase's auth server rather than
  // trusting whatever is in the cookie — do not swap this for getSession().
  // Wrapped defensively: this middleware also runs while prerendering every
  // static page at build time (and would run on every static-page request in
  // any case where Supabase is briefly unreachable) — a network hiccup here
  // should fall back to "signed out", not break the page.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error('Supabase auth check failed', err);
  }

  context.locals.user = user;

  const pathname = context.url.pathname;

  if (!user && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const redirectTo = `/login?next=${encodeURIComponent(pathname)}`;
    const response = context.redirect(redirectTo);
    applyPendingHeaders(response);
    return response;
  }

  if (user && AUTH_ONLY_PAGES.includes(pathname)) {
    const response = context.redirect('/account');
    applyPendingHeaders(response);
    return response;
  }

  const response = await next();
  applyPendingHeaders(response);
  return response;
});
