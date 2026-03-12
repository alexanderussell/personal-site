/**
 * Post-build script: injects subdomain routing into Vercel's config
 * BEFORE the filesystem handler, so vinyl.alexanderussell.com
 * routes to /experiments/vinyl instead of serving static index.html.
 *
 * The rewrite happens at Vercel's routing layer (not in Astro middleware)
 * because edge middleware can't reliably rewrite to serverless functions.
 */
import { readFileSync, writeFileSync } from 'fs';

const configPath = '.vercel/output/config.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Find the index of the filesystem handler
const fsIndex = config.routes.findIndex(r => r.handle === 'filesystem');

// Insert subdomain rewrite BEFORE the filesystem handler.
// "continue: true" ensures routing continues after the rewrite,
// so the rewritten path hits the SSR route → serverless function.
const subdomainRoutes = [
  // Let API routes pass through unchanged
  {
    src: '^/api/(.*)$',
    has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
    dest: '/api/$1',
    continue: true,
  },
  // Let static assets pass through
  {
    src: '^/_astro/(.*)$',
    has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
    dest: '/_astro/$1',
    continue: true,
  },
  // Rewrite everything else to the vinyl experiment page.
  // Exclude /experiments/vinyl to prevent infinite loop (host still matches after rewrite).
  {
    src: '^(?!/experiments/vinyl)(.*)$',
    has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
    dest: '/experiments/vinyl',
    continue: true,
  },
];

config.routes.splice(fsIndex, 0, ...subdomainRoutes);

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✓ Injected vinyl subdomain routes into Vercel config');
