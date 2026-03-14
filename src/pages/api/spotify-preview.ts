import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const artist = url.searchParams.get('artist');
  const album = url.searchParams.get('album');
  const spotifyId = url.searchParams.get('spotifyId');
  const targetTrack = url.searchParams.get('track');

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
        let bestTrack = null;

        // Priority 1: Match the specific requested track name
        if (targetTrack) {
          const trackLower = targetTrack.toLowerCase();
          bestTrack = tracks.find((t: any) => {
            const title = t.title.toLowerCase().replace(/\s*\(.*\)/, '');
            return title === trackLower || title.includes(trackLower) || trackLower.includes(title);
          });
        }

        // Priority 2: Title track (track name matches album name)
        if (!bestTrack) {
          const albumLower = album.toLowerCase();
          bestTrack = tracks.find((t: any) => {
            const title = t.title.toLowerCase().replace(/\s*\(.*\)/, '');
            return title === albumLower || albumLower.includes(title) || title.includes(albumLower);
          });
        }

        // Priority 3: Popularity-ranked search via Deezer
        if (!bestTrack) {
          const searchQuery = targetTrack
            ? encodeURIComponent(`artist:"${artist}" track:"${targetTrack}"`)
            : encodeURIComponent(`artist:"${artist}" album:"${album}"`);
          const popularResp = await fetch(`https://api.deezer.com/search/track?q=${searchQuery}&limit=5`);
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
          cover: match.cover_medium || match.cover_big || null,
          spotifyId: spotifyId || null,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Fallback: If album not found but we have a target track, try direct track search
    if (targetTrack) {
      const directQuery = encodeURIComponent(`artist:"${artist}" track:"${targetTrack}"`);
      const directResp = await fetch(`https://api.deezer.com/search/track?q=${directQuery}&limit=5`);
      const directData = await directResp.json();
      const directMatch = (directData.data || []).find((t: any) =>
        t.preview && t.artist?.name?.toLowerCase().includes(artistLower)
      );
      if (directMatch) {
        return new Response(JSON.stringify({
          url: directMatch.preview,
          name: directMatch.title,
          album: directMatch.album?.title || album,
          cover: directMatch.album?.cover_medium || directMatch.album?.cover_big || null,
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
