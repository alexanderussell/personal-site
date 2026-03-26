import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { BookWaitlistWelcome } from '../../emails/BookWaitlistWelcome';
import { NewsletterWelcome } from '../../emails/NewsletterWelcome';
import * as React from 'react';

// In-memory rate limiter — same pattern as /api/recommend.ts
// Resets on cold start, which is acceptable for a personal site
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 1000; // 1 minute

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

function getResend() {
  return new Resend(import.meta.env.RESEND_API_KEY);
}

function getSupabase() {
  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    clientAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again in a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { email?: string; list?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { email, list } = body;

  if (!email || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: 'A valid email address is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (list !== 'book' && list !== 'newsletter') {
    return new Response(
      JSON.stringify({ error: 'Invalid list. Must be "book" or "newsletter".' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const supabase = getSupabase();

  // Check for duplicate
  const { data: existing, error: lookupError } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', email)
    .eq('list', list)
    .maybeSingle();

  if (lookupError) {
    console.error('Supabase lookup error:', lookupError);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (existing) {
    return new Response(
      JSON.stringify({ ok: true, status: 'already_subscribed' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Insert into Supabase
  const { error: insertError } = await supabase
    .from('subscribers')
    .insert({ email, list });

  if (insertError) {
    // Handle race condition: unique constraint violation means already subscribed
    if (insertError.code === '23505') {
      return new Response(
        JSON.stringify({ ok: true, status: 'already_subscribed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Supabase insert error:', insertError);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resend = getResend();

  // Add contact to the appropriate Resend segment
  const segmentId =
    list === 'book'
      ? import.meta.env.RESEND_BOOK_SEGMENT_ID
      : import.meta.env.RESEND_NEWSLETTER_SEGMENT_ID;

  const { error: contactError } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(segmentId && segmentId !== 'seg_placeholder_replace_with_book_segment_id' && segmentId !== 'seg_placeholder_replace_with_newsletter_segment_id'
      ? { segments: [{ id: segmentId }] }
      : {}),
  });

  if (contactError) {
    console.error('Resend contact error:', contactError);
    // Don't fail the request — the subscriber is saved in Supabase
    // Resend sync can be retried manually if needed
  }

  // Send welcome email
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const emailTemplate =
    list === 'book'
      ? React.createElement(BookWaitlistWelcome)
      : React.createElement(NewsletterWelcome);

  const subject =
    list === 'book'
      ? "You're on the list — Alex Russell"
      : "You're in — Alex Russell";

  const { error: emailError } = await resend.emails.send({
    from: `Alex Russell <${fromEmail}>`,
    to: email,
    subject,
    react: emailTemplate,
  });

  if (emailError) {
    console.error('Resend email error:', emailError);
    // Don't fail — subscriber is saved, email is best-effort
  }

  return new Response(
    JSON.stringify({ ok: true, status: 'subscribed' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
