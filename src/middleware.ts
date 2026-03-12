import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
  // Check both the URL hostname and the Host header (Vercel may proxy the hostname)
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || new URL(request.url).hostname;

  // Rewrite vinyl.alexanderussell.com → /experiments/vinyl
  if (host === 'vinyl.alexanderussell.com') {
    return rewrite(new Request(new URL('/experiments/vinyl', new URL(request.url).origin), request));
  }

  return next();
});
