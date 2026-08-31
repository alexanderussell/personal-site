// Generates the .dc.html artboards for the design canvas.
// Values are lifted from src/styles/global.css and the components themselves —
// see README.md. Re-run after changing the prelude so every artboard stays in sync.
import { readFileSync, writeFileSync } from 'node:fs';

const font = readFileSync(new URL('./mondwest.woff2', import.meta.url)).toString('base64');
const I = JSON.parse(readFileSync(new URL('./icons.json', import.meta.url), 'utf8'));

const icon = (name, size = 18, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}>${I[name]}</svg>`;

const GH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
const XI = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>`;

// ── Shared prelude ────────────────────────────────────────────────────────
// Tokens are the resolved values from global.css @theme / .dark, not
// approximations. Type accents and growth colors do not vary by theme.
const PRELUDE = `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
  <style>
    @font-face {
      font-family: 'PP Mondwest';
      src: url(data:font/woff2;base64,${font}) format('woff2');
      font-weight: 400; font-style: normal; font-display: block;
    }

    .page {
      --bg-primary: oklch(14.5% .005 52);
      --bg-secondary: oklch(21.5% .007 44);
      --text-primary: oklch(93% .003 48.717);
      --text-secondary: color-mix(in srgb, oklch(93% .003 48.717) 68%, transparent);
      --accent: oklch(97% .003 56);
      --border: oklch(38% .009 52);
    }
    .page.light {
      --bg-primary: oklch(97% .003 56);
      --bg-secondary: oklch(93% .005 48);
      --text-primary: oklch(21.6% .006 56.043);
      --text-secondary: color-mix(in srgb, oklch(21.6% .006 56.043) 60%, transparent);
      --accent: oklch(15% .006 56);
      --border: oklch(88% .012 58);
    }

    .page {
      --type-note: #60a5fa;
      --type-guide: #e67e22;
      --type-experiment: #eab308;
      --grow-seedling: #a3e635;
      --grow-growing: #4ade80;
      --grow-evergreen: #22c55e;
      --font-heading: 'PP Mondwest', ui-serif, Georgia, serif;
      --font-body: 'Inter', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
    }

    body { margin: 0; }
    .page {
      font-family: var(--font-body);
      background: var(--bg-primary);
      color: var(--text-primary);
      -webkit-font-smoothing: antialiased;
    }
    .page *, .page *::before, .page *::after { box-sizing: border-box; }
    a { color: var(--text-primary); }
    a:hover { color: var(--text-primary); }

    /* Sidebar — 15rem expanded, 4.25rem rail (global.css :root) */
    .sb { width: 240px; flex-shrink: 0; border-right: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
          padding: 16px 12px; display: flex; flex-direction: column; }
    .sb-brand { display: flex; align-items: center; gap: 12px; padding: 4px; margin-bottom: 24px; }
    .sb-logo { width: 36px; height: 36px; border-radius: 8.8px; flex-shrink: 0;
               box-shadow: 0 0 0 1px var(--border); overflow: hidden;
               background: conic-gradient(from 210deg, #e8c37a, #b6d7a8, #c9a0dc, #f0a2a2, #e8c37a); }
    .sb-name { font-family: var(--font-heading); font-size: 17px; line-height: 1.2; letter-spacing: -0.01em; }
    .sb-role { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
               text-transform: uppercase; color: var(--text-secondary); }
    .sb-nav { display: flex; flex-direction: column; gap: 2px; }
    .sb-link { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 8px;
               font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); text-decoration: none; }
    .sb-link.on { background: var(--bg-secondary); color: var(--text-primary); }
    .sb-foot { margin-top: auto; padding-top: 24px; display: flex; flex-direction: column; gap: 14px; }
    .sb-socials { display: flex; align-items: center; gap: 16px; padding-left: 10px; color: var(--text-secondary); }
    .sb-copy { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); opacity: 0.7; padding-left: 10px; margin: 0; }

    .shell { display: flex; min-height: 100%; }
    .main { flex: 1; min-width: 0; padding: 0 16px; }
    .measure { max-width: 896px; margin: 0 auto; }

    /* Section heads (global.css .section-title / .section-lede) */
    .s-title { font-family: var(--font-heading); font-size: 72px; line-height: 1;
               letter-spacing: -0.02em; margin: 0; }
    .s-lede { max-width: 640px; margin: 16px 0 0; font-size: 17px; line-height: 1.7;
              color: var(--text-secondary); text-wrap: pretty; }

    /* Two-plane card (global.css .card-surface) */
    .card { position: relative; display: flex; flex-direction: column; overflow: hidden;
            border: 1px solid var(--border); border-radius: 12px; background: var(--bg-primary); }
    .card-media { display: flex; align-items: center; justify-content: center; aspect-ratio: 16/10;
                  background: color-mix(in srgb, var(--bg-secondary) 55%, transparent);
                  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
                  color: var(--text-secondary); gap: 6px; flex-direction: column; }
    .card-hint { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    .card-body { flex: 1; padding: 18px 20px 20px; background: var(--bg-secondary); }
    .card-meta { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
                 text-transform: uppercase; color: var(--text-secondary); }
    .card-title { font-size: 16px; font-weight: 600; margin: 6px 0 0; line-height: 1.35; }
    .card-desc { font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin: 4px 0 0; }

    /* Growth badge (GrowthStage.astro) */
    .grow { display: inline-flex; align-items: center; gap: 6.4px; font-family: var(--font-mono);
            font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--text-secondary); border: 1px solid var(--border); border-radius: 999px;
            padding: 4px 10.4px; }
    .grow svg { color: var(--gc); }
    .grow.seedling { --gc: var(--grow-seedling); border-style: dashed; }
    .grow.growing { --gc: var(--grow-growing); border-style: dashed;
                    border-color: color-mix(in srgb, var(--border) 50%, var(--grow-growing)); }
    .grow.evergreen { --gc: var(--grow-evergreen); border-style: solid;
                      border-color: color-mix(in srgb, var(--border) 35%, var(--grow-evergreen)); }

    /* Writing row (WritingRow.astro) */
    .wrow { display: block; padding: 20px 0; text-decoration: none;
            border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
    .wrow-meta { display: flex; align-items: center; gap: 8px; }
    .wrow-kind { font-family: var(--font-mono); font-size: 11px; font-weight: 600;
                 letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); }
    .wrow-date { font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); }
    .wrow-title { font-size: 18px; font-weight: 600; margin: 6px 0 0; }
    .wrow-desc { font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin: 4px 0 0; }

    /* Section preview header (SectionPreview.astro) */
    .sec { padding-block: 40px; }
    .sec-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
                padding-bottom: 12px; border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
    .sec-label { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase;
                 letter-spacing: 0.12em; color: var(--text-secondary); margin: 0; }
    .sec-link { font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); text-decoration: none; }

    .mono-label { font-family: var(--font-mono); font-size: 13px; font-weight: 600;
                  letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 8px; }
  </style>`;

const dc = (bodyHtml, props, logic) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>${PRELUDE}
</helmet>
${bodyHtml}
</x-dc>
<script data-dc-script data-props='${props}'>
class Component extends DCLogic {
  renderVals() {
${logic}
  }
}
</script>
</body>
</html>
`;

const THEME_PROPS = `{"theme":{"editor":"enum","options":["dark","light"],"default":"dark","section":"Theme"}}`;
const THEME_LOGIC = `    return { themeClass: this.props.theme === 'light' ? 'light' : '' };`;

// Sidebar markup shared by every screen artboard.
const nav = (active) => {
  const items = [['House','Home'],['User','About'],['FileText','Work'],['FlaskConical','Lab'],['PenLine','Writing']];
  return `<aside class="sb">
      <div class="sb-brand">
        <div class="sb-logo"></div>
        <div style="display: flex; flex-direction: column; min-width: 0">
          <span class="sb-name">Alex Russell</span>
          <span class="sb-role">Design Engineer</span>
        </div>
      </div>
      <nav class="sb-nav">
${items.map(([ic, label]) => `        <a href="#" class="sb-link${label === active ? ' on' : ''}">${icon(ic, 18)}<span>${label}</span></a>`).join('\n')}
      </nav>
      <div class="sb-foot">
        <div class="sb-socials">${GH}${XI}</div>
        <div style="padding-left: 10px; color: var(--text-secondary)">${icon('Monitor', 20)}</div>
        <p class="sb-copy">&copy; 2026</p>
      </div>
    </aside>`;
};

const screen = (active, inner, extraCss = '') => dc(
`<div class="page {{themeClass}}" style="min-height: 100%">
  ${extraCss}
  <div class="shell">
    ${nav(active)}
    <main class="main">
      <div class="measure">
${inner}
      </div>
    </main>
  </div>
</div>`, THEME_PROPS, THEME_LOGIC);

export { dc, screen, nav, icon, GH, XI, PRELUDE, THEME_PROPS, THEME_LOGIC, writeFileSync };
