import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

function getConvex() {
  return new ConvexHttpClient(import.meta.env.CONVEX_URL);
}

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
  const { mood, album } = await request.json();

  if (!mood) {
    return new Response(JSON.stringify({ error: 'Missing mood' }), { status: 400 });
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
