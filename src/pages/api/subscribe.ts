import type { APIRoute } from 'astro';
import { api } from '../../../convex/_generated/api';
import { BookWaitlistWelcome } from '../../emails/BookWaitlistWelcome';
import { NewsletterWelcome } from '../../emails/NewsletterWelcome';
import { getResend, getConvex, FROM_EMAIL, REPLY_TO } from '../../lib/clients';
import * as React from 'react';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
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

  // Insert into Convex (mutation handles duplicate check atomically)
  const convex = getConvex();
  let result: { status: 'subscribed' | 'already_subscribed' };

  try {
    result = await convex.mutation(api.subscribers.add, { email, list });
  } catch (err) {
    console.error('Convex mutation error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (result.status === 'already_subscribed') {
    return new Response(
      JSON.stringify({ ok: true, status: 'already_subscribed' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // New subscriber — sync to Resend + send welcome email
  // Resend is best-effort: if it fails, the subscriber is still saved in Convex
  try {
    const resend = getResend();

    const segmentId = list === 'book'
      ? import.meta.env.RESEND_BOOK_SEGMENT_ID
      : import.meta.env.RESEND_NEWSLETTER_SEGMENT_ID;

    const emailTemplate = list === 'book'
      ? React.createElement(BookWaitlistWelcome)
      : React.createElement(NewsletterWelcome);

    const subject = list === 'book'
      ? "You're on the list — Alex Russell"
      : "You're in — Alex Russell";

    const [{ error: contactError }, { error: emailError }] = await Promise.all([
      resend.contacts.create({
        email,
        unsubscribed: false,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }),
      resend.emails.send({
        from: FROM_EMAIL(),
        replyTo: REPLY_TO,
        to: email,
        subject,
        react: emailTemplate,
        headers: {
          'List-Unsubscribe': `<mailto:${REPLY_TO}?subject=unsubscribe>`,
        },
      }),
    ]);

    if (contactError) console.error('Resend contact error:', contactError);
    if (emailError) console.error('Resend email error:', emailError);
  } catch (err) {
    console.error('Resend failed (subscriber saved, email skipped):', err);
  }

  return new Response(
    JSON.stringify({ ok: true, status: 'subscribed' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
