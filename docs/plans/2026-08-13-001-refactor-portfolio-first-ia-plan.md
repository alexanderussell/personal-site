---
title: "refactor: Portfolio-first IA — Home / About / Work / Lab / Writing"
type: refactor
status: active
date: 2026-08-13
---

# refactor: Portfolio-first IA — Home / About / Work / Lab / Writing

## Summary

Restructure alexanderussell.com from a timeline-first content feed into a five-surface
portfolio: Home / About / Work / Lab / Writing. Work is net-new (career timeline plus a
case-study collection), Lab is the existing `experiments` collection renamed with a gallery
index, and Writing merges `notes` + `guides` behind a normalized post shape so a later
Substack move is a source-adapter swap. IA and section rhythm are borrowed from
itspatmorgan.com; typography, color, generative logo, and pixel iconography stay unchanged.

---

## Problem Frame

The site today is organized around *when things were published*, not *what they demonstrate*.
The homepage is a merged reverse-chron feed of notes, guides, and experiments; navigation is
About / Notes / Guides / Experiments. There is no portfolio surface anywhere — a visitor
evaluating Alex as a design engineer has no path to "here is work I shipped and what
happened as a result."

The stated audience (design leads, engineering managers, technology leaders) spends on the
order of two minutes on the site. A chronological feed asks them to infer competence from
eleven scattered artifacts. A portfolio asks them to read three.

Two secondary pressures: the interactive experiments are the site's strongest
differentiator and are currently buried inside the timeline, and publishing may move to
Substack, which the current architecture has no seam for.

### Reversal of prior documented decisions

This plan deliberately overturns three decisions already recorded in this repo. They are
listed here so the contradiction is explicit rather than silent:

| Prior decision | Where | Now |
|---|---|---|
| "Showcase thinking, not just work" — replace the portfolio/case-study model | `PRD.md` §1 Objectives | Reversed. Portfolio first, knowledge base second. |
| "Kill the Timeline (homepage reorg)" — rejected as a full reorg duplicating cheaper additive work | `docs/ideation/2026-06-10-...md` rejection #16 | Adopted. The reorg is now the point. |
| "Selected Work as Decision Journals" — rejected as a content-writing project, not a site enhancement | same doc, rejection #18 | Adopted, with the content-writing cost acknowledged as the real bottleneck (U1). |

The `PRD.md` objective statement should be updated as part of U2 rather than left contradicting
the shipped site.

---

## Requirements

- R1. Navigation and IA become Home / About / Work / Lab / Writing.
- R2. Work exists as a portfolio surface: a reverse-chron career timeline as the spine, with
  case-study detail pages hanging off it. Ships coherent with 1–2 case studies.
- R3. Lab presents the interactive experiments as a gallery with live previews, not feed rows.
- R4. Writing merges notes and guides into one surface with a type distinction preserved.
- R5. Writing renders from a normalized post shape, so swapping the source to a Substack feed
  is an adapter change rather than a rewrite of the index and detail pages.
- R6. The homepage becomes hero + section previews, replacing the merged timeline.
- R7. No existing published URL 404s. `/notes/*`, `/guides/*`, `/experiments/*` continue to
  resolve.
- R8. Typography, color tokens, generative logo, pixel iconography, and dark-mode-default
  behavior are unchanged.
- R9. `/book`, the vinyl experiment, and the vinyl subdomain remain reachable.
- R10. Markdown-in-repo remains the durable archive and the publishing path stays
  "write markdown, git push."

---

## Scope Boundaries

- Community / testimonials section — no source material exists, and fabricated social proof
  is the worst possible thing to ship to an audience that evaluates credibility.
- Colophon page (ideation idea #7) — good idea, separate effort.
- Creating the Substack account or wiring its feed. This plan builds the seam, not the
  integration.
- Newsletter pipeline changes (Convex `sentPosts`, Resend send, subscribe endpoint). The
  hardened security/idempotency patterns in `docs/solutions/` stay untouched.
- Generative OG images, experiment reveal toggles, public newsletter archive + RSS
  (ideation ideas #6, #3, #4).
- shadcn/ui and GitHub Pages — present in the inherited brief's stack list, deliberately not
  adopted. The site has its own component vocabulary, and Vercel already carries the
  serverless endpoints Convex/Resend need.
- A general visual redesign. Per the inherited process guidance, restructure and redesign are
  separated; this plan is the restructure.

### Deferred to Follow-Up Work

- Case-study prose beyond the first 1–2: authored incrementally, no code change needed.
- Substack source adapter implementation: unblocked by U3's normalized shape, done when the
  Substack exists.
- Media embeds if the answer to Open Question 3 is "no decks exist today" — U9 is written to
  be skippable.
- `docs/parking-lot.md` accumulates everything noticed mid-rebuild. That file is the
  scope-creep valve; it is not a backlog anyone promises to burn down.

---

## Context & Research

### Relevant Code and Patterns

- `src/middleware.ts` — already contains a `/logs` → `/notes` 301 redirect. This is the
  established precedent for the `/experiments` → `/lab` migration; follow it rather than
  introducing Vercel-level redirects.
- `src/middleware.ts` also rewrites `vinyl.alexanderussell.com` → `/experiments/vinyl`.
  **This rewrite target breaks when the collection is renamed** and is the single easiest
  thing in this plan to miss.
- `src/content.config.ts` — three collections share one `sharedSchema`. The `related`,
  `status`, and `via` fields shipped in PR #5 and must survive the rename.
- `src/components/TimelineItem.astro` — tightly coupled to the `note | guide | experiment`
  union, with experiment-specific rendering and a lightbox. It is a *content-feed* component,
  not a general timeline. The Work career timeline needs its own component; do not bend this
  one.
- `src/components/RelatedPosts.astro` — resolves refs of the form `"collection/slug"` by
  loading all three collections explicitly. Renaming a collection changes valid ref strings.
- `src/layouts/PostLayout.astro` — has a `backLinks` map keyed by type, and derives
  `currentRef` as `` `${type}s/${id}` ``. Both are rename-sensitive.
- `src/components/ExperimentRenderer.astro` — `sourceMap` keyed by experiment *id*, not
  collection name. Unaffected by the rename; the ids stay stable.
- `src/pages/{notes,guides,experiments}/index.astro` — three near-identical index pages.
  Their duplication is why Writing can absorb two of them cheaply.
- `astro.config.mjs` — `output: 'server'` with the Vercel adapter; pages opt in via
  `export const prerender = true`. Sitemap integration auto-includes new routes.
- `scripts/fix-vercel-routes.mjs` — post-build route injection, matched on *host* only, so it
  is insensitive to the path rename. No change needed, but verify.

### Content references that hardcode section paths

These break silently on rename and must be swept in U4:

- `src/data/now.ts` — links to `/experiments` and `/experiments/ask-dads-records`
- `src/content/experiments/bricklayer.mdx` — `related: ["experiments/ask-dads-records"]`
- `src/content/experiments/ask-dads-records.mdx` — `related: ["notes/dads-eulogy", "experiments/bricklayer"]`
- `src/content/experiments/hold-to-provision.mdx` — `related: ["notes/ux-for-engineers"]`
- `src/content/notes/ux-for-engineers.mdx` — `related: ["experiments/hold-to-provision"]`
- `src/emails/PostNotification.tsx` — hardcoded example URL

Unresolved `related` refs currently emit a build **warning**, not an error (per commit
`9fd80cf`). A silent-warning failure mode is exactly what U4's route check is for.

### Institutional Learnings

- `docs/solutions/` contains newsletter API hardening rules and multi-agent review findings.
  Neither is touched by this plan, but the newsletter endpoints must not be collaterally
  modified.
- The June ideation doc records `client:visible` for below-fold islands — relevant to Lab,
  where multiple live experiment previews sit on one page.

### External References

- [How I Rebuilt My Portfolio With Claude](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude) —
  source of the sequencing (foundation → migration → one finished page → homepage → rest),
  the restructure/redesign separation, mise-en-place, and the parking-lot pattern.
- `docs/website-brief.md` — the inherited brief, adapted. Carries five open questions.
- itspatmorgan.com — IA reference: Home / About / Work / Lab / Writing, career-timeline Work
  page with nested case-study cards, Lab as a live-preview gallery.

---

## Key Technical Decisions

- **Rename `experiments` → `lab` in place rather than creating a parallel collection.**
  Duplication would fork the `related` graph and double the content surface. The ids stay
  stable, so `ExperimentRenderer`'s `sourceMap` is unaffected.
- **Redirects live in `src/middleware.ts`, not `vercel.json`.** The `/logs` → `/notes`
  precedent is already there, and `vercel.json` is currently `{}`. One mechanism, one place
  to audit.
- **Work gets its own collection with portfolio fields** (role, company, timeline, outcome,
  featured) rather than being bent into `sharedSchema`. Case studies and essays have almost
  no field overlap, and forcing them together would put optional portfolio fields on every
  note.
- **Writing renders from a normalized post shape, not directly from collections.** A single
  mapping layer converts `notes` and `guides` entries into one `WritingEntry` type; the index
  and cards consume only that. Adding Substack later means adding a second producer of the
  same shape. This is the R5 seam and the cheapest possible insurance against the platform
  decision.
- **New `WorkTimeline` component; `TimelineItem` stays as-is.** `TimelineItem` is coupled to
  the content-type union and carries experiment lightbox logic. The career timeline shares
  its visual rail but not its data model.
- **Notes and guides keep their own URL namespaces** (`/notes/*`, `/guides/*`) even though
  they merge into one `/writing` index. Rewriting detail URLs would invalidate every
  newsletter link already sent for zero user-visible gain.
- **A route-integrity check script instead of a test framework.** The repo has no test runner
  today, and introducing vitest or playwright for a static content site is disproportionate.
  The actual risk this plan carries is broken URLs, so verification targets exactly that.

---

## Open Questions

### Resolved During Planning

- Writing source at launch: MDX in-repo, with a normalized shape for a later Substack swap.
- Work scope at launch: career timeline plus 1–2 case studies.
- Visual fidelity: borrow IA, keep existing visual identity.
- Where redirects live: middleware, following the `/logs` precedent.
- Whether `TimelineItem` can serve the career timeline: no — build a separate component.

### Deferred to Implementation

- Exact Work card composition and grid at each breakpoint — settle against real case-study
  content in U5, not in the abstract.
- Whether Lab previews render live or as static posters on mobile — depends on measured
  weight once three-plus islands sit on one page.
- Whether `/writing` needs tag filters at launch — nine pieces may not warrant them.

### Blocking on user input (from `docs/website-brief.md`)

- **Q1 Goals** — the brief's most load-bearing section is unanswered. A working default is in
  place; it shapes copy, not architecture, so it does not block code.
- **Q2 Nameable companies / NDA clearance** — blocks U1 and therefore the *content* of U5,
  not its structure.
- **Q3 Figma decks / recorded video** — determines whether U9 runs at all.
- **Q4 Social proof** — resolved to omit-or-substitute; no architectural impact.
- **Q5 Substack commitment** — does not block; U3's seam covers both outcomes.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not
> implementation specification. The implementing agent should treat it as context, not code
> to reproduce.*

The Writing seam — one normalized shape, swappable producers:

```
  MDX `notes` collection  ─┐
  MDX `guides` collection ─┼─→  toWritingEntry()  ─→  WritingEntry[]  ─→  /writing index
  (later) Substack feed   ─┘                                           └─→  homepage preview
```

`WritingEntry` carries only what a listing needs: title, description, date, href, kind,
optional status. Detail pages continue to render from their own collections; the seam exists
for listings, which is where a feed source can actually participate.

Surface map after the change:

```
/                 hero + Work / Lab / Writing previews
/about            existing page, re-slotted
/work             career timeline + nested case-study cards
/work/[slug]      case study detail
/lab              gallery of live experiment previews
/lab/[slug]       experiment detail          ← was /experiments/[slug]
/writing          merged notes + guides index
/notes/[slug]     unchanged
/guides/[slug]    unchanged
/book             unchanged
```

---

## Implementation Units

Sequenced per the inherited process: gather content, lay foundation, migrate the model, then
finish **one page end to end** before touching the homepage.

### Phase 1 — Preparation and foundation

### U1. Mise-en-place: gather Work source material

**Goal:** Assemble the raw material the Work section needs, before any Work code is written.

**Requirements:** R2

**Dependencies:** None. Blocks U5's content (not its structure). **User-owned work** — this
is the real bottleneck, per the inherited brief's "curation is the skill, not prompting."

**Files:**
- Create: `docs/work-source/` — role history, per-case-study raw notes
- Modify: `docs/website-brief.md` — answer Q1–Q5

**Approach:**
- Role history: dates, titles, company, one-paragraph narrative per role, back through the
  agency years.
- Per case study: problem, approach, outcome, and any metric that clears NDA. Marriott
  internal-platform work needs an explicit clearance pass.
- Visual assets: screenshots per case study, company logos in light and dark variants, a
  current hero photo.
- If Q2 clearance is restrictive, a Collectively Made or personal project is a legitimate
  first case study — do not let NDA review block the section shipping.

**Test expectation:** none — content gathering, no behavioral change.

**Verification:**
- Enough material exists to write at least one case study without inventing facts.
- Q2 and Q3 are answered, so U5's media needs and U9's necessity are known.

---

### U2. Repo foundation: conventions doc and scope parking lot

**Goal:** Give the repo the house rules it currently claims to have, and a place to park
scope creep.

**Requirements:** R10

**Dependencies:** None.

**Files:**
- Create: `AGENTS.md`
- Create: `docs/parking-lot.md`
- Modify: `PRD.md` — update the objectives section that this plan reverses

**Approach:**
- `CLAUDE.md` currently contains only `@AGENTS.md`, and **`AGENTS.md` does not exist**. Every
  agent session on this repo starts with no conventions. Document: stack and versions, content
  collection conventions, the frontmatter schema contract, Tailwind token usage, the
  dark-mode-default mechanism, redirect policy (middleware, not `vercel.json`), and the rule
  that publishing stays markdown-in-repo.
- `docs/parking-lot.md` captures anything noticed mid-rebuild that is not this plan's job.
  Explicitly not a backlog with a completion expectation.
- Amend `PRD.md` §1 so it no longer states the objective this plan reverses. Record the
  reversal and its reasoning rather than deleting the old text.

**Test expectation:** none — documentation only.

**Verification:**
- `CLAUDE.md`'s `@AGENTS.md` reference resolves.
- `PRD.md` no longer contradicts the shipped IA.

---

### Phase 2 — Content model and routing migration

### U3. Content model: `work` collection, `lab` rename, normalized writing shape

**Goal:** Establish the data model the new surfaces render from.

**Requirements:** R2, R3, R4, R5, R10

**Dependencies:** U2

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/lib/writing.ts` — normalized shape and mapping
- Create: `src/content/work/` — case-study entries
- Rename: `src/content/experiments/` → `src/content/lab/`

**Approach:**
- Rename the `experiments` collection to `lab`, keeping `sharedSchema` and preserving
  `related` / `status` / `via`. Entry ids are unchanged, so `ExperimentRenderer`'s `sourceMap`
  keeps resolving.
- Add a `work` collection with its own schema: title, description, date, company, role,
  timeline, tags, optional outcome, optional featured flag, optional media refs (U9), draft.
  Deliberately **not** an extension of `sharedSchema`.
- Add `src/lib/writing.ts` exposing a `WritingEntry` type and a mapper from notes/guides
  entries. Listings consume only `WritingEntry`. This is the R5 seam.
- Seed `src/content/work/` with one real case study from U1 material, plus a draft second.

**Patterns to follow:**
- `src/content.config.ts` — existing `defineCollection` + `glob` loader shape
- `sharedSchema` field documentation style (comments explaining intent, per PR #5)

**Test scenarios:**
- Happy path: `astro build` resolves all `lab` entries at their new collection with ids intact.
- Happy path: a `work` entry with only required frontmatter builds; one with all optional
  fields also builds.
- Edge case: a `work` entry marked `draft: true` is excluded from output.
- Edge case: `toWritingEntry` over notes + guides yields one array sorted newest-first with
  `kind` preserved per source.
- Error path: a `work` entry missing a required field fails the build with a readable zod
  error rather than rendering blank.

**Verification:**
- Build succeeds with `lab` and `work` collections present.
- Writing listings can be produced from `WritingEntry` alone, with no direct collection access
  in the listing component.

---

### U4. Routing, redirects, and reference sweep

**Goal:** Move `/experiments` to `/lab` without breaking a single existing URL or internal
reference.

**Requirements:** R7, R9

**Dependencies:** U3

**Files:**
- Modify: `src/middleware.ts`
- Create: `src/pages/lab/index.astro`, `src/pages/lab/[...slug].astro` (moved from `experiments/`)
- Delete: `src/pages/experiments/index.astro`, `src/pages/experiments/[...slug].astro`
- Modify: `src/pages/experiments/vinyl.astro` → `src/pages/lab/vinyl.astro`
- Modify: `src/layouts/PostLayout.astro` — `backLinks` map, `currentRef` derivation
- Modify: `src/components/RelatedPosts.astro` — collection names and ref resolution
- Modify: `src/data/now.ts`
- Modify: `src/content/lab/*.mdx`, `src/content/notes/ux-for-engineers.mdx` — `related` refs
- Create: `scripts/check-routes.mjs`
- Modify: `package.json` — wire the check into `build`

**Approach:**
- Add an `/experiments/*` → `/lab/*` 301 alongside the existing `/logs` → `/notes` rule, same
  shape.
- **Update the vinyl subdomain rewrite target** from `/experiments/vinyl` to `/lab/vinyl`.
  This is the highest-risk single line in the plan — a live subdomain silently 404s if missed.
- `PostLayout` derives `currentRef` as `` `${type}s/${id}` ``, which produces `experiments/x`
  for the old type name. Both the type union and this derivation need updating, and the
  `related` refs in content must move in the same commit or the graph half-resolves.
- `scripts/check-routes.mjs` walks the build output and asserts every known-published URL
  resolves — including redirect sources. Unresolved `related` refs currently only warn, so the
  check should treat them as failures.

**Execution note:** Write the route check before performing the rename, so it fails first and
then passes. It is the only guard against the silent-warning failure mode this unit creates.

**Patterns to follow:**
- `src/middleware.ts` — the `/logs` → `/notes` redirect
- `scripts/fix-vercel-routes.mjs` — build-script conventions and console output style

**Test scenarios:**
- Happy path: `/lab` and `/lab/bricklayer` resolve.
- Happy path: `/experiments` and `/experiments/bricklayer` 301 to their `/lab` equivalents.
- Happy path: `/logs/*` → `/notes/*` still redirects — the pre-existing rule is not regressed.
- Happy path: `vinyl.alexanderussell.com/` rewrites to the vinyl page.
- Edge case: `/experiments/vinyl` redirects to `/lab/vinyl` rather than dead-ending.
- Edge case: every `related` ref in every content file resolves to a real entry; an
  intentionally broken ref fails the check.
- Integration: `RelatedPosts` on a note that references a lab entry renders that entry, proving
  cross-collection refs survived the rename.
- Error path: `check-routes.mjs` exits non-zero when a known URL is missing, and names it.

**Verification:**
- No published URL 404s.
- The vinyl subdomain loads.
- Build fails loudly on an unresolved reference.

---

### Phase 3 — One page finished end to end, then the rest

### U5. Work section, complete

**Goal:** Ship `/work` and `/work/[slug]` fully — the first finished surface, and the one the
component vocabulary gets settled against.

**Requirements:** R1, R2, R8

**Dependencies:** U3, U4; content from U1

**Files:**
- Create: `src/pages/work/index.astro`, `src/pages/work/[...slug].astro`
- Create: `src/components/WorkTimeline.astro`, `src/components/CaseStudyCard.astro`
- Create: `src/layouts/CaseStudyLayout.astro`

**Approach:**
- `/work` is a reverse-chron career spine: role, company, dates, a short narrative per role,
  with case-study cards nested under the roles they belong to. The timeline reads as complete
  on its own, so a thin case-study count does not make the page look unfinished — this is what
  makes R2's "ships coherent with 1–2" true.
- New `WorkTimeline`; do not extend `TimelineItem`, which carries the content-type union and
  lightbox logic.
- Case study structure: challenge → approach → solution → outcome → project details. Outcome
  carries metrics when NDA permits and is omitted cleanly when it does not.
- Company logos need light and dark variants, consistent with the existing theme mechanism.

**Execution note:** Finish this page — real content, responsive, both themes — before starting
U6. Half-finished pages are what the inherited process guidance warns against.

**Patterns to follow:**
- `src/layouts/PostLayout.astro` — header composition, metadata rendering, back-link
- `src/styles/global.css` — timeline rail styling, reusable for the career spine
- Existing Tailwind design tokens; no new color or type values

**Test scenarios:**
- Happy path: `/work` renders every role in reverse-chron order with case studies nested under
  the correct role.
- Happy path: `/work/[slug]` renders a full case study including the outcome block.
- Edge case: a case study with no `outcome` omits the section rather than rendering an empty
  heading.
- Edge case: a role with zero case studies still renders as a complete timeline entry.
- Edge case: `/work` with only one published case study does not look broken.
- Integration: light and dark themes both render logos and timeline correctly.
- Integration: mobile viewport collapses the timeline rail per the existing pattern.

**Verification:**
- `/work` reads as a finished portfolio surface with one case study published.
- No new design tokens introduced (R8).

---

### U6. Homepage rebuild

**Goal:** Replace the merged timeline with hero + section previews.

**Requirements:** R1, R6, R8

**Dependencies:** U5

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/SectionPreview.astro`

**Approach:**
- Hero: name, photo, headline, short bio, socials, email, and company logos if U1 cleared
  them. The existing intro copy and rotating link tooltips are established personality — carry
  them, do not rewrite.
- Three preview blocks — Work, Lab, Writing — each a heading with a "View all →" affordance
  over a small set of items. Work leads.
- Retire the merged timeline from the homepage. `TimelineItem` survives for section indexes.
- Keep the existing stagger-in entrance treatment, including its no-JS fallback (`html.js`
  gating in `BaseLayout`).

**Patterns to follow:**
- `src/pages/index.astro` — existing `data-stagger` entrance and tooltip behavior
- `src/components/CaseStudyCard.astro` from U5, reused in the Work preview

**Test scenarios:**
- Happy path: homepage renders three previews, each linking to its section index.
- Edge case: a section with fewer items than the preview slot count renders without gaps.
- Edge case: with JS disabled, content is visible — the entrance animation must not hide it.
- Integration: both themes render the hero and logos correctly.
- Integration: preview cards match their section-index counterparts visually.

**Verification:**
- No merged chronological feed remains on `/`.
- Lighthouse performance holds at or above the current score.

---

### U7. Lab and Writing indexes

**Goal:** Build the two remaining section surfaces.

**Requirements:** R3, R4, R5

**Dependencies:** U3, U4

**Files:**
- Modify: `src/pages/lab/index.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/components/LabCard.astro`, `src/components/WritingRow.astro`

**Approach:**
- Lab becomes a gallery of cards with live previews rather than feed rows. Multiple islands on
  one page is the perf risk — apply `client:visible` for below-fold previews per the recorded
  learning, and fall back to a static poster if measured weight is unacceptable.
- Writing renders from `WritingEntry` only. Notes and guides interleave chronologically with a
  visible kind distinction. Detail URLs stay in their existing namespaces.
- `/notes` and `/guides` indexes: keep them as-is and let `/writing` be the merged front door.
  They already work, and removing them would break links for no gain.

**Patterns to follow:**
- `src/pages/lab/index.astro` — existing index page structure and eyebrow/headline treatment
- `src/components/TimelineItem.astro` — experiment preview rendering, for the Lab card
- `src/lib/writing.ts` from U3

**Test scenarios:**
- Happy path: `/lab` renders every published experiment with a working live preview.
- Happy path: `/writing` renders notes and guides interleaved newest-first with correct kinds.
- Edge case: a draft entry appears in neither index.
- Edge case: a Lab entry whose id has no `ExperimentRenderer` mapping degrades to a card
  without a preview instead of erroring.
- Integration: Lab previews below the fold do not load until scrolled into view.
- Integration: `/writing` links resolve to `/notes/*` and `/guides/*` correctly.

**Verification:**
- Lab previews are interactive on the index.
- `/writing` reads from the normalized shape with no direct `getCollection` call in the
  listing component.

---

### U8. Navigation, About re-slot, and final sweep

**Goal:** Wire the new IA into global chrome and close out stragglers.

**Requirements:** R1, R7, R8, R9

**Dependencies:** U5, U6, U7

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/layouts/BaseLayout.astro` — default title and description
- Modify: `src/pages/404.astro` — if it references old sections

**Approach:**
- Nav becomes About / Work / Lab / Writing, with the logo as home. Five items including home
  is denser than today's four — verify the mobile menu still behaves.
- About is re-slotted, not rewritten. Its receipt links point at `/experiments/*` paths and
  must be updated to `/lab/*` (the redirect covers it, but internal links should not rely on
  redirects).
- `BaseLayout`'s default description still says "Logs, guides, and experiments" — stale twice
  over.
- Sitemap is generated by integration, so new routes are automatic; confirm rather than build.

**Patterns to follow:**
- `src/components/Nav.astro` — existing `navLinks` array, active-state derivation, mobile menu

**Test scenarios:**
- Happy path: every nav item resolves and shows correct active state on its section.
- Edge case: active state on `/work/[slug]` highlights Work, not nothing.
- Edge case: mobile menu opens and lists all items at the narrowest supported width.
- Integration: About's receipt links resolve directly, without passing through a redirect.
- Integration: sitemap includes `/work`, `/work/*`, `/lab`, `/lab/*`, `/writing`.
- Integration: `check-routes.mjs` passes against the final build.

**Verification:**
- No internal link anywhere depends on a redirect.
- No user-facing copy references "Experiments" as a section name.

---

### U9. Media embeds — conditional on Open Question 3

**Goal:** Support Figma Slides and video embeds in case studies.

**Requirements:** R2

**Dependencies:** U5. **Skip entirely if no decks or recordings exist.**

**Files:**
- Create: `src/components/FigmaEmbed.astro`, `src/components/VideoEmbed.astro`
- Modify: `src/content.config.ts` — media fields on the work schema
- Modify: `src/layouts/CaseStudyLayout.astro`

**Approach:**
- Both embed types are third-party iframes: lazy-load, constrain aspect ratio, and give each a
  meaningful title for screen readers.
- Privacy-preserving video embedding (no-cookie host) is the default, consistent with the
  site's light analytics posture.
- Both must degrade to a plain link when JS is unavailable.

**Test scenarios:**
- Happy path: a case study with a Figma URL renders a responsive embed.
- Happy path: a case study with a video URL renders a lazy-loaded player.
- Edge case: a case study with neither renders no empty containers.
- Edge case: a malformed embed URL fails the build rather than rendering a broken frame.
- Integration: embeds do not regress Lighthouse performance on a case-study page.

**Verification:**
- Embeds are responsive in both themes and degrade gracefully.

---

## System-Wide Impact

- **Interaction graph:** `src/middleware.ts` is now on the path of every request for three
  redirect families plus one subdomain rewrite. `PostLayout` and `RelatedPosts` are shared by
  notes, guides, and lab, so the type-union change touches all three.
- **Error propagation:** Unresolved `related` refs currently warn rather than fail — the
  exact failure mode most likely to ship silently. U4 promotes it to a build failure.
- **State lifecycle risks:** None. No database, session, or cache state changes. Convex
  collections are untouched.
- **API surface parity:** `/api/*` endpoints are untouched. `send-post.ts` slug validation
  operates on note/guide slugs, whose URLs do not change — verify this holds rather than
  assuming.
- **Integration coverage:** The vinyl subdomain path (middleware rewrite + post-build route
  injection) is the one flow no build-time check exercises. Verify against a real deploy.
- **Unchanged invariants:** `/notes/*` and `/guides/*` detail URLs, all `/api/*` endpoints,
  the Convex schema, the Resend send pipeline, `/book`, design tokens, and the font stack.

---

## Risks & Dependencies

| Risk | Mitigation |
|---|---|
| Vinyl subdomain silently 404s — its middleware rewrite still targets `/experiments/vinyl` | Called out explicitly in U4; covered by a route-check case and verified against a real deploy |
| `related` refs half-resolve after the rename, degrading quietly to a warning | U4 promotes unresolved refs to build failures and moves refs in the same commit as the rename |
| Work ships thin and reads as an empty portfolio | Career timeline is designed to stand alone; U5 has an explicit one-case-study case |
| U1 content gathering stalls the whole plan | U1 blocks only U5's *content*; U2–U4 and U7 proceed independently. A personal project is an acceptable first case study if NDA review drags |
| Scope creep during the rebuild | `docs/parking-lot.md` (U2), plus the explicit restructure-not-redesign boundary |
| Multiple live Lab previews regress performance | `client:visible` below the fold; static-poster fallback if measurement demands it |
| Newsletter links sent to subscribers break | Note and guide detail URLs deliberately unchanged; redirects cover the rest |

---

## Documentation / Operational Notes

- `AGENTS.md` is created in U2 — the repo currently has a dangling `@AGENTS.md` reference.
- `PRD.md` objectives are amended in U2 to stop contradicting the shipped IA.
- `docs/website-brief.md` carries five open questions; Q2 and Q3 gate U1 and U9.
- Deploy verification must include the vinyl subdomain, which no build-time check covers.
- `docs/parking-lot.md` is the scope valve, not a backlog.

---

## Sources & References

- Design brief: `docs/website-brief.md`
- Prior ideation (records the decisions this plan reverses): `docs/ideation/2026-06-10-personality-perspective-work-showcase-ideation.md`
- Product requirements (to be amended in U2): `PRD.md`
- Process reference: [How I Rebuilt My Portfolio With Claude](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude)
- IA reference: <https://itspatmorgan.com>
- Redirect precedent: `src/middleware.ts`
- Build-script conventions: `scripts/fix-vercel-routes.mjs`
