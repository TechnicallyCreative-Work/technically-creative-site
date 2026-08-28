export const prerender = false;

import type { APIRoute } from 'astro';
import { createStripeClient } from '~/lib/stripe';

export const POST: APIRoute = async ({ locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single();

  const stripe = createStripeClient();
  const siteUrl = import.meta.env.PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: import.meta.env.STRIPE_PRICE_ID, quantity: 1 }],
    client_reference_id: user.id,
    // Reuse the existing Stripe customer if this user has subscribed before
    // (e.g. re-subscribing after a cancellation) instead of creating a duplicate.
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: user.email ?? undefined }),
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/account?checkout=cancelled`,
  });

  if (!session.url) {
    return new Response(JSON.stringify({ error: 'Could not create checkout session' }), { status: 500 });
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
