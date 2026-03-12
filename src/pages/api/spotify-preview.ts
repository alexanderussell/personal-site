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
    const match = (albumData.data || []).find((a: any) =>
      a.artist?.name?.toLowerCase().includes(artistLower) ||
      artistLower.includes(a.artist?.name?.toLowerCase())
    );

    if (match) {
      // Step 2: Get ALL tracks from that album
      const tracksResp = await fetch(`https://api.deezer.com/album/${match.id}/tracks?limit=50`);
      const tracksData = await tracksResp.json();
      const tracks = (tracksData.data || []).filter((t: any) => t.preview);

      if (tracks.length > 0) {
        // Prefer the title track (track name matches album name)
        const albumLower = album.toLowerCase();
        const titleTrack = tracks.find((t: any) => {
          const title = t.title.toLowerCase().replace(/\s*\(.*\)/, ''); // strip "(2005 Remaster)" etc.
          return title === albumLower || albumLower.includes(title) || title.includes(albumLower);
        });

        // If no title track, pick the most recognizable — Deezer ranks by popularity
        // so search for the top track by this artist from this album
        let bestTrack = titleTrack || null;

        if (!bestTrack) {
          // Try a track search scoped to artist + album to get popularity-ranked results
          const trackQuery = encodeURIComponent(`artist:"${artist}" album:"${album}"`);
          const popularResp = await fetch(`https://api.deezer.com/search/track?q=${trackQuery}&limit=5`);
          const popularData = await popularResp.json();
          const popularMatch = (popularData.data || []).find((t: any) =>
            t.preview && t.album?.id === match.id
          );
          bestTrack = popularMatch || tracks[0];
        }

        return new Response(JSON.stringify({
          url: bestTrack.preview,
          name: bestTrack.title,
          album: match.title,
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
