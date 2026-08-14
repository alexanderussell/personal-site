---
name: alexanderussell.com
description: Portfolio and public knowledge base for Alex Russell — a workshop, not a showroom.
colors:
  bg-primary: "oklch(97% .003 56)"
  bg-secondary: "oklch(93% .005 48)"
  text-primary: "oklch(21.6% .006 56.043)"
  text-secondary: "color-mix(in srgb, oklch(21.6% .006 56.043) 60%, transparent)"
  accent: "oklch(15% .006 56)"
  border: "oklch(88% .012 58)"
  bg-primary-dark: "oklch(14.5% .005 52)"
  bg-secondary-dark: "oklch(21.5% .007 44)"
  text-primary-dark: "oklch(93% .003 48.717)"
  text-secondary-dark: "color-mix(in srgb, oklch(93% .003 48.717) 68%, transparent)"
  accent-dark: "oklch(97% .003 56)"
  border-dark: "oklch(38% .009 52)"
  type-note: "#60a5fa"
  type-guide: "#e67e22"
  type-experiment: "#eab308"
typography:
  display:
    fontFamily: "PP Mondwest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "PP Mondwest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.12em"
rounded:
  hairline: "2px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
  section: "4rem"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.875rem"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
  card:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "1.125rem 1.25rem"
  card-hover:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
  badge-growth:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.65rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
---

# Design System: alexanderussell.com

## Overview

**Creative North Star: "The Workshop"**

The site is the workshop, not the showroom. Tools stay visible, work sits on the bench in
whatever state it is actually in, and nothing is staged for a photograph. This is why the
experiments run live in the page instead of being screenshotted, why unfinished thinking
carries a growth badge instead of being hidden until polished, and why metadata — dates,
provenance, type — is exposed rather than tucked away. A showroom hides the process because
the process is unflattering. A workshop shows it because the process is the evidence.

The system is quiet by construction. Warm near-black and warm near-white carry almost every
surface; the type does the work; color is rationed so tightly that its appearance is
meaningful. Dark is the default and the primary composition, not an inverted afterthought.
Density is generous rather than tight — this is a place for reading and poking at things, not
scanning a dashboard.

Three typefaces divide the labor cleanly and never trade jobs. A pixel display face carries
voice, a neutral sans carries prose, and a monospace carries every piece of machine truth:
dates, types, labels, counts. The monospace is the workshop's measuring tape — it appears
wherever the system is stating a fact rather than making an argument.

**Key Characteristics:**
- Warm neutral foundation (hue ~56) in both themes; never a cold or pure grey
- Running prose is Inter at 15–17px; monospace is reserved for facts
- Dark mode as the default composition, light as a true peer
- Three fonts with strictly separated jobs — display, prose, machine truth
- Color rationed to content-type identification; no decorative accents
- Flat chrome, lifted artifacts
- Metadata is exposed, not hidden
- Every animation degrades to fully visible content without JavaScript

## Colors

A warm, near-monochrome foundation with three tightly-rationed content accents.

### Primary

- **Warm Ink** (`oklch(21.6% .006 56.043)` as text; the dark page sits deeper at
  `oklch(14.5% .005 52)`): The near-black that carries all body text in light mode, and a
  deeper relative of it that becomes the page itself in dark mode. Warm rather than neutral — it reads as
  ink on paper, not as a screen default.
- **Warm Paper** (`oklch(97% .003 56)`): The near-white page in light mode, and the text color
  in dark mode. The same warmth as the ink, inverted.

The system deliberately has no brand hue. `accent` is not a color in the usual sense: it is
whichever of the two extremes contrasts hardest with the current background
(`oklch(15% .006 56)` in light, `oklch(97% .003 56)` in dark). It is used for selection
highlight, focus emphasis, and the case-study outcome rule — moments that need maximum
contrast rather than personality.

### Tertiary

Three content-type accents, used only to identify what kind of thing the reader is looking at:

- **Signal Blue** (`#60a5fa`): Notes and essays.
- **Kiln Orange** (`#e67e22`): Guides.
- **Filament Yellow** (`#eab308`): Lab experiments.

### Neutral

- **Bench Surface** (`oklch(93% .005 48)` light / `oklch(21.5% .007 44)` dark): The single
  step away from the page background. Backs experiment stages, code blocks, and photo frames.
  There is no third surface level.
- **Faded Ink** (`text-secondary`): Body ink at 60% opacity in light, 70% in dark — deliberately
  a transparency of the text color rather than a separate grey, so it stays in key against any
  background it lands on.
- **Hairline** (`oklch(88% .012 58)` light / `oklch(38% .009 52)` dark): Borders and dividers,
  frequently mixed down further (`color-mix` at 60–80%) where a full-strength line would shout.

### Named Rules

**The Rationed Color Rule.** The three content accents identify content types and nothing else.
They appear on type icons, hover states, and left-border accents. They never fill a button,
never back a surface, never emphasize a word. On a typical page, colored pixels are well under
1% of the composition. That scarcity is the entire reason they read as a system rather than
as decoration.

**The Warm Neutral Rule.** Every neutral sits at hue 34–58. There are no cold greys and no
pure `#000` or `#fff` anywhere in the system. If a new neutral is needed, it inherits the
warmth or it does not belong.

**The Transparency-Over-Grey Rule.** Secondary text is the primary text color at reduced
opacity, never a separately-chosen grey. It therefore adapts automatically to whatever surface
it lands on, and can never drift out of key with its own theme.

## Typography

**Display Font:** PP Mondwest (with `ui-sans-serif`, `system-ui` fallback)
**Body Font:** Inter Variable (with `Inter`, `ui-sans-serif` fallback)
**Label/Mono Font:** JetBrains Mono Variable (with `JetBrains Mono`, `ui-monospace` fallback)

**Character:** A pixel-era display face against a neutral contemporary sans and a precise
monospace. The pairing is the thesis of the site in three fonts — something handmade and
slightly strange doing the talking, something invisible and modern doing the reading, and
something mechanical stating the facts. The combination was evaluated against a proposed swap
and deliberately kept.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 7vw, 4rem)`, 1.02, `-0.01em`): PP Mondwest. Page-defining
  statements only — the About name, a case-study title. One per page, at most.
- **Headline** (400, `clamp(1.5rem, 4vw, 2rem)`, 1.35): PP Mondwest. Section-leading statements
  and the hero sentence. Where the site speaks in its own voice.
- **Title** (600, `1.125rem`, 1.4): Inter. Card and list-item titles, role names, component
  headings. The workhorse for anything scannable.
- **Body** (400, `1rem`, 1.75): Inter. Prose and descriptions. Constrained to roughly 42rem
  (~70ch) so lines never outrun the eye.
- **Label** (600, `0.6875rem`–`0.8125rem`, `0.08em`–`0.14em`, uppercase): JetBrains Mono.
  Section eyebrows, dates, content types, growth stages, project metadata.

### Named Rules

**The Three Jobs Rule.** Mondwest speaks, Inter reads, JetBrains Mono states facts. A font
never takes another's job. Prose never gets set in the display face because it looks
characterful; a date never gets set in Inter because it fits better.

**The Monospace-Means-Fact Rule.** If it is machine truth — a date, a type, a duration, a
count, a status, a file path — it is monospace, uppercase where it is a label, and letterspaced.
If it is an argument, an opinion, or a description, it is not. Running prose set in JetBrains
Mono at 13–15px was this site's single largest legibility cost; body copy is Inter at 15–17px
with a 40rem measure, and the mono stayed where it measures rather than where it reads.

**The No-Eyebrow Rule.** No kicker label above a heading. A section index that says "WORK" over
a headline is repeating what the nav, the URL, and the title already said. The heading carries
its own weight.

**The One Display Line Rule.** At most one Display-scale element per page. Its authority comes
from being alone.

## Layout

A single centered column at `max-width: 56rem` (`max-w-4xl`) with `1rem` gutters, holding every
page. Prose and narrative blocks narrow further to roughly `42rem` for line length. There is no
sidebar, no multi-column reading layout, and no full-bleed section — the column is the site's
spine and nothing breaks out of it.

Vertical rhythm is section-scale rather than tight: `4rem` (`py-16`) between major page
sections, `2.5rem` between timeline entries, `1.5rem` between cards in a grid, `0.875rem`
between stacked list items. Generous space is doing hierarchy work that borders and boxes would
otherwise have to do.

Grids collapse to one column below `640px` and step up at two breakpoints only: `640px` (two
columns for cards) and `768px` (three columns, and the point where side-by-side portrait
layouts engage). Timeline rails and other decorative structure are hidden below `640px` rather
than compressed — on a narrow screen the horizontal space belongs to the content.

**The Column Rule.** Everything lives in the 56rem column. If a design idea requires breaking
out of it, the idea changes, not the column.

## Elevation & Depth

Chrome is flat; artifacts are lifted. Navigation, cards, list items, and section containers sit
flush on the page and are separated by 1px hairlines and the single background tonal step.
Nothing in the interface layer casts a shadow at rest.

Things that behave like physical objects are the exception, and they earn real depth: the 3D
book, the vinyl record, the generative logo, the experiment lightbox. These are artifacts on
the workbench rather than interface chrome, and shadow is how the system says so.

### Shadow Vocabulary

- **Artifact rest** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06)`): The generative logo at rest.
  Barely there — enough to lift it off the page.
- **Artifact hover** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)`):
  Light-mode hover lift on interactive artifacts.
- **Dark glow** (`box-shadow: 0 0 10px rgba(255, 255, 255, 0.15), 0 0 4px rgba(255, 255, 255, 0.08)`):
  The dark-mode counterpart. Shadow cannot read against a near-black page, so depth inverts into
  emitted light.
- **Lightbox scrim** (`box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15)`): Modal separation only.

### Named Rules

**The Chrome-Is-Flat Rule.** If it is interface — nav, card, button, container, row — it has no
shadow at rest. Depth in the interface layer comes from the background tonal step and hairline
borders, never from elevation.

**The Glow-Inverts Rule.** In dark mode, depth is emitted rather than cast. A shadow that works
on paper becomes a soft white glow on ink. Never ship a dark-mode surface with a black drop
shadow; it is invisible and it reads as a bug.

## Shapes

Rectilinear with softened corners, and a radius scale that is unusually tight for its scale of
element — nothing on the site is pill-shaped except deliberate badges.

- **Hairline (2–3px):** Pixel-art icons, small inline markers, tag chips. Nearly square,
  matching the pixel iconography.
- **Small (4px):** Tags, inline code, small toggles.
- **Medium (6px):** The default. Buttons, the generative logo, toolbars.
- **Large (10px):** Experiment stages, photo frames, cards — anything framing content rather
  than being content.
- **Pill (999px):** Growth-stage badges and hover tooltips only. The pill is reserved for
  things that annotate rather than contain.

Borders are 1px and hairline-colored, frequently mixed down to 60–80% strength. Placeholder and
pending states use a 1px **dashed** border — the system's consistent signal for "this slot is
real but empty," used by photo frames and the About narrative placeholder.

Iconography is [Lucide](https://lucide.dev) — a single library on a 24×24 grid with a uniform
2px stroke. It replaced hand-plotted pixel-art paths, which turned to mush at the 14–16px sizes
they actually rendered at and read as noise beside a label. The display face carries the era;
the icons carry clarity, and the division is deliberate. Brand marks (GitHub, X) stay as their
official glyphs — Lucide does not ship brand icons, and a redrawn logo is worse than none.

**The One Icon Family Rule.** Every icon comes from Lucide at 2px stroke. No mixed families, no
one-off hand-drawn glyphs, no emoji standing in for an icon.

**The Square-ish Rule.** Corners soften; they never round away. A 10px radius on a large card
is the ceiling. Fully rounded containers belong to a different system.

## Components

### Buttons

The site has no filled button. Every action is a ghost button or a text link — a deliberate
consequence of the rationed-color rule, since a filled button would need a brand color the
system does not have.

- **Shape:** Softly squared (`6px`).
- **Ghost (the default and only variant):** Transparent background, 1px hairline border,
  secondary text, monospace uppercase label at `11px` with `0.12em` tracking, `0.375rem 0.875rem`
  padding, often with a pixel icon at 40% opacity.
- **Hover:** Text goes to primary, border goes to `accent`, over `300ms`. The button gains
  contrast rather than fill.

### Cards

Cards with media are built in two planes: the media runs full-bleed to the card edge, and only
the body below it carries padding. `overflow: hidden` on the card is what lets the media meet
the rounded corner instead of leaving a square shoulder behind the radius.

- **Corner Style:** Large (`12px` on media cards, `10px` on text frames).
- **Background:** Transparent by default. Only inner stages (experiment previews, photo frames)
  take the `bg-secondary` tonal step.
- **Shadow Strategy:** None. See Elevation — cards are chrome.
- **Border:** 1px hairline, shifting to the content-type accent (Lab) or `accent` (Work) on hover.
- **Internal Padding:** `1.125rem 1.25rem`.
- **Link behavior:** Cards use a stretched-link pseudo-element so the whole card is clickable
  while the accessible name stays on the title text rather than being swallowed by the preview.

### Inputs

- **Style:** Minimal — hairline border, transparent background, medium radius.
- **Focus:** Border shifts to `accent`. No glow, no ring offset; consistent with flat chrome.

### Navigation

Monospace at `13px`, secondary color, no underline. The active section is primary-colored and
medium-weight — weight and color only, never a background pill or underline bar. Collapses to a
hamburger below `640px`, revealing the same links stacked. The generative logo sits at the left
as the home link and is the only element in the chrome that is ever colorful.

### Growth Badge (signature)

A pill-shaped monospace badge — `10px`, `600`, `0.14em` tracking, uppercase, 1px hairline border,
`0.25rem 0.65rem` padding — carrying `seedling`, `growing`, or `evergreen` with a matching pixel
glyph. It states the epistemic status of a piece of writing. It is the clearest expression of
the workshop north star in a single component: the system's willingness to publish something
while admitting it is unfinished.

### Timeline Rail (signature)

A vertical dashed rail with a pixel type-glyph at each node, connecting entries down a page.
Used for content chronology and the Work career spine. The rail hides entirely below `640px`.
Icons shift to their content-type accent and lift `1px` on row hover — one of the only places
color animates.

### Experiment Stage (signature)

A `bg-secondary` panel at `10px` radius holding a live, running experiment. Never a screenshot.
Below the fold, stages hydrate on visibility so a gallery of them does not tax first paint. An
entry without a renderable component degrades to a card with no stage rather than an error.

## Do's and Don'ts

### Do:

- **Do** keep every neutral warm (hue 34–58) and every secondary text value a transparency of
  its primary, not a separate grey.
- **Do** set machine truth in JetBrains Mono, uppercase and letterspaced when it functions as a
  label.
- **Do** ship the live artifact when one is possible. A running prototype outranks an image of a
  running prototype, every time.
- **Do** let the background tonal step and 1px hairlines carry separation in the interface layer.
- **Do** invert depth to an emitted glow in dark mode.
- **Do** gate every entrance animation on `html.js` so content stays visible without JavaScript,
  and honor `prefers-reduced-motion`.
- **Do** use a dashed 1px border for any real-but-empty slot.
- **Do** format every date in UTC. Frontmatter dates coerce to UTC midnight and shift a day
  without it — this has already been fixed once.

### Don't:

- **Don't** use the content accents for anything but content-type identification. No colored
  buttons, no colored backgrounds, no colored emphasis.
- **Don't** introduce a brand hue. The absence of one is the position, not a gap.
- **Don't** put a shadow on interface chrome, or a black drop shadow on a dark surface.
- **Don't** set prose in PP Mondwest or metadata in Inter.
- **Don't** exceed one Display-scale element per page.
- **Don't** break content out of the 56rem column.
- **Don't** add a raw hex value or a one-off font size. Tokens live in `src/styles/global.css`.
- **Don't** set running prose in JetBrains Mono. Body copy is Inter; mono is for facts.
- **Don't** put an eyebrow label above a heading.
- **Don't** apply Tailwind Typography's `prose` classes to a bare inline link. It injects
  `--tw-prose-links` (a cold blue at hue 264) into a palette with no brand hue. Use
  `.link-inline`.
- **Don't** mix icon families. Lucide at 2px stroke, or an official brand mark.
- **Don't** fully round a container. `10px` is the ceiling; pills are for badges and tooltips.
- **Don't** compress the timeline rail on mobile — hide it. Narrow screens belong to content.
