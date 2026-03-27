---
title: "Code Review: Auth Bypass, Path Traversal, and API Hardening for Newsletter System"
date: 2026-03-27
module:
  - src/pages/api (send-post.ts, subscribe.ts, moods.ts)
  - src/lib/clients.ts
  - src/components/SubscribeForm.tsx
  - src/layouts/PostLayout.astro
  - convex (schema.ts, sentPosts.ts)
problem_type:
  - security-issues
  - code-quality
severity: critical
component:
  - send-post API route
  - moods API route
  - subscribe API route
  - SubscribeForm React component
  - PostLayout Astro layout
  - Convex sentPosts table
  - src/lib/clients shared module
tags:
  - security
  - auth-bypass
  - path-traversal
  - input-validation
  - idempotency
  - email-batching
  - accessibility
  - code-deduplication
  - convex
  - resend
  - newsletter
  - list-unsubscribe
  - hydration-deferral
status: resolved
---

# Code Review: Auth Bypass, Path Traversal, and API Hardening

A multi-agent code review (TypeScript, security, performance, simplicity) found 12 issues across P1/P2/P3 severity. All were fixed in two commits: `e801fc7` (P1 security) and `f5941b1` (P2/P3 improvements).

## Problem

After shipping the book waitlist, newsletter, and moods migration features, a comprehensive review revealed:

- **3 critical security issues** in the API layer
- **5 functional/performance issues** that would cause failures at scale
- **4 code quality issues** creating maintenance overhead

## Root Causes

1. **Fail-open auth pattern** — the send-post endpoint's token check silently allowed all requests when the env var was unset
2. **Unsanitized filesystem input** — the slug parameter went straight into `path.join` with no validation
3. **Inconsistent error handling** — some routes wrapped `request.json()` in try/catch, others didn't
4. **Sequential external calls** — emails sent one-at-a-time in a for loop
5. **No idempotency** — duplicate endpoint calls = duplicate emails to every subscriber
6. **Duplicated code** — same client factories copy-pasted across 3 files

## Solutions Applied

### P1 — Critical Security (commit `e801fc7`)

#### 1. Auth Bypass — Fail-Closed Token Check

**File:** `src/pages/api/send-post.ts:51`

```ts
// BEFORE (fail-open — missing token = open door)
if (authToken && providedToken !== authToken) { ... }

// AFTER (fail-closed — missing token = blocked)
if (!authToken || providedToken !== authToken) { ... }
```

The `!authToken ||` at the front ensures a missing env var rejects the request instead of skipping the check entirely.

#### 2. Path Traversal — Slug Sanitization

**File:** `src/pages/api/send-post.ts:77`

```ts
if (!/^[a-z0-9-]+$/.test(slug)) {
  return new Response(
    JSON.stringify({ error: 'Invalid slug' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
```

Rejects dots, slashes, and any characters that could traverse directories. Applied before any filesystem access.

#### 3. Uncaught JSON Parse + Input Limits

**File:** `src/pages/api/moods.ts:21-39`

```ts
let body: { mood?: string; album?: string };
try {
  body = await request.json();
} catch {
  return new Response(
    JSON.stringify({ error: 'Invalid request body' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
const { mood, album } = body;
if (!mood || typeof mood !== 'string' || mood.length > 500) { ... }
```

### P2 — Functional Improvements (commit `f5941b1`)

#### 4. Batch Email Sending

**File:** `src/pages/api/send-post.ts:140-173`

Replaced sequential `for` loop with chunked `Promise.allSettled`:

```ts
const BATCH_SIZE = 50;
for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
  const batch = subscribers.slice(i, i + BATCH_SIZE);
  const results = await Promise.allSettled(
    batch.map((sub) => resend.emails.send({ ... }))
  );
  // track sent/failed per result
}
```

`Promise.allSettled` (not `Promise.all`) ensures one failure doesn't abort the batch.

#### 5. Idempotency via sentPosts Table

**Files:** `convex/schema.ts`, `convex/sentPosts.ts`, `src/pages/api/send-post.ts:97-107`

New Convex table tracks which posts have been emailed. Pre-send query prevents duplicates:

```ts
const alreadySent = await convex.query(api.sentPosts.check, { slug, type });
if (alreadySent) {
  return Response({ message: 'Already sent — skipping to prevent duplicates' });
}
// ... send emails ...
await convex.mutation(api.sentPosts.record, { slug, type });
```

#### 6. Merged Double File Read

**File:** `src/pages/api/send-post.ts:19-46`

Previously read each post file twice (once for body, once for frontmatter). Consolidated into a single `readPost()` function returning `{ title, description, content }`.

#### 7. Form Accessibility

**File:** `src/components/SubscribeForm.tsx:67`

```tsx
// BEFORE: invisible to autofill, screen readers, keyboard
<div className="subscribe-form">
  <input onKeyDown={handleKeyDown} />
  <button type="button" onClick={handleSubmit}>

// AFTER: proper form semantics
<form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input required />
  <button type="submit">
```

#### 8. Deferred React Hydration

**File:** `src/layouts/PostLayout.astro:87`

Changed `client:load` to `client:visible` on the newsletter SubscribeForm. Defers ~40KB of React hydration until the form scrolls into view.

### P3 — Code Quality (commit `f5941b1`)

#### 9. Shared Client Utilities

**File:** `src/lib/clients.ts`

Extracted `getResend()`, `getConvex()`, `FROM_EMAIL()`, and `REPLY_TO` — eliminates 3x duplication across API routes.

#### 10. Removed Redundant Rate Limiter

Stripped the in-memory rate limiter from `subscribe.ts`. Convex's atomic dedup mutation (`already_subscribed`) is sufficient for a personal site.

#### 11. List-Unsubscribe Header

Added `List-Unsubscribe` mailto header to all outgoing emails for CAN-SPAM/GDPR compliance:

```ts
headers: {
  'List-Unsubscribe': `<mailto:${REPLY_TO}?subject=unsubscribe>`,
},
```

## Prevention Rules for New API Routes

1. **Auth**: Always fail-closed — `if (!secret || token !== secret)` with the negation first
2. **Path safety**: Validate slugs with `/^[a-z0-9-]+$/` before any filesystem access
3. **Body parsing**: Always wrap `request.json()` in try/catch
4. **Fan-out calls**: Use `Promise.allSettled` with batching for N-recipient operations
5. **Idempotency**: Track completed operations in persistent storage before confirming
6. **Shared clients**: Import from `src/lib/clients.ts`, never duplicate factory functions
7. **Forms**: Use `<form>` with `type="submit"`, never `<div>` with `onClick`

## Related Documentation

- [Brainstorm: Book Waitlist](../../brainstorms/2026-03-26-book-waitlist-brainstorm.md) — origin of the email capture feature
- [Plan: Book Waitlist & Email Capture](../../plans/2026-03-26-feat-book-waitlist-email-capture-plan.md) — implementation plan
- [Simplify: Email Capture Feature Branch](../code-quality/simplify-email-capture-feature-branch.md) — earlier code quality review (TOCTOU race, shared styles, Promise.all)

## Review Agents Used

- kieran-typescript-reviewer
- security-sentinel
- performance-oracle
- code-simplicity-reviewer
- learnings-researcher
