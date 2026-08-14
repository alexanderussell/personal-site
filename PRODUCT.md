# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — evaluators, first visit, short.** Design leads, engineering managers, and hiring
managers deciding whether Alex is worth a conversation. They arrive from a link, spend on the
order of two minutes, and are asking one question: does this person actually build things, or
just talk about building them.

**Secondary — practitioners, returning.** Fellow design engineers and UX people who read the
essays, poke at the experiments, and come back. They reward depth that the first audience will
never reach.

The two are served by different surfaces rather than by compromising one page for both: Work
and About carry the evaluator; Writing and Lab reward the reader.

## Product Purpose

A personal site for Alex Russell — portfolio first, public knowledge base second.

Success is a design or engineering leader coming away with the impression that Alex is a
design engineer who ships. The site exists to correct an undersell: "leads UX at a hotel
company" does not convey the building, and a reverse-chronological content feed asked visitors
to infer competence from a dozen scattered artifacts. Whether a specific role results is not
the measure — being read correctly is.

## Positioning

Alex works where design and engineering stop being separate jobs. The specific, hard-to-copy
combination:

- **Developer tools and internal platforms at enterprise scale.** The users are engineers, the
  interfaces are infrastructure, and the thing being designed is usually trust — whether
  someone believes what happens after they click. Most design portfolios are consumer work.
- **Design systems treated as infrastructure**, measured by what they enable rather than what
  they contain.
- **Working prototypes over mockups.** The interactive experiments are live on the site rather
  than screenshotted. This is the differentiating proof and the thing a neighboring portfolio
  cannot fake.
- **A blended route in** — agencies, dev shops, startups, and a design collective before going
  deep on developer experience.

## Operating Context

- Visitors arrive from a shared link (Slack, LinkedIn, email) before ever seeing the homepage,
  so share cards and detail pages are often the true entry point.
- The evaluator's pass is short and single-session. The reader's is repeat and unhurried.
- Publishing is markdown in the repo plus a git push. Writing and project summaries are
  authored and versioned as markdown, as is a good deal of adjacent AI work (agent configs,
  skills, docs) that may become publishable material.
- Distribution may move to Substack. The repo stays the durable archive regardless — platform
  is distribution, not the record.
- A newsletter goes out on publish, via Convex and Resend.

## Capabilities and Constraints

**Confirmed technical constraints** (established by the existing codebase):

- Astro 5 with `output: 'server'`, per-page `prerender = true`; Tailwind 4 with tokens in
  `src/styles/global.css`; MDX content collections; React islands only where needed.
- Convex (subscribers, moods, send idempotency) and Resend (email). This pipeline is hardened
  and its reasoning is recorded in `docs/solutions/`.
- Vercel hosting. Redirects live in `src/middleware.ts`, never `vercel.json`.
- A `vinyl` subdomain rewrite exists and has no build-time guard; it must be verified on deploy.
- No test framework, deliberately. Verification is `npm run build`, which includes a route and
  reference integrity check.
- Domain is **`alexanderussell.com`** — one `r` at the seam. The display name is "Alex Russell"
  with two. Both are correct; neither is a typo.

**Explicitly undecided:**

- Whether writing moves to Substack.
- Role dates and job titles for the career timeline (`src/data/roles.ts` is seeded without them
  rather than with guesses).

## Brand Commitments

- **Name and voice.** First person, dry, specific. Willing to be funny in small places — the
  rotating link tooltips, the broken-window 404 — without the page becoming a bit. Copy that
  sounds like a language model is a defect.
- **Typography is settled**: PP Mondwest (display), Inter (body), JetBrains Mono (UI and
  metadata). This was evaluated against a proposed swap and deliberately kept.
- **Dark mode is the default**, with a light toggle, applied before paint to avoid a flash.
- **Existing personality artifacts** that carry identity: the generative logo, the
  broken-window 404, the 3D CSS book page, the vinyl mood interface. Interface icons are
  Lucide; the hand-drawn pixel glyphs were retired in August 2026 for legibility at small
  sizes.
- Content must stay visible without JavaScript, and motion must respect
  `prefers-reduced-motion`. Both are honored in the current implementation.

## Evidence on Hand

**Published:** 5 essays, 2 guides, 4 interactive experiments (Bricklayer, Generative Logo,
Hold to Provision, Ask My Dad's Record Collection), and a book waitlist page. Experiment
write-ups carry real detail — Hold to Provision cites a ~50% reduction in unintentional
infrastructure provisions.

**Available for case studies, not yet written up:**

- Marriott internal-platform work, partially cleared for public description. Some of it will
  not carry shareable metrics.
- Collectively Made client work, with fewer clearance constraints than the enterprise work.
- Personal projects and the existing Lab experiments, which carry no clearance question at all.
- **Figma decks and recorded walkthroughs exist** for portfolio pieces. Embedding both is a
  real requirement, not a hypothetical.

**Absent — must not be fabricated:**

- No testimonials, endorsements, or quotes. No social-proof section can be built from real
  material today; it is omitted rather than invented.
- No photography supplied yet. Six photo slots render labelled placeholders until filled.
- No confirmed employment dates or titles beyond the current Marriott role.
- Company logos have not been gathered, and which prior employers are nameable is unconfirmed.

## Product Principles

1. **Show the work, then the thinking.** Case studies lead; essays and experiments are the
   proof underneath. This reverses the site's original stated objective, deliberately.
2. **Real beats rendered.** A running prototype on a URL ends arguments a mockup can only
   start. Where a live artifact is possible, ship the artifact rather than a picture of it.
3. **Never fabricate evidence.** Absent metrics, testimonials, and history stay absent. An
   honest qualitative result beats an invented number, and NDA limits are a reason to omit a
   section rather than to soften a claim.
4. **The first pass and the return visit are different jobs.** Optimize the evaluator's
   two-minute scan without flattening the depth that brings practitioners back.
5. **Publishing friction stays near zero.** Anything that adds a step between writing markdown
   and pushing is suspect, however good it looks.

## Accessibility & Inclusion

No external standard has been mandated, but the implementation already commits to:

- Content readable with JavaScript disabled; entrance animation is gated so it can never hide
  content from a crawler or a no-JS visitor.
- `prefers-reduced-motion` honored.
- Both light and dark themes are first-class, not an afterthought.
- Meaningful alternative text is a required field on every photo slot, not an optional one.

These are commitments to preserve, not aspirations.
