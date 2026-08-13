---
created: 2026-08-13
status: draft — sections marked [NEEDS YOUR INPUT] are unresolved
---

# Personal Website 2026 Brief

Structure inherited from Patrick Morgan's 2026 portfolio brief (see
[How I Rebuilt My Portfolio With Claude](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude)),
adapted to Alex Russell.

## Current Website

- <https://alexanderrussell.com>
- Astro 5 + Tailwind 4, MDX content collections, React islands, Convex + Resend, Vercel
- Today it is a timeline-first content site: a merged reverse-chron feed of notes, guides,
  and experiments on the homepage. Nav is About / Notes / Guides / Experiments.
- There is no portfolio or case-study surface anywhere on the site.

## Website goals

**Answered 2026-08-13. Canonical version now lives in [PRODUCT.md](../PRODUCT.md).**

Be read as **a design engineer who ships**. The site corrects an undersell: "leads UX at a
hotel company" does not convey the building. Success is a design or engineering leader coming
away with the right impression — not a specific job offer.

Audience is split by surface rather than compromised into one: **evaluators first** (design
leads, EMs, hiring managers, two-minute first visit) carried by Work and About;
**practitioners second** (peers who read and return) rewarded by Writing and Lab.

## Overall guidance

- Seed the site with content that already exists; let it evolve. Do not block the restructure
  on new writing.
- Easy to iterate on. The publishing path stays "write markdown, git push."
- Open to changing anything that better serves the goals above.
- Writing and project summaries are authored and versioned in markdown, and that continues.
  Work adjacent to AI (skills, agent configs, plans, prompts) also lands in markdown — the
  site should be able to surface those assets when they're worth publishing.
- Keep real flexibility for custom views, styles, and interactions. The interactive
  experiments are the site's strongest differentiator and the architecture must not flatten
  them into generic cards.
- **Professional portfolio site first, public knowledge base second.** This inverts the
  current PRD, which explicitly chose "showcase thinking, not just work" and rejected the
  case-study model. That reversal is deliberate and should be recorded, not glossed.

## Things to highlight

- **Expertise:** design engineer, 12 years. UX for developer tools and internal platforms —
  the systems engineering teams use to ship infrastructure. Design systems as infrastructure.
- **Blended background:** designer who builds. Agencies, dev shops, and startups wearing every
  hat — brand systems through full product builds — before going deep on developer experience
  at enterprise scale.
- **Founder instinct:** started Collectively Made, a design collective.
- **Perspective through writing:** essays on taste, AI's effect on craft, and what UX means
  when your users are engineers. A book in progress.
- **Proof over assertion:** working prototypes on URLs, not mockups. The experiments are the
  argument.

## Content structure

- **Home** — overview and pitch as designer, engineer, and writer
  - Hero: name, photo, headline, short bio, social links, email
  - Company logos **[NEEDS YOUR INPUT]** — Marriott is known; which prior agencies/startups
    are worth naming, and are any under NDA constraints?
  - Work: selected case study highlights
  - Lab: experiment highlights
  - Writing: newsletter summary + recent pieces
  - Social proof **[NEEDS YOUR INPUT]** — no testimonials or quotes exist today. Options:
    omit, substitute (talks given, book, publication credits), or gather.
- **About** — career story and perspective. An About page already exists and is strong
  (beliefs-with-receipts, "start here" path, auto-updating now strip). It gets re-slotted,
  not rewritten.
- **Work** — dedicated case study pages
  - Professional projects
  - Personal projects
- **Lab** — interactive experiments, converted from the current `experiments` collection
- **Writing** — markdown-authored, merging today's notes and guides
  - This stays the durable home for the writing **even if publishing moves to Substack.**
    Platform is distribution; the repo is the archive.
  - Holds both newsletter issues and pieces that don't fit the newsletter.

## Other features

- **Embed Figma Slides** — for case studies presented as decks **[NEEDS YOUR INPUT]**: do you
  have decks for any Marriott or Collectively Made work?
- **Embed YouTube / video** — for recorded walkthroughs **[NEEDS YOUR INPUT]**: same question.
- **Newsletter signup** — currently self-hosted (Convex + Resend, working and hardened).
  A Substack move is under consideration; the site should be able to point at either without
  a rewrite.
- **Book waitlist** — the existing `/book` page and its 3D CSS treatment stay.

## Tech stack

Already settled and staying — no reason to re-litigate:

- Astro 5, Tailwind 4, MDX content collections, React islands for interactivity
- Convex (newsletter, moods) + Resend (email)
- Vercel hosting, with subdomain routing built but unused
- Common, well-documented, AI-native tooling. Low maintenance.

Not adopting from Pat's brief: shadcn/ui and GitHub Pages. The site has its own component
vocabulary and Vercel already carries the serverless endpoints Convex/Resend need.

## Style preferences

- **Typography stays**: PP Mondwest (display) + Inter (body) + JetBrains Mono (UI/meta).
  This was recently re-evaluated against a swap and deliberately kept.
- **Dark mode default** with a light toggle. Note this inverts Pat's light-default preference —
  keeping the existing behavior.
- Minimal, intentional, generous whitespace, monospace for metadata and UI chrome.
- High craft at the detail and interaction level; restraint at the page level.
- Existing personality artifacts to preserve and build on: generative logo, pixel-art
  iconography, the broken-window 404, the 3D book, the vinyl mood UI.
- Responsive by default — must feel deliberate on mobile, not merely reflowed.
- **Clichés to avoid** (carried from the June ideation doc): scroll-motion overload,
  dark-mode-as-personality, 3D nav gimmicks, AI-sounding copy.

## Industry inspiration

Documented in the existing PRD and ideation doc:

- <https://wking.dev> — primary inspiration for the current site's typographic direction
- <https://rauno.me> — craft demos, restraint
- <https://www.joshwcomeau.com> — inline interactive MDX; the model for Lab writeups
- <https://leerob.com> — how little you actually need
- <https://itspatmorgan.com> — the IA being adopted here

## Reference material to gather (mise-en-place)

Pat's argument is that curation is the bottleneck, not prompting. What's missing before the
Work section can be built:

- Role history with dates, titles, and one-paragraph narratives per role
- Source material for 1–2 case studies: problem, approach, outcome, and any metrics that
  clear NDA
- Screenshots or visuals per case study
- Company logos, light and dark variants
- A current photo for the hero

## Open questions

1. ~~What are the actual goals?~~ **Answered** — see Website goals above and `PRODUCT.md`.
2. **Partially answered.** Source material exists across Marriott (some NDA-cleared),
   Collectively Made client work, and personal/Lab projects. Still open: *which specific
   prior companies are nameable*, and exactly what clears review at Marriott.
3. ~~Do Figma decks or recorded walkthroughs exist?~~ **Answered — yes, both.** Embedding them
   is a real requirement, not a conditional. This unblocks the media-embed unit in the plan.
4. ~~Social proof: omit, substitute, or gather?~~ **Answered by absence** — no testimonials or
   endorsements exist, so the section is omitted rather than fabricated.
5. Substack: committed, or still evaluating? **Still open.** Does not block anything — the
   normalized writing shape in `src/lib/writing.ts` covers either outcome.

### Still needed from Alex

- Role dates and titles for `src/data/roles.ts`
- Photography for the six slots in `src/data/photos.ts`
- Location and timezone for the footer detail in `src/data/site.ts`
- The origin-story section on the About page
- Source material for the first case study
