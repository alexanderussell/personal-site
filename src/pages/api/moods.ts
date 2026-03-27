import type { APIRoute } from 'astro';
import { api } from '../../../convex/_generated/api';
import { getConvex } from '../../lib/clients';

export const GET: APIRoute = async () => {
  const convex = getConvex();

  try {
    const moods = await convex.query(api.moods.list);
    return new Response(JSON.stringify({ moods }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ moods: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: { mood?: string; album?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { mood, album } = body;

  if (!mood || typeof mood !== 'string' || mood.length > 500) {
    return new Response(JSON.stringify({ error: 'Missing or invalid mood' }), { status: 400 });
  }

  if (album && (typeof album !== 'string' || album.length > 500)) {
    return new Response(JSON.stringify({ error: 'Invalid album' }), { status: 400 });
  }

  const convex = getConvex();

  try {
    await convex.mutation(api.moods.add, { mood, album });
  } catch (err) {
    console.error('Convex moods error:', err);
    return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
