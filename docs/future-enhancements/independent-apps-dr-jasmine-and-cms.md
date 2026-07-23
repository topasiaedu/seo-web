# Future: Independent apps for Dr Jasmine and CMS

**Status:** Deferred until the CAE preview (`apps/cae` + gateway `/cae`) is accepted by superior.

**Related:** CAE lives under `apps/cae`. The legacy `website/` shell has been removed — scaffold new brands directly under `apps/`.

## Goal

Mirror the CAE independent-app model for the remaining brands/platforms:

| App | Package | Astro `base` | Dev port (via gateway) |
|-----|---------|--------------|-------------------------|
| Dr Jasmine | `@seo/dr-jasmine` | `/dr-jasmine/` | 4323 |
| CMS | `@seo/cms` | `/cms/` | 4324 |

Gateway (already serving `/cae` → 4322) gains matching proxy routes. Browse `/dr-jasmine` and `/cms` on the same gateway host/port as CAE (default listen **4321**, or `PORT`).

## Why deferred

Product/leadership needs to accept the CAE website as a preview first. Do not scaffold these apps or spend design time on them until that gate passes.

## Prerequisites

- [x] Workspace uses `apps/*` + `packages/*` (legacy `website/` removed)
- [ ] CAE preview accepted (`apps/cae` native landing + gateway `/cae`)
- [ ] `apps/gateway` exists and is the path front door

## Workstream A — `apps/dr-jasmine`

1. Scaffold Astro app `@seo/dr-jasmine` with `base: "/dr-jasmine/"`, `server.port: 4323` (same pattern as `apps/cae`).
2. Minimal `src/pages/index.astro` placeholder until marketing build.
3. `apps/dr-jasmine/.env.example` (+ `.env.local` as needed). Per-app env only — no new root secrets.
4. Add gateway proxy: `/dr-jasmine` → `http://127.0.0.1:4323`.
5. Root `pnpm dev` starts this app alongside CAE + gateway.
6. Wiki: `sites/dr-jasmine.md`, overview, log.

**Out of scope for the first stub PR:** full marketing redesign.

## Workstream B — `apps/cms`

1. Scaffold Astro app `@seo/cms` with `base: "/cms/"`, `server.port: 4324`.
2. Minimal authoring stubs (index, login, posts) — rebuild as needed; do not resurrect a shared shell.
3. `apps/cms/.env.example` for Supabase/auth keys the CMS will use.
4. Gateway proxy: `/cms` → `http://127.0.0.1:4324`.
5. Wire root scripts; wiki: `sites/cms.md`, overview, log.

**Out of scope for the migrate PR:** Auth/CRUD, Media Library (see [cms-media-library.md](./cms-media-library.md)).

## Suggested multitask split (when unblocked)

| Agent | Owns |
|-------|------|
| DJ scaffold | `apps/dr-jasmine/**` |
| CMS scaffold | `apps/cms/**` |
| Gateway + root scripts | `apps/gateway` routes + root `package.json` only for new filters |
| Wiki merge | `seo-wiki-vault/**` after both apps build |

Do not start these agents until CAE preview acceptance is explicit.

## Acceptance (later)

- `pnpm --filter @seo/dr-jasmine build` and `pnpm --filter @seo/cms build` succeed.
- Gateway serves `/dr-jasmine` and `/cms`.
- Env files live under each app.
- Wiki matches the multi-app layout (no `website/` shell).
