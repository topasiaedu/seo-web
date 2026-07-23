# Overview — SEO Website

Living synthesis of the monorepo. Agents update this on ingest and code-sync.

Last updated: 2026-07-23

## Current focus

- Primary site: **CAE** (`apps/cae` / `@seo/cae`) — **homepage + Media & Press** shipped as **GHL section lift**; **blog still scaffold**; preview via **gateway** `/cae`
- Path gateway: `apps/gateway` (`@seo/gateway`) on port **4321**
- Legacy `website/` shell: **removed** — future brands/CMS scaffold under `apps/` only
- Deploy: root `vercel.json` builds **`@seo/cae`** → `apps/cae/dist` (`base: "/cae/"`)
- Framework: **Astro** · Package manager: **pnpm**
- Knowledge vault: `seo-wiki-vault/`

## Context map

| Context | Home | Notes |
|---------|------|--------|
| Gateway | `apps/gateway/` | Proxies `/cae` → 4322; other brands “not migrated yet” |
| Site:CAE | `apps/cae/` | `HomePage` + `components/ghl/*` (+ `/media/`); vault scrapes in `raw/research/cae-ghl-capture*` |
| Shared platform | `packages/`, `supabase/` | Shared modules + migrations |
| Site:DrJasmine | (not scaffolded) | Deferred → `apps/dr-jasmine` |
| CMS | (not scaffolded) | Deferred → `apps/cms` |
| Wiki vault | `seo-wiki-vault/` | See `AGENTS.md` |

Sites share Supabase and `@seo/blog`. Sites must **not** import each other’s UI.

Deferred independent apps: [independent-apps-dr-jasmine-and-cms.md](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

## Architecture (short)

- **One Astro app per brand** + path gateway ([ADR 0003](decisions/0003-astro-single-app-per-site-folders.md))
- CAE marketing: sanitized GHL section lift in-app; vault `_ghl-extract` is archive only ([cae](sites/cae.md))
- CAE served from `apps/cae`; local front door is gateway ([routing](architecture/routing-vercel.md))
- Shared Supabase ([schema](architecture/supabase.md))

Details: [architecture/overview](architecture/overview.md) · [monorepo](architecture/monorepo.md) · [routing](architecture/routing-vercel.md) · [supabase](architecture/supabase.md)

## Monorepo tree

```text
seo-website/
├── CONTEXT.md
├── apps/
│   ├── cae/                 # @seo/cae
│   └── gateway/             # @seo/gateway
├── packages/db | blog | config-typescript
├── supabase/
├── seo-wiki-vault/
└── docs/
    ├── research/
    └── future-enhancements/   # independent apps, CMS Media Library, …
```

### Per-brand app contract

Astro app under `apps/<slug>` with `base: "/<slug>/"`, own port, own `.env*`, registered in the gateway proxy map.

Sites: [CAE](sites/cae.md) · [CMS](sites/cms.md) · [Dr Jasmine](sites/dr-jasmine.md)

## Seed UUIDs

| slug | projectId | In seed.sql |
|------|-----------|-------------|
| cae | `00000000-0000-4000-8000-000000000001` | yes (`cae.localhost` only; config also has `www.cae.localhost`) |
| dr-jasmine | `00000000-0000-4000-8000-000000000002` | yes |
| cms | `00000000-0000-4000-8000-000000000099` | no (code identity only) |

## Accepted ADRs

- [0001](decisions/0001-one-vercel-project-host-routing.md) — one Vercel project, host routing (intent; deploy wiring incomplete)
- [0002](decisions/0002-supabase-multi-site-blog.md) — multi-site blog in Supabase
- [0003](decisions/0003-astro-single-app-per-site-folders.md) — **one Astro app per brand + path gateway**

## Commands

```bash
pnpm install
pnpm dev                 # gateway + CAE → http://127.0.0.1:4321/cae
pnpm dev:cae             # CAE only (:4322)
pnpm dev:gateway         # gateway only
pnpm build               # @seo/cae → apps/cae/dist
pnpm --filter @seo/cae build
```

Env: `apps/cae/.env.example` → `apps/cae/.env.local` (root `.env.example` is a pointer only).

Useful paths: `/cae` · `/cae/media/` (gateway and Vercel output with Astro `base: "/cae/"`).

## Deferred

- Scaffold `apps/dr-jasmine` + `apps/cms` + gateway routes — [independent-apps doc](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md)
- Host-based multi-brand production routing / multi-app Vercel topology
- `@astrojs/vercel` adapter + SSR for production host middleware / CMS
- Separate Vercel project per site (optional alternative)
- Shared `@seo/ui`
- ISR, i18n, multi-role CMS auth
- **CMS Media Library** + Supabase Storage `media` bucket / `media` table (design: `docs/future-enhancements/cms-media-library.md`)
- Real `@seo/db` clients and `@seo/blog` queries (incl. `MediaAsset` when Media Library ships)
- Delete parked CAE native BEM (`components/home/*`) after superior accepts GHL lift

## Related raw sources

- [astro-vs-next-vercel](../raw/research/astro-vs-next-vercel.md) → [sources/astro-vs-next-vercel.md](sources/astro-vs-next-vercel.md)
- [astro-vs-next-api-and-limits](../raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md) → [sources/astro-vs-next-api-and-limits.md](sources/astro-vs-next-api-and-limits.md)
- [cae-ghl-capture](../raw/research/cae-ghl-capture/) → [sources/cae-ghl-capture.md](sources/cae-ghl-capture.md)
- [cae-ghl-capture-media](../raw/research/cae-ghl-capture-media/) → [sources/cae-ghl-capture-media.md](sources/cae-ghl-capture-media.md)
- [cae-ghl-section-lift-and-media-page](../raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md) → [sources/cae-ghl-section-lift-and-media-page.md](sources/cae-ghl-section-lift-and-media-page.md)
- [cae-independent-app-and-native-landing](../raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md) → [sources/cae-independent-app-and-native-landing.md](sources/cae-independent-app-and-native-landing.md)
- [cms-media-library-and-cae-image-alt](../raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md) → [sources/cms-media-library-and-cae-image-alt.md](sources/cms-media-library-and-cae-image-alt.md)
