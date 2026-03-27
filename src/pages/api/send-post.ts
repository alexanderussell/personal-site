import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { PostNotification } from '../../emails/PostNotification';
import * as React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

function getResend() {
  return new Resend(import.meta.env.RESEND_API_KEY);
}

function getConvex() {
  return new ConvexHttpClient(import.meta.env.CONVEX_URL);
}

// Read the raw markdown content of a post (strips frontmatter)
function readPostContent(type: string, slug: string): string | null {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const contentDir = path.resolve(__dirname, `../../content/${type}s`);

  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(contentDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      // Strip YAML frontmatter
      const match = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
      return match ? match[1].trim() : raw;
    }
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  // Simple auth: require a secret token to prevent unauthorized sends
  const authToken = import.meta.env.NEWSLETTER_SEND_TOKEN;
  const providedToken = request.headers.get('x-send-token');

  if (authToken && providedToken !== authToken) {
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

  if (!slug || !type || !['log', 'guide', 'experiment'].includes(type)) {
    return new Response(
      JSON.stringify({ error: 'slug and type (log|guide|experiment) are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Read the post content from disk
  const content = readPostContent(type, slug);
  if (!content && type !== 'experiment') {
    return new Response(
      JSON.stringify({ error: `Post not found: ${type}s/${slug}` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse title and description from frontmatter
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const contentDir = path.resolve(__dirname, `../../content/${type}s`);
  let title = slug;
  let description = '';

  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(contentDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const titleMatch = fm.match(/title:\s*["']?(.+?)["']?\s*$/m);
        const descMatch = fm.match(/description:\s*["']?(.+?)["']?\s*$/m);
        if (titleMatch) title = titleMatch[1];
        if (descMatch) description = descMatch[1];
      }
      break;
    }
  }

  const postUrl = `https://alexanderussell.com/${type}s/${slug}`;

  // Fetch all newsletter subscribers from Convex
  const convex = getConvex();
  let subscribers: Array<{ email: string }>;

  try {
    const allSubscribers = await convex.query(api.subscribers.listByList, { list: 'newsletter' });
    subscribers = allSubscribers;
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

  // Send to each subscriber
  const resend = getResend();
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const isExperiment = type === 'experiment';
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: `Alex Russell <${fromEmail}>`,
        replyTo: 'alex@collectivelymade.com',
        to: sub.email,
        subject: `${title} — new ${type}`,
        react: React.createElement(PostNotification, {
          title,
          type: type as 'log' | 'guide' | 'experiment',
          description,
          content: isExperiment ? undefined : (content || undefined),
          url: postUrl,
        }),
      });

      if (error) {
        console.error(`Failed to send to ${sub.email}:`, error);
        failed++;
      } else {
        sent++;
      }
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err);
      failed++;
    }
  }

  return new Response(
    JSON.stringify({ ok: true, sent, failed, total: subscribers.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
