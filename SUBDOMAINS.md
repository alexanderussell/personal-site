# Adding Subdomains

This site supports routing subdomains to specific experiments/pages. Here's how it works and how to add new ones.

## Architecture

Subdomain routing requires two pieces working together:

1. **Post-build script** (`scripts/fix-vercel-routes.mjs`) — injects a route into Vercel's config that sends subdomain requests to the serverless function, bypassing the static file handler
2. **Astro middleware** (`src/middleware.ts`) — detects the subdomain via the `Host` header and rewrites to the target page

The key insight: prerendered static pages on Vercel are served from CDN **before** any middleware or serverless function runs. The post-build script forces subdomain traffic to the serverless function, where the Astro middleware can handle it.

## How to add a new subdomain

### 1. Add the route in Astro middleware

In `src/middleware.ts`, add a new host check:

```ts
if (
  (hostWithoutPort === 'newname.alexanderussell.com' || hostWithoutPort === 'newname.localhost') &&
  !url.pathname.startsWith('/path/to/page')
) {
  return rewrite('/path/to/page');
}
```

Key details:
- Use `rewrite('/path/to/page')` with a **path string**, not `new Request(...)` — path strings let Astro resolve to the correct `.astro` file and avoid conflicts with `[...slug]` catch-all routes
- Add a pathname guard (`!url.pathname.startsWith(...)`) to prevent loops when the rewrite re-enters middleware
- Add `newname.localhost` for local dev testing
- Strip the port with `host.split(':')[0]` (already done in the shared `hostWithoutPort` variable)

### 2. Add the subdomain to the post-build script

In `scripts/fix-vercel-routes.mjs`, add a new route entry before the filesystem handler:

```js
config.routes.splice(fsIndex, 0, {
  src: '^/(.*)$',
  has: [{ type: 'host', value: 'newname.alexanderussell.com' }],
  dest: '_render',
});
```

This sends all subdomain traffic to the `_render` serverless function. The Astro middleware inside that function handles the rewrite.

### 3. Add the domain in Vercel

Go to **Vercel Dashboard → Project → Settings → Domains** and add `newname.alexanderussell.com`. Since nameservers are on Vercel (`ns1.vercel-dns.com`), the DNS record is created automatically.

### 4. Test locally

Run `npm run dev` and visit `http://newname.localhost:4321`.

## Why it works this way

Vercel + Astro subdomain routing is tricky because of how the pieces interact:

- **Static pages bypass everything.** Prerendered pages are served from Vercel's CDN edge before any serverless function or middleware runs. A request to `subdomain.example.com/` matches `index.html` and returns the homepage.
- **`vercel.json` rewrites don't work with Astro.** Officially unsupported — Astro generates its own routing config via the Build Output API, and `vercel.json` rewrites conflict with it.
- **Edge middleware can't rewrite to serverless functions.** With `edgeMiddleware: true`, the middleware runs as an Edge Function separate from the `_render` Serverless Function. Astro's `rewrite()` returns an empty response because the edge function can't chain to the render function.
- **`continue: true` causes infinite loops.** Vercel routing with `continue: true` re-evaluates all routes after a rewrite. Since the `Host` header doesn't change, the subdomain catch-all matches again → loop.

The working solution: route subdomain requests directly to `_render` (the serverless function) **without** edge middleware. The Astro middleware runs inside the same Node.js process as the renderer, so `rewrite()` works correctly.

## Gotchas

- **No `edgeMiddleware: true`** — it breaks subdomain rewrites. Keep the adapter as `vercel()` with no options.
- **No `vercel.json` rewrites** — keep `vercel.json` as `{}`. All routing is handled by the Build Output API config injected by the post-build script.
- **URL conflicts** — don't create a content file (`.mdx`) with the same slug as a standalone page (`.astro`). Example: `vinyl.mdx` and `vinyl.astro` both resolve to `/experiments/vinyl`.
- **`export const prerender = true`** — required on any page using `getStaticPaths()` when `output: 'server'` is set. Without it, Astro ignores `getStaticPaths()` and the page crashes with `RenderUndefinedEntryError`.
- **API routes work automatically** — the serverless function handles all routes, so `/api/*` endpoints work on subdomains without special config.
- **Build command** — must be `astro build && node scripts/fix-vercel-routes.mjs` in `package.json`. The post-build script modifies the generated Vercel config.
