import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { mood, recordList } = await request.json();

  if (!mood || !recordList) {
    return new Response(JSON.stringify({ error: 'Missing mood or recordList' }), { status: 400 });
  }

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

  if (!resp.ok) {
    const error = await resp.text();
    return new Response(JSON.stringify({ error: 'Claude API error', detail: error }), { status: 502 });
  }

  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
