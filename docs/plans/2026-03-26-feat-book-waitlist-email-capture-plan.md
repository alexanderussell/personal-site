---
title: Book Waitlist & Email Capture
type: feat
status: completed
date: 2026-03-26
origin: docs/brainstorms/2026-03-26-book-waitlist-brainstorm.md
---

# feat: Book Waitlist & Email Capture

## Overview

Add a book interest-validation system to the personal site: a `/book` landing page with email capture, a homepage CTA button linking to it, and a footer newsletter signup on all log/guide/experiment pages. All signups are stored via **Resend** (contact management + transactional welcome email) with **Convex** used for subscriber storage and duplicate detection. Two separate Resend segments distinguish book waitlist vs. newsletter subscribers.

**Goal:** Reach enough signups to validate demand before committing to writing the book.

---

## Problem Statement / Motivation

There is no existing email capture on the site. Before investing significant effort writing a book, the author wants to validate real interest through email signups — measuring demand, not assuming it. The site already has readers (via logs, guides, experiments); the infrastructure just needs to capture them.

---

## Proposed Solution

Four additive changes, no existing pages broken:

1. **`/api/subscribe`** — new Astro API route that checks for duplicates (Supabase), adds the contact to Resend, and sends a welcome email
2. **`/book` page** — static landing page with a CSS book animation and an inline email capture form (React component)
3. **Homepage CTA row** — a single extensible button row injected between the intro section and the timeline in `src/pages/index.astro`
4. **`<NewsletterSignup />` footer component** — reusable subscribe widget added at the bottom of `PostLayout.astro`

---

## Technical Considerations

### Resend — Segments, Not Audiences

The Resend `audienceId` field is **deprecated**. Contacts are now global entities. To separate book waitlist from newsletter subscribers, create two **segments** in the Resend dashboard and pass the appropriate segment ID at signup time.

```
RESEND_BOOK_SEGMENT_ID=seg_xxxxxxxxx
RESEND_NEWSLETTER_SEGMENT_ID=seg_yyyyyyyyy
```

When calling `resend.contacts.create()`, pass `segments: [{ id: segmentId }]`.

### Duplicate Detection — Supabase

The Resend API silently upserts duplicate contacts (no 409 error), so it cannot be used to detect "already subscribed." Instead, use the existing Supabase integration to store subscriber emails in a new `subscribers` table. Before calling Resend, check the table for the email:

- **Not found** → insert into Supabase, call Resend to add contact + send welcome email → return `{ ok: true, status: 'subscribed' }`
- **Already exists** → skip Resend → return `{ ok: true, status: 'already_subscribed' }` (the UI shows "you're already signed up")

This pattern matches the existing `moods.ts` Supabase usage and keeps Supabase as the source of truth for subscriber counts.

### Supabase Table

```sql
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  list text not null check (list in ('book', 'newsletter')),
  created_at timestamptz default now(),
  unique (email, list)
);
```

A composite unique constraint on `(email, list)` allows the same email to appear in both lists independently.

### Rate Limiting

Use the same in-memory `Map` pattern already present in `/api/recommend.ts`. Limit to 3 subscribe attempts per IP per 60 seconds. This is sufficient for a personal site and adds no new dependencies.

### React Email Template

Install `@react-email/components`. Write two simple templates:
- `src/emails/BookWaitlistWelcome.tsx`
- `src/emails/NewsletterWelcome.tsx`

Pass the template directly to `resend.emails.send({ react: <BookWaitlistWelcome /> })` — the SDK renders it automatically.

### Book Animation

A CSS-only floating book built as an Astro/SVG component — no dependencies. A simplified book shape (cover + spine) in the site's token colors (`--color-text-primary`, `--color-border`) with a subtle `translateY` oscillation (`@keyframes float`: 0% → -6px → 0%, 3s ease-in-out infinite). This fits the site's minimalist aesthetic and requires zero new packages.

### Environment Variables

Add to `.env` (and document for production in Vercel dashboard):

```ini
RESEND_API_KEY=re_xxxxxxxxx
RESEND_BOOK_SEGMENT_ID=seg_xxxxxxxxx
RESEND_NEWSLETTER_SEGMENT_ID=seg_yyyyyyyyy
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` already exist.

Access pattern: `import.meta.env.RESEND_API_KEY` (consistent with all other env vars in the codebase).

### `/book` Page — Static Prerendering

Add `export const prerender = true` at the top of `src/pages/book.astro`. The page has no server-side data — the form is a client-side React component. This is consistent with `index.astro`.

### Form Feedback States

The `<SubscribeForm />` React component manages three states:
- `idle` — email input + submit button
- `loading` — input disabled, button shows spinner
- `success` — "You're on the list — I'll be in touch." (book) or equivalent (newsletter)
- `already_subscribed` — "You're already signed up."
- `error` — "Something went wrong. Try again."

No page reload; inline state transitions matching the site's fade-in animation conventions.

---

## System-Wide Impact

- **No existing pages modified** except `index.astro` (one new section added) and `PostLayout.astro` (one new component appended) — both are purely additive
- **New API route** `/api/subscribe` is server-rendered (SSR) and isolated; no middleware changes needed
- **New Supabase table** `subscribers` — migration must be applied before deployment
- **New env vars** — three new keys must be added to Vercel before deploying

---

## Implementation Phases

### Phase 1: Infrastructure

**Files to create/modify:**
- `src/pages/api/subscribe.ts` — new API route
- `src/emails/BookWaitlistWelcome.tsx` — email template
- `src/emails/NewsletterWelcome.tsx` — email template
- `.env` — add `RESEND_API_KEY`, `RESEND_BOOK_SEGMENT_ID`, `RESEND_NEWSLETTER_SEGMENT_ID`
- Supabase migration — create `subscribers` table

**Tasks:**
- [ ] Create Resend account, generate API key
- [ ] Create two Resend segments (`book-waitlist`, `newsletter`), copy segment IDs
- [ ] Configure sending domain in Resend (or use default `onboarding@resend.dev` for initial testing)
- [x] Run Supabase migration to create `subscribers` table with `(email, list)` unique constraint — SQL at `docs/migrations/create_subscribers_table.sql`
- [x] `npm install resend @react-email/components`
- [x] Write `src/pages/api/subscribe.ts`
- [x] Write `src/emails/BookWaitlistWelcome.tsx`
- [x] Write `src/emails/NewsletterWelcome.tsx`

**`src/pages/api/subscribe.ts` skeleton:**

```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { BookWaitlistWelcome } from '../../emails/BookWaitlistWelcome';
import { NewsletterWelcome } from '../../emails/NewsletterWelcome';

// In-memory rate limiter — same pattern as /api/recommend.ts
const requests = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean { /* ... */ }

function getResend() {
  return new Resend(import.meta.env.RESEND_API_KEY);
}
function getSupabase() {
  return createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_ANON_KEY);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? 'unknown';
  if (isRateLimited(ip)) return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });

  const { email, list } = await request.json();
  // validate email + list ('book' | 'newsletter')

  // 1. Check duplicate in Supabase
  // 2. If duplicate → return { ok: true, status: 'already_subscribed' }
  // 3. Insert into Supabase subscribers table
  // 4. Add to Resend contacts with appropriate segment
  // 5. Send welcome email via Resend
  // 6. Return { ok: true, status: 'subscribed' }
};
```

---

### Phase 2: `/book` Page

**Files to create:**
- `src/pages/book.astro`
- `src/components/SubscribeForm.tsx` — reusable React form (takes `list` prop: `'book' | 'newsletter'`)
- `src/components/BookAnimation.astro` — CSS floating book SVG

**Tasks:**
- [x] Create `src/components/BookAnimation.astro` — SVG book + `@keyframes float` CSS animation
- [x] Create `src/components/SubscribeForm.tsx` — controlled input, 5 states (idle/loading/success/already_subscribed/error), POSTs to `/api/subscribe` with `{ email, list }`
- [x] Create `src/pages/book.astro` with:
  - `export const prerender = true`
  - `<BaseLayout>` wrapper
  - `<BookAnimation />` centered above the fold
  - Heading: "My Upcoming Book"
  - Body: "Sign up to receive updates on my upcoming book."
  - `<SubscribeForm list="book" client:load />`

**`src/components/SubscribeForm.tsx` state sketch:**

```tsx
// src/components/SubscribeForm.tsx
type Status = 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error';

export function SubscribeForm({ list }: { list: 'book' | 'newsletter' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit() {
    setStatus('loading');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, list }),
    });
    const data = await res.json();
    if (!res.ok) { setStatus('error'); return; }
    setStatus(data.status === 'already_subscribed' ? 'already_subscribed' : 'success');
  }

  // render input + button when idle/loading
  // render inline message when success/already_subscribed/error
}
```

---

### Phase 3: Homepage CTA Row

**Files to modify:**
- `src/pages/index.astro` — inject CTA row between intro `</section>` and `<!-- Timeline -->`

**Tasks:**
- [x] Add a flex row `<div class="flex gap-3 mt-6">` after the closing `</script>` tag and before the timeline section
- [x] Add a single styled anchor `<a href="/book">` with the site's border/mono style
- [x] Button label: "My Book"
- [x] Row is a flex container — future buttons can be appended without restructuring

**Injection point in `src/pages/index.astro`:**

```astro
<!-- After </script> (line 121), before timeline section -->
<div class="flex gap-3 mt-2">
  <a href="/book" class="font-mono text-[12px] uppercase tracking-[0.12em] text-text-secondary border border-border px-4 py-2 rounded-sm hover:text-text-primary hover:border-accent transition-all duration-300">
    My Book
  </a>
</div>
```

---

### Phase 4: Post Footer Newsletter

**Files to modify:**
- `src/layouts/PostLayout.astro` — inject `<NewsletterSignup />` after the prose div

**Tasks:**
- [x] Add `<SubscribeForm list="newsletter" client:load />` inside `PostLayout.astro` after the prose div
- [x] Wrap in a div with top border divider and `mt-16` spacing
- [x] Label: "Stay in the loop" heading and "Get notified when I publish new logs and guides." body

---

## Acceptance Criteria

### API — `/api/subscribe`
- [ ] `POST /api/subscribe` with `{ email: string, list: 'book' | 'newsletter' }` returns `{ ok: true, status: 'subscribed' }` for new signups
- [ ] Returns `{ ok: true, status: 'already_subscribed' }` when email + list already exists in Supabase
- [ ] Returns `400` for missing or malformed email
- [ ] Returns `400` for invalid `list` value
- [ ] Returns `429` after 3 requests from the same IP within 60 seconds
- [ ] New contact appears in Resend with the correct segment
- [ ] Welcome email is sent on first signup (not on duplicate)
- [ ] No welcome email sent for duplicate signups

### `/book` Page
- [ ] Page accessible at `/book`
- [ ] Book animation renders and floats smoothly (no jank, respects `prefers-reduced-motion`)
- [ ] Form shows email input and submit button in idle state
- [ ] Submit button is disabled and shows loading indicator while request is in flight
- [ ] Shows "You're on the list — I'll be in touch." on success
- [ ] Shows "You're already signed up." on duplicate
- [ ] Shows "Something went wrong. Try again." on API error
- [ ] Form is functional on mobile

### Homepage CTA Row
- [ ] A button labeled "My Book" (or "Book Waitlist") appears between the intro paragraphs and the timeline section
- [ ] Clicking it navigates to `/book`
- [ ] Row renders as a flex container — extensible for future buttons
- [ ] Styling matches site conventions (mono font, border, subtle hover)
- [ ] Button participates in the existing stagger fade-in animation

### Post Footer Newsletter
- [ ] Subscribe form appears at the bottom of all logs, guides, and experiments pages
- [ ] Heading and body copy clearly indicate this is a newsletter (not the book waitlist)
- [ ] Same `SubscribeForm` component with `list="newsletter"` — all states work identically to the book form
- [ ] Visually separated from post content with a horizontal rule or spacing

### Email Templates
- [ ] Book waitlist welcome email arrives in inbox within ~30s of signup
- [ ] Newsletter welcome email arrives on first newsletter signup
- [ ] Both emails render correctly in Gmail and Apple Mail (at minimum)
- [ ] Plain-text fallback present (React Email generates this automatically from `text` prop)

---

## Dependencies & Risks

| Item | Notes |
|---|---|
| Resend account + sending domain | Must verify a sending domain in Resend before welcome emails work in production (without it, only `onboarding@resend.dev` addresses can receive) |
| Supabase migration | New `subscribers` table must be applied before deploying Phase 1 |
| New env vars on Vercel | `RESEND_API_KEY`, `RESEND_BOOK_SEGMENT_ID`, `RESEND_NEWSLETTER_SEGMENT_ID` must be added to Vercel project settings |
| `audienceId` deprecation | Do NOT use `audienceId` on `resend.contacts.create()` — use `segments` instead. The legacy field still exists in the TypeScript types as `LegacyCreateContactOptions` but will fail |
| In-memory rate limiter | Effective for personal site scale; does not persist across Vercel cold starts. Acceptable risk |

---

## Sources & References

### Origin
- **Brainstorm:** [docs/brainstorms/2026-03-26-book-waitlist-brainstorm.md](../brainstorms/2026-03-26-book-waitlist-brainstorm.md)
  - Key decisions carried forward: Resend as email service; two separate segments (not audiences); welcome email on signup; "already subscribed" UI state; YAGNI scope (no drip campaigns, no analytics dashboard)

### Internal References
- Rate limiter pattern: `src/pages/api/recommend.ts`
- Supabase client pattern: `src/pages/api/moods.ts`
- API route shape (POST, env vars, Response): `src/pages/api/recommend.ts`
- CTA button style reference: `src/components/VinylPreview.astro` (`.vinyl-preview-cta` class)
- Post layout injection point: `src/layouts/PostLayout.astro:134`
- Homepage injection point: `src/pages/index.astro:121`
- Design tokens: `src/styles/global.css` (`--color-accent`, `--color-border`, `--color-text-secondary`, `--font-mono`)

### External References
- Resend Node.js SDK: https://resend.com/docs/send-with-nodejs
- Resend Contacts API: https://resend.com/docs/api-reference/contacts/create-contact
- Resend Segments: https://resend.com/docs/dashboard/segments/introduction
- React Email components: https://react.email/docs/components/html
