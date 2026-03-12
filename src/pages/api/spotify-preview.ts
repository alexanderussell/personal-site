import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const artist = url.searchParams.get('artist');
  const album = url.searchParams.get('album');
  const spotifyId = url.searchParams.get('spotifyId');

  if (!artist || !album) {
    return new Response(JSON.stringify({ error: 'Missing artist or album' }), { status: 400 });
  }

  try {
    // Use Deezer API for 30-second previews (free, no auth required)
    const query = encodeURIComponent(`artist:"${artist}" album:"${album}"`);
    const resp = await fetch(`https://api.deezer.com/search?q=${query}&limit=3`);
    const data = await resp.json();

    const track = (data.data || []).find((t: any) => t.preview);

    if (track) {
      return new Response(JSON.stringify({
        url: track.preview,
        name: track.title,
        spotifyId: spotifyId || null,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // No preview found — return spotifyId for fallback link
    return new Response(JSON.stringify({
      url: null,
      spotifyId: spotifyId || null,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ url: null, spotifyId: spotifyId || null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
