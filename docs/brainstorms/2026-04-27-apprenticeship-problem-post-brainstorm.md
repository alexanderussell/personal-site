---
date: 2026-04-27
topic: The Apprenticeship Problem (post)
status: brainstorm
---

# The Apprenticeship Problem — Post Brainstorm

## What We're Building

A long-form personal essay for `src/content/notes/` arguing that "taste is the moat" — the consensus position in the design+AI conversation circa 2026 — papers over a quieter problem: taste was always downstream of reps, and AI has eaten most of the reps. The post diagnoses that gap and offers a working theory of what the new apprenticeship looks like.

Working title (for now): **"The Ladder, Pulled Up"**
Alternatives to consider during drafting: *The Apprenticeship Problem* · *Reps* · *The Studio Is Closed* · *Where Taste Used to Come From*

Target length: ~1,500–2,200 words. Same register as *We Swapped the Motor* but tighter, more argument-led and less memoir.

## Why This Angle

In April 2026 the dominant claim in design+AI discourse is that taste is the new moat. It's a comforting story for senior designers and a useless one for everyone below them. Almost no one is asking the obvious follow-up: if taste comes from reps, and reps are now automated, where does the next generation of taste come from?

Alex is in the right seat to ask it:

- He did come up through the reps. The site is full of evidence: spacing problems on Hold-to-Provision, a homemade UX research pipeline, design-systems-as-infrastructure thinking that only forms after you've watched a few systems collapse.
- His most recent post (*We Swapped the Motor*, 2026-03-18) already established that distribution and taste are the new bottlenecks. This post takes the next step: it interrogates the supply side of taste, which the previous post left unresolved.
- The intersection of practice (he designs for engineers, so he sees how reviewers form judgment) and personal stake (his own taste was paid for in reps that no one is paying for anymore) gives the piece a perspective that pure-pundit takes can't reach.

## Why Not the Other Angles

- **Defending Friction** is a strong post but builds too directly on the existing Hold-to-Provision experiment, narrower in reach.
- **Designing for the Agent-User** is the most novel idea but is forward-looking and harder to anchor in lived experience right now — better to bank that one and let the practice catch up before writing it.
- **Sharper opinion / contrarian** as an energy: rejected in favor of personal-essay register, which is what Alex's audience responds to.
- **Honest reckoning, no answers** and **direct address to early-career designers** as resolutions: rejected in favor of *working theory of the new apprenticeship*, which is more generative and gives the reader something to carry away.

## Core Argument (Spine)

1. **Hook — the boring reps that made me good.** Open with concrete, slightly embarrassing reps from Alex's own past: spacing buttons until they stopped looking cheap, synthesizing a single paragraph from a 40-page deck, polishing someone else's mock for the third time. Establish that this is how taste actually got built. None of these particular reps exist as paid work anymore.
2. **The consensus story.** "Taste is the moat" is now received wisdom. Quote a representative version of the claim. Concede the obvious: yes, taste matters more than ever.
3. **The hidden premise.** Taste isn't a static asset; it's the residue of reps. Pixel reps, critique reps, research reps, copy reps. The senior designers proclaiming taste-as-moat are the last generation produced by the old apprenticeship. They are, mostly without realizing it, pulling the ladder up behind them.
4. **What got broken.** The specific pipeline: junior production roles → exposure to senior critique → repeated cycles → judgment. Each rung is being automated or eliminated. Hiring data backs this up — most teams now hire senior or "cracked grad," with the middle hollowing.
5. **A working theory of the new apprenticeship.** Not nostalgia, not "use more AI." A reframe in three moves:
   - **Reps still matter, but the kind changes.** The new core skill is precise critique — being able to articulate what is wrong with a generated artifact precisely enough that someone (or something) can fix it. This is a *teachable* skill and almost no one is teaching it.
   - **Pre-prompt taste matters more, not less.** The opinions you walk into the room with — before the agent hands you fifty plausible options — are now the load-bearing ones. Build them by reading, looking, copying with intent. The library is back.
   - **Deliberate constraint as a training method.** Take the tool away on purpose. Write the spec by hand. Audit a flow without help. Treat your rep deficit the way an athlete treats a strength deficit.
6. **Who builds the new studio.** This is not a problem AI labs will solve. Whoever — companies, schools, individuals — figures out what the new studio looks like will produce the next generation of designers. Right now a generational gap is forming and it is quiet.
7. **Close.** Short. The ladder is up. Someone has to put it back down. Probably us.

## Voice and Constraints

- Match the register of *We Swapped the Motor* and *UX for Engineers*: declarative, observational, comfortable making strong claims, periodic personal anecdote that earns the abstract argument.
- **Avoid metaphor reuse from *We Swapped the Motor*.** Specifically: no "motor / factory / redesign the factory," no "load-bearing walls," no Carlota Perez framing. Different metaphor system. Candidates: ladder, studio, library, gym, scaffold.
- No bulleted lists in the published post. Argument moves through prose.
- Section breaks (`---`) the way the existing notes do.
- Cite numbers sparingly and only if checked. Hiring-mix data ("mostly senior + cracked grad") is real (Figma's State of Design 2026 + adjacent reporting); confirm before quoting.

## Key Decisions

- **Format:** `note` (essay, not guide). Lives at `src/content/notes/`.
- **Length:** 1,500–2,200 words.
- **Title:** placeholder *The Ladder, Pulled Up*; revisit during drafting.
- **Resolution:** working theory of new apprenticeship (not pure diagnosis, not letter to juniors, not indictment).
- **Tone:** essay, not opinion column. Personal anecdote earns each abstraction.
- **Publishing pipeline:** publish via MDX in `src/content/notes/`, then send the newsletter (per saved preference: send after every new post).

## Open Questions

1. **Newsletter framing.** Per saved preference, send the newsletter after publish. Draft the subject line and one-line teaser alongside the post itself.

## Resolved Questions

- **Energy:** personal essay, voice-forward (resolved 2026-04-27).
- **Angle:** The Apprenticeship Problem (resolved 2026-04-27).
- **Resolution shape:** a working theory of the new apprenticeship — diagnosis plus prescription, not pure diagnosis (resolved 2026-04-27).
- **Metaphor constraint:** avoid reusing motor/factory/load-bearing/Carlota Perez language from *We Swapped the Motor* (resolved 2026-04-27).
- **Opening anecdote:** carry two candidate reps into the draft (pixel-pushing a button until it stopped looking cheap; polishing someone else's mock for the third Friday in a row) and pick once the rest of the post is written. Synthesizing-a-research-deck is dropped (resolved 2026-04-27).
- **Prescriptions to keep:** all three — precise critique, pre-prompt taste, deliberate constraint. The trio does distinct work and shouldn't be trimmed (resolved 2026-04-27).
- **Audience:** senior practitioners and design leaders, single tier the whole way through. Trust that early-career readers will recognize themselves in the diagnosis without a direct address. No tonal shift at the end (resolved 2026-04-27).
- **Naming the consensus:** describe the "taste is the moat" position rather than cite a specific person or article. Sharper-by-citation isn't worth the fight it starts and the framing is now diffuse enough that one citation would feel arbitrary (resolved 2026-04-27).
