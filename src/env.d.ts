// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

import type { SupabaseClient, User } from '@supabase/supabase-js';

// This file has a top-level `import`, which makes it a module — ambient
// declarations below must go through `declare global` or they'd only be
// scoped to this file instead of augmenting the real global types.
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      user: User | null;
    }
  }

  interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly STRIPE_SECRET_KEY: string;
    readonly STRIPE_PRICE_ID: string;
    readonly STRIPE_WEBHOOK_SECRET: string;
    readonly PUBLIC_SITE_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
