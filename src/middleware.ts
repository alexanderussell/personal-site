import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite, redirect }, next) => {
  const url = new URL(request.url);
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.hostname;
  const hostWithoutPort = host.split(':')[0];

  // Rewrite vinyl subdomain → /experiments/vinyl
  if (
    (hostWithoutPort === 'vinyl.alexanderussell.com' || hostWithoutPort === 'vinyl.localhost') &&
    url.pathname === '/'
  ) {
    return rewrite('/experiments/vinyl');
  }

  // Redirect old /logs/ URLs to /notes/
  if (url.pathname.startsWith('/logs')) {
    const newPath = url.pathname.replace(/^\/logs/, '/notes');
    return redirect(newPath, 301);
  }

  return next();
});
