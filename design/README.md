# Design canvas

Artboards of the site, published as a Claude Design canvas for visual iteration.

Live canvas: https://claude.ai/code/artifact/905263ed-41a1-475b-87dd-68ee87cd1a04

## What's here

| File | Role |
|---|---|
| `build.mjs` | Shared prelude: design tokens, component CSS, icon helper, artboard wrapper |
| `artboards.mjs` | Per-artboard content. Run it to regenerate every `.dc.html` |
| `*.dc.html` | The nine artboards. **Generated — edit `artboards.mjs`, not these** |
| `canvas.json` | Layout: positions, the two pages, sticky notes, launch view |
| `icons.json` | Lucide paths extracted from `node_modules/lucide-astro` |
| `mondwest.woff2` | PP Mondwest subset (basic Latin + punctuation), inlined per artboard |

The seeded output (`alexanderussell-site.html`, ~2.4 MB) is gitignored. It is a
generated bundle of the canvas editor plus the artboards, and it re-seeds from
the files above.

## Regenerating

```bash
node design/artboards.mjs
```

Then re-seed and publish with the `/design` skill, which owns the seeding
helper. The helper lives in the skill's bundled directory and is machine-local,
so on a fresh checkout run `/design` once before re-seeding.

The font subset was produced with fonttools:

```bash
pyftsubset public/fonts/PPMondwest-Regular.otf --output-file=design/mondwest.woff2 \
  --flavor=woff2 --unicodes="U+0020-007E,U+00A0,U+2018-201D,U+2013,U+2014,U+2022,U+00B7,U+2026,U+2192,U+2190" \
  --layout-features="" --no-hinting --desubroutinize
```

## Where the values come from

Tokens are the **resolved** values from `src/styles/global.css` — the oklch
literals, not approximations, and not snapped to a 4/8px grid. Component
geometry (`.card-surface`, `.growth-stage`, `.writing-row`, the sidebar) is
lifted from the components themselves. Icon geometry comes from the installed
`lucide-astro`, not from memory.

When a token changes in `global.css`, change it in `build.mjs`'s `PRELUDE` and
re-run the generator so all nine artboards stay in sync.

## Known gaps

- Inter and JetBrains Mono load from Google Fonts, so PNG/PDF exports fall back
  to system faces. PP Mondwest is embedded and exports correctly.
- The three `sample-*` case studies appear on the Home and Work artboards
  because they are still published on the live site.
- Touch targets in the artboards match the live site, including the ones under
  44px (subscribe button ~26px, sidebar links ~34px). Deliberate: a mockup that
  quietly corrects the app is no longer useful for iterating on it.
