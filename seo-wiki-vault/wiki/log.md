# Wiki log

Append-only timeline. Each entry starts with `## [YYYY-MM-DD] <verb> | <title>` for easy grepping.

## [2026-07-23] ingest | cae-ghl-section-lift-and-media-page

- Raw: `raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md`
- New sources: `wiki/sources/cae-ghl-section-lift-and-media-page.md`, `wiki/sources/cae-ghl-capture-media.md`
- Updated: `sites/cae` (home + `/cae/media/` GHL lift), `sources/cae-ghl-capture`, `cae-independent-app-and-native-landing` (visual approach superseded), `cms-media-library-and-cae-image-alt`, ADR 0003, monorepo (vault vs runtime CSS), architecture/overview, overview, index, CONTEXT-MAP

## [2026-07-23] sync | remove stale repo-root wiki/

- Deleted leftover `wiki/sites/cae.md` (outdated GHL-era notes)
- Canonical wiki remains `seo-wiki-vault/wiki/` only

## [2026-07-23] sync | remove legacy website/ shell

- Deleted `website/` (`@seo/website`) — cms/dr-jasmine stubs gone with the shared shell
- Workspace is `apps/*` + `packages/*` only
- Root scripts + `vercel.json` now build/preview `@seo/cae` → `apps/cae/dist`
- Updated README, CONTEXT*, deferred independent-apps doc, ADR 0003, monorepo, routing, sites/cms + dr-jasmine, site-pages (historical), glossary, overview, index

## [2026-07-23] lint | ingest gap + stale media source

- Ingested missing inbox: `raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md` → `wiki/sources/astro-vs-next-api-and-limits.md`
- Fixed stale Affects on `sources/cms-media-library-and-cae-image-alt.md` (apps/cae native landing)
- Index + overview Related raw sources updated; full report: `outputs/lint-2026-07-23.md`
- Broken wiki links: 0; no index orphans

## [2026-07-23] ingest | cae-independent-app-and-native-landing

- Raw: `raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md`
- New source: `wiki/sources/cae-independent-app-and-native-landing.md`
- Session capture for multi-app CAE + gateway + native landing; DJ/CMS deferred to docs/future-enhancements
- Index updated

## [2026-07-23] sync | CAE preview merge — multi-app + retire website/cae

- Root `pnpm dev` runs gateway + `@seo/cae` via `concurrently`
- Removed `website/cae/`; `@seo/website` registry is cms + dr-jasmine stubs only
- Env pointer: root `.env.example` → `apps/cae/.env.example`; secrets stay per-app
- `vercel.json` still builds `@seo/website` — documented CAE deploy gap
- ADR 0003 superseded wording → one Astro app per brand + path gateway (CAE migrated; cms/dr-jasmine deferred)
- Updated overview, monorepo, routing-vercel, sites/cae, index, architecture/overview, glossary, CONTEXT.md / README

## [2026-07-23] sync | CAE homepage as site-native components (no ghl-clone)

- Removed `website/cae/ghl-clone/` and `public/cae/ghl-*.css`
- Runtime now: `components/HomePage.astro`, `layouts/HomeLayout.astro`, `content/home/{markup.html,meta.ts}`, `scripts/testimonial-carousel.js`, `styles/home.css` + `home-host-patch.css`
- Updated sites/cae, sources/cae-ghl-capture, overview, monorepo, docs/future-enhancements/cms-media-library.md

## [2026-07-23] sync | archive unused CAE GHL capture folders

- Moved unused `website/cae/ghl-clone/*` siblings (captured HTML/CSS, custom-code, screenshots) → `raw/research/cae-ghl-capture/ghl-clone-archive/`
- Relocated intermediate `_ghl-extract/` out of the app tree → `raw/research/cae-ghl-capture/_ghl-extract/` (contents re-fetched from caegoh.com after relocate)
- Kept runtime: `ghl-clone/{page.html,meta.json,testimonial-carousel.js}` + `public/cae/ghl-*.css`
- Added `wiki/sources/cae-ghl-capture.md`; updated `sites/cae.md`, index, overview, monorepo

## [2026-07-23] ingest | cms-media-library-and-cae-image-alt

- Raw: `raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md`
- New source: `wiki/sources/cms-media-library-and-cae-image-alt.md`
- Updated: sites/cae (images + alt interim), sites/cms (deferred `/media`), architecture/supabase (deferred Storage), packages/blog (`MediaAsset` planned), overview Deferred, glossary, index
- Repo design already at `docs/future-enhancements/cms-media-library.md` (linked; not duplicated as authority)

## [2026-07-22] lint | vault health after sync

Findings fixed this session:

- Broken link `overview.md` → `sites/` (directory) → replaced with site page links
- Stale CAE “scaffold only” → landing shipped / blog scaffold
- Supabase “planned” → documented migration + RLS + seed
- Package pages overstated APIs → current exports only + planned
- ADR 0003 mount “at implement time” → implemented via site-pages
- Documented static / no `@astrojs/vercel` deploy gap on routing page
- Added concept page: site-pages-integration
- Dr Jasmine: already in registry; activation = `enabled: true`
- Seed vs config domain mismatch noted for CAE (`www.cae.localhost`)

Remaining open (tracked in overview Deferred): SSR adapter, real db/blog clients, CMS Auth/CRUD.

Index: no orphans; all catalogued pages exist. Raw research covered by `wiki/sources/`.

## [2026-07-22] sync | CAE landing + platform reality

- Synced wiki to monorepo: CAE homepage components/content, static Astro config, package placeholders, supabase migration
- Updated overview, index, sites/*, packages/*, architecture/*, ADR 0003, glossary, sources affect note
- New: `wiki/concepts/site-pages-integration.md`

## [2026-07-22] ingest | astro-vs-next-vercel (already present)

- Raw: `raw/research/astro-vs-next-vercel.md`
- Source summary refreshed Affects section for static/no-adapter gap

## [2026-07-22] lint | reorganize vault to Karpathy llm-wiki layout

- Moved topic pages under `wiki/`
- Added `AGENTS.md`, `raw/`, `scratch/`, `outputs/`
- Replaced flat `RAW.md` with `wiki/overview.md` + `wiki/log.md` + `wiki/index.md`
- Copied research into `raw/research/astro-vs-next-vercel.md`
- Removed duplicate repo-root `wiki/`; `CONTEXT.md` now points at `seo-wiki-vault/`

## [2026-07-22] sync | initial monorepo scaffold documented

- Scaffolded `website/{cae,cms,dr-jasmine}`, packages, supabase migrations
- Documented ADRs 0001–0003 and site/package pages

## [2026-07-22] sync | CAE homepage is 1:1 GHL capture

- Replaced redesigned Astro sections with captured GHL `#preview-container` markup + Playwright stylesheet dump
- Assets: `website/cae/ghl-clone/`, `website/public/cae/ghl-captured.css`
- Updated `wiki/sites/cae.md`
