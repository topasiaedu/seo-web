# Monorepo layout

```text
apps/cae/                          # @seo/cae — CAE brand (source of truth)
apps/dr-jasmine/                   # @seo/dr-jasmine — Dr Jasmine brand
apps/gateway/                      # @seo/gateway — path front door (:4321)
packages/db                        # @seo/db
packages/blog                      # @seo/blog
packages/config-typescript         # shared tsconfig base
supabase/                          # migrations + seed
seo-wiki-vault/                    # LLM wiki vault (raw/ + wiki/)
docs/future-enhancements/          # deferred work (CMS, media library, …)
docs/implementation-plan/          # active/completed feature plans
```

pnpm workspaces: `apps/*` + `packages/*`.

## Git branches (integration model)

Both brand apps always live on the same tree. Do **not** use long-lived brand-only content branches that omit the other app.

| Branch | Role |
|--------|------|
| `main` | Production integration — `apps/cae` + `apps/dr-jasmine` always present |
| `staging` | Pre-prod check — same full monorepo as `main` |
| `feat/...` | Day-to-day work; branch from `main` (or `staging`); merge → `staging` → PR → `main` |

“Push only CAE” = commit changes under `apps/cae` (and shared packages if needed) on a **full-monorepo** branch — never delete `apps/dr-jasmine` from the tree. Same for DJ-only work under `apps/dr-jasmine`.

Source: [monorepo-main-staging-branch-model](../sources/monorepo-main-staging-branch-model.md). Retired tips `origin/cae` / `origin/dr-jasmine` are historical; delete remote `cae` after GitHub default branch is `main`.

## Brand ownership

| Brand / surface | Location | Status |
|-----------------|----------|--------|
| CAE | `apps/cae` | Live — marketing + `/cae/admin` + `/cae/blog`; gateway `/cae`; Vercel builds this app |
| Dr Jasmine | `apps/dr-jasmine` | Live — Option A native site + `/dr-jasmine/admin` + `/dr-jasmine/blog`; gateway `/dr-jasmine` |
| CMS | (not scaffolded) | Independent app **deferred** → `apps/cms` (≠ brand Admin) |

CMS deferred: [independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md) (DJ Workstream A superseded by [landing + Admin plan](../../../docs/implementation-plan/dr-jasmine-landing-and-admin.md)).

The legacy `website/` package has been **removed**. Do not resurrect a shared Astro shell for brands.

CAE **vault archives** (immutable scrapes) live under `seo-wiki-vault/raw/research/cae-ghl-capture/` and `cae-ghl-capture-media/` — see [cae-ghl-capture](../sources/cae-ghl-capture.md) · [cae-ghl-capture-media](../sources/cae-ghl-capture-media.md). Do **not** Vite-import vault `_ghl-extract/` folders.

Dr Jasmine **vault archive**: `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/` — see [dr-jasmine-ghl-capture](../sources/dr-jasmine-ghl-capture.md).

**Runtime:** CAE public chrome is the **native ZWDS** stack (`components/home/*` + SiteHeader/SiteFooter); `components/ghl/` is unwired archive. Dr Jasmine public routes are **native Option A** pages; `apps/dr-jasmine/src/components/ghl/` is deprecated archive/reference only (assets under `src/assets/ghl/` remain in use). Vault `_ghl-extract/` folders must never be Vite-imported.
