// Server-only MailerLite client. Never import this from a client-side script —
// it holds the secret API key.
export async function subscribeToMailerLite(email: string, groupId?: string) {
  const apiKey = import.meta.env.MAILERLITE_API_KEY;

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // Posting an email that already exists updates that subscriber rather than
    // erroring, so callers don't need to special-case duplicates.
    body: JSON.stringify({
      email,
      ...(groupId ? { groups: [groupId] } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `MailerLite request failed with status ${response.status}`);
  }

  return response.json();
}
