import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
  const url = new URL(request.url);
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.hostname;

  // Rewrite vinyl subdomain → /experiments/vinyl
  // Matches production subdomain and vinyl.localhost for local dev
  const hostWithoutPort = host.split(':')[0];
  if ((hostWithoutPort === 'vinyl.alexanderussell.com' || hostWithoutPort === 'vinyl.localhost') && !url.pathname.startsWith('/experiments/vinyl')) {
    return rewrite('/experiments/vinyl');
  }

  return next();
});
