# Source: Astro vs Next on Vercel

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/research/astro-vs-next-vercel.md](../../raw/research/astro-vs-next-vercel.md) |
| Also in repo | `docs/research/astro-vs-next-vercel.md` |
| Ingested | 2026-07-22 |

## Takeaways

- Vercel hosts Astro (static zero-config; SSR/ISR/Functions via `@astrojs/vercel`).
- Astro endpoints ≈ Next App Router Route Handlers (named methods + Web `Response`), not Pages `req`/`res`.
- Conceptually similar APIs; not drop-in identical (file layout, prerender rules, helpers).
- Astro SEO strength: zero JS by default / islands; Next documents Metadata API heavily.

## Affects

- Choice of Astro for all sites in this monorepo
- **Not applied yet:** `@astrojs/vercel` / SSR — `@seo/cae` remains `output: "static"`; production host middleware and live CMS APIs still pending adapter work
- Endpoints pattern still relevant when server mode is enabled
- Companion session notes: [astro-vs-next-api-and-limits.md](astro-vs-next-api-and-limits.md)
