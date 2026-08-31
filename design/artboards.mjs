import { dc, screen, nav, icon, GH, XI, PRELUDE, THEME_PROPS, THEME_LOGIC, writeFileSync } from './build.mjs';

const out = (name, src) => { writeFileSync(new URL('./' + name, import.meta.url), src); console.log('  ' + name); };

const cardMedia = `<div class="card-media">${icon('Image', 22)}<span class="card-hint">Cover image</span></div>`;

const workCard = (co, title, desc, meta) => `<article class="card">
  ${cardMedia}
  <div class="card-body">
    <p class="card-meta" style="margin: 0">${meta ?? co}</p>
    <h3 class="card-title">${title}</h3>
    <p class="card-desc">${desc}</p>
  </div>
</article>`;

// ── Home ──────────────────────────────────────────────────────────────────
out('Main.dc.html', screen('Home', `
        <section style="padding-top: 48px; display: grid; grid-template-columns: minmax(0, 1fr) 208px; gap: 40px; align-items: start">
          <div style="display: flex; flex-direction: column; gap: 12px">
            <h1 style="font-family: var(--font-heading); font-size: 52px; line-height: 1.15; letter-spacing: -0.01em; margin: 0; text-wrap: balance">
              Alex is a <span style="position: relative; color: var(--text-secondary); text-decoration: line-through; text-decoration-thickness: 1.5px">designer</span> <span>design engineer</span>
            </h1>
            <p style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); max-width: 640px; margin: 0; text-wrap: pretty">
              I lead UX for developer tools at <a href="#" style="font-weight: 600; text-decoration: underline; text-underline-offset: 3px">Marriott International</a>. My users are the engineers who ship the company's infrastructure.
            </p>
            <p style="font-family: var(--font-mono); font-size: 13px; margin: 8px 0 0">
              <a href="#" style="color: var(--text-secondary); text-decoration: none; border-bottom: 1px solid color-mix(in srgb, var(--border) 80%, transparent); padding-bottom: 1px">alex@collectivelymade.com</a>
            </p>
          </div>
          <div style="aspect-ratio: 1; border: 1px dashed var(--border); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-secondary); padding: 16px; text-align: center">
            ${icon('Image', 22)}
            <span style="font-family: var(--font-mono); font-size: 11px; line-height: 1.5">Hero portrait</span>
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2 class="sec-label">Work</h2><a href="#" class="sec-link">View all &rarr;</a></div>
          <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; padding-top: 20px">
            ${workCard('Marriott International', 'Making Infrastructure Provisioning Legible', 'Engineers were spinning up costly infrastructure by accident. Rebuilding the provisioning flow around consequence rather than speed cut unintended provisions roughly in half.')}
            ${workCard('Marriott International', 'A Design System Engineers Stopped Noticing', 'Adoption was stalling because the system asked teams to change how they worked. Rebuilding it as versioned, typed, installable infrastructure moved it from a proposal to a default.')}
            ${workCard('Collectively Made', 'A Brand System Built to Be Handed Off', 'A studio identity built so a small team could keep applying it after the engagement ended. Tokens and templates instead of a static guideline PDF.')}
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2 class="sec-label">Lab</h2><a href="#" class="sec-link">View all &rarr;</a></div>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; padding-top: 20px">
            <article class="card">
              <div class="card-media"><svg width="96" height="96" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="19" fill="currentColor" opacity="0.25"/><circle cx="60" cy="60" r="2.5" fill="currentColor"/></svg></div>
              <div class="card-body">
                <p class="card-meta" style="margin: 0">Mar 2026</p>
                <h3 class="card-title">Ask My Dad's Record Collection</h3>
                <p class="card-desc">Tell it your mood and the ghost of a vinyl collection pulls the right record off the shelf. The collection belonged to Daniel, a brick mason and audiophile.</p>
              </div>
            </article>
            <article class="card">
              <div class="card-media"><svg width="96" height="96" viewBox="0 0 120 120"><rect x="30" y="30" width="46" height="46" rx="4" fill="#e8c37a" opacity="0.75"/><rect x="44" y="38" width="46" height="46" rx="4" fill="#b6d7a8" opacity="0.7"/><rect x="37" y="50" width="46" height="46" rx="4" fill="#c9a0dc" opacity="0.6"/></svg></div>
              <div class="card-body">
                <p class="card-meta" style="margin: 0">Mar 2025</p>
                <h3 class="card-title">Generative Logo</h3>
                <p class="card-desc">Overlapping rotated color planes with additive blending. Randomizes on each click.</p>
              </div>
            </article>
          </div>
        </section>

        <section class="sec" style="padding-bottom: 56px">
          <div class="sec-head"><h2 class="sec-label">Writing</h2><a href="#" class="sec-link">View all &rarr;</a></div>
          <div style="padding-top: 4px">
            <a href="#" class="wrow">
              <div class="wrow-meta"><span style="color: var(--type-note)">${icon('PenLine', 16)}</span><span class="wrow-kind">Note</span><span class="wrow-date">Aug 14, 2026</span><span class="grow evergreen">${icon('TreePine', 12)}evergreen</span></div>
              <h3 class="wrow-title">My pathless path into technology</h3>
              <p class="wrow-desc">No plan, no clean pivot point. A campus computer lab, a class called new genres, and a run of environments that each asked more than I expected.</p>
            </a>
            <a href="#" class="wrow">
              <div class="wrow-meta"><span style="color: var(--type-guide)">${icon('BookOpen', 16)}</span><span class="wrow-kind">Guide</span><span class="wrow-date">May 25, 2026</span><span class="grow evergreen">${icon('TreePine', 12)}evergreen</span></div>
              <h3 class="wrow-title">The Claude Code + Obsidian Vault Pattern for Design Teams</h3>
              <p class="wrow-desc">A working setup using Obsidian, Claude Code, and Design Decision Records. Context that compounds across sessions instead of evaporating with each new chat.</p>
            </a>
            <a href="#" class="wrow">
              <div class="wrow-meta"><span style="color: var(--type-note)">${icon('PenLine', 16)}</span><span class="wrow-kind">Note</span><span class="wrow-date">Apr 27, 2026</span><span class="grow growing">${icon('Leaf', 12)}growing</span></div>
              <h3 class="wrow-title">The Ladder, Pulled Up</h3>
              <p class="wrow-desc">Taste is the moat. Fine. But taste was always downstream of reps, and AI has eaten the reps. A working theory of what the new apprenticeship has to look like.</p>
            </a>
          </div>
        </section>
`));

// ── About ─────────────────────────────────────────────────────────────────
const belief = (n, statement, body, receiptType, receiptTitle) => {
  const ic = { note: 'PenLine', guide: 'BookOpen', experiment: 'FlaskConical' }[receiptType];
  const col = { note: 'var(--type-note)', guide: 'var(--type-guide)', experiment: 'var(--type-experiment)' }[receiptType];
  return `<div style="display: grid; grid-template-columns: 48px 1fr; gap: 6px 20px">
    <span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); opacity: 0.6; padding-top: 10px">${n}</span>
    <div>
      <h3 style="font-family: var(--font-heading); font-size: 32px; line-height: 1.15; margin: 0 0 10px">${statement}</h3>
      <p style="font-size: 15px; line-height: 1.75; color: var(--text-secondary); margin: 0 0 14px; max-width: 608px">${body}</p>
      <a href="#" style="display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; text-decoration: none">
        <span style="font-weight: 600; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary); border: 1px dashed var(--border); border-radius: 999px; padding: 3px 9px">Receipt</span>
        <span style="color: ${col}; line-height: 0">${icon(ic, 14)}</span>
        <span style="border-bottom: 1px solid var(--border); padding-bottom: 1px">${receiptTitle}</span>
        <span style="color: var(--text-secondary)">&rarr;</span>
      </a>
    </div>
  </div>`;
};

const startRow = (n, title, why, type) => {
  const ic = { note: 'PenLine', guide: 'BookOpen', experiment: 'FlaskConical' }[type];
  return `<a href="#" style="display: grid; grid-template-columns: 48px 1fr; gap: 20px; padding: 17.6px 0; text-decoration: none; border-bottom: 1px dashed var(--border)">
    <span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); opacity: 0.6; padding-top: 2px">${n}</span>
    <span style="display: flex; flex-direction: column; gap: 3px">
      <span style="display: inline-flex; align-items: center; gap: 9px; font-size: 17px; font-weight: 600">${title}<span style="color: var(--text-secondary); line-height: 0">${icon(ic, 14)}</span></span>
      <span style="font-size: 15px; line-height: 1.6; color: var(--text-secondary)">${why}</span>
    </span>
  </a>`;
};

const photoSlot = (hint) => `<div style="aspect-ratio: 4/3; border: 1px dashed var(--border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: var(--text-secondary); padding: 12px; text-align: center">${icon('Image', 18)}<span style="font-family: var(--font-mono); font-size: 10px; line-height: 1.4">${hint}</span></div>`;

out('About.dc.html', screen('About', `
        <article style="padding-top: 48px; padding-bottom: 32px">
          <header style="display: grid; grid-template-columns: minmax(0, 1fr) 224px; gap: 48px; align-items: start">
            <div style="max-width: 672px">
              <h1 style="font-family: var(--font-heading); font-size: 64px; line-height: 1.02; letter-spacing: -0.01em; margin: 0">Alex Russell</h1>
              <p style="font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin: 10px 0 24px">Design Engineer</p>
              <p style="font-size: 16px; line-height: 1.7; color: var(--text-secondary); margin: 0">
                &ldquo;If you're going to do it, do it right.&rdquo; My dad's refrain before any project. He laid brick for a living; I ship software. <a href="#" style="color: var(--text-primary); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--border)">The rule transfers.</a>
              </p>
            </div>
            <div style="aspect-ratio: 4/5; border: 1px dashed var(--border); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-secondary); padding: 16px; text-align: center">${icon('Image', 22)}<span style="font-family: var(--font-mono); font-size: 11px; line-height: 1.5">About portrait</span></div>
          </header>

          <section style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 48px">
            ${photoSlot('At work')}${photoSlot('Something built')}${photoSlot('Somewhere that matters')}${photoSlot('People')}
          </section>

          <section style="max-width: 672px; margin-top: 48px; display: flex; flex-direction: column; gap: 16px">
            <p style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); margin: 0; text-wrap: pretty">I'm a design engineer with 12 years of making software feel like something. I lead UX for developer tools at Marriott International. Before that: agencies, dev shops, startups, and a design collective called <a href="#" style="color: var(--text-primary); font-weight: 600">Collectively Made</a>.</p>
            <p style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); margin: 0; text-wrap: pretty">Most of my work lives where design and engineering stop being separate jobs. The users are engineers and the interfaces are infrastructure. What I'm actually designing is trust: whether someone believes what happens after they click.</p>
            <p style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); margin: 0; text-wrap: pretty">This site is the workshop. <a href="#" style="color: var(--text-primary); font-weight: 600">Work</a> is what shipped, <a href="#" style="color: var(--text-primary); font-weight: 600">Lab</a> is what I built to find out, and <a href="#" style="color: var(--text-primary); font-weight: 600">Writing</a> is me arguing with myself in public. They link to each other on purpose.</p>
          </section>

          <section style="margin-top: 88px">
            <h2 class="mono-label">The longer version</h2>
            <p style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); max-width: 672px; margin: 0; text-wrap: pretty">I got here without a plan. <a href="#" style="color: var(--text-primary); font-weight: 600">My pathless path into technology</a> is the whole route: a campus computer lab, a class called new genres, and a run of environments that each asked more than I expected.</p>
          </section>

          <section style="margin-top: 88px">
            <h2 class="mono-label">What I believe</h2>
            <p style="font-size: 16px; line-height: 1.65; color: var(--text-secondary); margin: 0 0 44px">Each one comes with a receipt.</p>
            <div style="display: flex; flex-direction: column; gap: 52px; max-width: 704px">
              ${belief('01', 'Taste is residue.', "It's what's left over after the reps: the 11pm grid audits, the hundred bad prototypes. The moat everyone says will save designers got built by the exact work we just automated away. That should worry us more than it does.", 'note', 'The Ladder, Pulled Up')}
              ${belief('02', 'Build it real enough to fight over.', 'A working prototype on a URL ends arguments that a mockup can only start.', 'note', 'We Swapped the Motor')}
              ${belief('03', 'The best design system is the one you forget about.', "Roads don't get feature roadmaps. The measure of infrastructure is what people build on top of it.", 'note', 'Design Systems Are Not a Product')}
            </div>
          </section>

          <section style="margin-top: 88px">
            <h2 class="mono-label">Start here</h2>
            <p style="font-size: 16px; line-height: 1.65; color: var(--text-secondary); margin: 0 0 44px">Four pieces, in this order.</p>
            <div style="max-width: 704px; border-top: 1px dashed var(--border)">
              ${startRow('01', 'The Ladder, Pulled Up', 'The thesis: where taste comes from, and what AI just did to it.', 'note')}
              ${startRow('02', 'We Swapped the Motor', 'What happened when the friction died and the hard questions showed up on day three.', 'note')}
              ${startRow('03', 'The Claude Code + Obsidian Vault Pattern', 'The practice: how context stops evaporating between sessions.', 'guide')}
              ${startRow('04', "Ask My Dad's Record Collection", "A vinyl collection that won't stop playing.", 'experiment')}
            </div>
          </section>
        </article>
`));

// ── Work ──────────────────────────────────────────────────────────────────
out('Work.dc.html', screen('Work', `
        <section style="padding: 64px 0">
          <h1 class="s-title">Work</h1>
          <p class="s-lede">Mostly developer tools and internal platforms. The software other people's work depends on.</p>

          <div style="margin-top: 56px; display: flex; flex-direction: column; gap: 56px">
            <section style="display: grid; grid-template-columns: 24px 1fr; gap: 20px">
              <div style="display: flex; flex-direction: column; align-items: center; padding-top: 6px">
                <span style="width: 9px; height: 9px; border-radius: 999px; background: var(--text-secondary)"></span>
                <span style="width: 1.5px; flex: 1; margin-top: 8px; background: repeating-linear-gradient(to bottom, color-mix(in srgb, var(--text-secondary) 68%, transparent) 0 7px, transparent 7px 12px)"></span>
              </div>
              <div>
                <p style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 4px">Now</p>
                <h2 style="font-family: var(--font-heading); font-size: 30px; margin: 0; line-height: 1.15">Marriott International</h2>
                <p style="color: var(--text-secondary); line-height: 1.75; margin: 8px 0 0; max-width: 640px; font-size: 15px">Leading UX for developer tools: the internal platforms engineering teams use to ship infrastructure. Design systems built to be depended on, for users who would rather drop down to the raw API.</p>
                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 24px">
                  ${workCard('', 'Making Infrastructure Provisioning Legible', 'Engineers were spinning up costly infrastructure by accident. Rebuilding the provisioning flow around consequence rather than speed cut unintended provisions roughly in half.', 'Lead UX Engineer &middot; ~5 months')}
                  ${workCard('', 'A Design System Engineers Stopped Noticing', 'Adoption was stalling because the system asked teams to change how they worked. Rebuilding it as versioned, typed, installable infrastructure moved it from a proposal to a default.', 'Lead UX Engineer &middot; ~8 months')}
                </div>
              </div>
            </section>

            <section style="display: grid; grid-template-columns: 24px 1fr; gap: 20px">
              <div style="display: flex; flex-direction: column; align-items: center; padding-top: 6px">
                <span style="width: 9px; height: 9px; border-radius: 999px; border: 1.5px solid var(--text-secondary)"></span>
                <span style="width: 1.5px; flex: 1; margin-top: 8px; background: repeating-linear-gradient(to bottom, color-mix(in srgb, var(--text-secondary) 68%, transparent) 0 2px, transparent 2px 5px)"></span>
              </div>
              <div>
                <h2 style="font-family: var(--font-heading); font-size: 30px; margin: 0; line-height: 1.15">Collectively Made</h2>
                <p style="color: var(--text-secondary); line-height: 1.75; margin: 8px 0 0; max-width: 640px; font-size: 15px">A design collective I started. Client work across brand systems and product builds, with a rotating cast of collaborators.</p>
                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 24px">
                  ${workCard('', 'A Brand System Built to Be Handed Off', 'A studio identity built so a small team could keep applying it after the engagement ended. Tokens and templates instead of a static guideline PDF.', 'Design Lead &middot; ~3 months')}
                  <div></div>
                </div>
              </div>
            </section>

            <section style="display: grid; grid-template-columns: 24px 1fr; gap: 20px">
              <div style="display: flex; flex-direction: column; align-items: center; padding-top: 6px">
                <span style="width: 9px; height: 9px; border-radius: 999px; border: 1.5px solid var(--text-secondary); opacity: 0.5"></span>
              </div>
              <div>
                <h2 style="font-family: var(--font-heading); font-size: 30px; margin: 0; line-height: 1.15">Agencies, dev shops, and startups</h2>
                <p style="color: var(--text-secondary); line-height: 1.75; margin: 8px 0 0; max-width: 640px; font-size: 15px">Years of wearing every hat, from brand systems through full product builds. The reps that taste is downstream of.</p>
              </div>
            </section>
          </div>
        </section>
`));

// ── Writing ───────────────────────────────────────────────────────────────
const wrow = (kind, date, badge, badgeIc, title, desc) => {
  const ic = kind === 'Guide' ? 'BookOpen' : 'PenLine';
  const col = kind === 'Guide' ? 'var(--type-guide)' : 'var(--type-note)';
  return `<a href="#" class="wrow">
    <div class="wrow-meta"><span style="color: ${col}">${icon(ic, 16)}</span><span class="wrow-kind">${kind}</span><span class="wrow-date">${date}</span>${badge ? `<span class="grow ${badge}">${icon(badgeIc, 12)}${badge}</span>` : ''}</div>
    <h3 class="wrow-title">${title}</h3>
    <p class="wrow-desc">${desc}</p>
  </a>`;
};

out('Writing.dc.html', screen('Writing', `
        <section style="padding: 64px 0">
          <h1 class="s-title">Writing</h1>
          <p class="s-lede">6 essays and 2 guides so far. Most carry a badge saying how settled the thinking is.</p>
          <div style="margin-top: 48px">
            ${wrow('Note', 'Aug 14, 2026', 'evergreen', 'TreePine', 'My pathless path into technology', 'No plan, no clean pivot point. A campus computer lab, a class called new genres, and a run of environments that each asked more than I expected.')}
            ${wrow('Guide', 'May 25, 2026', 'evergreen', 'TreePine', 'The Claude Code + Obsidian Vault Pattern for Design Teams', 'A working setup using Obsidian, Claude Code, and Design Decision Records. Context that compounds across sessions instead of evaporating with each new chat.')}
            ${wrow('Note', 'Apr 27, 2026', 'growing', 'Leaf', 'The Ladder, Pulled Up', 'Taste is the moat. Fine. But taste was always downstream of reps, and AI has eaten the reps. A working theory of what the new apprenticeship has to look like.')}
            ${wrow('Note', 'Mar 18, 2026', 'evergreen', 'TreePine', 'We Swapped the Motor', "AI removed the friction that kept my ideas theoretical, and left me with the harder question of what's worth building at all.")}
            ${wrow('Note', 'Mar 7, 2026', '', '', "Dad's Eulogy", 'The eulogy I gave for my father, Daniel Russell, on October 5th during the Jewish High Holidays.')}
            ${wrow('Guide', 'Dec 15, 2025', 'evergreen', 'TreePine', 'A Local-First UX Research Workflow in Cursor', 'How I stopped copying interview notes into chat windows and built a research pipeline that lives in my codebase, processes transcripts automatically, and compounds over time.')}
            ${wrow('Note', 'Feb 12, 2025', 'growing', 'Leaf', 'What Does UX Mean When Your Users Are Engineers?', 'Designing for developers means throwing out half the UX playbook and replacing ease with something harder to achieve: trust.')}
            ${wrow('Note', 'Jan 20, 2024', 'evergreen', 'TreePine', 'Design Systems Are Not a Product', 'On the quiet trap of treating your component library like a startup, and why the best design system is the one you forget about.')}
          </div>

          <div style="margin-top: 64px; border-top: 1px solid color-mix(in srgb, var(--border) 50%, transparent); padding-top: 40px">
            <h2 style="font-family: var(--font-heading); font-size: 18px; margin: 0">Get new pieces by email</h2>
            <p class="s-lede" style="margin-top: 4px">New essays and experiments, straight to your inbox. No cadence promises.</p>
            <form style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; max-width: 420px">
              <span style="flex: 1; min-width: 0; font-family: var(--font-mono); font-size: 12px; background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px">your@email.com</span>
              <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); background: transparent; border: 1px solid var(--border); border-radius: 6px; padding: 6px 14px; min-width: 88px; text-align: center">Notify me</span>
            </form>
          </div>
        </section>
`));

// ── Lab ───────────────────────────────────────────────────────────────────
out('Lab.dc.html', screen('Lab', `
        <section style="padding: 64px 0">
          <h1 class="s-title">Lab</h1>
          <p class="s-lede">Prototypes and small tools I've built, all of them running live in the page.</p>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 48px">
            <article class="card">
              <div class="card-media" style="aspect-ratio: 16/10"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.35"/><circle cx="60" cy="60" r="19" fill="currentColor" opacity="0.25"/><circle cx="60" cy="47" r="2" fill="currentColor" opacity="0.7"/><circle cx="60" cy="60" r="2.5" fill="currentColor"/></svg></div>
              <div class="card-body">
                <p class="card-meta" style="margin: 0">Mar 2026</p>
                <h3 class="card-title">Ask My Dad's Record Collection</h3>
                <p class="card-desc">Tell it your mood and the ghost of a vinyl collection pulls the right record off the shelf. The collection belonged to Daniel, a brick mason and audiophile.</p>
              </div>
            </article>
            <article class="card">
              <div class="card-media" style="aspect-ratio: 16/10"><svg width="120" height="120" viewBox="0 0 120 120"><rect x="30" y="30" width="46" height="46" rx="4" fill="#e8c37a" opacity="0.75"/><rect x="44" y="38" width="46" height="46" rx="4" fill="#b6d7a8" opacity="0.7"/><rect x="37" y="50" width="46" height="46" rx="4" fill="#c9a0dc" opacity="0.6"/></svg></div>
              <div class="card-body">
                <p class="card-meta" style="margin: 0">Mar 2025</p>
                <h3 class="card-title">Generative Logo</h3>
                <p class="card-desc">Overlapping rotated color planes with additive blending. Randomizes on each click.</p>
              </div>
            </article>
          </div>
        </section>
`));

// ── Post detail ───────────────────────────────────────────────────────────
out('Post.dc.html', screen('Writing', `
        <article style="padding: 80px 0">
          <header style="margin-bottom: 56px">
            <div style="display: flex; justify-content: center; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 32px">
              <span style="color: var(--type-note); line-height: 0">${icon('PenLine', 16)}</span>
              <span style="color: var(--text-secondary)">note</span>
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 72px; line-height: 0.95; letter-spacing: -0.02em; text-align: center; margin: 0 0 16px; text-wrap: balance">My pathless path into technology</h1>
            <p style="color: var(--text-secondary); text-align: center; font-size: 14px; margin: 0">Friday, August 14, 2026</p>
            <div style="margin-top: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px">
              <span class="grow evergreen">${icon('TreePine', 14)}evergreen</span>
              <p style="color: var(--text-secondary); margin: 0; max-width: 448px; text-align: center; font-family: var(--font-mono); font-size: 12px; line-height: 1.6">via an empty section on my About page &mdash; the part only I could write</p>
            </div>
          </header>

          <div style="max-width: 672px; margin: 0 auto; padding: 0 16px">
            <div style="font-size: 17px; line-height: 1.8; color: color-mix(in srgb, var(--text-primary) 90%, transparent)">
              <p style="margin: 0 0 22px">The first technical thing I ever did professionally was teach.</p>
              <p style="margin: 0 0 22px">Not in a classroom. In a campus lab &ndash; the New Media Center &ndash; where student workers ran workshops on software and programming for anyone who showed up and wanted to learn. The NMC was tucked into a building most students walked past without going in.</p>
              <p style="margin: 0 0 22px">I was there because someone thought I knew enough about Illustrator and Photoshop to be useful, and because the schedule fit around fine arts with minors in English and Psychology, which felt less like a decision and more like what was already true about me.</p>
            </div>

            <aside style="margin-top: 64px">
              <div style="height: 1px; background: var(--border); margin-bottom: 24px"></div>
              <p style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 16px">Keep pulling the thread</p>
              <div style="display: flex; flex-direction: column; gap: 10px">
                <a href="#" style="display: flex; align-items: flex-start; gap: 12px; text-decoration: none; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--border) 60%, transparent); border-radius: 8px">
                  <span style="color: var(--type-note); line-height: 0; padding-top: 2px">${icon('PenLine', 16)}</span>
                  <span style="display: flex; flex-direction: column; gap: 2px">
                    <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary)">note &middot; Mar 2026</span>
                    <span style="font-size: 15px; font-weight: 600">We Swapped the Motor</span>
                  </span>
                </a>
                <a href="#" style="display: flex; align-items: flex-start; gap: 12px; text-decoration: none; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--border) 60%, transparent); border-radius: 8px">
                  <span style="color: var(--type-note); line-height: 0; padding-top: 2px">${icon('PenLine', 16)}</span>
                  <span style="display: flex; flex-direction: column; gap: 2px">
                    <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary)">note &middot; Apr 2026</span>
                    <span style="font-size: 15px; font-weight: 600">The Ladder, Pulled Up</span>
                  </span>
                </a>
              </div>
            </aside>

            <div style="margin-top: 64px; padding: 0 16px">
              <div style="height: 1px; background: var(--border); margin-bottom: 32px"></div>
              <p style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 8px">Subscribe to the newsletter</p>
              <p style="font-family: var(--font-mono); font-size: 14px; color: var(--text-secondary); margin: 0 0 20px; line-height: 1.6">Have my next post drop in your inbox.</p>
              <form style="display: flex; gap: 8px; flex-wrap: wrap; max-width: 420px">
                <span style="flex: 1; min-width: 0; font-family: var(--font-mono); font-size: 12px; background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px">your@email.com</span>
                <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 14px; min-width: 88px; text-align: center">Notify me</span>
              </form>
            </div>
          </div>
        </article>
`));

// ── Navigation states ─────────────────────────────────────────────────────
const railLink = (ic, on) => `<a href="#" style="display: flex; justify-content: center; padding: 10px 0; border-radius: 8px; color: ${on ? 'var(--text-primary)' : 'var(--text-secondary)'}; ${on ? 'background: var(--bg-secondary);' : ''} text-decoration: none">${icon(ic, 18)}</a>`;

out('Navigation.dc.html', dc(`<div class="page {{themeClass}}" style="padding: 32px">
  <div style="display: flex; gap: 32px; align-items: flex-start">

    <div style="display: flex; flex-direction: column; gap: 12px">
      <p class="mono-label" style="margin: 0">Expanded &mdash; 1280px+</p>
      <div style="height: 620px; display: flex; border: 1px solid color-mix(in srgb, var(--border) 60%, transparent); border-radius: 10px; overflow: hidden; background: var(--bg-primary)">
        ${nav('Home')}
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px">
      <p class="mono-label" style="margin: 0">Rail &mdash; 768&ndash;1279px</p>
      <div style="height: 620px; width: 68px; display: flex; flex-direction: column; align-items: center; padding: 16px 8px; border: 1px solid color-mix(in srgb, var(--border) 60%, transparent); border-radius: 10px; background: var(--bg-primary)">
        <div class="sb-logo" style="margin-bottom: 20px"></div>
        <div style="align-self: stretch; display: flex; flex-direction: column; gap: 2px">
          ${railLink('House', true)}${railLink('User')}${railLink('FileText')}${railLink('FlaskConical')}${railLink('PenLine')}
        </div>
        <div style="margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 14px; color: var(--text-secondary)">
          ${GH}${XI}${icon('Monitor', 20)}
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px">
      <p class="mono-label" style="margin: 0">Mobile &mdash; below 768px</p>
      <div style="width: 375px; border: 1px solid color-mix(in srgb, var(--border) 60%, transparent); border-radius: 10px; overflow: hidden; background: var(--bg-primary)">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent)">
          <div style="display: flex; align-items: center; gap: 10px">
            <div class="sb-logo" style="width: 32px; height: 32px; box-shadow: none"></div>
            <span style="font-family: var(--font-heading); font-size: 18px; letter-spacing: -0.01em">Alex Russell</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; color: var(--text-secondary)">${icon('Monitor', 20)}${icon('Menu', 20)}</div>
        </div>
        <div style="display: flex; flex-direction: column; padding: 8px 12px 12px; border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent)">
          <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; text-decoration: none; background: var(--bg-secondary); color: var(--text-primary)">${icon('House', 16)}Home</a>
          <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; text-decoration: none; color: var(--text-secondary)">${icon('User', 16)}About</a>
          <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; text-decoration: none; color: var(--text-secondary)">${icon('FileText', 16)}Work</a>
          <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; text-decoration: none; color: var(--text-secondary)">${icon('FlaskConical', 16)}Lab</a>
          <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; text-decoration: none; color: var(--text-secondary)">${icon('PenLine', 16)}Writing</a>
        </div>
        <div style="padding: 24px 16px; color: var(--text-secondary); font-family: var(--font-mono); font-size: 12px">page content &hellip;</div>
      </div>
    </div>

  </div>
</div>`, THEME_PROPS, THEME_LOGIC));

// ── Foundations ───────────────────────────────────────────────────────────
const swatch = (name, value, note) => `<div style="display: flex; align-items: center; gap: 12px">
  <span style="width: 44px; height: 44px; border-radius: 8px; background: ${value}; border: 1px solid color-mix(in srgb, var(--border) 80%, transparent); flex-shrink: 0"></span>
  <span style="display: flex; flex-direction: column; gap: 1px; min-width: 0">
    <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 600">${name}</span>
    <span style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary); white-space: nowrap">${note}</span>
  </span>
</div>`;

out('Foundations.dc.html', dc(`<div class="page" style="padding: 40px">
  <h1 style="font-family: var(--font-heading); font-size: 44px; margin: 0 0 6px; letter-spacing: -0.01em">Foundations</h1>
  <p style="font-size: 15px; color: var(--text-secondary); margin: 0 0 40px; max-width: 640px">Resolved values from <span style="font-family: var(--font-mono); font-size: 13px">src/styles/global.css</span>. Neutrals stay in the warm 34&ndash;58 hue band; nothing here is a rounded approximation.</p>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; margin-bottom: 48px">
    <section style="padding: 24px; border: 1px solid var(--border); border-radius: 12px; background: oklch(14.5% .005 52); color: oklch(93% .003 48.717)">
      <p class="mono-label" style="color: color-mix(in srgb, oklch(93% .003 48.717) 68%, transparent)">Dark &mdash; the default</p>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 18px">
        ${swatch('bg-primary', 'oklch(14.5% .005 52)', 'oklch(14.5% .005 52)')}
        ${swatch('bg-secondary', 'oklch(21.5% .007 44)', 'oklch(21.5% .007 44)')}
        ${swatch('border', 'oklch(38% .009 52)', 'oklch(38% .009 52)')}
        ${swatch('text-secondary', 'color-mix(in srgb, oklch(93% .003 48.717) 68%, transparent)', '68% of text-primary')}
        ${swatch('text-primary', 'oklch(93% .003 48.717)', 'oklch(93% .003 48.717)')}
        ${swatch('accent', 'oklch(97% .003 56)', 'oklch(97% .003 56)')}
      </div>
    </section>
    <section style="padding: 24px; border: 1px solid oklch(88% .012 58); border-radius: 12px; background: oklch(97% .003 56); color: oklch(21.6% .006 56.043)">
      <p class="mono-label" style="color: color-mix(in srgb, oklch(21.6% .006 56.043) 60%, transparent)">Light</p>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 18px">
        ${swatch('bg-primary', 'oklch(97% .003 56)', 'oklch(97% .003 56)')}
        ${swatch('bg-secondary', 'oklch(93% .005 48)', 'oklch(93% .005 48)')}
        ${swatch('border', 'oklch(88% .012 58)', 'oklch(88% .012 58)')}
        ${swatch('text-secondary', 'color-mix(in srgb, oklch(21.6% .006 56.043) 60%, transparent)', '60% of text-primary')}
        ${swatch('text-primary', 'oklch(21.6% .006 56.043)', 'oklch(21.6% .006 56.043)')}
        ${swatch('accent', 'oklch(15% .006 56)', 'oklch(15% .006 56)')}
      </div>
    </section>
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; margin-bottom: 48px">
    <section>
      <p class="mono-label">Content-type accents</p>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 18px">
        ${swatch('type-note', '#60a5fa', '#60a5fa &middot; PenLine')}
        ${swatch('type-guide', '#e67e22', '#e67e22 &middot; BookOpen')}
        ${swatch('type-experiment', '#eab308', '#eab308 &middot; FlaskConical')}
      </div>
    </section>
    <section>
      <p class="mono-label">Growth stages</p>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0 0 18px; line-height: 1.6">The border firms up as the thinking does: dashed, dashed-tinted, solid.</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap">
        <span class="grow seedling">${icon('Sprout', 14)}seedling</span>
        <span class="grow growing">${icon('Leaf', 14)}growing</span>
        <span class="grow evergreen">${icon('TreePine', 14)}evergreen</span>
      </div>
    </section>
  </div>

  <section>
    <p class="mono-label">Type</p>
    <div style="display: flex; flex-direction: column; gap: 22px; margin-top: 20px">
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent); padding-bottom: 18px">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.5">PP Mondwest<br>72px / 1.0 / -0.02em</span>
        <span style="font-family: var(--font-heading); font-size: 72px; line-height: 1; letter-spacing: -0.02em">Writing</span>
      </div>
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent); padding-bottom: 18px">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.5">PP Mondwest<br>32px / 1.15 &mdash; belief</span>
        <span style="font-family: var(--font-heading); font-size: 32px; line-height: 1.15">Taste is residue.</span>
      </div>
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent); padding-bottom: 18px">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.5">Inter<br>17px / 1.7 &mdash; body</span>
        <span style="font-size: 17px; line-height: 1.7; color: var(--text-secondary); max-width: 640px">Most of my work lives where design and engineering stop being separate jobs. The users are engineers and the interfaces are infrastructure.</span>
      </div>
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent); padding-bottom: 18px">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.5">Inter 600<br>18px &mdash; row title</span>
        <span style="font-size: 18px; font-weight: 600">The Ladder, Pulled Up</span>
      </div>
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.5">JetBrains Mono<br>13px / 0.12em / upper</span>
        <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary)">What I believe</span>
      </div>
    </div>
    <p style="font-size: 14px; color: var(--text-secondary); margin: 24px 0 0; line-height: 1.7; max-width: 720px">Mono is for facts &mdash; dates, types, labels, code. Never running prose: mono at 13&ndash;16px was the site's single largest legibility cost.</p>
  </section>
</div>`, `{}`, `    return {};`));

// ── Components ────────────────────────────────────────────────────────────
out('Components.dc.html', dc(`<div class="page" style="padding: 40px">
  <h1 style="font-family: var(--font-heading); font-size: 44px; margin: 0 0 6px; letter-spacing: -0.01em">Components</h1>
  <p style="font-size: 15px; color: var(--text-secondary); margin: 0 0 40px; max-width: 640px">The pieces every page is assembled from. Change one here, change it everywhere.</p>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px">

    <section>
      <p class="mono-label">Two-plane card &mdash; .card-surface</p>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0 0 18px; line-height: 1.6">Media runs full-bleed to the card edge; only the body carries padding. Shared by Work and Lab so the two can't drift.</p>
      ${workCard('Marriott International', 'Making Infrastructure Provisioning Legible', 'Engineers were spinning up costly infrastructure by accident. Rebuilding the provisioning flow around consequence rather than speed cut unintended provisions roughly in half.')}
    </section>

    <section>
      <p class="mono-label">Section preview header</p>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0 0 18px; line-height: 1.6">Homepage only. Mono label left, quiet link right, hairline rule under both.</p>
      <div class="sec-head"><h2 class="sec-label">Work</h2><a href="#" class="sec-link">View all &rarr;</a></div>

      <p class="mono-label" style="margin-top: 36px">Subscribe form</p>
      <form style="display: flex; gap: 8px; flex-wrap: wrap; max-width: 380px; margin-top: 14px">
        <span style="flex: 1; min-width: 0; font-family: var(--font-mono); font-size: 12px; background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px">your@email.com</span>
        <span style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 6px 14px; min-width: 88px; text-align: center">Notify me</span>
      </form>
      <p style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); margin: 14px 0 0">You're on the list. I'll be in touch.</p>

      <p class="mono-label" style="margin-top: 36px">Growth badges</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px">
        <span class="grow seedling">${icon('Sprout', 14)}seedling</span>
        <span class="grow growing">${icon('Leaf', 14)}growing</span>
        <span class="grow evergreen">${icon('TreePine', 14)}evergreen</span>
      </div>
    </section>

    <section style="grid-column: 1 / -1">
      <p class="mono-label">Writing row</p>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0 0 8px; line-height: 1.6">Type icon carries the accent; the row itself stays neutral until hover.</p>
      <div style="max-width: 720px">
        ${wrow('Note', 'Aug 14, 2026', 'evergreen', 'TreePine', 'My pathless path into technology', 'No plan, no clean pivot point. A campus computer lab, a class called new genres, and a run of environments that each asked more than I expected.')}
        ${wrow('Note', 'Apr 27, 2026', 'growing', 'Leaf', 'The Ladder, Pulled Up', 'Taste is the moat. Fine. But taste was always downstream of reps, and AI has eaten the reps.')}
      </div>
    </section>

    <section>
      <p class="mono-label">Belief + receipt</p>
      <div style="margin-top: 18px">
        ${belief('01', 'Taste is residue.', "It's what's left over after the reps: the 11pm grid audits, the hundred bad prototypes.", 'note', 'The Ladder, Pulled Up')}
      </div>
    </section>

    <section>
      <p class="mono-label">Start-here row</p>
      <div style="margin-top: 18px; border-top: 1px dashed var(--border)">
        ${startRow('01', 'The Ladder, Pulled Up', 'The thesis: where taste comes from, and what AI just did to it.', 'note')}
        ${startRow('02', "Ask My Dad's Record Collection", "A vinyl collection that won't stop playing.", 'experiment')}
      </div>
    </section>

  </div>
</div>`, `{}`, `    return {};`));

console.log('done');
