# SEO Website — Context



Read this first, then open the wiki vault:



1. [seo-wiki-vault/AGENTS.md](seo-wiki-vault/AGENTS.md) — agent schema

2. [seo-wiki-vault/wiki/index.md](seo-wiki-vault/wiki/index.md) — page catalog

3. [seo-wiki-vault/wiki/overview.md](seo-wiki-vault/wiki/overview.md) — living synthesis



## Current focus



- **Primary site:** CAE (`apps/cae` / `@seo/cae`) — homepage (GHL lift + Insights Blog soft bento; home SSR) + `/media/`; Admin + public `/blog`; preview via gateway `/cae`

- **Path gateway:** `apps/gateway` (`@seo/gateway`) on port **4321**

- **Deferred:** independent `apps/dr-jasmine` + `apps/cms` — see [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md)



## Quick map



| Path | Role |

|------|------|

| [CONTEXT-MAP.md](CONTEXT-MAP.md) | Bounded contexts |

| [seo-wiki-vault/](seo-wiki-vault/) | LLM wiki vault (`raw/` + `wiki/` + `AGENTS.md`) |

| [apps/cae/](apps/cae/) | CAE Astro app (`base: /cae/`, port 4322) |

| [apps/gateway/](apps/gateway/) | Local path gateway (proxies `/cae` → 4322) |

| [packages/](packages/) | Shared `@seo/db`, `@seo/blog` |

| [supabase/](supabase/) | Migrations and seed |



## Preview (local)



```bash

pnpm install

pnpm dev

# gateway :4321 + CAE :4322 — open http://127.0.0.1:4321/cae

```



Or separately: `pnpm dev:gateway` and `pnpm dev:cae`.



Env for CAE: `apps/cae/.env.example` → `apps/cae/.env.local`.



## Deploy note (`vercel.json`)

Root `vercel.json` currently assumes a **static** `@seo/cae` → `apps/cae/dist` build. CAE Admin requires **server mode** (`@astrojs/node`); deploy config must move to a Node host (or a Vercel SSR adapter) before Admin works in production. Host-based multi-brand routing remains deferred.



## Agent rule



After any schema, routing, or package change, update the matching page under `seo-wiki-vault/wiki/` and append `seo-wiki-vault/wiki/log.md` in the same session (see vault `AGENTS.md`).

