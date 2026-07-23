# Session notes: Astro vs Next — APIs, limits, Vercel hosting

**Date:** 2026-07-23  
**Kind:** Chat / working notes (not primary-docs research)  
**Related raw:** `raw/research/astro-vs-next-vercel.md` (primary-sources dump, 2026-07-22)  
**Topic:** Whether Astro and Next API setups are the same; Astro limitations vs Next; hosting Astro on Vercel.

---

## Q1 — Are Astro and Next.js API setups almost the same?

**Verdict:** Similar at the HTTP-handler layer; not the same architecture or drop-in APIs.

### Surface similarity

| | Astro | Next.js (App Router) |
|---|---|---|
| Endpoints | `src/pages/api/*.ts` (or any `src/pages/**/*.ts`) | `app/api/**/route.ts` |
| Handlers | Named exports `GET` / `POST` / … (`APIRoute`) | Named exports `GET` / `POST` / … |
| Response | Web `Response` | Web `Response` (often `Response.json`) |

Small JSON `GET` endpoints feel familiar across both.

### Where they diverge

- Next wires APIs into Server Actions, RSC, middleware/proxy, caching, and a richer first-party deploy story.
- Astro endpoints are thinner “backend for the frontend” routes; static-by-default vs live needs adapter + `prerender = false` or `output: "server"`.
- Astro is **not** like Next Pages Router `pages/api` (`req`/`res` helpers). Closest cousin is **App Router Route Handlers**.
- Practical porting gaps: file layout, static vs on-demand defaults, Next-only helpers (`next/headers`, segment config, `NextRequest`), async `params` in modern Next vs sync Astro context.

**Rule of thumb:** Same for small REST/JSON endpoints; not the same for a full product backend + highly interactive app.

---

## Q2 — Limitations of Astro compared to Next.js

Working framing (product fit, not a claim that Astro “cannot” do these):

1. **Interactivity model** — Astro is HTML-first with opt-in islands. Next is built for interactive React apps (RSC + client components). Heavy client state, dashboards, and complex auth UIs are usually easier in Next.
2. **Server Components / app data patterns** — Next App Router (RSC, streaming, cache APIs, Server Actions) is a first-class app model. Astro has SSR and endpoints but not the same React-centric server-component ecosystem.
3. **Built-in backend surface** — Next has deeper built-ins (middleware/proxy conventions, revalidation APIs, draft mode, image pipeline, PPR, etc.). Astro covers SSR/SSG/endpoints well; more assembly via adapters/integrations.
4. **Ecosystem / hosting coupling** — Next + Vercel is tightly integrated. Astro is adapter-based; some Next-specific features do not map 1:1.
5. **Complex auth / SaaS apps** — Possible in Astro; Next + common auth libraries + Server Actions is the more common path for multi-tenant dashboards and billing-heavy UIs.
6. **React-as-default** — If the product needs the full React ecosystem as the default (not islands), Next fits better.

### When Astro is still the better choice

- Content / marketing / blogs / docs / SEO-heavy sites
- Mostly static with a few interactive widgets
- Minimal JS shipped by default

---

## Q3 — Can Astro be hosted on Vercel?

**Yes.**

- **Static sites:** Deploy with zero config; Vercel auto-detects Astro. No adapter required for pure SSG.
- **SSR / API routes / middleware / many platform features:** Use official `@astrojs/vercel` (`npx astro add vercel`). Set `output: "server"` (or keep static and `export const prerender = false` on live routes).
- Vercel handles builds, preview deployments, and custom domains like other frameworks.
- Also supported on Vercel with the adapter: ISR (`isr` adapter option), serverless Functions for on-demand routes, Edge-focused middleware (`middlewareMode: "edge"` / docs’ `edgeMiddleware`).

See the primary-sources dump for citations and the full feature matrix: `raw/research/astro-vs-next-vercel.md`.

---

## Project relevance (this monorepo)

- Sites are Astro-based; Vercel hosting is the intended platform.
- As of related wiki notes (2026-07-22): app may still be `output: "static"` with `@astrojs/vercel` / live CMS APIs pending — confirm against current code when ingesting or syncing.

---

## Open questions / follow-ups

- [ ] Ingest this inbox note into `wiki/sources/` (or fold takeaways into existing `wiki/sources/astro-vs-next-vercel.md`)
- [ ] Confirm whether production has adopted `@astrojs/vercel` yet
- [ ] If limitations framing should become a wiki `concepts/` page (framework fit), separate from the docs-only research summary
