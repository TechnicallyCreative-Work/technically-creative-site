export const prerender = false;

import type { APIRoute } from 'astro';
import { setNewsletterSubscription } from '~/lib/newsletter';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Account-page newsletter toggle. Signed-in users only; always acts on the
// caller's own profile and email — nothing here is taken from the request body
// except the on/off flag.
export const POST: APIRoute = async ({ request, locals }) => {
  const { user } = locals;

  if (!user?.email) {
    return json({ error: 'Not signed in' }, 401);
  }

  let subscribed: unknown;
  try {
    subscribed = (await request.json())?.subscribed;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  if (typeof subscribed !== 'boolean') {
    return json({ error: 'Invalid request.' }, 400);
  }

  try {
    await setNewsletterSubscription(user.id, user.email, subscribed, { explicit: true });
  } catch (err) {
    console.error('Newsletter preference update failed', err);
    return json({ error: 'Could not update your newsletter preference right now. Please try again.' }, 502);
  }

  return json({ success: true, subscribed }, 200);
};
