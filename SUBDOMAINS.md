# Adding Subdomains

This site supports routing subdomains to specific experiments/pages. Here's how it works and how to add new ones.

## Architecture

1. **Astro middleware** (`src/middleware.ts`) — checks the `Host` header and rewrites subdomain requests to the target page
2. **Post-build script** (`scripts/fix-vercel-routes.mjs`) — injects subdomain routes into Vercel's routing config *before* the filesystem handler, so static pages don't intercept subdomain requests
3. **Vercel domain config** — the subdomain must be added to the Vercel project

## How to add a new subdomain

### 1. Add the route in middleware

In `src/middleware.ts`, add a new host check:

```ts
if (hostWithoutPort === 'newname.alexanderussell.com' || hostWithoutPort === 'newname.localhost') {
  return rewrite('/path/to/page');
}
```

Key details:
- Strip the port with `host.split(':')[0]` (already done in the shared `hostWithoutPort` variable)
- Add `newname.localhost` for local dev testing
- Use `rewrite('/path/to/page')` with a **path string**, not `new Request(...)` — path strings let Astro resolve to the correct `.astro` file and avoid conflicts with `[...slug]` catch-all routes
- Add a pathname guard if the target path could loop: `&& !url.pathname.startsWith('/path/to/page')`

### 2. Add the subdomain to the post-build script

In `scripts/fix-vercel-routes.mjs`, update the `has` condition to include the new subdomain. If you have multiple subdomains, add a separate route entry for each:

```js
config.routes.unshift({
  src: '^(?!/api/|/_astro/).*$',
  has: [{ type: 'host', value: 'newname.alexanderussell.com' }],
  dest: '_middleware',
});
```

This ensures Vercel sends subdomain requests to the middleware instead of serving static files.

### 3. Add the domain in Vercel

Go to **Vercel Dashboard → Project → Settings → Domains** and add `newname.alexanderussell.com`. Since nameservers are on Vercel (`ns1.vercel-dns.com`), the DNS record is created automatically.

### 4. Test locally

Run `npm run dev` and visit `http://newname.localhost:4321`.

## Why it works this way

- Astro prerendered/static pages are served from Vercel's CDN **before** any middleware runs
- `vercel.json` rewrites don't work with Astro server output (officially unsupported)
- The post-build script injects routes before the `"handle": "filesystem"` rule in Vercel's routing config, forcing subdomain traffic through the Astro middleware edge function
- `edgeMiddleware: true` in `astro.config.mjs` makes the Astro middleware run as a Vercel Edge Function

## Gotchas

- **URL conflicts**: Don't create a content file (`.mdx`) with the same slug as a standalone page (`.astro`). Example: `vinyl.mdx` and `vinyl.astro` both resolve to `/experiments/vinyl`.
- **API routes**: The post-build script excludes `/api/` paths so API endpoints work on subdomains without being rewritten.
- **`vercel.json`**: Keep it empty (`{}`). Astro generates its own routing config and vercel.json rewrites conflict with it.
