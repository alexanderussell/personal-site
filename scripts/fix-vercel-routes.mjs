/**
 * Post-build script: injects subdomain routing into Vercel's config.
 *
 * Sends ALL vinyl subdomain requests to the serverless function,
 * bypassing the filesystem handler. The Astro middleware inside the
 * serverless function detects the host and rewrites to /experiments/vinyl.
 */
import { readFileSync, writeFileSync } from 'fs';

const configPath = '.vercel/output/config.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Find the index of the filesystem handler
const fsIndex = config.routes.findIndex(r => r.handle === 'filesystem');

// Route ALL subdomain requests to the serverless function, BEFORE
// the filesystem handler serves static files (like index.html).
// No "continue" — the function handles everything.
config.routes.splice(fsIndex, 0, {
  src: '^/(.*)$',
  has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
  dest: '_render',
});

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✓ Injected vinyl subdomain route into Vercel config');
