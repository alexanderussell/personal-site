import { defineMiddleware } from 'astro:middleware';

/**
 * Lab entries retired from publication. Their content files still exist with
 * `draft: true`, so restoring one means flipping that flag and deleting its
 * entry here.
 */
const RETIRED_LAB_PATHS = new Set(['/lab/hold-to-provision', '/lab/bricklayer']);

export const onRequest = defineMiddleware(({ request, rewrite, redirect }, next) => {
  const url = new URL(request.url);
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.hostname;
  const hostWithoutPort = host.split(':')[0];

  // Rewrite vinyl subdomain → /lab/vinyl
  // NOTE: this target must track the page's real location. No build-time check
  // covers it (scripts/check-routes.mjs can only see prerendered output, not
  // request-time rewrites), so moving the vinyl page silently 404s the
  // subdomain. Verify on deploy, not just locally.
  if (
    (hostWithoutPort === 'vinyl.alexanderussell.com' || hostWithoutPort === 'vinyl.localhost') &&
    url.pathname === '/'
  ) {
    return rewrite('/lab/vinyl');
  }

  // Redirect old /logs/ URLs to /notes/
  if (url.pathname.startsWith('/logs')) {
    const newPath = url.pathname.replace(/^\/logs/, '/notes');
    return redirect(newPath, 301);
  }

  // Redirect old /experiments/ URLs to /lab/
  // The section was renamed in the portfolio-first restructure; these URLs were
  // published and are linked from prior newsletter sends.
  if (url.pathname.startsWith('/experiments')) {
    const newPath = url.pathname.replace(/^\/experiments/, '/lab');
    return redirect(newPath, 301);
  }

  // Experiments retired from Lab in August 2026. Their write-ups still exist as
  // drafts, but the URLs were published, so they land on the Lab index rather
  // than 404. 302 rather than 301 — these could come back.
  if (RETIRED_LAB_PATHS.has(url.pathname.replace(/\/$/, ''))) {
    return redirect('/lab', 302);
  }

  return next();
});
