export const prerender = false;

import type { APIRoute } from 'astro';
import { createStripeClient } from '~/lib/stripe';

export const POST: APIRoute = async ({ locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single();

  if (!profile?.stripe_customer_id) {
    return new Response(JSON.stringify({ error: 'No billing account on file yet' }), { status: 400 });
  }

  const stripe = createStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${import.meta.env.PUBLIC_SITE_URL}/account`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
