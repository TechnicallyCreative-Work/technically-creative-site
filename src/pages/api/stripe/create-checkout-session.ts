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

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: import.meta.env.STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: user.id,
      // Reuse the existing Stripe customer if this user has subscribed before
      // (e.g. re-subscribing after a cancellation) instead of creating a duplicate.
      ...(profile?.stripe_customer_id
        ? { customer: profile.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      success_url: `${siteUrl}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/account?checkout=cancelled`,
    });
  } catch (err) {
    // Log the real Stripe error server-side; return a clean JSON message so the
    // client never gets an empty body (which breaks res.json()).
    console.error('Stripe checkout session creation failed', err);
    return new Response(JSON.stringify({ error: "Couldn't start checkout. Please try again in a moment." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!session.url) {
    return new Response(JSON.stringify({ error: 'Could not create checkout session' }), { status: 500 });
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
