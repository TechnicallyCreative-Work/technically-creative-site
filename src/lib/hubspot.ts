// Server-only HubSpot client. Never import this from a client-side script —
// it holds the secret Private App token.
export async function upsertHubspotContact(email: string, props: { leadSource?: string } = {}) {
  const token = import.meta.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const properties = {
    email,
    // notemapper_lead_source is a plain text property, separate from the
    // curated "how did you hear about us" referral_source dropdown (which is
    // a fixed picklist that rejects arbitrary values like "NoteMapper").
    ...(props.leadSource ? { notemapper_lead_source: props.leadSource } : {}),
  };

  // Upsert by email — HubSpot updates the existing contact if one matches,
  // so callers don't need to special-case duplicates.
  const response = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    }
  );

  if (response.status === 404) {
    // No contact with this email exists yet — create one instead.
    const createResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });

    if (!createResponse.ok) {
      const body = await createResponse.json().catch(() => null);
      throw new Error(body?.message ?? `HubSpot create failed with status ${createResponse.status}`);
    }

    return createResponse.json();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `HubSpot upsert failed with status ${response.status}`);
  }

  return response.json();
}
