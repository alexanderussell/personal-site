# AGENTS.md

House rules for agents working in this repo. Read this before making changes.

## What this is

`alexanderussell.com` — Alex Russell's personal site. Portfolio first, public knowledge base
second. Static-first Astro, deployed to Vercel.

Note the domain spelling: **`alexanderussell.com`** (one `r` at the seam — "alexander" +
"ussell"). The display name is "Alex Russell" with two. Both are correct in their place; do
not "fix" either.

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro 5, `output: 'server'` with per-page `export const prerender = true` |
| Styling | Tailwind 4 via `@tailwindcss/vite` (no `tailwind.config.js` — tokens live in `src/styles/global.css`) |
| Content | MDX content collections (`src/content/`), zod schemas in `src/content.config.ts` |
| Interactivity | Astro components with inline `<script>`; React islands only where genuinely needed |
| Backend | Convex (newsletter subscribers, moods, sent-post idempotency) |
| Email | Resend, with React Email templates in `src/emails/` |
| Hosting | Vercel, via `@astrojs/vercel` |

Most pages are prerendered. `src/pages/api/*` and anything reading request state are not.

## Information architecture

```
/            Home — hero + Work / Lab / Writing previews
/about       Beliefs-with-receipts, start-here path, now strip
/work        Career timeline + nested case studies
/work/[slug] Case study detail
/lab         Interactive experiments gallery
/lab/[slug]  Experiment detail
/writing     Merged notes + guides index
/notes/[slug]  /guides/[slug]   Detail pages (namespaces preserved deliberately)
/book        Book waitlist
```

## Content collections

Four collections. `notes`, `guides`, and `lab` share `sharedSchema`; `work` has its own.

**Shared schema fields that matter** (all optional unless noted):
- `title`, `date`, `description` — required
- `status` — `seedling | growing | evergreen`, renders a growth badge
- `related` — array of `"collection/slug"` refs, e.g. `"lab/bricklayer"`
- `via` — provenance line, what prompted the piece
- `draft` — excluded from build when true

**`related` refs are load-bearing and fragile.** They are plain strings resolved at build
time against collection names. Renaming a collection invalidates every ref pointing at it.
`scripts/check-routes.mjs` fails the build on an unresolved ref — do not downgrade that to a
warning.

## Conventions

**Redirects live in `src/middleware.ts`, not `vercel.json`.** There are existing rules for
`/logs` → `/notes` and `/experiments` → `/lab`. `vercel.json` is intentionally `{}`. One
mechanism, one place to audit.

**`src/middleware.ts` also rewrites the vinyl subdomain** to a real page path. If that page
ever moves, the rewrite target must move with it. This has no build-time guard beyond the
route check — verify it against a real deploy.

**Design tokens only.** Colors, type, and spacing come from `src/styles/global.css` and
Tailwind. Do not introduce raw hex values or one-off font sizes.

**Fonts are settled**: PP Mondwest (display, `font-heading`), Inter (body, `font-body`),
JetBrains Mono (UI/metadata, `font-mono`). This was evaluated against a swap and deliberately
kept. Not up for re-litigation without an explicit ask.

**Dark mode is the default.** The theme is applied by an inline script in `BaseLayout` before
paint to avoid a flash. Entrance animations are gated on `html.js` so content stays visible
without JavaScript — preserve that when adding animation.

**Dates render in UTC.** Frontmatter dates coerce to UTC midnight; formatting without
`timeZone: 'UTC'` shifts them a day on UTC-negative machines. This has already been fixed
once — do not reintroduce it.

**Publishing path is markdown + git push.** Anything that adds a step to that is suspect.

## Testing

There is no test framework, and that is a deliberate choice for a static content site.
Verification is:

```bash
npm run build          # must succeed; also runs the route check
```

`scripts/check-routes.mjs` asserts every known-published URL resolves and every `related` ref
points at a real entry. When you add a permanent URL, add it there.

Manual QA before shipping UI work: both themes, mobile and desktop widths, and JS disabled.

## Do not touch without a specific reason

- `src/pages/api/*` and `convex/*` — the newsletter pipeline is hardened, with the reasoning
  recorded in `docs/solutions/`. Security and idempotency patterns there are intentional.
- `scripts/fix-vercel-routes.mjs` — post-build route injection for the vinyl subdomain and
  asset caching. Subtle ordering; the comments explain why.
- Existing published URLs. Redirect, never break.

## Where decisions live

- `PRD.md` — product requirements (§1 amended 2026-08-13)
- `docs/website-brief.md` — current design brief and open questions
- `docs/plans/` — implementation plans
- `docs/ideation/`, `docs/brainstorms/` — upstream thinking, including rejected directions
- `docs/solutions/` — institutional learnings; read before touching an area it covers
- `docs/parking-lot.md` — noticed-but-out-of-scope items
