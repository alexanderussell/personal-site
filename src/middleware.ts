import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
  const url = new URL(request.url);
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.hostname;
  const hostWithoutPort = host.split(':')[0];

  // Rewrite vinyl subdomain → /experiments/vinyl
  // Production: Vercel routing sends subdomain requests to this serverless function
  // Local dev: vinyl.localhost detected here
  if (
    (hostWithoutPort === 'vinyl.alexanderussell.com' || hostWithoutPort === 'vinyl.localhost') &&
    !url.pathname.startsWith('/experiments/vinyl')
  ) {
    return rewrite('/experiments/vinyl');
  }

  return next();
});
