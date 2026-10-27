// Server-only MailerLite client. Never import this from a client-side script —
// it holds the secret API key.

// "TechCre8 General" group — the list behind the contact page's newsletter form
// and the account-page newsletter toggle.
export const NEWSLETTER_GROUP_ID = '189906690472150665';

function authHeaders() {
  return {
    Authorization: `Bearer ${import.meta.env.MAILERLITE_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

// `reactivate` forces status "active" — use it only for an explicit, user-initiated
// opt-in (someone who unsubscribed via an email link and later ticks the box again).
// Without it, an existing unsubscribed/bounced subscriber keeps their status.
export async function subscribeToMailerLite(email: string, groupId?: string, options: { reactivate?: boolean } = {}) {
  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: authHeaders(),
    // Posting an email that already exists updates that subscriber rather than
    // erroring, so callers don't need to special-case duplicates. Note: `groups`
    // in this body is silently ignored by MailerLite's API — group membership
    // must be assigned via a separate call below.
    body: JSON.stringify({
      email,
      ...(options.reactivate ? { status: 'active' } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `MailerLite request failed with status ${response.status}`);
  }

  const result = await response.json();

  if (groupId) {
    const subscriberId = result?.data?.id;
    const groupResponse = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${groupId}`,
      {
        method: 'POST',
        headers: authHeaders(),
      }
    );

    if (!groupResponse.ok) {
      const body = await groupResponse.json().catch(() => null);
      throw new Error(body?.message ?? `MailerLite group assignment failed with status ${groupResponse.status}`);
    }
  }

  return result;
}

// Removes the subscriber from one group only (they stay in MailerLite and in any
// other lists, e.g. the Midi to Tab group). A subscriber MailerLite has never
// heard of is already "not subscribed", so that is treated as success.
export async function removeFromMailerLiteGroup(email: string, groupId: string) {
  const lookup = await fetch(`https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`, {
    headers: authHeaders(),
  });

  if (lookup.status === 404) return;
  if (!lookup.ok) {
    throw new Error(`MailerLite lookup failed with status ${lookup.status}`);
  }

  const subscriberId = (await lookup.json())?.data?.id;
  if (!subscriberId) return;

  const removal = await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${groupId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  // 404 = was not in the group, which is the state we wanted anyway.
  if (!removal.ok && removal.status !== 404) {
    throw new Error(`MailerLite group removal failed with status ${removal.status}`);
  }
}
