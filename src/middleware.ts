import { defineMiddleware } from 'astro:middleware';

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

  return next();
});
