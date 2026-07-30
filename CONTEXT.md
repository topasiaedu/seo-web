# SEO Website — Context



Read this first, then open the wiki vault:



1. [seo-wiki-vault/AGENTS.md](seo-wiki-vault/AGENTS.md) — agent schema

2. [seo-wiki-vault/wiki/index.md](seo-wiki-vault/wiki/index.md) — page catalog

3. [seo-wiki-vault/wiki/overview.md](seo-wiki-vault/wiki/overview.md) — living synthesis



## Current focus



- **Primary site:** CAE (`apps/cae` / `@seo/cae`) — native ZWDS homepage (Insights Blog soft bento; home SSR) + native `/media/`; Admin + public `/blog`; preview via gateway `/cae`

- **Second brand:** Dr Jasmine (`apps/dr-jasmine` / `@seo/dr-jasmine`) — Option A Clinical Trust native site (`/`, `/blog`; Meet + FAQ on home) + Admin; gateway `/dr-jasmine`

- **Path gateway:** `apps/gateway` (`@seo/gateway`) on port **4321** (proxies `/cae` + `/dr-jasmine`)

- **Deferred:** shared CMS only (`apps/cms`) — see [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md) (DJ Workstream A superseded by [dr-jasmine-landing-and-admin.md](docs/implementation-plan/dr-jasmine-landing-and-admin.md) + [dr-jasmine-true-website.md](docs/implementation-plan/dr-jasmine-true-website.md))

- **Git:** `main` (prod) + `staging` (check); work on `feat/...` then merge → staging → PR → main. Both apps always on the tree — see [branch model](seo-wiki-vault/wiki/sources/monorepo-main-staging-branch-model.md)



## Quick map



| Path | Role |

|------|------|

| [CONTEXT-MAP.md](CONTEXT-MAP.md) | Bounded contexts |

| [seo-wiki-vault/](seo-wiki-vault/) | LLM wiki vault (`raw/` + `wiki/` + `AGENTS.md`) |

| [apps/cae/](apps/cae/) | CAE Astro app (`base: /cae/`, port 4322) |

| [apps/dr-jasmine/](apps/dr-jasmine/) | Dr Jasmine Astro app (`base: /dr-jasmine/`, port 4323) |

| [apps/gateway/](apps/gateway/) | Local path gateway (proxies `/cae` → 4322, `/dr-jasmine` → 4323) |

| [packages/](packages/) | Shared `@seo/db`, `@seo/blog` |

| [supabase/](supabase/) | Migrations and seed |



## Preview (local)



```bash

pnpm install

pnpm dev

# gateway :4321 + CAE :4322 + DJ :4323 — open http://127.0.0.1:4321/cae and /dr-jasmine

```



Or separately: `pnpm dev:gateway`, `pnpm dev:cae`, `pnpm dev:dr-jasmine`.



Env: `apps/cae/.env.example` → `.env.local`; `apps/dr-jasmine/.env.example` → `.env.local`.



## Deploy note (`vercel.json`)

Two Vercel projects share this monorepo:

| Project | Root Directory | Build |
|---------|----------------|-------|
| `seo-web-cae` | `apps/cae` | `pnpm --filter @seo/cae build` |
| `seo-web-dr-jasmine` | `apps/dr-jasmine` | `pnpm --filter @seo/dr-jasmine build` |

Both apps use `output: "server"`. On Vercel (`VERCEL=1`) the adapter is `@astrojs/vercel` (writes `.vercel/output`). Locally / on Node hosts the adapter is `@astrojs/node` standalone (`pnpm start`). Per-app `apps/*/vercel.json` sets install/build; **do not** set an Output Directory override in the Vercel dashboard. Public URLs remain under Astro `base` (`/cae/`, `/dr-jasmine/`) until host-based routing ships.



## Agent rule



After any schema, routing, or package change, update the matching page under `seo-wiki-vault/wiki/` and append `seo-wiki-vault/wiki/log.md` in the same session (see vault `AGENTS.md`).
