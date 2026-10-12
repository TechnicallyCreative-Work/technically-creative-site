import { createSupabaseServiceRoleClient } from '~/lib/supabase-server';
import { NEWSLETTER_GROUP_ID, removeFromMailerLiteGroup, subscribeToMailerLite } from '~/lib/mailerlite';

// Server-only. Applies a newsletter preference to MailerLite first, then records it
// on the profile — so if MailerLite fails the stored preference doesn't claim
// something that isn't true, and the caller can surface the error.
//
// The profile write uses the service-role client on purpose: browser-role clients
// have no UPDATE access to `profiles` (otherwise a signed-in user could edit their
// own membership_tier).
//
// `explicit` = the user just clicked the toggle (vs. the automatic one-time sync of
// a signup-form checkbox), which is when re-activating an unsubscribed contact is
// legitimate.
export async function setNewsletterSubscription(
  userId: string,
  email: string,
  subscribed: boolean,
  { explicit }: { explicit: boolean }
) {
  if (!import.meta.env.MAILERLITE_API_KEY) {
    throw new Error('Newsletter is not configured yet.');
  }

  if (subscribed) {
    await subscribeToMailerLite(email, NEWSLETTER_GROUP_ID, { reactivate: explicit });
  } else {
    await removeFromMailerLiteGroup(email, NEWSLETTER_GROUP_ID);
  }

  const { error } = await createSupabaseServiceRoleClient()
    .from('profiles')
    .update({ newsletter_opt_in: subscribed, newsletter_synced_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
