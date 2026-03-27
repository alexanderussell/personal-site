# Book Waitlist & Email Capture

**Date:** 2026-03-26
**Status:** Ready for planning

---

## What We're Building

A lightweight book interest-validation system with three parts:

1. **Homepage CTA row** — a single extensible button row placed between the intro paragraphs and the timeline, linking to `/book`
2. **`/book` page** — a focused landing page with a book animation, a one-liner pitch, and an email capture form
3. **Footer newsletter signup** — a reusable subscribe component added to the bottom of all logs, guides, and experiments pages
4. **`/api/subscribe` endpoint** — a new Astro API route that writes signups to a Resend Audience

**Goal:** Capture enough email signups to validate real interest before committing to writing the book.

---

## Why This Approach

### Email service: Resend

- Developer-native REST API — same pattern as the existing `/api/recommend` endpoint
- Audiences/Contacts feature covers list management without a separate service
- React Email companion library matches the stack for future email templates
- Free tier (1,000 contacts, 3,000 emails/month) is sufficient for validation
- One integration covers both the `/book` waitlist and the footer newsletter

### Homepage placement: CTA row between intro and timeline

- The intro establishes identity and context; the CTA row immediately offers the most direct call-to-action before the reader scrolls into content history
- Placing it above the timeline keeps it visible without burying it
- A row structure (extensible flex container) allows future buttons (e.g., newsletter, resume) without redesign

### `/book` page: animation + email capture only

- Minimalist — no fake details about a book that doesn't exist yet
- The animation signals seriousness/effort; the copy is honest ("sign up to receive updates on my upcoming book")
- No social proof, no pricing, no chapters — just enough to convert curious visitors
- YAGNI: skip a full marketing page until there's something to market

### Footer newsletter on content pages

- Readers who finish a log or guide are the highest-intent audience
- A subtle, non-intrusive subscribe component at the end of posts is the right moment to capture them
- Same Resend Audience as the book waitlist — one unified list, segmented by source

---

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Email service | Resend | Developer-native, free tier covers validation, handles both use cases |
| List strategy | Two separate Resend audiences | Book waitlist and newsletter are distinct — enables different messaging per group |
| Book animation | Decided during planning | Pick style (3D CSS, SVG, floating) that fits the site's minimalist aesthetic |
| CTA row | Single button to start | Start with just the book CTA; row is extensible via flex layout |
| `/book` page copy | Honest/minimal | "Sign up to receive updates on my upcoming book" — no overpromising |
| API endpoint | `/api/subscribe` | POST `{ email, list }` → Resend Contacts API, same pattern as `/api/recommend` |
| Form feedback | Inline success/error state | No page reload; React component handles state |
| Welcome email | Yes, simple confirmation | "You're on the list — I'll be in touch." Sent via Resend on signup for both lists |
| Duplicate signups | Show "you're already signed up" | Friendly acknowledgment rather than silent success |

---

## Open Questions

_None remaining._

## Resolved Questions

- **Book animation style**: Decided during planning based on what fits the site's minimalist aesthetic
- **Confirmation email**: Yes — a simple "You're on the list" transactional email sent via Resend on signup
- **List strategy**: Two separate Resend audiences (book waitlist vs. newsletter), enabling different messaging per group
- **Duplicate handling**: Show "you're already signed up" — friendly acknowledgment rather than silent success

---

## What's Out of Scope

- Full book marketing page (chapters, pricing, social proof)
- Email sequences or drip campaigns
- Subscriber management UI
- Open rate tracking / analytics dashboard
- Multiple audiences or segmented sends
