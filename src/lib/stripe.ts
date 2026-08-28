import Stripe from 'stripe';

// Server-only Stripe client. Never import this from a client-side script or
// from anything shipped to the browser — it holds the secret key.
// No `apiVersion` is pinned here on purpose: the installed SDK version already
// bundles a default it's tested against, and guessing a version string by hand
// risks pinning to one that doesn't exist.
export function createStripeClient() {
  return new Stripe(import.meta.env.STRIPE_SECRET_KEY);
}
