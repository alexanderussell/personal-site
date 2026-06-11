---
date: 2026-06-10
topic: personality-perspective-work-showcase
focus: enhancements to make the personal site better at showing off personality, perspective, and work
mode: repo-grounded
---

# Ideation: Showing Off Personality, Perspective, and Work

## Grounding Context

**Codebase Context.** Astro 5 + TypeScript site with Tailwind 4, MDX content collections, React islands, Convex backend (moods, newsletter), Resend email, Vercel hosting. ~11 published pieces: 5 notes/essays (incl. "The Ladder, Pulled Up" on taste/AI, "We Swapped the Motor", a eulogy essay, "Design Systems Are Not a Product"), 2 guides (incl. "Claude Code + Obsidian vault pattern"), 4 interactive experiments (Bricklayer, Generative Logo, Hold to Provision, Ask Dad's Records). Homepage is a nested recency timeline. Existing personality artifacts: 3D CSS book page with waitlist, animated broken-window 404, vinyl mood-tracking UI, pixel-art icons. Subdomain routing (studio.*, tools.*) built but unused. Stated strategy (PRD): portfolio alternative — "showcase thinking, not just work" — for hiring managers, design leads, and EMs who spend minutes per visit.

**Gaps found:** no /about page (one-sentence bio on homepage is the only self-description); no projects/case-study surface; experiments buried in the timeline; newsletter has no public archive; no RSS; no related-post linking.

**Settled decisions (respected, not re-litigated):** typography stack (PP Mondwest + Inter + JetBrains Mono, recently re-confirmed against a swap evaluation); newsletter security/idempotency patterns (fail-closed auth, slug validation, Convex `sentPosts` idempotency, shared email styles).

**Past learnings:** newsletter API hardening rules codified in docs/solutions/; `client:visible` for below-fold islands; no institutional knowledge yet on visual design/homepage/projects — worth capturing post-implementation.

**External context:** digital gardens (growth-stage + epistemic-status markers — Appleton, Gwern); Comeau-style inline interactive MDX; /now, /uses, colophon page genres; liner-notes and open-studio cross-domain analogies; undersaturated: reading/listening logs, process-embedded projects, live colophons. Clichés to avoid: scroll-motion overload, dark-mode-as-personality, 3D nav gimmicks, AI-sounding copy.

## Topic Axes

- identity-self-presentation (about/bio/now/colophon)
- perspective-thinking-visible (essay/note mechanics, opinions, evolving thought)
- work-craft-showcase (experiments, projects, process/making-of)
- site-as-artifact-personality (the site itself expressing character)
- compounding-connection (archive, RSS, related content, return visits)

## Ranked Ideas

### 1. The Front Door — beliefs-with-receipts About page
**Description:** A composite `/about`: a short set of beliefs about design written to be true in five years, each claim linking to the essay or experiment that proves it; a "Start here" curated path of 3–4 defining pieces; and an auto-fresh "now" strip distilled from the Obsidian vault via the already-documented Claude Code pipeline, with a provenance note ("distilled from my vault by a robot I wrote about") that makes the automation itself a personality statement.
**Axis:** identity-self-presentation
**Basis:** `direct:` no about page exists in src/pages; the homepage one-liner is the only self-description on the site — the single most-expected page for the stated audience is absent. The vault pipeline exists per the published guide.
**Rationale:** Hiring managers look for "who is this person" within seconds; today the answer is scattered across 11 pieces. Beliefs-with-receipts makes the page a perspective artifact rather than a resume clone, and the auto-now strip prevents the classic staleness failure.
**Downsides:** The beliefs section is genuinely hard editorial work; vault distillation needs a public-safety review step.
**Confidence:** 90%
**Complexity:** Medium
**Status:** Unexplored

### 2. One Schema Change, Three Features
**Description:** Add `related` (slugs), `status` (seedling/growing/evergreen), and `via` (what prompted the piece) to the shared zod schema in src/content.config.ts. One edit unlocks related-post footers, garden growth-stage badges (lowering the publishing bar — "strongly held, loosely argued"), and provenance lines across all three collections. Optional extension: a remark plugin resolving Obsidian `[[wikilinks]]` to internal links with "Linked from" backlink footers.
**Axis:** perspective-thinking-visible (+ compounding-connection)
**Basis:** `direct:` all collections share one zod schema; no related-posts feature exists; the Obsidian-first workflow is documented in the owner's own guide. `external:` digital-garden growth stages and bi-directional links are proven compounding structures (Appleton, Gwern).
**Rationale:** Cheapest move with the widest blast radius — every existing and future piece becomes more navigable, and epistemic-status markers make intellectual honesty itself visible, which the target audience reads as senior judgment.
**Downsides:** Payoff compounds with corpus size; modest visible change today.
**Confidence:** 85%
**Complexity:** Low
**Status:** Unexplored

### 3. The Reveal Toggle
**Description:** Each of the 4 experiments gets a "reveal the method" switch: the live piece keeps running but gains an annotated overlay — spring values on Hold to Provision, layout pass order in Bricklayer, seed logic in Generative Logo — with callout lines and one-sentence decision notes. The trick and its method on the same stage, not a separate making-of post.
**Axis:** work-craft-showcase
**Basis:** `external:` magician method-reveal (Penn & Teller) — showing mechanism during the trick increases respect because it proves the skill was real; Comeau-style inline interactivity. `direct:` experiments are React islands, so an overlay is a per-component state flag; experiments are the site's strongest differentiator and currently buried.
**Rationale:** The audience evaluates craft; an in-situ method reveal is direct evidence of both polish and engineering judgment, doubling each existing experiment's payload without new content.
**Downsides:** Each overlay needs real design effort to not feel bolted-on.
**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored

### 4. The Broadcast Log — public newsletter archive + RSS
**Description:** Every sent issue auto-publishes to a public archive page the moment the Resend send fires, reusing the existing Convex `sentPosts` machinery as the trigger. Rendered as a vinyl crate — each issue a sleeve with an air date, "tonight's show" teaser, and a tracklist of cited references. Past issues can carry "do I still believe this" status annotations. Ship a standard RSS/Atom feed alongside.
**Axis:** compounding-connection
**Basis:** `direct:` convex/sentPosts.ts and the auto-send-on-publish endpoint exist; no archive page; no RSS dependency in package.json. Missing RSS on a hand-built Astro site reads as a craft gap to this audience.
**Rationale:** The archive de-risks subscribing (visible track record), earns search traffic from content already written, and the annotations are public intellectual honesty at near-zero new-writing cost. RSS serves the design-lead/EM crowd who disproportionately still use feed readers.
**Downsides:** Touches the hardened newsletter pipeline — must follow the codified security/idempotency patterns in docs/solutions/.
**Confidence:** 90%
**Complexity:** Medium
**Status:** Unexplored

### 5. The Omakase Route
**Description:** A "First time here? Trust the chef" path linked from the homepage: five fixed-order courses, each pairing an essay with the experiment that embodies it (e.g., "Design Systems Are Not a Product" → Bricklayer; the taste/AI essay → Generative Logo), with a one-line chef's note on why they're served together and a menu-card progress indicator.
**Axis:** work-craft-showcase (+ identity-self-presentation)
**Basis:** `external:` chef's tasting menus solve "first-time guest, deep menu, limited attention" by removing choice and sequencing for an arc. `direct:` 5 notes and 4 experiments map nearly 1:1; experiments are buried; the audience spends only minutes per visit.
**Rationale:** Engineered for the single-pass visitor: interleaves thinking (essays) with proof (experiments), and the pairings themselves demonstrate editorial judgment — the site's core thesis enacted as navigation.
**Downsides:** Pairings need refreshing as the corpus grows.
**Confidence:** 75%
**Complexity:** Low
**Status:** Unexplored

### 6. Generative OG Images
**Description:** Repurpose the GenerativeLogo system as a build-time OG-image generator: each post's share card is a unique generative composition seeded by its slug, with the title set in the site's type. Every past and future piece gets a recognizable, personality-dense share card with zero per-post effort.
**Axis:** site-as-artifact-personality
**Basis:** `direct:` the generative logo exists as a published experiment; no OG pipeline exists. `reasoned:` share cards are the most-seen surface of the site for this audience — links land in Slack/LinkedIn/email before anyone visits, so personality investment there has the highest impressions-per-effort ratio of any visual change.
**Rationale:** Turns a toy into a system — literally demonstrating the "design engineer who ships systems" perspective — while making every future publish distinct in feeds automatically.
**Downsides:** Canvas/SVG → static image rendering at build time takes some plumbing.
**Confidence:** 85%
**Complexity:** Low-Medium
**Status:** Unexplored

### 7. The Live Colophon
**Description:** A `/colophon` that is generated, not just written: build-time component census, dependency list with one-line justifications, live deploy/subscriber stats from Vercel/Convex, per-page "view source" links — woven with the decision stories that currently live nowhere public: the typography evaluation that kept PP Mondwest, the broken-window 404, the 3D book, the pixel icons.
**Axis:** site-as-artifact-personality
**Basis:** `external:` colophons are a recognized genre the engineer/design-lead audience actively seeks out; live-data colophons are rare. `direct:` the site's personality artifacts are completely unannotated; the typography-swap evaluation is a real documented rejected direction with reasoning.
**Rationale:** For an audience that evaluates craft by reading construction, a computed colophon is unfakeable — it proves the "design in code" identity claim mechanically and partially covers the case-study gap with zero new project work.
**Downsides:** Self-referential tone needs calibration to stay charming rather than precious.
**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Ask the Corpus / Ask the Site (Q&A over own writing) | Too expensive (retrieval quality, hallucination guardrails) relative to a skimmable 11-piece corpus; revisit as the corpus grows |
| 2 | Playbill About / Timeline About / Permanent Record / Start Here | Absorbed into survivor #1 (composite Front Door) |
| 3 | Self-Writing /now page | Absorbed into survivor #1 as the auto-now strip |
| 4 | Letters Unlocked / Dispatch Ledger | Absorbed into survivor #4 (auto-trigger + status annotations) |
| 5 | The Firehose (everything-feed incl. commits + moods) | Novelty exceeds value; privacy/noise risk; standard RSS ships in #4 |
| 6 | Growth-stage markers (standalone) | Absorbed into survivor #2 (`status` field) |
| 7 | Obsidian wikilinks → backlinks (standalone) | Absorbed into survivor #2 as optional extension |
| 8 | Revision Strata (git history as visible diffs) | Raw edit history is noise-prone and risks exposing unconsidered drafts |
| 9 | Second-Edition Marginalia | Habit-dependent; the "do I still believe this" mechanic is carried by #2/#4 |
| 10 | Threads, Not Tags / Curator's Wall Text | Corpus too small to need it; `related`/`via` (#2) + omakase notes (#5) deliver most value now; revisit at ~25+ pieces |
| 11 | The Concordance (claims-level fragment index) | Too precious at 11 pieces; extraction effort high, risks reading as self-quoting |
| 12 | Working Notes / Auto-Garden stream | Real cadence commitment with public-staleness risk; prove the vault pipeline via #1 first |
| 13 | The Cutting Room Floor (rejected-directions log) | Only one documented rejection exists so far; fold the typography story into #7 |
| 14 | Liner Notes on every piece | Per-piece writing commitment; overlaps #3 (experiments) and #7 (site); revisit as a Records Universe extension |
| 15 | Experiments as Furniture (experiments as site chrome) | Highest wow but high cost/risk (perf, maintenance, coupling); #3 + #5 deliver the surfacing |
| 16 | Kill the Timeline (homepage reorg) | Full reorg duplicates what #5 achieves additively at lower risk |
| 17 | Activate lab.*/tools.* subdomain for experiments | Splits a small corpus across domains; SEO dilution; save infra for actual tools |
| 18 | Selected Work as Decision Journals | A content-writing project (with NDA navigation), not a site enhancement; separate effort |
| 19 | The Jig Wall (pegboard of self-built tooling) | Duplicates #7 at lower generality |
| 20 | Essays with Receipts (claim→artifact links) | Enabled by #2's `related` field and #5's pairings |
| 21 | The Anti-Portfolio (auto per-page provenance footers) | Commit-footer noise; "view source" belongs in #7 with less surface area |
| 22 | Expressive MDX Primitives Library | Premature generalization — extract when the next interactive essay needs one |
| 23 | The 60-Second Cut (timed guided tour) | Expensive production for an auto-advancing format visitors often skip; #5 serves the same visitor |
| 24 | New Game Plus (read-gated B-Sides drawer) | Gates the best material away from first-visit evaluators — the exact audience |
| 25 | Text Mode (zero-JS shadow site) | Witty but a permanent maintenance tax on every future page |
| 26 | The Daily Pressing (date-seeded daily edition) | Adds first-impression complexity and QA burden; #6 captures generative identity cheaper |
| 27 | The Listening Shelf (vinyl guestbook) | Anonymous-write moderation surface; revisit after #4 ships |
| 28 | Dear [Name] (single-reader editions) | Outbound instrument rather than a site enhancement; worth its own brainstorm |
| 29 | The Records Universe (site-wide vinyl system) | Design direction, not an actionable feature; informs #4's crate framing |
