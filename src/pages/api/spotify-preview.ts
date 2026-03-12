import type { APIRoute } from 'astro';

let tokenCache: { token: string; expires: number } | null = null;

async function getToken(): Promise<string | null> {
  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.token;

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(
        import.meta.env.SPOTIFY_CLIENT_ID + ':' + import.meta.env.SPOTIFY_CLIENT_SECRET
      ),
    },
    body: 'grant_type=client_credentials',
  });

  if (!resp.ok) return null;

  const data = await resp.json();
  tokenCache = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

export const GET: APIRoute = async ({ url }) => {
  const albumId = url.searchParams.get('albumId');
  if (!albumId) {
    return new Response(JSON.stringify({ error: 'Missing albumId' }), { status: 400 });
  }

  const token = await getToken();
  if (!token) {
    return new Response(JSON.stringify({ error: 'Auth failed' }), { status: 500 });
  }

  const resp = await fetch(`https://api.spotify.com/v1/albums/${encodeURIComponent(albumId)}/tracks?limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resp.ok) {
    return new Response(JSON.stringify({ url: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await resp.json();
  const track = (data.items || []).find((t: any) => t.preview_url);

  return new Response(JSON.stringify(
    track ? { url: track.preview_url, name: track.name } : { url: null }
  ), {
    headers: { 'Content-Type': 'application/json' },
  });
};
