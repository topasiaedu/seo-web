# Overview — SEO Website

Living synthesis of the monorepo. Agents update this on ingest and code-sync.

Last updated: 2026-07-27

## Current focus

- Primary site: **CAE** (`apps/cae` / `@seo/cae`) — **homepage** (GHL lift + Insights Blog soft bento after Press; home **SSR**); **Media & Press**; **Admin Blog** at `/cae/admin` with **Published vs Scheduled** UI + lazy `published_at` gate; simplified PostForm; **Bulk import** (`/cae/admin/posts/import`) for multi-post Markdown; **public blog SSR** at `/cae/blog`; preview via **gateway** `/cae`
- Path gateway: `apps/gateway` (`@seo/gateway`) on port **4321**
- Legacy `website/` shell: **removed** — future brands/CMS scaffold under `apps/` only
- Deploy: root `vercel.json` builds **`@seo/cae`** → `apps/cae/dist` (`base: "/cae/"`; server output + Node adapter)
- Framework: **Astro** · Package manager: **pnpm**
- Knowledge vault: `seo-wiki-vault/`

**Admin ≠ CMS:** CAE authoring is in-app Admin (`/cae/admin`). Shared CMS (`apps/cms`) remains deferred. Language: [`apps/cae/CONTEXT.md`](../../apps/cae/CONTEXT.md).

## Context map

| Context | Home | Notes |
|---------|------|--------|
| Gateway | `apps/gateway/` | Proxies `/cae` → 4322; other brands “not migrated yet” |
| Site:CAE | `apps/cae/` | Marketing GHL lift + homepage Insights Blog bento + Admin Blog + public `/blog`; vault scrapes in `raw/research/cae-ghl-capture*` |
| Shared platform | `packages/`, `supabase/` | `@seo/db` clients + `@seo/blog` CRUD; authors/categories/posts + Storage `media` |
| Site:DrJasmine | (not scaffolded) | Deferred → `apps/dr-jasmine` |
| CMS | (not scaffolded) | Deferred → `apps/cms` (not the same as CAE Admin) |
| Wiki vault | `seo-wiki-vault/` | See `AGENTS.md` |

Sites share Supabase and `@seo/blog`. Sites must **not** import each other’s UI.

Deferred independent apps: [independent-apps-dr-jasmine-and-cms.md](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

## Architecture (short)

- **One Astro app per brand** + path gateway ([ADR 0003](decisions/0003-astro-single-app-per-site-folders.md))
- CAE marketing: sanitized GHL section lift in-app; homepage Insights soft bento replaces Offerings ([cae](sites/cae.md), [homepage blog bento](sources/cae-homepage-blog-bento.md))
- CAE Admin + public blog + **home** (for recent Posts): server mode, Supabase Auth session where needed, `@seo/blog` queries; public posts are **live** only (`published_at <= now()`)
- CAE served from `apps/cae`; local front door is gateway ([routing](architecture/routing-vercel.md))
- Shared Supabase ([schema](architecture/supabase.md))

Details: [architecture/overview](architecture/overview.md) · [monorepo](architecture/monorepo.md) · [routing](architecture/routing-vercel.md) · [supabase](architecture/supabase.md)

## Monorepo tree

```text
seo-website/
├── CONTEXT.md
├── apps/
│   ├── cae/                 # @seo/cae (marketing + Admin + blog)
│   └── gateway/             # @seo/gateway
├── packages/db | blog | config-typescript
├── supabase/
├── seo-wiki-vault/
└── docs/
    ├── research/
    ├── cae-admin-blog-agent-tasks.md
    └── future-enhancements/   # independent apps, Media Library, scheduled/featured, …
```

### Per-brand app contract

Astro app under `apps/<slug>` with `base: "/<slug>/"`, own port, own `.env*`, registered in the gateway proxy map. CAE runs `output: "server"`; Media stays `prerender = true`; **home is SSR** so the Insights Blog band can read published Posts.

Sites: [CAE](sites/cae.md) · [CMS](sites/cms.md) · [Dr Jasmine](sites/dr-jasmine.md)

## Seed UUIDs

| slug | projectId | In seed.sql |
|------|-----------|-------------|
| cae | `00000000-0000-4000-8000-000000000001` | yes (`cae.localhost` only; config also has `www.cae.localhost`); Author + 7 categories |
| dr-jasmine | `00000000-0000-4000-8000-000000000002` | yes (site row only) |
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

Useful paths: `/cae` · `/cae/media/` · `/cae/blog` · `/cae/admin` (gateway and Vercel output with Astro `base: "/cae/"`).

Smoke: [CAE smoke checklist](sites/cae.md#smoke-checklist-admin--public-blog).

## Deferred

- Scaffold `apps/dr-jasmine` + `apps/cms` + gateway routes — [independent-apps doc](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md)
- Host-based multi-brand production routing / multi-app Vercel topology
- `@astrojs/vercel` adapter for production host middleware (CAE already uses Node adapter locally/server)
- Separate Vercel project per site (optional alternative)
- Shared `@seo/ui`
- ISR, i18n, multi-role CMS auth
- **CMS Media Library UI** + `media` table (bucket/paths already live for Admin uploads; design: `docs/future-enhancements/cms-media-library.md`)
- **Featured Posts** pin / homepage surfacing (design: `docs/future-enhancements/featured-posts.md`) — homepage currently shows newest 4 chronologically only
- Delete parked CAE native BEM under `components/home/*` after superior accepts GHL lift (**except** wired `HomeInsights`)
- Decide fate of unwired Offerings GHL fragments

## Related raw sources

- [astro-vs-next-vercel](../raw/research/astro-vs-next-vercel.md) → [sources/astro-vs-next-vercel.md](sources/astro-vs-next-vercel.md)
- [astro-vs-next-api-and-limits](../raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md) → [sources/astro-vs-next-api-and-limits.md](sources/astro-vs-next-api-and-limits.md)
- [cae-ghl-capture](../raw/research/cae-ghl-capture/) → [sources/cae-ghl-capture.md](sources/cae-ghl-capture.md)
- [cae-ghl-capture-media](../raw/research/cae-ghl-capture-media/) → [sources/cae-ghl-capture-media.md](sources/cae-ghl-capture-media.md)
- [cae-ghl-1to1-native-parity](../raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md) → [sources/cae-ghl-1to1-native-parity.md](sources/cae-ghl-1to1-native-parity.md) (superseded)
- [cae-ghl-section-lift-and-media-page](../raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md) → [sources/cae-ghl-section-lift-and-media-page.md](sources/cae-ghl-section-lift-and-media-page.md)
- [cae-seo-improvements](../raw/inbox/2026-07-23-cae-seo-improvements.md) → [sources/cae-seo-improvements.md](sources/cae-seo-improvements.md)
- [cae-independent-app-and-native-landing](../raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md) → [sources/cae-independent-app-and-native-landing.md](sources/cae-independent-app-and-native-landing.md)
- [cms-media-library-and-cae-image-alt](../raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md) → [sources/cms-media-library-and-cae-image-alt.md](sources/cms-media-library-and-cae-image-alt.md)
- [cae-homepage-blog-bento](../raw/inbox/2026-07-27-cae-homepage-blog-bento.md) → [sources/cae-homepage-blog-bento.md](sources/cae-homepage-blog-bento.md)
- [cae-blog-scheduled-publishing](../raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md) → [sources/cae-blog-scheduled-publishing.md](sources/cae-blog-scheduled-publishing.md)
