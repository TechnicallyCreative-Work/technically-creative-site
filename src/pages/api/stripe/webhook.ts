export const prerender = false;

import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { createStripeClient } from '~/lib/stripe';
import { createSupabaseServiceRoleClient } from '~/lib/supabase-server';

// Statuses that keep a member on the paid tier as a grace period rather than
// downgrading them immediately on a failed/late payment. Only an explicit
// cancellation (handled separately below, and via `customer.subscription.deleted`)
// downgrades to free.
const GRACE_PERIOD_STATUSES = new Set(['active', 'trialing', 'past_due', 'unpaid']);

export const POST: APIRoute = async ({ request }) => {
  // Signature verification needs the exact raw body — do not call
  // request.json() first, that consumes the stream and breaks verification.
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const stripe = createStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, import.meta.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Service-role client: this request has no user session, and needs to write
  // to an arbitrary user's profile row — the anon/RLS-scoped client can't do that.
  const supabase = createSupabaseServiceRoleClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error('checkout.session.completed had no client_reference_id — cannot map to a user');
        break;
      }

      await supabase
        .from('profiles')
        .update({
          membership_tier: 'paid',
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
          stripe_subscription_id:
            typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
          subscription_status: 'active',
        })
        .eq('id', userId);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('profiles')
        .update({
          membership_tier: GRACE_PERIOD_STATUSES.has(subscription.status) ? 'paid' : 'free',
          subscription_status: subscription.status,
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('profiles')
        .update({
          membership_tier: 'free',
          subscription_status: 'canceled',
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    default:
      // Unhandled event types are expected — Stripe sends far more event
      // types than this app needs to react to.
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
