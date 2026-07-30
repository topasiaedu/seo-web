# Overview — SEO Website

Living synthesis of the monorepo. Agents update this on ingest and code-sync.

Last updated: 2026-07-30 (ingest Vercel Output Directory off — dual-site deploy success)

## Current focus

- Primary site: **CAE** (`apps/cae` / `@seo/cae`) — **native ZWDS homepage** (Insights Blog soft bento after Press; home **SSR**); **native Media & Press**; **Admin Blog** at `/cae/admin` with **Published vs Scheduled** UI + lazy `published_at` gate; simplified PostForm; **Bulk import** (section 4 MYT cadence; no MD `publishAt`); **public blog SSR** at `/cae/blog` (Immersive Story + shared native chrome); nm-zwds tokens + public Light/Dark toggle; preview via **gateway** `/cae`
- Second brand: **Dr Jasmine** (`apps/dr-jasmine` / `@seo/dr-jasmine`) — **single-home** native site (`/` GHL LDP copy + Meet/FAQ + **Health Insights** latest-3 Post tiles; home **SSR**; **no** `/about` `/workshop` `/programs` `/faq` pages) + Admin (**Bulk import** section 4 MYT cadence) + **light** public `/blog`; gateway `/dr-jasmine` → `:4323`; GHL capture archive/reference only
- Path gateway: `apps/gateway` (`@seo/gateway`) on port **4321** (proxies `/cae` + `/dr-jasmine`; `/cms` still not migrated)
- **Git:** integration on **`main`** + pre-prod **`staging`** (both apps always present). Flow `feat/...` → `staging` → PR → `main`. Brand-only long-lived branches retired ([branch model source](sources/monorepo-main-staging-branch-model.md))
- Legacy `website/` shell: **removed** — future brands/CMS scaffold under `apps/` only
- Deploy: prefer Git branches **`main`** / **`staging`**; two Vercel projects (`seo-web-cae`, `seo-web-dr-jasmine`) with Root Directory `apps/cae` / `apps/dr-jasmine`. **Confirmed live (2026-07-30):** Output Directory **Off**; `@astrojs/vercel` → `.vercel/output`. **Base:** `VERCEL=1` → `base: "/"` (open host root); local gateway keeps `/cae/` and `/dr-jasmine/`. See [routing](architecture/routing-vercel.md) · [deploy success source](sources/vercel-output-directory-off-deploy-success.md)
- Framework: **Astro** · Package manager: **pnpm**
- Knowledge vault: `seo-wiki-vault/`

**Admin ≠ CMS:** Brand authoring is in-app Admin (`/cae/admin`, `/dr-jasmine/admin`). Shared CMS (`apps/cms`) remains deferred. Language: [`apps/cae/CONTEXT.md`](../../apps/cae/CONTEXT.md) · [`apps/dr-jasmine/CONTEXT.md`](../../apps/dr-jasmine/CONTEXT.md).

## Context map

| Context | Home | Notes |
|---------|------|--------|
| Gateway | `apps/gateway/` | Proxies `/cae` → 4322, `/dr-jasmine` → 4323; `/cms` “not migrated yet” |
| Site:CAE | `apps/cae/` | Native ZWDS marketing (home + media) + Insights Blog bento + Admin Blog + public `/blog`; vault GHL scrapes in `raw/research/cae-ghl-capture*` |
| Site:DrJasmine | `apps/dr-jasmine/` | Single-home marketing (GHL LDP copy + Health Insights teaser) + Admin Blog (Bulk import MYT schedule) + light public `/blog`; GHL capture archive in `raw/research/dr-jasmine-ghl-capture/` |
| Shared platform | `packages/`, `supabase/` | `@seo/db` clients + `@seo/blog` CRUD; authors/categories/posts + Storage `media` |
| CMS | (not scaffolded) | Deferred → `apps/cms` (not the same as brand Admin) |
| Wiki vault | `seo-wiki-vault/` | See `AGENTS.md` |

Sites share Supabase and `@seo/blog`. Sites must **not** import each other’s UI.

CMS (only) still deferred: [independent-apps-dr-jasmine-and-cms.md](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md) (DJ Workstream A superseded by landing + Admin plan).

## Architecture (short)

- **One Astro app per brand** + path gateway ([ADR 0003](decisions/0003-astro-single-app-per-site-folders.md))
- CAE marketing: **native** `components/home/*` + shared chrome; Insights soft bento after Press ([cae](sites/cae.md), [native redesign](sources/cae-native-zwds-public-redesign.md), [homepage blog bento](sources/cae-homepage-blog-bento.md))
- Dr Jasmine marketing: single home (GHL copy + Health Insights Post tiles); all CTAs → live `registerUrl`; light ivory blog ([dr-jasmine](sites/dr-jasmine.md), [home IA](sources/dr-jasmine-home-ia-and-polish.md), [homepage blog band](sources/dr-jasmine-homepage-blog-band.md), [blog readability](sources/dr-jasmine-admin-theme-and-blog-readability.md))
- Brand Admin + public blog (+ CAE/DJ home for recent Posts): server mode, Supabase Auth where needed, `@seo/blog` queries scoped by `site_id`; public posts are **live** only (`published_at <= now()`)
- Local front door is gateway ([routing](architecture/routing-vercel.md))
- Shared Supabase ([schema](architecture/supabase.md))

Details: [architecture/overview](architecture/overview.md) · [monorepo](architecture/monorepo.md) · [routing](architecture/routing-vercel.md) · [supabase](architecture/supabase.md)

## Monorepo tree

```text
seo-website/
├── CONTEXT.md
├── apps/
│   ├── cae/                 # @seo/cae (marketing + Admin + blog)
│   ├── dr-jasmine/          # @seo/dr-jasmine (Option A site + Admin + blog)
│   └── gateway/             # @seo/gateway
├── packages/db | blog | config-typescript
├── supabase/
├── seo-wiki-vault/
└── docs/
    ├── research/
    ├── cae-admin-blog-agent-tasks.md
    ├── implementation-plan/   # e.g. dr-jasmine-landing-and-admin, dr-jasmine-true-website
    └── future-enhancements/   # CMS deferred, Media Library, featured, …
```

### Per-brand app contract

Astro app under `apps/<slug>` with `base: "/<slug>/"`, own port, own `.env*`, registered in the gateway proxy map. CAE and DJ run `output: "server"`. CAE Media stays `prerender = true`; CAE **home is SSR** so the Insights Blog band can read published Posts; DJ **home is SSR** for the Health Insights teaser (latest 3 Posts).

Sites: [CAE](sites/cae.md) · [Dr Jasmine](sites/dr-jasmine.md) · [CMS](sites/cms.md)

## Seed UUIDs

| slug | projectId | In seed.sql |
|------|-----------|-------------|
| cae | `00000000-0000-4000-8000-000000000001` | yes (`cae.localhost` only; config also has `www.cae.localhost`); Author + 7 categories |
| dr-jasmine | `00000000-0000-4000-8000-000000000002` | yes (`dr-jasmine.localhost`); Author + 6 categories |
| cms | `00000000-0000-4000-8000-000000000099` | no (code identity only) |

## Accepted ADRs

- [0001](decisions/0001-one-vercel-project-host-routing.md) — one Vercel project, host routing (intent; deploy wiring incomplete)
- [0002](decisions/0002-supabase-multi-site-blog.md) — multi-site blog in Supabase
- [0003](decisions/0003-astro-single-app-per-site-folders.md) — **one Astro app per brand + path gateway**

## Commands

```bash
pnpm install
pnpm dev                 # gateway + CAE + DJ → http://127.0.0.1:4321/cae and /dr-jasmine
pnpm dev:cae             # CAE only (:4322)
pnpm dev:dr-jasmine      # DJ only (:4323)
pnpm dev:gateway         # gateway only
pnpm build               # @seo/cae → apps/cae/dist
pnpm build:dr-jasmine    # @seo/dr-jasmine → apps/dr-jasmine/dist
pnpm --filter @seo/cae build
pnpm --filter @seo/dr-jasmine build
```

Env: `apps/cae/.env.example` → `.env.local`; `apps/dr-jasmine/.env.example` → `.env.local` (root `.env.example` is a pointer only).

Useful paths: `/cae` · `/cae/media/` · `/cae/blog` · `/cae/admin` · `/dr-jasmine` · `/dr-jasmine/blog` · `/dr-jasmine/admin`.

Smoke: [CAE](sites/cae.md#smoke-checklist-admin--public-blog) · [Dr Jasmine](sites/dr-jasmine.md#smoke-checklist-option-a-true-website--t12).

## Deferred

- Set GitHub default branch to `main`, delete `origin/cae`, retarget hosts off retired brand tips ([branch model](sources/monorepo-main-staging-branch-model.md))
- Scaffold `apps/cms` + activate gateway `/cms` — [independent-apps doc](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md) (DJ superseded)
- Host-based multi-brand production routing / multi-app Vercel topology
- `@astrojs/vercel` adapter for production host middleware (CAE/DJ already use Node adapter locally/server)
- Separate Vercel project per site (optional alternative)
- Shared `@seo/ui`
- ISR, i18n, multi-role CMS auth
- **CMS Media Library UI** + `media` table (bucket/paths already live for Admin uploads; design: `docs/future-enhancements/cms-media-library.md`)
- **Featured Posts** pin / homepage surfacing (design: `docs/future-enhancements/featured-posts.md`) — CAE homepage shows newest 4 chronologically; DJ homepage shows newest 3 chronologically
- Decide fate of unwired CAE GHL lift under `components/ghl/*` after native cutover acceptance
- Wire or drop unused blog index `LeadPost`
- Formal Appendix B visual smoke (375/1280, light+dark) for native public surfaces
- DJ residual human QA: Auth/CRUD/publish smoke; `supabase db reset` when Docker available (see [dr-jasmine](sites/dr-jasmine.md)). Public responsive baseline **passed** 2026-07-28 — no code changes ([responsive audit](sources/dr-jasmine-responsive-audit.md))
- DJ brand tokens: Forest/Gold/Ivory live in public + Admin + light blog (see [home IA](sources/dr-jasmine-home-ia-and-polish.md), [blog readability](sources/dr-jasmine-admin-theme-and-blog-readability.md))

## Related raw sources

- [astro-vs-next-vercel](../raw/research/astro-vs-next-vercel.md) → [sources/astro-vs-next-vercel.md](sources/astro-vs-next-vercel.md)
- [astro-vs-next-api-and-limits](../raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md) → [sources/astro-vs-next-api-and-limits.md](sources/astro-vs-next-api-and-limits.md)
- [cae-ghl-capture](../raw/research/cae-ghl-capture/) → [sources/cae-ghl-capture.md](sources/cae-ghl-capture.md)
- [cae-ghl-capture-media](../raw/research/cae-ghl-capture-media/) → [sources/cae-ghl-capture-media.md](sources/cae-ghl-capture-media.md)
- [dr-jasmine-ghl-capture](../raw/research/dr-jasmine-ghl-capture/) → [sources/dr-jasmine-ghl-capture.md](sources/dr-jasmine-ghl-capture.md)
- [dr-jasmine-option-a-true-website](../raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md) → [sources/dr-jasmine-option-a-true-website.md](sources/dr-jasmine-option-a-true-website.md)
- [dr-jasmine-home-ia-and-polish](../raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md) → [sources/dr-jasmine-home-ia-and-polish.md](sources/dr-jasmine-home-ia-and-polish.md)
- [dr-jasmine-admin-theme-and-blog-readability](../raw/inbox/2026-07-28-dr-jasmine-admin-theme-and-blog-readability.md) → [sources/dr-jasmine-admin-theme-and-blog-readability.md](sources/dr-jasmine-admin-theme-and-blog-readability.md)
- [dr-jasmine-responsive-audit](../raw/inbox/2026-07-28-dr-jasmine-responsive-audit.md) → [sources/dr-jasmine-responsive-audit.md](sources/dr-jasmine-responsive-audit.md)
- [dr-jasmine-homepage-blog-band](../raw/inbox/2026-07-28-dr-jasmine-homepage-blog-band.md) → [sources/dr-jasmine-homepage-blog-band.md](sources/dr-jasmine-homepage-blog-band.md)
- [cae-ghl-1to1-native-parity](../raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md) → [sources/cae-ghl-1to1-native-parity.md](sources/cae-ghl-1to1-native-parity.md) (superseded)
- [cae-ghl-section-lift-and-media-page](../raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md) → [sources/cae-ghl-section-lift-and-media-page.md](sources/cae-ghl-section-lift-and-media-page.md) (live chrome superseded by native redesign)
- [cae-seo-improvements](../raw/inbox/2026-07-23-cae-seo-improvements.md) → [sources/cae-seo-improvements.md](sources/cae-seo-improvements.md)
- [cae-independent-app-and-native-landing](../raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md) → [sources/cae-independent-app-and-native-landing.md](sources/cae-independent-app-and-native-landing.md)
- [cms-media-library-and-cae-image-alt](../raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md) → [sources/cms-media-library-and-cae-image-alt.md](sources/cms-media-library-and-cae-image-alt.md)
- [cae-homepage-blog-bento](../raw/inbox/2026-07-27-cae-homepage-blog-bento.md) → [sources/cae-homepage-blog-bento.md](sources/cae-homepage-blog-bento.md)
- [cae-blog-scheduled-publishing](../raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md) → [sources/cae-blog-scheduled-publishing.md](sources/cae-blog-scheduled-publishing.md)
- [cae-admin-postform-simplifications](../raw/inbox/2026-07-27-cae-admin-postform-simplifications.md) → [sources/cae-admin-postform-simplifications.md](sources/cae-admin-postform-simplifications.md)
- [cae-admin-bulk-import](../raw/inbox/2026-07-27-cae-admin-bulk-import.md) → [sources/cae-admin-bulk-import.md](sources/cae-admin-bulk-import.md)
- [cae-bulk-import-schedule-ui](../raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md) → [sources/cae-bulk-import-schedule-ui.md](sources/cae-bulk-import-schedule-ui.md)
- [dr-jasmine-bulk-import-schedule-ui](../raw/inbox/2026-07-30-dr-jasmine-bulk-import-schedule-ui.md) → [sources/dr-jasmine-bulk-import-schedule-ui.md](sources/dr-jasmine-bulk-import-schedule-ui.md)
- [cae-blog-immersive-story-redesign](../raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md) → [sources/cae-blog-immersive-story-redesign.md](sources/cae-blog-immersive-story-redesign.md)
- [cae-nm-zwds-brand-theme-and-public-theme-toggle](../raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md) → [sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md](sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md)
- [cae-native-zwds-public-redesign](../raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md) → [sources/cae-native-zwds-public-redesign.md](sources/cae-native-zwds-public-redesign.md)
- [monorepo-main-staging-branch-model](../raw/inbox/2026-07-29-monorepo-main-staging-branch-model.md) → [sources/monorepo-main-staging-branch-model.md](sources/monorepo-main-staging-branch-model.md)
