import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
  const url = new URL(request.url);

  // Rewrite vinyl.alexanderussell.com → /experiments/vinyl
  if (url.hostname === 'vinyl.alexanderussell.com') {
    return rewrite(new Request(new URL('/experiments/vinyl', url.origin), request));
  }

  return next();
});
