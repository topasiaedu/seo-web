# Future: Independent apps for Dr Jasmine and CMS

**Status:** **Dr Jasmine Workstream A is superseded** by [dr-jasmine-landing-and-admin.md](../implementation-plan/dr-jasmine-landing-and-admin.md) (`apps/dr-jasmine` is live). **CMS Workstream B remains deferred.**

**Related:** CAE lives under `apps/cae`. The legacy `website/` shell has been removed — scaffold new brands directly under `apps/`.

## Goal

Mirror the CAE independent-app model for the remaining brands/platforms:

| App | Package | Astro `base` | Dev port (via gateway) | Status |
|-----|---------|--------------|-------------------------|--------|
| Dr Jasmine | `@seo/dr-jasmine` | `/dr-jasmine/` | 4323 | **Done** — see landing + Admin plan |
| CMS | `@seo/cms` | `/cms/` | 4324 | **Deferred** — not scaffolded |

Gateway already proxies `/cae` → 4322 and `/dr-jasmine` → 4323. `/cms` still returns **not migrated yet** until Workstream B starts.

## Why CMS is still deferred

Product/leadership needs a clear green light for a shared authoring platform. Do **not** scaffold `apps/cms` or spend design time on Media Library UI until that gate passes. Brand Admins (CAE, Dr Jasmine) are **not** the CMS.

## Prerequisites

- [x] Workspace uses `apps/*` + `packages/*` (legacy `website/` removed)
- [x] `apps/gateway` exists and is the path front door
- [x] Dr Jasmine independent app shipped (landing + Admin + blog)
- [ ] Explicit approval to start shared CMS (`apps/cms`)

## Workstream A — `apps/dr-jasmine` (superseded)

**Do not follow this stub checklist.** Implementation and acceptance live in [dr-jasmine-landing-and-admin.md](../implementation-plan/dr-jasmine-landing-and-admin.md) (T1–T12). Wiki: [sites/dr-jasmine.md](../../seo-wiki-vault/wiki/sites/dr-jasmine.md).

Historical stub intent (kept for context only):

1. Scaffold Astro app `@seo/dr-jasmine` with `base: "/dr-jasmine/"`, `server.port: 4323`.
2. Gateway proxy `/dr-jasmine` → `http://127.0.0.1:4323`.
3. Root `pnpm dev` starts DJ alongside CAE + gateway.

## Workstream B — `apps/cms` (still deferred)

1. Scaffold Astro app `@seo/cms` with `base: "/cms/"`, `server.port: 4324`.
2. Minimal authoring stubs (index, login, posts) — rebuild as needed; do not resurrect a shared shell.
3. `apps/cms/.env.example` for Supabase/auth keys the CMS will use.
4. Gateway: remove `/cms` from deferred prefixes; proxy → `http://127.0.0.1:4324`.
5. Wire root scripts; wiki: `sites/cms.md`, overview, log.

**Out of scope for the migrate PR:** Auth/CRUD, Media Library (see [cms-media-library.md](./cms-media-library.md)).

## Suggested multitask split (when CMS unblocked)

| Agent | Owns |
|-------|------|
| CMS scaffold | `apps/cms/**` |
| Gateway + root scripts | `apps/gateway` routes + root `package.json` filters for CMS |
| Wiki merge | `seo-wiki-vault/**` after CMS builds |

Do not start these agents until CMS approval is explicit.

## Acceptance (CMS later)

- `pnpm --filter @seo/cms build` succeeds.
- Gateway serves `/cms` (no longer “not migrated”).
- Env files live under `apps/cms`.
- Wiki matches the multi-app layout (no `website/` shell).
