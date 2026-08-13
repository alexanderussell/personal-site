/**
 * Post-build route and reference integrity check.
 *
 * Why this exists: Astro's content-collection errors and the RelatedPosts
 * unresolved-ref warning are both non-fatal. During the /experiments -> /lab
 * migration, a build with a stale collection name exited 0 while every
 * experiment detail page silently failed to generate. Green CI, broken site.
 *
 * This script turns those two failure modes into build failures.
 *
 * Scope and limits — read before trusting it:
 *   - It checks PRERENDERED OUTPUT and CONTENT REFS only.
 *   - It CANNOT verify redirects or the vinyl subdomain rewrite. Those live in
 *     src/middleware.ts and only run at request time. Verify them on a real
 *     deploy; nothing here will catch a broken rewrite target.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const OUT_DIR = 'dist/client';
const CONTENT_DIR = 'src/content';

/** Collections whose entries become pages, mapped to their URL prefix. */
const ROUTED_COLLECTIONS = {
  notes: '/notes',
  guides: '/guides',
  lab: '/lab',
  work: '/work',
};

/**
 * Routes that must never break. Published and linked from outside the site
 * (newsletter sends, external links), so a 404 here is a real regression.
 * Add an entry when a route becomes permanent — not before.
 */
const PERMANENT_ROUTES = ['/', '/about', '/book', '/notes', '/guides', '/lab', '/writing'];

const errors = [];
const notes = [];

// ── Read content entries ────────────────────────────────────────────────

/** Extract the frontmatter block without pulling in a YAML dependency. */
function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

function isDraft(fm) {
  return /^draft:\s*true\s*$/m.test(fm);
}

/** Parse `related: ["a/b", "c/d"]` into its refs. */
function relatedRefs(fm) {
  const match = fm.match(/^related:\s*\[(.*)\]\s*$/m);
  if (!match) return [];
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

const entries = [];

for (const collection of Object.keys(ROUTED_COLLECTIONS)) {
  const dir = join(CONTENT_DIR, collection);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    // Leading underscore marks a template — Astro's glob loader ignores these.
    if (file.startsWith('_')) continue;

    const slug = file.replace(/\.mdx?$/, '');
    const fm = frontmatter(readFileSync(join(dir, file), 'utf-8'));

    entries.push({
      collection,
      slug,
      ref: `${collection}/${slug}`,
      url: `${ROUTED_COLLECTIONS[collection]}/${slug}`,
      draft: isDraft(fm),
      related: relatedRefs(fm),
    });
  }
}

const published = entries.filter((e) => !e.draft);
const validRefs = new Set(published.map((e) => e.ref));

// ── Check 1: every `related` ref resolves ───────────────────────────────
// Astro only warns on these, so a rename leaves the graph half-broken and green.

for (const entry of published) {
  for (const ref of entry.related) {
    if (!validRefs.has(ref)) {
      errors.push(
        `Unresolved related ref: "${ref}" in ${entry.collection}/${entry.slug}.mdx ` +
          `(no published entry matches — collection renamed, or slug typo?)`
      );
    }
  }
}

// ── Check 2: every published entry produced a page ───────────────────────

function pageExists(url) {
  const path = join(OUT_DIR, url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`);
  return existsSync(path) && statSync(path).isFile();
}

if (!existsSync(OUT_DIR)) {
  errors.push(`Build output not found at ${OUT_DIR}/ — did the build run?`);
} else {
  for (const entry of published) {
    if (!pageExists(entry.url)) {
      errors.push(
        `Missing page: ${entry.url} (from ${entry.collection}/${entry.slug}.mdx). ` +
          `A collection error can drop detail pages without failing the build.`
      );
    }
  }

  // ── Check 3: permanent routes still resolve ──────────────────────────
  for (const url of PERMANENT_ROUTES) {
    if (!pageExists(url)) {
      errors.push(`Missing permanent route: ${url}`);
    }
  }

  // ── Check 4: drafts did not leak ─────────────────────────────────────
  for (const entry of entries.filter((e) => e.draft)) {
    if (pageExists(entry.url)) {
      errors.push(`Draft leaked into build: ${entry.url} is marked draft: true`);
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────

notes.push(
  `Checked ${published.length} published entries across ${Object.keys(ROUTED_COLLECTIONS).length} collections ` +
    `and ${PERMANENT_ROUTES.length} permanent routes.`
);

if (errors.length > 0) {
  console.error('\n✗ Route check failed:\n');
  for (const error of errors) console.error(`  • ${error}`);
  console.error(
    `\n  ${errors.length} problem${errors.length === 1 ? '' : 's'} found. ` +
      `Redirects and the vinyl subdomain are NOT covered here — verify those on deploy.\n`
  );
  process.exit(1);
}

console.log(`✓ Route check passed. ${notes.join(' ')}`);
