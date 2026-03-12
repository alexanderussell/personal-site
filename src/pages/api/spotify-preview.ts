import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const artist = url.searchParams.get('artist');
  const album = url.searchParams.get('album');
  const spotifyId = url.searchParams.get('spotifyId');

  if (!artist || !album) {
    return new Response(JSON.stringify({ error: 'Missing artist or album' }), { status: 400 });
  }

  try {
    // Step 1: Search Deezer for the specific album
    const albumQuery = encodeURIComponent(`"${album}" "${artist}"`);
    const albumResp = await fetch(`https://api.deezer.com/search/album?q=${albumQuery}&limit=5`);
    const albumData = await albumResp.json();

    // Find the best matching album by the correct artist
    const artistLower = artist.toLowerCase();
    const albumLower = album.toLowerCase();
    const match = (albumData.data || []).find((a: any) =>
      a.artist?.name?.toLowerCase().includes(artistLower) ||
      artistLower.includes(a.artist?.name?.toLowerCase())
    );

    if (match) {
      // Step 2: Get tracks from that specific album
      const tracksResp = await fetch(`https://api.deezer.com/album/${match.id}/tracks?limit=5`);
      const tracksData = await tracksResp.json();
      const track = (tracksData.data || []).find((t: any) => t.preview);

      if (track) {
        return new Response(JSON.stringify({
          url: track.preview,
          name: track.title,
          spotifyId: spotifyId || null,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // No match — return spotifyId for fallback link
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
