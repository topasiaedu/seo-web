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
- [Routing / Vercel](architecture/routing-vercel.md) — gateway preview (`/cae`, `/dr-jasmine`; `/cms` deferred) + `@seo/cae` deploy
- [Supabase](architecture/supabase.md) — sites/posts + authors/categories/editorial columns; Storage bucket `media`; anon posts RLS time-gate on `published_at`

## Sites

- [CAE](sites/cae.md) — `apps/cae` GHL lift (home + `/media/`) + homepage Insights Blog bento + Admin (`/cae/admin`, Published/Scheduled intent, simplified PostForm, Bulk import) + public `/cae/blog` (slug Immersive Story)
- [Dr Jasmine](sites/dr-jasmine.md) — `apps/dr-jasmine` single-home (GHL LDP copy) + light `/blog` + Admin (`/dr-jasmine/admin`); CMS still deferred
- [CMS](sites/cms.md) — deferred shared platform; **not** brand Admin

## Packages

- [@seo/db](packages/db.md) — env helper + browser/server Supabase clients
- [@seo/blog](packages/blog.md) — types + public/Admin CRUD; live helpers (`isPostLive` / `isPostScheduled`)

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
- [CAE GHL 1:1 native parity](sources/cae-ghl-1to1-native-parity.md) — superseded; do not re-apply “no capture CSS” to funnels
- [CAE GHL section lift + Media page](sources/cae-ghl-section-lift-and-media-page.md) — from `raw/inbox/` (2026-07-23)
- [CAE website SEO improvements](sources/cae-seo-improvements.md) — from `raw/inbox/` (2026-07-23); UI-safe head/sitemap/remapper pass
- [CAE independent app + native landing](sources/cae-independent-app-and-native-landing.md) — multi-app/gateway; homepage approach superseded by lift
- [CMS Media Library + CAE image alt](sources/cms-media-library-and-cae-image-alt.md) — from `raw/inbox/` (runtime paths updated; interim alts via SEO remapper)
- [CAE homepage Blog band (soft bento)](sources/cae-homepage-blog-bento.md) — from `raw/inbox/` (2026-07-27); Offerings → Insights bento
- [CAE blog scheduled publishing](sources/cae-blog-scheduled-publishing.md) — from `raw/inbox/` (2026-07-27); lazy `published_at` gate + Admin Scheduled label
- [CAE Admin PostForm simplifications](sources/cae-admin-postform-simplifications.md) — from `raw/inbox/` (2026-07-27); previews, Summary, tags typeahead, auto related, Published vs Scheduled select
- [CAE Admin bulk Post import](sources/cae-admin-bulk-import.md) — from `raw/inbox/` (2026-07-27); multi-post Markdown + per-post heroes + schedule-aware frontmatter
- [CAE blog Immersive Story redesign](sources/cae-blog-immersive-story-redesign.md) — from `raw/inbox/` (2026-07-27); dark feature slug UI (replaces light paper)
- [Dr Jasmine GHL capture (register/join)](sources/dr-jasmine-ghl-capture.md) — from `raw/research/dr-jasmine-ghl-capture/`; runtime lift in `apps/dr-jasmine`
- [Dr Jasmine Option A true website + brand tokens](sources/dr-jasmine-option-a-true-website.md) — from `raw/inbox/` (2026-07-27); Clinical Trust palette sheet (multi-page IA later collapsed)
- [Dr Jasmine home IA collapse + polish](sources/dr-jasmine-home-ia-and-polish.md) — from `raw/inbox/` (2026-07-28); single home; removed about/workshop/programs/faq pages
- [Dr Jasmine Admin theme + light blog readability](sources/dr-jasmine-admin-theme-and-blog-readability.md) — from `raw/inbox/` (2026-07-28); forest Admin; light blog; promise-first slug
- [Dr Jasmine responsive audit — no code changes](sources/dr-jasmine-responsive-audit.md) — from `raw/inbox/` (2026-07-28); public mobile-friendly pass; polish deferred
