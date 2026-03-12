/**
 * Post-build script: injects subdomain routing into Vercel's config.
 *
 * Routes vinyl subdomain page requests to the serverless function,
 * while letting static assets (/_astro/*, /favicon.*, etc.) and
 * API routes fall through to their normal handlers.
 */
import { readFileSync, writeFileSync } from 'fs';

const configPath = '.vercel/output/config.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Find the index of the filesystem handler
const fsIndex = config.routes.findIndex(r => r.handle === 'filesystem');

// Only intercept page requests on the subdomain — NOT static assets or API routes.
// Static assets (/_astro/, /favicon, /fonts, /images) need the filesystem handler.
// API routes (already SSR) are handled by their own route entries after filesystem.
config.routes.splice(fsIndex, 0, {
  src: '^(?!/_astro/|/api/|/favicon|/fonts/|/images/)(.*)$',
  has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
  dest: '_render',
});

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✓ Injected vinyl subdomain route into Vercel config');
