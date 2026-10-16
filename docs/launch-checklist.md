---
created: 2026-09-23
branch: claude/site-redesign-portfolio-focus-2ca39a
status: pre-launch — structure done, content and assets outstanding
---

# Launch checklist: portfolio-first redesign

The restructure (plan `docs/plans/2026-08-13-001-refactor-portfolio-first-ia-plan.md`) is built
end to end: U1–U9 all have code on this branch, and `npm run build` is clean. "Half done" is
about **content and assets**, not structure. Most of what's left is material only you can
supply.

Status key: **Blocker** = can't launch without it · **Should** = launch looks unfinished
without it · **Nice** = fine to follow up after launch.

---

## 1. Hard blockers

| | Item | Why it blocks |
|---|---|---|
| **Blocker** | Delete or draft the three `sample-*` case studies in `src/content/work/` | They're fabricated. A production deploy (`VERCEL_ENV=production`) now **fails the build** while they're published. Preview deploys still build, so layout review keeps working. |
| **Blocker** | Resolve the merge with `main` | `main` has PR #7 (About page removed pending revision). Merging it into this branch conflicts in 4 files. See §5. |
| **Blocker** | Decide what About ships as | You pulled About from `main` on 2026-09-02 to revise it. This branch keeps a restructured About. Either the revision happens here before launch, or About stays out of the nav at launch. |

With the samples gone, the site holds together at **zero** case studies: the homepage hides
Work, and `/work` still shows the career timeline. At **one**, the homepage shows a single wide
feature card. So one real case study is enough to launch the Work section. It doesn't need three.

---

## 2. What I need from you

Things I can't make without inventing facts (PRODUCT.md, principle 3).

### Content

| | Item | Where it goes |
|---|---|---|
| **Should** | **At least one real case study.** Problem, approach, outcome, and any metric that clears review. | Copy `src/content/work/_template.mdx`. Raw notes → `docs/work-source/` |
| **Should** | Refresh the "now" strip. It renders **"Updated June 10, 2026"**, which will be over three months stale at launch. | `src/data/now.ts` (bump `updated`) |
| **Should** | Role titles and start/end dates. Titles are blank, and the timeline has no date rail yet. | `src/data/roles.ts` |
| **Nice** | The earlier roles (agencies, dev shops, startups) broken out as real entries instead of one summary line | `src/data/roles.ts` |
| **Nice** | Which prior employers can be named, and what clears review at Marriott | Unblocks more case studies and a logo row |

**A suggestion for case study #1:** `sample-provisioning-console` makes the same ~50%
claim that the retired **Hold to Provision** experiment actually earned (PRODUCT.md, "Evidence on
Hand"). The real version of that story already exists: a live prototype and a measured result.
Writing it up from real notes gets you the strongest case study you have, and it's the one
least likely to hit NDA problems.

### Assets

| | Item | Where it goes |
|---|---|---|
| **Should** | Hero portrait (square, head and shoulders) | `public/images/`, then `src` + `alt` in `src/data/photos.ts` |
| **Nice** | About portrait, plus up to four gallery photos | Same file. Any number from 0–4 works; the gallery adjusts its columns. |
| **Nice** | Case study cover images | `cover` + `coverAlt` in the case study's frontmatter |
| **Nice** | Company logos, light and dark variants | No slot built yet; waits on the "nameable employers" answer |

Photos are no longer a blocker. Empty slots now render nothing in production and the layout
closes up around them (see §3), so every photo is an upgrade, not a gap. A photo with a `src`
but no `alt` **fails the build** on purpose.

### Facts and links

| | Item | Where it goes |
|---|---|---|
| **Should** | Your **LinkedIn** URL. Only GitHub and X are linked, and LinkedIn is the first link your evaluator audience looks for. | `src/components/Sidebar.astro` + `Footer.astro` |
| **Nice** | Location + IANA timezone for the sidebar's local-time detail. Hidden until both are set. | `src/data/site.ts` |

### Decisions

| | Question | Current behaviour |
|---|---|---|
| **Should** | **Dark by default, or follow the OS?** AGENTS.md and PRODUCT.md both say "dark mode is the default". The code follows the visitor's OS setting, so anyone on light mode gets light. | Follows OS. Forcing dark is a one-line change in `BaseLayout.astro`. |
| **Nice** | Should Hold to Provision / Bricklayer come back to Lab? | Drafted, with a 302 to `/lab`. Restoring one = flip `draft` + remove it from `RETIRED_LAB_PATHS` in `src/middleware.ts`. |
| **Nice** | Substack: committed or still evaluating? | Doesn't block launch. The seam in `src/lib/writing.ts` covers both. |

### Environment (new machine)

- **`.env`** — none on this machine, so `npm run dev` fails on its `convex dev` half. Static
  pages work via `npm run dev:astro`. Needed: `CONVEX_URL`, `RESEND_API_KEY`,
  `RESEND_FROM_EMAIL`, `RESEND_NEWSLETTER_SEGMENT_ID`, `RESEND_BOOK_SEGMENT_ID`,
  `NEWSLETTER_SEND_TOKEN`, `ANTHROPIC_API_KEY`. `npx vercel env pull .env` if they live in Vercel.
- **Design canvas** — `design/README.md` says the `/design` skill's seeding helper is
  machine-local. Run `/design` once here before re-seeding the canvas.

---

## 3. Fixed in this pass

All on this branch, uncommitted. Verified in the dev server at 375px and 1440px, in both
themes, with JS off, and in a production build.

**Layout**
- **Band across the top of every page in dark mode.** `<main>`'s top margin collapsed through
  `<body>`, exposing `<html>`, whose pre-paint colour was still the pre-"darker palette" value.
  Fixed both: `display: flow-root` on `.site-shell`, and synced the inline colours in
  `BaseLayout.astro` (now commented as needing to track `global.css`).
- **Case study page said "Outcome" twice.** The layout rendered the `outcome` field *after* a
  body that ended in its own `## Outcome`, and the template told authors to write both. The
  header now carries company, role, timeline and a one-line **Result**, which is what a
  two-minute evaluator needs first. The body tells the story. Template updated so future case
  studies don't repeat themselves.
- **Case study prose** now reads at the same 672px measure as notes and guides (it was ~40% wider).
- **Case study tags** were jammed against the description: a scoped `margin: 0` silently beat
  Tailwind's `mt-5`.
- **One case study on the homepage** sat in the first of three columns beside two empty ones.
  Columns now follow the count, and a single study becomes a wide horizontal card.

**Photos and covers**
- Placeholders ("Hero portrait — head and shoulders…", "Cover image") rendered in
  **production**. They're now dev-only: production omits the slot, the hero and About
  masthead go single-column, and the gallery disappears when empty. DESIGN.md updated to match.

**Mobile and accessibility**
- **With JS off, the mobile nav was unreachable.** The panel shipped `hidden` and only JS
  could open it. It now renders open without JS and scrolls away with the page; the dead menu
  button is hidden.
- Mobile menu: **Escape** closes it and returns focus. Mobile links get `aria-current`.
- Mobile header buttons were **20×20px**, below WCAG 2.2's 24px minimum. Now 44×44 without
  changing the bar's height.
- Theme toggle: the label now states the current theme, it no longer breaks when storage is
  blocked (private mode), and it's hidden without JS instead of being an empty focusable button.
- Record collection experiment: the disc looked clickable and wasn't. The whole preview is now
  one link, the CTA reads as the page's primary action, uses the site's mono face instead of
  Courier New, and says it opens a new tab.

**Build**
- **42 warnings per build down to 0.** `src/middleware.ts` read request headers during
  prerender. The noise was burying the one warning that mattered: fabricated content is published.
- **Fabricated content can't reach production.** `scripts/check-routes.mjs` fails a production
  deploy on `sample-*` entries and prints the warning last, not before a green check.
- `.nvmrc` pins Node 22 to match Vercel's runtime.

**Copy (accuracy only)**
- Lab intro said every experiment runs "live in the page". The record collection opens on its
  own subdomain, so the line now just says "running live".

---

## 4. Tweaks still worth doing

Real issues I found and didn't fix, because they need your call, touch working experiment
internals, or are post-launch polish.

| | Item | Notes |
|---|---|---|
| **Should** | Icon-rail sidebar (768–1279px) has no visible labels or tooltips | The names are there for screen readers (`aria-label`), but sighted users get icons only. A hover/focus tooltip would fix it. |
| **Should** | Regenerate the design canvas | The case study header and placeholder behaviour changed. `node design/artboards.mjs`, then re-seed with `/design`. |
| **Nice** | OG images | Every page shares one static card. Ideation #6 (generative per-slug cards) is still the cheapest big win for shared links, which is how evaluators actually arrive. |
| **Nice** | RSS feed | Called a craft gap for this audience in the June ideation doc (#4). |
| **Nice** | Experiments animate layout properties | `max-height`/`width`/`margin` transitions in `RecordCollection.jsx` and `Bricklayer.astro`. Already in `docs/parking-lot.md`. |
| **Nice** | Unused `pixelarticons` dependency | Parking lot. Safe to remove. |
| **Nice** | Dev pages take ~1.5s each to render | Dev only (production is prerendered). Not traced. |

---

## 5. Merging with `main`

`main` is one PR ahead (#7, 2026-09-02: About removed pending revision). A trial merge
conflicts in:

| File | `main` | This branch | Resolution |
|---|---|---|---|
| `src/components/Nav.astro` | removed its About link | deleted (replaced by `Sidebar.astro`) | **Delete.** The sidebar supersedes it. |
| `src/pages/index.astro` | removed the "About Me" CTA | rewritten homepage | **Take this branch.** The CTA row no longer exists here. |
| `src/pages/about.astro` | deleted | restructured | **Your call** (§1). Keep this branch's version if About ships; otherwise delete it and drop About from `navLinks` in `Sidebar.astro`. |
| `src/data/now.ts` | deleted | edited | Follows About. It's only used there. |

---

## 6. Verify on the first real deploy

The build can't check these (AGENTS.md):

- [ ] `vinyl.alexanderussell.com` loads the record collection (middleware rewrite + route injection)
- [ ] `/experiments/*` → `/lab/*` and `/logs/*` → `/notes/*` redirect with 301s
- [ ] `/lab/hold-to-provision` and `/lab/bricklayer` 302 to `/lab`
- [ ] Newsletter subscribe works end to end (needs `.env`)
- [ ] Share a URL in Slack and LinkedIn and check the card
- [ ] Both themes, phone width, JS disabled, one last time on the real URL
