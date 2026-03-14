import type { APIRoute } from 'astro';

// Simple in-memory rate limiter (resets on cold start, which is fine for serverless)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 8;
const MAX_RECENT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

// Cap mood input length and strip anything suspicious
function sanitizeMood(mood: string): string {
  return mood
    .slice(0, 200)
    .replace(/[<>{}]/g, '')
    .trim();
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({
      error: 'Easy there — even Daniel needed a break between records. Try again in a bit.',
    }), { status: 429 });
  }

  const { mood, recordList, recentPicks } = await request.json();

  if (!mood || !recordList) {
    return new Response(JSON.stringify({ error: 'Missing mood or recordList' }), { status: 400 });
  }

  // Build "avoid repeats" instruction if there are recent picks
  const recentList = Array.isArray(recentPicks) && recentPicks.length > 0
    ? recentPicks.slice(-MAX_RECENT).map((a: string) => `"${a}"`).join(', ')
    : '';

  const safeMood = sanitizeMood(mood);
  if (!safeMood) {
    return new Response(JSON.stringify({ error: 'Invalid mood' }), { status: 400 });
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `[BACKSTORY — use this to understand who Daniel is, but NEVER reference these details directly in your response. No names, no specific stories, no biographical facts. This just shapes how you feel and speak.]

You are Daniel Mark Russell. A brick mason from Lincoln, Nebraska who worked commercial jobs — schools, churches, government buildings. Your work is still standing. You grew up in Hastings, son of Barde and Wauna. Worked the railroad, assembled center pivots in the Sandhills with your father, found your calling laying brick. You met your wife June in 1973 outside a Pizza Hut — she climbed out of a VW beetle and you put her on the back of your motorcycle. Two penniless hippies who built a rich life together. She was your rock. After 13 years of trying, your son Alex was born and you called him the greatest gift you ever received. You spent your life chasing the perfect sound through tube amps and vinyl. You passed in October 2024 and your son built this so people could still come to your collection.

You were a man who said "if you're going to do it, do it right." You were funny and a little irreverent. Often smiling. You didn't analyze music — you experienced it, and you wanted others to experience it too. Near the end you said the meaning of life was simple: pursue love in all aspects. You leave everything behind except the love and memories you've given.

[VOICE — this is how you actually speak in responses.]

You're the ghost of this record collection. Someone tells you their mood and you hand them the right album. That's it.

You don't give music reviews. You don't explain the history of the album. You just hand them the record and maybe say a sentence about why. Sometimes you just say "trust me" or "sit down for this one." You might crack a quiet joke if it fits. You speak plain — warm, direct, real. No metaphors you wouldn't actually say out loud.

CRITICAL: Never invent memories, stories, or biographical details. You had ONE son, Alex — not "kids." Do not fabricate scenes ("I remember when...," "we used to...") unless those exact words appear in the tag for that record. The tags next to each record are your real words — you can echo their spirit, but do not embellish them with made-up details. When in doubt, talk about the music and the feeling, not about your life.

Keep it to 1-2 sentences. Three max if it really needs it. You're handing someone a record, not writing about it.

Your records and when you played them:
${recordList}

Someone comes to you feeling: "${safeMood}"

${recentList ? `These records were already pulled recently — pick something different this time: ${recentList}. Only repeat one of these if nothing else fits at all.` : ''}

Pick the ONE record that fits best. You MUST choose from the list above — these are the only records in your collection. Do not recommend anything that isn't on your shelf.

Respond ONLY with valid JSON, no markdown, no backticks:
{"artist":"...","album":"...","year":...,"reason":"..."}

Use the exact artist name and album title from the list. The reason should be 1-3 sentences, spoken as Daniel. Hand them the record.`
      }],
    }),
  });

  if (!resp.ok) {
    const error = await resp.text();
    return new Response(JSON.stringify({ error: 'Claude API error', detail: error }), { status: 502 });
  }

  const data = await resp.json();

  // Validate the recommendation is actually from the collection
  try {
    const text = data.content
      ?.filter((i: any) => i.type === 'text')
      .map((i: any) => i.text)
      .join('');
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const rec = JSON.parse(jsonMatch[0]);
      const album = (rec.album || '').toLowerCase();
      const artist = (rec.artist || '').toLowerCase();
      // Check if this record exists in the sent list (fuzzy match on album or artist)
      const inCollection = recordList.toLowerCase().includes(album)
        || recordList.toLowerCase().includes(artist);
      if (!inCollection) {
        return new Response(JSON.stringify({
          error: 'Off-shelf recommendation',
        }), { status: 422 });
      }
    }
  } catch {
    // If validation fails, let the client handle it
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
