# HANDOFF: Ask My Dad's Record Collection → vinyl.alexanderrussell.com

## What This Is

An interactive experiment for alexanderrussell.com (Experiments content pillar). Visitors describe their mood, and an AI — speaking as Daniel Russell, a brick mason and audiophile — pulls a vinyl record from a curated 40-album collection. A generative art engine creates unique album art per genre. A 30-second Spotify preview auto-plays when the needle drops. Anonymous mood history accumulates across visitors over time.

**Live URL target:** vinyl.alexanderrussell.com (subdomain) OR alexanderrussell.com/experiments/vinyl

---

## Existing Site Stack

- Astro 5.x + MDX
- Tailwind CSS 4.x
- Deployed on Vercel
- Three content pillars: Logs, Guides, Experiments

---

## Files to Integrate

### 1. `record-collection.jsx` (provided)
The full React component. Currently self-contained with inline styles. This is the prototype — it works as-is but needs the following adaptations for production:

### 2. This handoff doc (`HANDOFF.md`)

---

## Environment Variables Needed

Add these to `.env` and Vercel project settings:

```
SPOTIFY_CLIENT_ID=1604decab0a0489d87698f7f7c9f93ab
SPOTIFY_CLIENT_SECRET=090d69da8d9d4034b0958c38b7921fed
ANTHROPIC_API_KEY=<your anthropic api key>
```

**CRITICAL:** The prototype currently has the Spotify credentials hardcoded in the frontend component (`SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` constants near line 330). These MUST be removed from the client-side code and moved to server-side API routes before deploying.

---

## Architecture: What Needs to Change for Production

### A. Create two Vercel serverless API routes

The prototype makes two external API calls directly from the browser:
1. **Spotify** (auth + track preview fetch) — credentials exposed in client JS
2. **Anthropic Claude API** — currently relies on Claude.ai's built-in proxy

Both need to move server-side.

#### Route 1: `/api/spotify-preview.ts`

```typescript
// src/pages/api/spotify-preview.ts (Astro API route)
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

  const data = await resp.json();
  tokenCache = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

export const GET: APIRoute = async ({ url }) => {
  const albumId = url.searchParams.get('albumId');
  if (!albumId) return new Response(JSON.stringify({ error: 'Missing albumId' }), { status: 400 });

  const token = await getToken();
  if (!token) return new Response(JSON.stringify({ error: 'Auth failed' }), { status: 500 });

  const resp = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await resp.json();
  const track = (data.items || []).find((t: any) => t.preview_url);

  return new Response(JSON.stringify(
    track ? { url: track.preview_url, name: track.name } : { url: null }
  ), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

#### Route 2: `/api/recommend.ts`

```typescript
// src/pages/api/recommend.ts (Astro API route)
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { mood, recordList } = await request.json();

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are the ghost of a record collection. You belong to Daniel, a brick mason and audiophile who spent decades building this collection. You speak warmly but plainly, like a craftsman who knows his materials. No pretension — just someone who deeply loved music and understood that the right album at the right moment is a kind of shelter.

Your records and when you played them:
${recordList}

Someone comes to you feeling: "${mood}"

Pick the ONE record that fits best. Consider both the music and the personal context of when Daniel played it. Respond ONLY with valid JSON, no markdown, no backticks:
{"artist":"...","album":"...","year":...,"reason":"..."}

The reason should be 2-3 sentences max. Speak as Daniel would — direct, warm, a man who worked with his hands and chose his words carefully. You're handing someone a record, not writing an essay.`,
      }],
    }),
  });

  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### B. Update the React component to use API routes

In `record-collection.jsx`, replace the direct API calls:

1. **Remove** the `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` constants and the `getSpotifyToken()` function entirely.

2. **Replace** `getPreviewUrl(spotifyId)` with:
```javascript
async function getPreviewUrl(spotifyId) {
  try {
    const resp = await fetch(`/api/spotify-preview?albumId=${spotifyId}`);
    const data = await resp.json();
    return data.url ? data : null;
  } catch (e) {
    return null;
  }
}
```

3. **Replace** the `fetch("https://api.anthropic.com/v1/messages", ...)` call in `fetchRecommendation` with:
```javascript
const response = await fetch('/api/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mood: moodText, recordList }),
});
```

### C. Create the Astro page

```astro
---
// src/pages/experiments/vinyl.astro (or use as subdomain index)
import Layout from '../../layouts/BaseLayout.astro';
import RecordCollection from '../../components/experiments/RecordCollection.jsx';
---

<Layout title="Ask My Dad's Record Collection" description="Tell it your mood. It'll pull the right record.">
  <RecordCollection client:load />
</Layout>
```

**Important:** Use `client:load` (not `client:visible`) since this is the entire page content.

### D. Mood History / Persistent Storage

The prototype uses `window.storage` (Claude.ai's artifact storage API) for the mood wall. This won't exist in production. Replace with one of:

- **Vercel KV (Redis)** — simplest, ~free tier covers it. Create a `/api/moods` route for GET/POST.
- **Supabase** — you already use this for RenovateOS, so the infra is familiar. A single `moods` table with `mood text, album text, created_at timestamp`.
- **JSON file on disk** — dirtiest but works for low traffic. Write to a JSON file from the API route.

The storage calls in the component are:
- `window.storage.get("mood-history", true)` — load on mount
- `window.storage.set("mood-history", JSON.stringify(updated), true)` — save after each recommendation

Replace these with fetch calls to your `/api/moods` route.

---

## Component Architecture Overview

```
RecordCollection (main app)
├── State: mood, result, isSpinning, showResult, moodHistory, currentView
├── Views: "turntable" (Ask) | "shelf" (Browse)
│
├── VinylRecord — Canvas-based disc with drag-to-spin
│   └── Uses artCanvasRef for generative center label art
│
├── Tonearm — SVG, animates into playing position
│
├── SpotifyPlayer — Fetches 30s preview, native <audio> element
│   └── Auto-plays when isSpinning + preview loaded
│
├── ShelfView — Genre-grouped record spines, click to play
│
├── MoodWall — Anonymous mood cloud from persistent storage
│
└── generateGenreArt() — Genre-aware canvas art generator
    └── 7 visual modes: smoky, warm, groovy, bold, organic, electric, raw
```

---

## Styling Notes

- All styling is currently inline React `style={}` objects — no Tailwind classes
- Fonts: Georgia (serif body), Courier New (monospace labels)
- Color palette: warm browns/golds on near-black (#0a0808) background
- The component handles its own `*` reset — in the Astro layout, you may want to scope this or remove it if your base styles handle resets
- The `<style>` block at the bottom has keyframe animations (`spin`, `fadeUp`, `pulse`) — move these to a CSS file or `<style is:global>` in the Astro page if preferred

---

## Record Collection Data

40 records with fields: `artist, album, year, genre, tag, spotifyId`

The `tag` is the most important field for voice quality — it's what Daniel would say about when/why he played the record. It feeds directly into the Claude prompt. When Alex adds his father's actual records, the tag is where the personal magic happens.

To add records: push new objects to the `CURATED_RECORDS` array. Get the Spotify album ID from the URL: `open.spotify.com/album/{THIS_PART}`.

---

## Subdomain Setup (if using vinyl.alexanderrussell.com)

In Vercel:
1. Add `vinyl.alexanderrussell.com` as a domain in project settings
2. Add CNAME record in DNS pointing to `cname.vercel-dns.com`
3. If running as a separate Vercel project, deploy just this experiment standalone
4. If running within the main Astro site, use Vercel rewrites in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/experiments/vinyl/$1", "has": [{ "type": "host", "value": "vinyl.alexanderrussell.com" }] }
  ]
}
```

---

## Quick Start for Claude Code

Paste this as your first prompt:

> Read HANDOFF.md in the repo root. I need you to integrate the record collection experiment (record-collection.jsx) into my Astro 5 + MDX site. Create the two API routes for Spotify and Claude, update the component to use them instead of direct API calls, remove the hardcoded Spotify credentials, set up the Astro page, and replace the window.storage calls with a Supabase-backed /api/moods endpoint. The env vars are already in .env.

---

## Known Issues / Future Work

- **Some Spotify albums don't have preview URLs** — the player gracefully falls back to a "Listen on Spotify" link, but this is becoming more common as Spotify restricts previews
- **Spotify IDs are hardcoded** — once the API key is working server-side, you could add a dynamic search fallback for records without a spotifyId
- **Mobile touch handling** — drag-to-spin works but could be smoother on mobile; consider adding velocity/momentum
- **OG image / meta tags** — would be great to generate a custom OG image showing the vinyl + "Ask My Dad's Record Collection" for social sharing
- **Album art as full display** — the generative art currently only appears on the vinyl center label; could be expanded to a larger view or used as the page background
