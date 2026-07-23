# Astro vs Next.js on Vercel — Endpoints, Hosting, and SEO

**Date:** 2026-07-22  
**Scope:** Primary sources only (official Astro, Next.js, and Vercel documentation).  
**Not used:** Opinion blogs, third-party tutorials, or unofficial comparisons.

---

## Executive summary

- **Yes — Vercel hosts Astro.** Static Astro sites deploy with zero config; on-demand rendering and Vercel platform features require the official `@astrojs/vercel` adapter (`npx astro add vercel`). Sources: [Astro deploy to Vercel](https://docs.astro.build/en/guides/deploy/vercel/), [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro), [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/).
- **SSR / on-demand rendering** works via the adapter: routes become Vercel Functions. Opt out of prerendering per route with `export const prerender = false`, or set `output: "server"` for server-first defaults. Sources: [On-demand rendering](https://docs.astro.build/en/guides/server-side-rendering/), [Astro on Vercel — SSR](https://vercel.com/docs/frameworks/frontend/astro).
- **ISR** is supported on Vercel by setting `isr: true` (or an ISR config object) on the Vercel adapter. Sources: [@astrojs/vercel `isr`](https://docs.astro.build/en/guides/integrations-guide/vercel/#isr), [Astro on Vercel — ISR](https://vercel.com/docs/frameworks/frontend/astro).
- **Serverless / Vercel Functions:** With SSR enabled, routes (including Astro Server Endpoints) deploy as Vercel Functions. Configure `maxDuration`, bundling, etc. via the adapter. Sources: [Astro on Vercel — Vercel Functions](https://vercel.com/docs/frameworks/frontend/astro), [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/).
- **Edge:** Astro middleware can run as Vercel Edge (Astro adapter: `middlewareMode: "edge"`; Vercel docs also document `edgeMiddleware: true`). Full page/API handlers are documented primarily as serverless Functions, not as Edge page runtimes. Sources: [@astrojs/vercel — Edge middleware](https://docs.astro.build/en/guides/integrations-guide/vercel/#running-astro-middleware-on-vercel-edge-functions), [Astro on Vercel — Middleware](https://vercel.com/docs/frameworks/frontend/astro).
- **Fluid Compute:** Platform-level Vercel Functions feature (enabled by default for new projects). Astro is listed among frameworks that configure function `maxDuration` the same way; SSR Astro routes run as Vercel Functions and therefore sit under Fluid Compute limits/billing. There is no separate Astro-only Fluid Compute toggle in the Astro adapter docs. Sources: [Configuring maximum duration](https://vercel.com/docs/functions/configuring-functions/duration), [Fluid compute](https://vercel.com/docs/fluid-compute).
- **Astro endpoints ≈ Next.js App Router Route Handlers** conceptually (named HTTP method exports + Web `Request`/`Response`), **not** like Pages Router `pages/api` (`req`/`res` helpers). They do **not** work the same in file placement, static-vs-live behavior, or Next-specific helpers (`NextRequest`, `cookies()` from `next/headers`, segment config). See comparison table and verdict below.
- **SEO angle (documented characteristics):** Astro markets itself for content-driven sites with **zero client JS by default**, islands/selective hydration, and server-first HTML — traits it explicitly ties to fast loads and SEO. Next.js documents SEO via **Metadata API**, OG/sitemap/robots conventions, and server-rendered HTML (including bot-aware metadata). Sources: [Why Astro?](https://docs.astro.build/en/concepts/why-astro/), [Islands architecture](https://docs.astro.build/en/concepts/islands/), [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Production checklist — Metadata and SEO](https://nextjs.org/docs/app/guides/production-checklist).

---

## 1. Can Vercel host Astro.js? Adapters, config, and features

### Claim: Vercel can host Astro (static and server-rendered)

Astro’s deploy guide states you can deploy an Astro site to Vercel’s global edge network with **zero configuration** for static sites, and that Vercel auto-detects Astro. For **on-demand rendering**, add the Vercel adapter:

```bash
npx astro add vercel
```

Sources:

- https://docs.astro.build/en/guides/deploy/vercel/
- https://vercel.com/docs/frameworks/frontend/astro

### Claim: Adapter needed for SSR and many Vercel features

- **Static site:** No adapter required to deploy.
- **On-demand rendering / SSR:** Requires `@astrojs/vercel`.
- **Vercel features** (e.g. Web Analytics, Image Optimization) on a static site also require the adapter per Vercel’s Astro docs.

Current Astro adapter install (official integration guide, v11.x docs):

```js
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  adapter: vercel(),
});
```

Sources:

- https://docs.astro.build/en/guides/integrations-guide/vercel/
- https://vercel.com/docs/frameworks/frontend/astro

> **Docs note:** Vercel’s Astro page still shows older import paths such as `@astrojs/vercel/serverless` and `@astrojs/vercel/static`, and mentions `output: "hybrid"`. Astro’s current configuration reference documents `output` as **`'static' | 'server'`** only (default `'static'`). Prefer Astro’s adapter + config reference for current project setup; use Vercel’s page for platform feature descriptions.

Sources for output modes:

- https://docs.astro.build/en/reference/configuration-reference/#output
- https://docs.astro.build/en/guides/server-side-rendering/

### Feature matrix (what official docs say works)

| Feature | Works with Astro on Vercel? | What docs say | Sources |
| --- | --- | --- | --- |
| **Static hosting** | Yes | Zero-config deploy; prerendered HTML/assets | [Deploy Vercel](https://docs.astro.build/en/guides/deploy/vercel/), [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro) |
| **SSR / on-demand** | Yes | Adapter required; routes as Vercel Functions; scales to zero; `Cache-Control` / `stale-while-revalidate` called out | [SSR guide](https://docs.astro.build/en/guides/server-side-rendering/), [Astro on Vercel — SSR](https://vercel.com/docs/frameworks/frontend/astro) |
| **ISR** | Yes | `adapter: vercel({ isr: true })` or ISR config (`expiration`, `bypassToken`, `exclude`) | [@astrojs/vercel `isr`](https://docs.astro.build/en/guides/integrations-guide/vercel/#isr), [Astro on Vercel — ISR](https://vercel.com/docs/frameworks/frontend/astro) |
| **Serverless / Vercel Functions** | Yes | SSR routes + Server Endpoints run as Functions; `maxDuration`, `includeFiles`, `excludeFiles`, etc. | [Astro on Vercel — Functions](https://vercel.com/docs/frameworks/frontend/astro), [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/) |
| **Edge** | Partially / middleware-focused | Astro middleware → Edge Function via `middlewareMode: "edge"` (Astro) / `edgeMiddleware: true` (Vercel docs). Access to Vercel edge request context documented. Full page runtime is described as Functions/SSR, not “Edge pages” | [@astrojs/vercel Edge middleware](https://docs.astro.build/en/guides/integrations-guide/vercel/#running-astro-middleware-on-vercel-edge-functions), [Astro on Vercel — Middleware](https://vercel.com/docs/frameworks/frontend/astro) |
| **Fluid Compute** | Platform default for Functions | Fluid Compute is Vercel’s Functions execution model (default for new projects). Astro appears in the same `maxDuration` docs group as Next.js/SvelteKit/etc. No Astro-specific Fluid API in the Astro adapter guide | [maxDuration](https://vercel.com/docs/functions/configuring-functions/duration), [Fluid compute](https://vercel.com/docs/fluid-compute) |
| **Image Optimization / Analytics** | Yes (with adapter options) | `imageService`, `imagesConfig`, `webAnalytics` (legacy analytics config notes apply) | [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/), [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro) |

### Adapter config options commonly cited

From [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/) and [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro):

- `isr` — Incremental Static Regeneration
- `maxDuration` — Function timeout (seconds)
- `middlewareMode: "edge"` / Vercel’s `edgeMiddleware: true` — Edge middleware
- `imageService` / `imagesConfig` / `devImageService`
- `webAnalytics`
- `includeFiles` / `excludeFiles`
- `skewProtection`, `staticHeaders` (Astro adapter docs)

---

## 2. How Astro API / server endpoints work

Primary source: https://docs.astro.build/en/guides/endpoints/

### File location and URL conventions

- Place `.js` / `.ts` files under **`src/pages/`** (same tree as pages).
- The `.js`/`.ts` extension is **stripped**; the rest of the filename becomes the route. Example: `src/pages/data.json.ts` → `/data.json`.
- Dynamic routes use brackets, e.g. `src/pages/api/[id].json.ts`, same pattern as pages.
- Endpoints whose URLs include a file extension are accessed **without** a trailing slash (e.g. `/sitemap.xml`), regardless of `trailingSlash` config.

Sources:

- https://docs.astro.build/en/guides/endpoints/
- https://docs.astro.build/en/guides/server-side-rendering/ (Server Endpoints section)

### Request / response API

- Export named functions for HTTP methods: `GET`, `POST`, `DELETE`, etc., and optionally `ALL` for unmatched methods.
- Handlers receive an **endpoint context** (similar to the `Astro` global): `params`, `request`, `redirect`, etc.
- Return a standard Web **`Response`** (status, headers, body).
- Type with `APIRoute` from `"astro"` (`satisfies APIRoute`).
- If `GET` exists but not `HEAD`, Astro auto-handles `HEAD` by calling `GET` and stripping the body.
- Unmatched methods redirect to the site’s 404 page (per endpoints guide).

Example shape (from docs):

```ts
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

Sources:

- https://docs.astro.build/en/guides/endpoints/

### Static vs server (on-demand) endpoints

| Mode | Behavior | Request object | Dynamic params |
| --- | --- | --- | --- |
| **Static / prerendered** (default) | Endpoint runs at **build time**; output is a static file | Only `request.url` is meaningfully available | Need `getStaticPaths()` for dynamic segments |
| **On-demand (SSR)** | Endpoint runs **per request** as a live server endpoint | Full usable `Request` (body, headers, method) | Can use `params` without `getStaticPaths` |

How to enable on-demand:

1. Install an adapter (e.g. `@astrojs/vercel`).
2. Either:
   - Keep `output: "static"` (default) and set `export const prerender = false` on the endpoint, **or**
   - Set `output: "server"` so routes are on-demand by default, and use `export const prerender = true` to opt specific endpoints back to static.

Sources:

- https://docs.astro.build/en/guides/endpoints/
- https://docs.astro.build/en/guides/server-side-rendering/
- https://docs.astro.build/en/reference/configuration-reference/#output

> **Terminology:** Older docs/Vercel pages may say “hybrid.” Current Astro `output` values are **`static`** and **`server`**, with per-route `prerender` toggling. Hybrid-style mixes are achieved via per-route prerender flags, not a separate `output: "hybrid"` in current Astro config reference.

### Middleware

- File: `src/middleware.js|ts` or `src/middleware/index.js|ts`.
- Export **`onRequest(context, next)`** (not a default export).
- Can mutate `context.locals` (shared with pages and API endpoints), return a `Response`, call `next()`, rewrite, etc.
- Runs at **build time** for prerendered routes; at **request time** for on-demand routes (cookies/headers then available).
- On Vercel, can be deployed to Edge (`middlewareMode: "edge"` / `edgeMiddleware: true`).

Sources:

- https://docs.astro.build/en/guides/middleware/
- https://docs.astro.build/en/guides/integrations-guide/vercel/#running-astro-middleware-on-vercel-edge-functions
- https://vercel.com/docs/frameworks/frontend/astro

### Related on-demand page features (same SSR stack)

From the on-demand rendering guide: HTML streaming for pages, cookies (`Astro.cookies`), `Astro.response` / returning `Response`, full `Astro.request`.

Source: https://docs.astro.build/en/guides/server-side-rendering/

---

## 3. Comparison to Next.js API Routes / Route Handlers

### Next.js App Router — Route Handlers

Primary source: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

- File: `route.js|ts` inside an App Router segment (e.g. `app/api/hello/route.ts` → `/api/hello`).
- Export named HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.
- Uses Web **`Request` / `Response`** APIs; often typed with **`NextRequest`** (`next/server`).
- Second arg `context.params` is a **Promise** (as of Next.js 15) resolving to dynamic params.
- Helpers: `cookies()` / `headers()` from `next/headers`, `redirect()` from `next/navigation`, `Response.json()`, streaming via `ReadableStream` / Response body.
- Segment config: `dynamic`, `revalidate`, `runtime`, `preferredRegion`, etc.
- If `OPTIONS` is omitted, Next.js can auto-implement `OPTIONS` and set `Allow`.

### Next.js Pages Router — API Routes

Primary source: https://nextjs.org/docs/pages/building-your-application/routing/api-routes

- Files under **`pages/api/`** map to `/api/*`.
- Default-export a single **`handler(req, res)`**.
- `req`: Node `IncomingMessage` (with helpers: `req.cookies`, `req.query`, `req.body`).
- `res`: Node `ServerResponse` with Express-like helpers (`res.status()`, `res.json()`, `res.send()`, `res.redirect()`, `res.revalidate()`).
- Method switching via `req.method` branching (not separate named exports).
- Cannot be used with static export; App Router Route Handlers can (per Pages docs “Good to know”).
- Streaming possible via Node `res.write` / `writeHead`; docs recommend App Router Route Handlers on Next.js 14+.

### Next.js middleware / proxy (for comparison)

Next.js docs note the `middleware` file convention is **deprecated and renamed to `proxy`**. `proxy.ts` runs before routes; uses `NextRequest` / `NextResponse`, optional `matcher` config.

Source: https://nextjs.org/docs/app/building-your-application/routing/middleware

Astro middleware remains `src/middleware` + `onRequest`. Vercel also distinguishes Astro middleware from Vercel Routing Middleware (`middleware.ts` at project root).

Source: https://vercel.com/docs/frameworks/frontend/astro

### What’s the same conceptually

- Custom HTTP endpoints for JSON, webhooks, non-UI responses, etc.
- File-based routing colocated with the app.
- Named HTTP method handlers + Web `Request`/`Response` (**Astro endpoints ↔ App Router Route Handlers**).
- Dynamic segments via `[param]` file naming.
- Middleware layer that can share request-scoped data / alter responses before/around rendering.
- On Vercel, both frameworks’ server routes map onto **Vercel Functions** (with platform features like duration limits and Fluid Compute).

### What’s different

| Area | Astro | Next.js App Router | Next.js Pages API |
| --- | --- | --- | --- |
| Canonical file | `src/pages/**/*.ts` (any path, often `*.json.ts`) | `app/**/route.ts` | `pages/api/**` |
| Handler shape | Named exports `GET`/`POST`/…/`ALL` | Named exports `GET`/`POST`/… | Single `handler(req, res)` |
| Request API | Web `Request` in SSR; limited in static | Web `Request` / `NextRequest` | Node `req` + helpers |
| Response API | `new Response(...)` | `Response` / `Response.json()` | `res.json()`, `res.send()`, … |
| Static endpoints | First-class: build-time file generation | Can prerender/revalidate via segment config / `generateStaticParams` | Not for static export |
| Catch-all unmatched methods | `ALL` export | No `ALL`; undefined methods → framework behavior; auto `OPTIONS` | Branch on `req.method` |
| Params | Sync `params` on context | `params` is a **Promise** (v15+) | Via `req.query` |
| Framework cookies helpers | Endpoint context / `Astro.cookies` on pages | `cookies()` from `next/headers` | `req.cookies` / Set-Cookie |
| Revalidation | Vercel ISR via adapter `isr`; Cache-Control | `export const revalidate`, caching APIs | `res.revalidate` (on-demand for pages) |

---

## Side-by-side: Astro endpoints vs Next.js Route Handlers

| Dimension | Astro Server / API Endpoints | Next.js App Router Route Handlers |
| --- | --- | --- |
| **Docs** | [Endpoints](https://docs.astro.build/en/guides/endpoints/) | [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) |
| **File convention** | `src/pages/api/hello.ts` or `src/pages/data.json.ts` | `app/api/hello/route.ts` |
| **URL mapping** | Path from `pages/` + filename (extensions kept in name when desired) | Folder path; `route.ts` does not appear in URL |
| **HTTP methods** | Export `GET`, `POST`, …, optional `ALL` | Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` |
| **Context** | Single context object (`params`, `request`, `redirect`, `locals`, …) | `(request, { params })` — `params` awaited in Next 15+ |
| **Return type** | Web `Response` | Web `Response` (often `Response.json`) |
| **Static generation** | Default build-time endpoints; `getStaticPaths` for dynamic static | `generateStaticParams` + segment config / caching |
| **On-demand** | Adapter + `prerender = false` or `output: "server"` | Dynamic by default for many GET cases (see version history notes in Route Handlers docs) |
| **Streaming** | HTML streaming documented for on-demand **pages**; endpoints return `Response` (can use stream bodies via Web API) | Explicit Route Handler streaming examples with `ReadableStream` |
| **Middleware** | `src/middleware` → `onRequest` | `proxy` (formerly middleware) at project/`src` root |
| **Types** | `APIRoute` from `astro` | `NextRequest`, `RouteContext<'/path/[id]'>` |
| **Vercel deploy** | Needs `@astrojs/vercel` for live endpoints | First-party Next.js on Vercel |

---

## “Do they work the same?” — Verdict

**No — not the same implementation, but close cousins at the App Router layer.**

- **Closest match:** Astro **on-demand** endpoints and Next.js **App Router Route Handlers** share the same mental model: **named HTTP method exports** returning the **Web Fetch `Response` API**, with a Web `Request` (or Next’s extension) for input.
- **Not the same as Pages Router API Routes:** Astro does **not** use Node `req`/`res` or Express-style helpers; that pattern is Next.js Pages `pages/api` only.
- **Practical differences that matter when porting:**
  1. **File placement** (`src/pages/*.ts` vs `app/**/route.ts`).
  2. **Static-by-default endpoints** in Astro (build artifacts) vs Next’s Route Handler caching/dynamic rules.
  3. **Params async** in modern Next vs sync Astro context params.
  4. **Next-only** APIs (`next/headers`, segment `runtime`/`revalidate` exports, `NextRequest` helpers).
  5. **Vercel wiring:** Next is native; Astro needs **`@astrojs/vercel`** for live SSR/API/ISR/Edge middleware.

**Bottom line:** Treat them as **conceptually similar Web-standard HTTP handlers** with **different routing conventions and platform adapters**, not as drop-in interchangeable APIs.

---

## 4. Brief SEO angle (documented framework characteristics)

### Astro (official “Why Astro?” + Islands)

Astro’s own docs position it as the framework for **content-driven** sites (blogs, marketing, docs, e-commerce content) and state: if you need a site that **loads fast and has great SEO**, Astro is for you.

Documented characteristics relevant to SEO/performance:

1. **Zero JS by default** — UI components render to HTML/CSS; client JS is stripped unless you opt in with `client:*` directives.
2. **Islands / selective hydration** — Most of the page stays static HTML; only marked interactive “islands” hydrate, avoiding monolithic SPA JS payloads.
3. **Server-first / MPA-style** — Prefer server HTML over client-rendered SPA; Astro contrasts this with SPA-oriented frameworks (explicitly naming Next.js among others in the “Server-first” section) regarding TTI tradeoffs for content sites.
4. **Content focus** — Content collections, Markdown/MDX ecosystem, and design principles oriented around delivering content quickly.

Sources:

- https://docs.astro.build/en/concepts/why-astro/
- https://docs.astro.build/en/concepts/islands/
- https://vercel.com/docs/frameworks/frontend/astro (“content-rich experiences with as little JavaScript as possible”)

### Next.js (official SEO-related docs)

Next.js documents SEO primarily through **tooling and server HTML**, not through a “zero JS by default” claim:

1. **Metadata API** (`metadata` / `generateMetadata`) to generate `<title>`, description, and related tags for SEO and shareability.
2. **File conventions** for favicons, Open Graph images, `sitemap`, `robots`.
3. **Server Components / server rendering** so metadata can be in the initial HTML; streaming metadata is **disabled for many bots/crawlers** so they still get metadata in `<head>`.
4. Production checklist section **“Metadata and SEO”** points teams at Metadata API, OG images, sitemaps, and robots.

Sources:

- https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/guides/production-checklist

### Fair, docs-only framing

| | Astro (per Astro docs) | Next.js (per Next.js docs) |
| --- | --- | --- |
| Default client JS | None until `client:*` | React app model; Server Components reduce client JS but framework is React-centric |
| Primary SEO story | Content-first + fast HTML + islands | Metadata API + crawlable server HTML + SEO file conventions |
| Hosting on Vercel | Fully supported with adapter for dynamic features | First-party framework on Vercel |

Neither official doc set claims the other cannot rank; they emphasize **different default architectures** for delivering HTML and JS to crawlers and users.

---

## Primary sources index

| Topic | URL |
| --- | --- |
| Astro docs home | https://docs.astro.build/ |
| Deploy Astro to Vercel | https://docs.astro.build/en/guides/deploy/vercel/ |
| `@astrojs/vercel` adapter | https://docs.astro.build/en/guides/integrations-guide/vercel/ |
| Astro endpoints | https://docs.astro.build/en/guides/endpoints/ |
| Astro on-demand / SSR | https://docs.astro.build/en/guides/server-side-rendering/ |
| Astro middleware | https://docs.astro.build/en/guides/middleware/ |
| Astro `output` config | https://docs.astro.build/en/reference/configuration-reference/#output |
| Why Astro? | https://docs.astro.build/en/concepts/why-astro/ |
| Islands architecture | https://docs.astro.build/en/concepts/islands/ |
| Astro on Vercel (Vercel) | https://vercel.com/docs/frameworks/frontend/astro |
| Fluid compute | https://vercel.com/docs/fluid-compute |
| Function max duration (incl. Astro examples) | https://vercel.com/docs/functions/configuring-functions/duration |
| Next.js Route Handlers | https://nextjs.org/docs/app/building-your-application/routing/route-handlers |
| Next.js Pages API Routes | https://nextjs.org/docs/pages/building-your-application/routing/api-routes |
| Next.js middleware → proxy | https://nextjs.org/docs/app/building-your-application/routing/middleware |
| Next.js Metadata / SEO | https://nextjs.org/docs/app/getting-started/metadata-and-og-images |
| Next.js production checklist (SEO) | https://nextjs.org/docs/app/guides/production-checklist |

---

## Research caveats

1. **Vercel vs Astro config drift:** Vercel’s Astro page still references `hybrid` output and `@astrojs/vercel/serverless|static` import paths; Astro’s current adapter guide uses `import vercel from "@astrojs/vercel"` and `output: "static" | "server"`. Claims about **how to configure Astro today** follow Astro’s docs; claims about **platform capabilities** follow both.
2. **Fluid Compute** is documented as a Vercel Functions platform behavior, not an Astro framework API. Support is inferred from Astro SSR → Vercel Functions + Astro appearing in Functions duration docs.
3. No secondary “best for SEO” rankings were used; SEO section sticks to each framework’s stated architecture and SEO tooling.
