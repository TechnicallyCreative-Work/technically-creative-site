export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('membership_tier').eq('id', user.id).single();

  if (profile?.membership_tier !== 'paid') {
    return new Response(JSON.stringify({ error: 'Upgrade to a paid membership to save your work.' }), {
      status: 403,
    });
  }

  const formData = await request.formData().catch(() => null);
  const originalFile = formData?.get('originalFile');
  const originalFilename = formData?.get('originalFilename');
  const tabText = formData?.get('tabText');
  const fingeringDataJson = formData?.get('fingeringDataJson');
  const reportHtml = formData?.get('reportHtml');
  const detectedKey = formData?.get('detectedKey');
  const detectedBpm = formData?.get('detectedBpm');

  if (
    !(originalFile instanceof File) ||
    typeof originalFilename !== 'string' ||
    typeof tabText !== 'string' ||
    typeof fingeringDataJson !== 'string' ||
    typeof reportHtml !== 'string'
  ) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
  }

  const saveId = crypto.randomUUID();
  const prefix = `${user.id}/${saveId}`;

  const uploads = await Promise.all([
    supabase.storage.from('notemapper-saves').upload(`${prefix}/original.mid`, originalFile),
    supabase.storage.from('notemapper-saves').upload(`${prefix}/tab.txt`, tabText, { contentType: 'text/plain' }),
    supabase.storage
      .from('notemapper-saves')
      .upload(`${prefix}/fingering.json`, fingeringDataJson, { contentType: 'application/json' }),
    supabase.storage.from('notemapper-saves').upload(`${prefix}/report.html`, reportHtml, { contentType: 'text/html' }),
  ]);

  const uploadError = uploads.find((result) => result.error)?.error;
  if (uploadError) {
    console.error('NoteMapper save upload failed:', uploadError);
    return new Response(JSON.stringify({ error: 'Could not upload your files. Please try again.' }), { status: 500 });
  }

  const { error: insertError } = await supabase.from('notemapper_saves').insert({
    id: saveId,
    user_id: user.id,
    original_filename: originalFilename,
    detected_key: typeof detectedKey === 'string' ? detectedKey : null,
    detected_bpm: typeof detectedBpm === 'string' ? Number.parseInt(detectedBpm, 10) || null : null,
    storage_prefix: prefix,
  });

  if (insertError) {
    console.error('NoteMapper save row insert failed:', insertError);
    return new Response(JSON.stringify({ error: 'Could not save your work. Please try again.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, saveId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
