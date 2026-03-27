---
title: "Book waitlist email capture: simplification review fixes"
date: 2026-03-26
problem_type: code-quality
symptoms:
  - Duplicate style constants (~100 lines) copied across two email templates
  - SELECT before INSERT created a race window (TOCTOU) for duplicate subscriber check
  - Resend API calls awaited sequentially despite being independent operations
  - useCallback wrapping handleSubmit with a state dependency that changes every keystroke, negating memoization
  - Sentinel placeholder strings used as production guards instead of falsy checks
component: "src/pages/api/subscribe.ts, src/components/SubscribeForm.tsx, src/emails/"
tags:
  - astro
  - react
  - supabase
  - resend
  - email
  - api-route
  - memoization
  - concurrency
  - deduplication
severity: medium
status: resolved
---

# Book Waitlist Email Capture — Simplification Review Fixes

Five code quality issues were identified and fixed during a `/simplify` review of the `feat/book-waitlist-email-capture` branch. All fixes were applied to the email subscription feature spanning `src/pages/api/subscribe.ts`, `src/components/SubscribeForm.tsx`, and `src/emails/`.

## Root Cause

Five independent simplification gaps accumulated during initial feature development: shared style objects were copy-pasted across email templates rather than extracted; a redundant pre-flight SELECT was left in front of an INSERT that already had a unique constraint and duplicate error handling; two independent Resend API calls were awaited sequentially without cause; a `useCallback` was applied to a function whose only dependency was rapidly-changing input state, making memoization self-defeating; and a placeholder sentinel string from development was left as a runtime guard in production code.

## Solution

### 1. Extract shared email styles

All eight shared `React.CSSProperties` constants were moved into `src/emails/styles.ts` and imported by both templates, removing ~100 lines of duplication.

```ts
// src/emails/styles.ts
import type * as React from 'react';

export const body: React.CSSProperties = {
  backgroundColor: '#f7f6f3',
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  margin: 0, padding: 0,
};
// ... container, heading, paragraph, hr, footer, unsubscribe, link
```

```tsx
// BookWaitlistWelcome.tsx / NewsletterWelcome.tsx
import { body, container, heading, paragraph, hr, footer, unsubscribe, link } from './styles';
```

### 2. Remove redundant SELECT before INSERT

The pre-check SELECT against `subscribers` was removed. The database unique constraint on `(email, list)` already handles duplicates atomically, and the existing `23505` error code handler already returns an `already_subscribed` response. The SELECT added a wasted round-trip and a TOCTOU race window between check and insert.

```ts
// Before
const { data: existing } = await supabase
  .from('subscribers').select('id').eq('email', email).eq('list', list).maybeSingle();
if (existing) return alreadySubscribedResponse;
const { error: insertError } = await supabase.from('subscribers').insert({ email, list });

// After
const { error: insertError } = await supabase.from('subscribers').insert({ email, list });
// 23505 handler below covers duplicates atomically
```

### 3. Parallelize independent Resend API calls

`resend.contacts.create()` and `resend.emails.send()` were awaited sequentially despite having no data dependency between them. Both calls now run concurrently via `Promise.all`, saving one network round-trip on every successful subscription.

```ts
const [{ error: contactError }, { error: emailError }] = await Promise.all([
  resend.contacts.create({
    email,
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  }),
  resend.emails.send({
    from: `Alex Russell <${fromEmail}>`,
    to: email,
    subject,
    react: emailTemplate,
  }),
]);
```

### 4. Remove useless useCallback

`handleSubmit` in `SubscribeForm.tsx` was wrapped in `useCallback` with `[email, list]` as dependencies. Because `email` is controlled input state that changes on every keystroke, React was allocating a new function reference on every character typed — the memoization was entirely self-defeating. Replaced with a plain `async function`.

```tsx
// Before
const handleSubmit = useCallback(async () => { ... }, [email, list]);

// After
async function handleSubmit() { ... }
```

### 5. Remove placeholder sentinel string guards

A runtime guard comparing an env var against a literal placeholder string was removed from production code. Placeholder values belong only in `.env.example`. An absent env var already evaluates as falsy, so the truthiness check alone is sufficient.

```ts
// Before
...(segmentId && segmentId !== 'seg_placeholder_replace_with_book_segment_id' && segmentId !== 'seg_placeholder_replace_with_newsletter_segment_id'
  ? { segments: [{ id: segmentId }] }
  : {})

// After
...(segmentId ? { segments: [{ id: segmentId }] } : {})
```

## Prevention

These fixes address patterns that are likely to resurface as the codebase grows.

### 1. Shared constants before shared modules

**Watch for:** Style objects, color tokens, font stacks, or spacing values defined inline in more than one file. In React Email templates this is especially common because each template feels self-contained.

**Catch it early:** When adding a second email template, treat that as the trigger to extract shared values — not after a third file copies them. During PR review, search for object literals that appear verbatim in more than one file in the same directory.

### 2. SELECT-before-INSERT / TOCTOU patterns

**Watch for:** Any async sequence that reads from the database to check for existence and then writes based on that result — especially in API routes handling form submissions, waitlists, or deduplication. This pattern introduces a race window and duplicates logic the database already enforces via unique constraints.

**Catch it early:** Treat every `INSERT` preceded by a `SELECT` on the same table as suspect. Prefer catching the `23505` unique violation error from the database directly. If a unique constraint does not yet exist but the intent is uniqueness, add the constraint rather than guarding it in application code.

### 3. Sequential `await` for independent I/O

**Watch for:** Two or more `await` expressions on separate lines where the second call does not depend on the result of the first — especially in API routes calling Resend, Supabase, or any third-party service.

**Catch it early:** When reviewing any async function with multiple `await` statements, ask whether each call actually needs the previous result. If you can swap the order of two `await` lines without breaking anything, they should be parallelized with `Promise.all`.

### 4. `useCallback` applied to handlers with fast-changing dependencies

**Watch for:** `useCallback` wrapping a function whose dependency array includes state that changes on every user interaction — such as a controlled input value. The callback is recreated on every render anyway.

**Catch it early:** When adding `useCallback`, verify that at least one dependency is stable across typical interactions (a ref, a setter, a static value). If the only dependency is a piece of state updated by the very interaction the handler responds to, remove `useCallback`.

### 5. Placeholder and sentinel values in production paths

**Watch for:** Hardcoded strings used as temporary stand-ins during development that are later guarded with `if (value !== 'placeholder_...')` checks. These sentinels persist long after the real value is available.

**Catch it early:** Use environment variables or typed configuration from day one. A missing env var that fails cleanly at startup is safer than a sentinel that silently skips production behavior.

---

### PR Review Checklist

**Constants and duplication**
- [ ] Are any style objects or string constants defined in more than one file in this PR?
- [ ] If a new email template is added, does it import shared styles rather than define its own?

**Database interactions**
- [ ] Does any `INSERT` follow a `SELECT` on the same table to check for an existing row?
- [ ] Is uniqueness enforced at the database level (constraint), not only in application code?

**Async and I/O**
- [ ] Are there sequential `await` calls whose results are independent of each other?
- [ ] If yes, are they wrapped in `Promise.all`?

**React performance hooks**
- [ ] Does every `useCallback` have at least one dependency that is stable across the relevant interaction?
- [ ] If a callback's only dependency is a controlled input value, has `useCallback` been removed?

**Placeholder and sentinel values**
- [ ] Does any condition check whether a value equals a hardcoded placeholder string?
- [ ] Are all external IDs sourced purely from environment variables?

## Related

- `src/pages/api/recommend.ts` — duplicates the same in-memory rate limiter pattern (`Map<string, { count: number; resetAt: number }>`); candidate for shared extraction
- `src/pages/api/moods.ts` — duplicates the `getSupabase()` factory; candidate for shared extraction
- `docs/migrations/create_subscribers_table.sql` — defines the `(email, list)` unique constraint that makes the TOCTOU fix safe
- `docs/plans/2026-03-26-feat-book-waitlist-email-capture-plan.md` — original implementation plan for this feature
