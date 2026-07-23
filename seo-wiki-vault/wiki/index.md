# Wiki index

Catalog of compiled pages. Agents update this on every ingest or sync.

Read this first when answering queries, then open linked pages.

## Navigation

- [Overview](overview.md) — living synthesis of the whole project
- [Glossary](glossary.md) — ubiquitous language
- [Log](log.md) — chronological vault activity

## Architecture

- [Overview](architecture/overview.md) — system design short form
- [Monorepo](architecture/monorepo.md) — `apps/*` + `packages/*`
- [Routing / Vercel](architecture/routing-vercel.md) — gateway preview + `@seo/cae` deploy
- [Supabase](architecture/supabase.md) — migrated schema and RLS; Storage/`media` deferred

## Sites

- [CAE](sites/cae.md) — `apps/cae` GHL section lift (home + `/media/`); blog scaffold
- [CMS](sites/cms.md) — deferred; planned `apps/cms`
- [Dr Jasmine](sites/dr-jasmine.md) — deferred; planned `apps/dr-jasmine`

## Packages

- [@seo/db](packages/db.md) — env helper + placeholders
- [@seo/blog](packages/blog.md) — types + placeholders

## Decisions (ADRs)

- [0001 One Vercel project / host routing](decisions/0001-one-vercel-project-host-routing.md)
- [0002 Supabase multi-site blog](decisions/0002-supabase-multi-site-blog.md)
- [0003 One Astro app per brand + path gateway](decisions/0003-astro-single-app-per-site-folders.md)

## Concepts

- [Site pages integration](concepts/site-pages-integration.md) — historical; removed with `website/`

## Sources (from raw/)

- [Astro vs Next on Vercel](sources/astro-vs-next-vercel.md) — from `raw/research/`
- [Astro vs Next APIs / limits / Vercel](sources/astro-vs-next-api-and-limits.md) — from `raw/inbox/` (session notes)
- [CAE GHL capture archive](sources/cae-ghl-capture.md) — homepage scrape; runtime is in-app lift
- [CAE Media & Press GHL capture](sources/cae-ghl-capture-media.md) — `/media` scrape archive
- [CAE GHL section lift + Media page](sources/cae-ghl-section-lift-and-media-page.md) — from `raw/inbox/` (2026-07-23)
- [CAE independent app + native landing](sources/cae-independent-app-and-native-landing.md) — multi-app/gateway; homepage approach superseded by lift
- [CMS Media Library + CAE image alt](sources/cms-media-library-and-cae-image-alt.md) — from `raw/inbox/` (runtime paths updated)
