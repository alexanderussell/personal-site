/**
 * Post-build script: injects subdomain routing into Vercel's config
 * BEFORE the filesystem handler, so vinyl.alexanderussell.com
 * routes to the SSR middleware instead of serving static index.html.
 */
import { readFileSync, writeFileSync } from 'fs';

const configPath = '.vercel/output/config.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Add subdomain route before everything — sends subdomain requests
// to the Astro middleware function, which rewrites to /experiments/vinyl
config.routes.unshift({
  src: '^(?!/api/|/_astro/).*$',
  has: [{ type: 'host', value: 'vinyl.alexanderussell.com' }],
  dest: '_middleware',
});

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✓ Injected vinyl subdomain route into Vercel config');
