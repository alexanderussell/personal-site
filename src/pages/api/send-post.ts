import type { APIRoute } from 'astro';
import { api } from '../../../convex/_generated/api';
import { PostNotification } from '../../emails/PostNotification';
import { getResend, getConvex, FROM_EMAIL, REPLY_TO } from '../../lib/clients';
import * as React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

type PostType = 'log' | 'guide' | 'experiment';
const VALID_TYPES: PostType[] = ['log', 'guide', 'experiment'];

function isValidType(t: string): t is PostType {
  return VALID_TYPES.includes(t as PostType);
}

// Read a post file once — returns title, description, and body content
function readPost(type: string, slug: string): { title: string; description: string; content: string } | null {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const contentDir = path.resolve(__dirname, `../../content/${type}s`);

  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(contentDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');

      let title = slug;
      let description = '';
      let content = raw;

      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (fmMatch) {
        const fm = fmMatch[1];
        content = fmMatch[2].trim();
        const titleMatch = fm.match(/title:\s*["']?(.+?)["']?\s*$/m);
        const descMatch = fm.match(/description:\s*["']?(.+?)["']?\s*$/m);
        if (titleMatch) title = titleMatch[1];
        if (descMatch) description = descMatch[1];
      }

      return { title, description, content };
    }
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const authToken = import.meta.env.NEWSLETTER_SEND_TOKEN;
  const providedToken = request.headers.get('x-send-token');

  if (!authToken || providedToken !== authToken) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { slug?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { slug, type } = body;

  if (!slug || !type || !isValidType(type)) {
    return new Response(
      JSON.stringify({ error: 'slug and type (log|guide|experiment) are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return new Response(
      JSON.stringify({ error: 'Invalid slug' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Read post — single file read for title, description, and content
  const post = readPost(type, slug);
  if (!post) {
    return new Response(
      JSON.stringify({ error: 'Post not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const postUrl = `https://alexanderussell.com/${type}s/${slug}`;
  const convex = getConvex();

  // Idempotency: check if this post was already sent
  try {
    const alreadySent = await convex.query(api.sentPosts.check, { slug, type });
    if (alreadySent) {
      return new Response(
        JSON.stringify({ ok: true, sent: 0, message: 'Already sent — skipping to prevent duplicates' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch {
    // sentPosts table might not exist yet — continue
  }

  // Fetch newsletter subscribers
  let subscribers: Array<{ email: string }>;
  try {
    subscribers = await convex.query(api.subscribers.listByList, { list: 'newsletter' });
  } catch (err) {
    console.error('Failed to fetch subscribers:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch subscribers' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (subscribers.length === 0) {
    return new Response(
      JSON.stringify({ ok: true, sent: 0, message: 'No newsletter subscribers yet' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Build email — render once, send to all
  const resend = getResend();
  const isExperiment = type === 'experiment';
  const emailProps = {
    title: post.title,
    type,
    description: post.description,
    content: isExperiment ? undefined : post.content,
    url: postUrl,
  };

  // Batch send — chunks of 50 with Promise.allSettled
  const BATCH_SIZE = 50;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((sub) =>
        resend.emails.send({
          from: FROM_EMAIL(),
          replyTo: REPLY_TO,
          to: sub.email,
          subject: `${post.title} — new ${type}`,
          react: React.createElement(PostNotification, emailProps),
          headers: {
            'List-Unsubscribe': `<mailto:${REPLY_TO}?subject=unsubscribe>`,
          },
        })
      )
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && !r.value.error) {
        sent++;
      } else {
        failed++;
        if (r.status === 'fulfilled' && r.value.error) {
          console.error('Resend error:', r.value.error);
        } else if (r.status === 'rejected') {
          console.error('Send failed:', r.reason);
        }
      }
    }
  }

  // Record that this post was sent (idempotency)
  try {
    await convex.mutation(api.sentPosts.record, { slug, type });
  } catch {
    // Non-fatal — the emails already went out
  }

  return new Response(
    JSON.stringify({ ok: true, sent, failed, total: subscribers.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
