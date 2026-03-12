import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
}

export const GET: APIRoute = async () => {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('moods')
    .select('mood, album, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return new Response(JSON.stringify({ moods: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ moods: data || [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const supabase = getSupabase();
  const { mood, album } = await request.json();

  if (!mood) {
    return new Response(JSON.stringify({ error: 'Missing mood' }), { status: 400 });
  }

  const { error } = await supabase
    .from('moods')
    .insert({ mood, album });

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
