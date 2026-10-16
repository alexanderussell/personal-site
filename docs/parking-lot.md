# Parking Lot

Things noticed while working that are **not** the current job.

This is a scope valve, not a backlog. Nothing here carries a promise that it gets done.
The point is to write it down and keep moving, so the thing in front of you ships.

**How to use it:** when you notice something mid-task that isn't the task, add a line and
move on. Don't fix it. Don't open a discussion about it. If an item turns out to matter, it
graduates to `docs/plans/` on purpose, not by accident.

---

## Noticed during the portfolio-first IA rebuild (2026-08-13)

- ~~**`Astro.request.headers` warnings on prerendered routes.**~~ **Resolved 2026-09-23.**
  Source was `src/middleware.ts` reading `host` on every request, including prerender. It now
  uses `url.hostname` when `isPrerendered`. Builds went from 42 warnings to 0 — and the noise
  had been burying the route check's sample-content warning.
- ~~**Local Node is 25; Vercel functions run 22.**~~ **Resolved 2026-09-23** with an `.nvmrc`
  pinning 22. fnm picks it up (`fnm use`).
- **Three near-identical index pages** (`notes`, `guides`, `lab`) share structure with only
  copy differences. After `/writing` lands, revisit whether `/notes` and `/guides` should
  become thin filtered views of one component.
- **`ExperimentRenderer` uses a hardcoded `sourceMap`.** Every new Lab entry needs a manual
  entry in two places. A glob-based registry would make adding an experiment a one-file
  operation.
- **The screen/code toggle is commented out** in `ExperimentRenderer` and `TimelineItem`,
  along with the lightbox maximize button. Either finish these or delete them — commented
  blocks with TODOs age badly.
- **`BaseLayout`'s default OG image is static.** Ideation idea #6 (generative OG images per
  slug) would make every share card distinct at near-zero marginal effort.
- **`SUBDOMAINS.md` documents `studio.*` and `tools.*`** routing that is built but unused.
  Either activate or archive the doc.
- **No RSS feed.** Called out in the June ideation doc as a craft gap for this audience.
  Bundled there with the newsletter archive idea (#4).

- **Experiments animate layout properties.** The design detector flags
  `transition: max-height` in `RecordCollection.jsx` (two sites), `transition: margin-bottom`
  (one), and `transition: width` in `Bricklayer.astro`. These thrash layout rather than
  compositing. Real, but fixing them means reworking working experiment internals — not a
  polish-pass job.
- **`pixelarticons` is still a dependency** but nothing imports it now that icons are Lucide.
  Safe to remove on the next dependency sweep.

---

## Deferred from the current plan by design

These are in the plan's own Scope Boundaries — listed here so they're findable from one place.

- Community / testimonials section — no source material exists
- Colophon page (ideation #7)
- Substack feed adapter — the seam is built in `src/lib/writing.ts`; the integration waits
  on the platform decision
- Experiment "reveal the method" overlays (ideation #3)
- Public newsletter archive + RSS (ideation #4)
