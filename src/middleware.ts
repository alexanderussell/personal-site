import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
  const url = new URL(request.url);
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.hostname;
  const hostWithoutPort = host.split(':')[0];

  // Local dev: rewrite vinyl.localhost → /experiments/vinyl
  // Production subdomain is handled by Vercel routing config (see scripts/fix-vercel-routes.mjs)
  if (hostWithoutPort === 'vinyl.localhost' && !url.pathname.startsWith('/experiments/vinyl')) {
    return rewrite('/experiments/vinyl');
  }

  return next();
});
