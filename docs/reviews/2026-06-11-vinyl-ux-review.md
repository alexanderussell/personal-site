# UX Review — vinyl.alexanderussell.com ("Ask My Dad's Record Collection")

**Date:** 2026-06-11
**Method:** Four parallel review agents — live browser UX (desktop 1440×900 + mobile 390×844, 3 real moods submitted), performance audit (curl measurements + local build + code analysis), WCAG 2.1 AA accessibility audit, and code-level correctness review.
**Constraint:** Preserve the artistic/memorial direction. Every recommendation works within the existing visual language.

---

## What's working (don't touch)

- **First-run clarity is genuinely strong.** The tagline plus evocative example chips means visitors know what to do within seconds. The Side A / Side B tab metaphor is instantly legible.
- **The voice is consistent and earned.** Live testing confirmed recommendation quality: all three test moods returned apt picks with quotes that fused the shelf note and the mood gracefully.
- **The reveal is a moment.** Turntable, tonearm, generated art, the quote — the needle-drop fantasy lands.
- **Error recovery is exceptional for a side project.** API failures silently fall back to a deterministic local pick with an in-character reason. The visitor never sees an error.
- **Performance fundamentals are good.** TTFB ~150ms, FCP 372ms, zero console errors, no layout shift, no horizontal scroll on mobile. Spinning is pure CSS (no re-render churn); canvas art generation doesn't block load.
- **A11y bones are good.** Correct heading hierarchy, zoom not blocked, real buttons for primary controls, Enter submits, no XSS surface (React escaping, no `dangerouslySetInnerHTML`).

---

## Findings (deduplicated across all four reviews, by severity)

### Critical / High

1. **Mood wall shows the 40 *oldest* moods, not the newest.** Convex returns newest-first; client takes `slice(-40)` = the oldest, and appends new moods to the end, mixing orderings. As the collection grows past 200, the wall fossilizes — recent visitors never appear. The shared-memorial effect silently stops working. *(code review H1)*
2. **Audio is a dead end on mobile and can never be replayed anywhere.** Autoplay is attempted outside a user gesture so it always fails on iOS/Android; the only control is a hover-gated overlay (`onMouseEnter`) with the copy "Hover the vinyl to play" — meaningless on touch. Once a preview ends, clicking does nothing (`currentTime` pinned at end). There is also **no way to pause** 30s of audio. *(live UX #2, a11y B2, code H3)*
3. **No double-submit guard.** Two rapid clicks fired two `/api/recommend` calls 53ms apart and wrote the mood to the public wall twice (verified live). *(live UX #1, code L2)*
4. **No request timeout.** A hung `/api/recommend` leaves the page bricked on "Pulling from the shelf…" forever; only reload recovers. The excellent fallback path exists but never gets the chance to run. *(live UX #4, code M2)*
5. **"No preview available" state is computed but never rendered.** `audioFailed` is set but appears nowhere in JSX — for any album Deezer can't match (or any network hiccup), the record spins in total silence with no explanation. Common on flaky mobile connections. *(code H2)*
6. **Unguarded `localStorage.setItem` can break the entire reveal.** In Safari private/lockdown contexts, `addRecentPick` throws, control jumps to the catch, which calls it again and throws again — skipping the spin/reveal timers. Every ask renders half-broken for those visitors. *(code M3)*
7. **Shelf records and mood-wall notes are `<div onClick>`** — Side B and the wall are unusable by keyboard and invisible to screen readers; record tags are hover-`title`-only (lost on touch too). *(a11y B1/M1, live UX #6)*
8. **No screen-reader announcement of the async result.** Zero `aria-live` anywhere — an SR user submits a mood and hears nothing; the core flow appears broken. *(a11y B3)*

### Major

9. **Stale-response race:** no AbortController/sequence guard — submit a mood, switch to Side B, pick a record yourself, and the late AI response clobbers your explicit pick mid-spin. *(code M1)*
10. **Hashed assets revalidated on every visit.** All `/_astro/*` JS + fonts serve `cache-control: max-age=0, must-revalidate` — the adapter's immutable-cache route sits *after* the filesystem handler so it never applies. 80 KB gz re-validated per visit. Pure config fix in `vercel.json`. *(perf #1)*
11. **Recommend→music waterfall wastes ~1.5s+.** The Spotify preview fetch is gated behind the 1,000ms `showResult` timeout, then takes ~550ms uncached (4 serial Deezer calls server-side, no cache headers). Perceived click-to-music: 2.5–4s. Un-gating the prefetch saves a guaranteed 1s; caching the preview endpoint helps repeat picks. *(perf #2, live UX measured)*
12. **Ask-again empties the stage.** Submitting a second mood instantly collapses the whole result to a bare form for 1.5–2s of dead space. A real turntable would lift the needle and swap records — keep the current record on the platter during the wait. *(live UX #3)*
13. **Hidden panels keep focusable ghosts.** `opacity:0/maxHeight:0` hiding leaves the collapsed input, toggles, chips, and an invisible "Back to shelf" button in the tab order — the very first Tab stop on the page is an invisible button. Fix: `visibility`/`inert` alongside the opacity transitions. *(a11y M4, live UX #6)*
14. **Contrast failures across the dim-tan text tier.** `#6a5a4a` (3.02:1) and `#7a6a5a` (3.84:1) used for placeholder, footer dedication, eyebrows, captions; wall-note opacity floor 2.85:1; inactive toggle text down to 1.39:1. Fixable within the same sepia family: `#6a5a4a → #857565`, `#7a6a5a → #94826e`, opacity floors up. *(a11y M3)*
15. **Focus indicators effectively invisible.** `outline: none` on inputs with a ~1.3:1 border-color change as the only cue; no `:focus-visible` styles anywhere. One warm-gold CSS rule fixes it. *(a11y M2)*
16. **No `prefers-reduced-motion` support** for the infinite spin/sheen/tonearm. *(a11y M5)*
17. **Recommend endpoint trusts client-supplied `recordList`** — uncapped, interpolated raw into the prompt, and the "on-shelf" validation checks against the attacker's own list. Open Claude-proxy cost surface; also ~10–12 KB of upload per ask on cellular. Fix: move the curated list server-side; client sends `{mood, recentPicks}` only. *(code M5, perf #6)*
18. **Whole-page SSR per request, zero HTML caching.** The page renders no per-request data; far-from-iad1 visitors pay 300–600ms TTFB that prerender + a CDN route (or `s-maxage`) would eliminate. *(perf #3)*

### Minor / Polish

19. Rate-limit (429) silently teleports the user to the shelf with no announcement; `rateLimited` never resets, so the banner persists all session. *(a11y M7, code L2)*
20. Mood inputs have no accessible name, no `<form>` semantics, no `maxLength` (over-long moods are saved to the wall view but rejected by the API — they vanish on next visit). *(a11y M6, code L3)*
21. View toggle state conveyed only by color — needs `aria-pressed`. *(a11y M8)*
22. Album-mismatch edge: server validates artist *OR* album; client matches artist-only — multi-album artists (Willie ×3, Van Morrison ×3) can get a quote describing a different album than the sleeve shown. *(code L1)*
23. "← Back to shelf" mislabeled in the ask flow (user was never on the shelf) and overlaps the kicker on mobile. *(live UX #5)*
24. Audio lifecycle: switching records mid-playback can leave the detached old preview audibly playing under the new one. *(code M4)*
25. When the preview ends, the record keeps spinning with the needle down — visual says playing, audio is silent. In-world fix: lift the tonearm, "Side ended." *(live UX #9)*
26. Touch targets: 20px-wide spines, 29px chips — add invisible hit-slop. *(live UX #8, a11y m3)*
27. `Canvas2D` console warning — pass `{ willReadFrequently: true }` to `getContext`. *(live UX #10)*
28. Every keystroke re-renders ~130 unmemoized children (always-mounted shelf + wall); `React.memo` + extracting the input component fixes typing jank on low-end phones. *(perf #4)*
29. Canonical URL points at the redirecting apex domain. *(perf #5)*
30. No landmarks (`<main>`, `<footer>`); canvas/disc unlabeled for SR. *(a11y m1/m2)*
31. The memorial framing is nearly invisible — nothing above the fold says the records and notes are real, or that the dedication exists. One quiet line of provenance would secure the most affecting fact about the site. **Content decision — owner's call.** *(live UX #7)*
32. Wall moods are unmoderated on a memorial page (XSS-safe, but a crude submission would sit visible until it ages out). Consider a denylist or approval flag in Convex. *(code L3)*
33. Fallback path still posts the mood to the wall paired with a random album (observed live: "testing the error state" is now on the wall). *(live UX measured)*
34. Bigger payload lever if ever wanted: React+react-dom is 76% of the 80 KB gz JS; Preact compat or a smaller turntable-only island would cut to ~25–30 KB. *(perf #9)*

---

## Production data note

Live testing left entries on the public mood wall that should be pruned in Convex:
"missing someone I lost", "celebrating good news with friends tonight" (×2 — the double-click test), "tired after a long week of work", "testing the error state".

---

## Fix plan

**Tier 1 — shipped in `fix/vinyl-ux-review` (mechanical, vibe-preserving):**
mood-wall ordering (1), audio control overhaul: real tap/click button + replay + pause + failed-state caption + mobile copy (2, 5, 24, 25 partial), double-submit guard (3), client+server timeouts routed into the existing fallback (4), localStorage guard (6), spines/wall notes → real buttons (7), `aria-live` status + focus management (8), stale-response guard (9), immutable cache headers (10), un-gate preview prefetch + cache preview endpoint (11), `visibility` on hidden panels (13), contrast lifts in-family (14), warm-gold `:focus-visible` (15), `prefers-reduced-motion` (16), rate-limit announce + reset (19), form semantics + maxLength (20), `aria-pressed` (21), willReadFrequently (27), landmarks + canvas labels (30).

**Tier 2 — backlog (design/architecture decisions):**
keep-record-on-platter during ask-again (12), server-side record list + typed API contract (17, 22), prerender + CDN routing for the subdomain (18), back-to-shelf labeling (23), touch hit-slop (26), React.memo/input extraction (28), canonical URL (29), memorial provenance line (31 — owner's call), wall moderation (32), fallback wall-posting behavior (33), island slimming (34).
