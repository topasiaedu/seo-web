# Monorepo layout

```text
apps/cae/                          # @seo/cae — CAE brand (source of truth)
apps/gateway/                      # @seo/gateway — path front door (:4321)
packages/db                        # @seo/db
packages/blog                      # @seo/blog
packages/config-typescript         # shared tsconfig base
supabase/                          # migrations + seed
seo-wiki-vault/                    # LLM wiki vault (raw/ + wiki/)
docs/future-enhancements/          # deferred work (independent apps, media library, …)
```

pnpm workspaces: `apps/*` + `packages/*`.

## Brand ownership

| Brand / surface | Location | Status |
|-----------------|----------|--------|
| CAE | `apps/cae` | Live — marketing + `/cae/admin` + `/cae/blog`; gateway `/cae`; Vercel builds this app |
| Dr Jasmine | (not scaffolded) | Independent app **deferred** → `apps/dr-jasmine` |
| CMS | (not scaffolded) | Independent app **deferred** → `apps/cms` (≠ CAE Admin) |

Deferred split: [independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

The legacy `website/` package has been **removed**. Do not resurrect a shared Astro shell for brands.

CAE **vault archives** (immutable scrapes) live under `seo-wiki-vault/raw/research/cae-ghl-capture/` and `cae-ghl-capture-media/` — see [cae-ghl-capture](../sources/cae-ghl-capture.md) · [cae-ghl-capture-media](../sources/cae-ghl-capture-media.md). Do **not** Vite-import vault `_ghl-extract/` folders.

**Runtime** marketing CSS/HTML are **sanitized copies** under `apps/cae/src/styles/ghl/` and `apps/cae/src/components/ghl/` (GHL section lift). That is intentional app code — not the same as dumping raw `_ghl-extract/` into the app tree.
