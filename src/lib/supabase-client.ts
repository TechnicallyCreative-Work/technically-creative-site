import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client. Persists the session via cookies (not
// localStorage) so that server-rendered pages/middleware can read the same
// session — do not swap this for a plain `@supabase/supabase-js` createClient.
export function createSupabaseBrowserClient() {
  return createBrowserClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}
