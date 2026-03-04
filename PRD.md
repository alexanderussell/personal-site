# PRD: alexanderrussell.com

## 1. App Overview and Objectives

### Overview
A personal portfolio and writing site for Alex Russell, UX Engineer. Built with Astro, inspired by the typography-forward, minimal aesthetic of wking.dev. The site is a lean, content-first platform organized around three content pillars — Logs, Guides, and Experiments — surfaced through a shared chronological timeline on the homepage.

### Objectives
- **Showcase thinking, not just work.** Replace the traditional portfolio/case-study model with living content that demonstrates craft in real-time.
- **Stay lean.** Use Astro's static-first architecture to ship the minimum JavaScript necessary. No bloat, no over-engineering.
- **Support future expansion.** Architecture should cleanly support subdomains (e.g., `studio.alexanderrussell.com`, `tools.alexanderrussell.com`) without coupling them to the main site.
- **Ship fast, iterate later.** The MVP is the homepage + one content section (Logs). Guides and Experiments follow.

### Design Philosophy
The site draws direct inspiration from wking.dev's design language:
- Strong typographic hierarchy with careful font pairing
- Generous whitespace
- Dark mode default with light mode toggle
- Minimal UI chrome — content is the interface
- No unnecessary animations or visual clutter unless they serve the content

---

## 2. Target Audience

- **Primary:** Hiring managers, design leads, and engineering managers evaluating Alex's work and thinking
- **Secondary:** Fellow design engineers, UX practitioners, and developers who may find value in guides and experiments
- **Tertiary:** Alex himself — the site is a personal tool for organizing and publishing thinking

---

## 3. Success Metrics and KPIs

Given this is a personal site, metrics are lightweight and non-invasive:

| Metric | Target | How Measured |
|---|---|---|
| Site is live and functional | Launch within 2 weeks of starting dev | Deploy to Vercel |
| Content publishing friction | < 5 minutes from writing to published | MDX file + git push |
| Lighthouse performance score | 95+ across all categories | Lighthouse CI |
| First content published | At least 3 logs and 1 guide at launch | Manual |
| Subdomain architecture works | Can deploy independent project to subdomain | Vercel domain config |

---

## 4. Competitive / Inspiration Analysis

### wking.dev (Primary Inspiration)
- **What works:** Typography-driven design, content taxonomy (Guides, Demos, Logs, Tips), minimal layout, personality in copy, content-as-portfolio approach
- **What to adapt:** Alex's taxonomy is Logs/Guides/Experiments instead of Guides/Demos/Logs/Tips. Hero section will use generative art instead of photo.

### Other Notable Design Engineer Portfolios
- **josh.com (Josh Comeau):** Rich interactive content, MDX-powered, but heavier build. Inspiration for the Experiments section — small interactive demos embedded in content.
- **leerob.io (Lee Robinson):** Ultra-minimal, blog-focused, Next.js. Good reference for how little you actually need.
- **rauno.me (Rauno Freiberg):** Beautiful craft demos, dark aesthetic, minimal navigation. Inspiration for the visual tone.

### Key Differentiator
Alex's site leans into the UX engineering intersection — not purely dev content, not purely design. The Experiments section in particular bridges both worlds with demoable UI components, interactions, and animations.

---

## 5. Core Features

### 5.1 Homepage

**Purpose:** First impression + activity pulse

**Components:**
- **Navigation bar:** Site name/logo (left), section links: Logs, Guides, Experiments (right). Minimal. Dark mode toggle in nav.
- **Hero section:** Generative art canvas (lightweight, HTML Canvas or SVG-based). Unique on each visit. Below it: name, one-liner role description, and 2-3 links to current work/affiliations (like wking.dev's "snowflake / riff & refine" pattern).
- **Shared timeline:** A chronological feed of recent content from all three sections (Logs, Guides, Experiments). Each item shows: title, content type tag, date, and a short excerpt or description. Clicking goes to the full post. The timeline should display the most recent 10-15 items.
- **Footer:** Social links (GitHub, X/Twitter), copyright, minimal.

### 5.2 Logs Section (`/logs`)

**Purpose:** Short-form writing — essays, philosophies, learnings, reflections, devlogs

**Behavior:**
- Section landing page at `/logs` showing all logs in reverse chronological order
- Individual log pages at `/logs/[slug]`
- Each log has: title, date, reading time, content body, tags (optional)
- MDX-powered so interactive elements can be embedded when needed
- No comments system — keep it clean

### 5.3 Guides Section (`/guides`)

**Purpose:** Step-by-step guides for frameworks, patterns, and processes Alex has developed

**Behavior:**
- Section landing page at `/guides` showing all guides
- Individual guide pages at `/guides/[slug]`
- Each guide has: title, date, estimated reading time, content body, tags (optional)
- MDX allows for code blocks with syntax highlighting, callout boxes, step markers
- Guides may be longer-form than logs

### 5.4 Experiments Section (`/experiments`)

**Purpose:** Small demoable components, interactions, animations, games — things you can see and play with

**Behavior:**
- Section landing page at `/experiments` showing all experiments as cards (visual preview if possible)
- Individual experiment pages at `/experiments/[slug]`
- Each experiment has: title, date, description, embedded demo (via Astro island / iframe / MDX component), optional writeup
- Experiments are the interactive counterpart to the written content in Logs and Guides
- Astro's island architecture lets each experiment load its own JS only when needed

### 5.5 Dark Mode

**Behavior:**
- Dark mode is the default
- Toggle in navigation switches between dark and light
- Preference persists via `localStorage` (or cookie for SSR compatibility)
- Respects `prefers-color-scheme` on first visit, but defaults to dark if no preference
- Transition between modes should be smooth (CSS transition on background/color)

### 5.6 Generative Art Hero

**Behavior:**
- Lightweight generative art piece rendered on the homepage hero
- Should be Canvas or SVG-based — no heavy libraries (no Three.js for this)
- Generates a unique variation on each visit (seeded randomness)
- Should feel like a subtle, ambient piece — not a screensaver
- Must not block page load or degrade Lighthouse score
- Implemented as an Astro island with `client:load` directive

---

## 6. Content Model

All content is managed as MDX files in the repository. No external CMS.

### Shared Frontmatter Schema

```yaml
---
title: string          # Required. Display title.
date: string           # Required. ISO date (YYYY-MM-DD).
description: string    # Required. Short excerpt for timeline/cards/SEO.
tags: string[]         # Optional. For filtering/categorization.
draft: boolean         # Optional. Defaults to false. Drafts excluded from build.
---
```

### Content Collections (Astro Content Collections API)

```
src/content/
├── logs/
│   ├── my-first-log.mdx
│   └── ...
├── guides/
│   ├── shape-up-for-one.mdx
│   └── ...
└── experiments/
    ├── spring-animation.mdx
    └── ...
```

Each collection is defined in `src/content/config.ts` with Zod schema validation.

---

## 7. Technical Stack

### Core
| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Astro 5.x** | Static-first, zero JS by default, islands architecture for interactive pieces, content collections API |
| Content | **MDX** | Markdown with embedded components — perfect for experiments and rich guides |
| Styling | **Tailwind CSS 4.x** | Utility-first, minimal CSS output, great dark mode support via `dark:` variants |
| Deployment | **Vercel** | First-class Astro support, instant deploys, preview URLs, easy subdomain config |
| Language | **TypeScript** | Type-safe content schemas, component props |

### Supporting
| Concern | Solution | Notes |
|---|---|---|
| Syntax highlighting | **Shiki** (built into Astro) | Zero-JS code highlighting, theme-able |
| Image optimization | **Astro Image** (`astro:assets`) | Built-in, handles responsive images and format conversion |
| Fonts | **Self-hosted variable fonts** | Avoid FOUT/FOIT, no external requests. Match wking.dev's typographic feel. |
| Analytics | **None at launch** | Can add Plausible or Vercel Analytics later if desired |
| Generative art | **HTML Canvas API** | No library needed — vanilla JS in an Astro island |

### What We're NOT Using
- No React, Vue, Svelte, or other UI framework (unless needed for a specific experiment)
- No database
- No CMS
- No comments system
- No authentication
- No RSS feed (can add later)
- No search (can add later with Pagefind if needed)

---

## 8. Site Architecture

### URL Structure
```
alexanderrussell.com/                  → Homepage (timeline + hero + about)
alexanderrussell.com/logs              → All logs
alexanderrussell.com/logs/[slug]       → Individual log
alexanderrussell.com/guides            → All guides
alexanderrussell.com/guides/[slug]     → Individual guide
alexanderrussell.com/experiments       → All experiments
alexanderrussell.com/experiments/[slug]→ Individual experiment
```

### Subdomain Architecture
The main site lives at the apex domain. Subdomains are handled at the DNS/Vercel level and point to independent deployments:
```
alexanderrussell.com                   → This Astro site (Vercel project A)
studio.alexanderrussell.com            → Separate project (Vercel project B)
[anything].alexanderrussell.com        → Future projects (independent deploys)
```

No code in the main Astro site needs to know about subdomains. They are architecturally decoupled — just separate Vercel projects sharing a domain.

### File Structure
```
alexanderrussell.com/
├── public/
│   └── fonts/                    # Self-hosted fonts
├── src/
│   ├── components/
│   │   ├── Nav.astro             # Site navigation
│   │   ├── Footer.astro          # Site footer
│   │   ├── Timeline.astro        # Shared timeline component
│   │   ├── TimelineItem.astro    # Individual timeline entry
│   │   ├── ContentCard.astro     # Card for section listing pages
│   │   ├── ThemeToggle.astro     # Dark/light mode toggle
│   │   ├── GenerativeHero.astro  # Generative art island wrapper
│   │   └── hero-canvas.ts        # Canvas rendering logic
│   ├── content/
│   │   ├── config.ts             # Content collection schemas
│   │   ├── logs/
│   │   ├── guides/
│   │   └── experiments/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell, head, fonts, theme
│   │   └── PostLayout.astro      # Layout for individual content pages
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── logs/
│   │   │   ├── index.astro       # Logs listing
│   │   │   └── [...slug].astro   # Individual log
│   │   ├── guides/
│   │   │   ├── index.astro       # Guides listing
│   │   │   └── [...slug].astro   # Individual guide
│   │   └── experiments/
│   │       ├── index.astro       # Experiments listing
│   │       └── [...slug].astro   # Individual experiment
│   └── styles/
│       └── global.css            # Tailwind directives, font-face, base styles
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 9. Design Specifications

### Typography
Following wking.dev's approach of strong typographic hierarchy:

- **Heading font:** A distinctive display/sans-serif (candidates: Inter, Satoshi, General Sans, or a geometric sans). Should feel modern and clean.
- **Body font:** Highly readable at small sizes. Same family or a complementary one.
- **Monospace font:** For code blocks (JetBrains Mono or similar).
- All fonts self-hosted as variable fonts for performance.

### Color System
Dark mode default:

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--bg-primary` | Near-black (`#0a0a0a` range) | Near-white (`#fafafa` range) |
| `--text-primary` | White/off-white | Near-black |
| `--text-secondary` | Muted gray | Muted gray |
| `--accent` | TBD — a single accent color for links/highlights | Same |
| `--border` | Subtle dark border | Subtle light border |

Keep the palette minimal. One accent color max. The typography does the heavy lifting.

### Spacing and Layout
- Max content width: ~680-720px (optimal reading width)
- Generous vertical spacing between sections
- No sidebar — single column layout throughout
- Responsive: looks good on mobile through desktop with minimal breakpoint changes

---

## 10. SEO and Performance

### SEO
- Semantic HTML throughout (proper heading hierarchy, `<article>`, `<time>`, etc.)
- Dynamic `<title>` and `<meta description>` per page from frontmatter
- Open Graph and Twitter Card meta tags for social sharing
- Sitemap generation via `@astrojs/sitemap`
- Clean, readable URLs

### Performance
- Target: Lighthouse 95+ on all metrics
- Astro's zero-JS default handles most of this
- Self-hosted fonts with `font-display: swap`
- Optimized images via `astro:assets`
- No render-blocking resources
- Generative hero canvas should be lazy-loaded or non-blocking

---

## 11. Assumptions and Dependencies

### Assumptions
- Domain `alexanderrussell.com` (or similar) will be acquired and configured
- Alex will write content in MDX and deploy via Git push
- The site does not need authentication, comments, or a database
- Subdomains are managed at the DNS/Vercel level, not in the Astro codebase

### Dependencies
- Astro 5.x
- @astrojs/mdx
- @astrojs/tailwind
- @astrojs/sitemap
- Tailwind CSS 4.x
- TypeScript
- Vercel (hosting)

### Constraints
- No external CMS or API dependencies
- No client-side JavaScript except for: theme toggle, generative hero canvas, and experiment islands
- Fonts must be self-hosted (no Google Fonts CDN)
- Must work without JavaScript enabled (progressive enhancement — content readable, interactivity gracefully degraded)

---

## 12. Launch Plan

### Phase 1: Foundation (MVP)
- [ ] Project scaffolding (Astro + MDX + Tailwind + TypeScript)
- [ ] Base layout (HTML shell, fonts, theme system)
- [ ] Navigation and footer
- [ ] Homepage with generative hero and timeline
- [ ] Dark mode toggle
- [ ] Logs section (listing + individual pages)
- [ ] Deploy to Vercel
- [ ] Domain configuration (apex + subdomain support)

### Phase 2: Content Expansion
- [ ] Guides section
- [ ] Experiments section
- [ ] Seed with initial content (3+ logs, 1+ guide, 1+ experiment)

### Phase 3: Polish
- [ ] SEO meta tags and Open Graph
- [ ] Sitemap
- [ ] Lighthouse audit and optimization
- [ ] Typography fine-tuning
- [ ] Responsive QA

### Phase 4: Future (Not in scope)
- RSS feed
- Search (Pagefind)
- Analytics (Plausible or Vercel Analytics)
- Newsletter integration
- Additional subdomains (studio, tools, etc.)
