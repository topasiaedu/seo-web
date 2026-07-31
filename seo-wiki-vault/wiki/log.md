# Wiki log

Append-only timeline. Each entry starts with `## [YYYY-MM-DD] <verb> | <title>` for easy grepping.

## [2026-07-31] ingest | Dr Jasmine curated Instagram Reels (Option C)

- Raw: `raw/inbox/2026-07-31-dr-jasmine-curated-instagram-reels.md`
- Source: `wiki/sources/dr-jasmine-curated-instagram-reels.md`
- Updated: `sites/dr-jasmine`, `architecture/supabase`, `architecture/overview`, `packages/blog`, `overview`, `index`
- Note: `/reels` official embeds; Admin paste URL (max 6); home ≤3 teaser; no Graph API / title-caption fields; apply migrations before live use

## [2026-07-31] ingest | Dr Jasmine About page restored + polish

- Raw: `raw/inbox/2026-07-31-dr-jasmine-about-page.md`
- Source: `wiki/sources/dr-jasmine-about-page.md`
- Updated: `sites/dr-jasmine`, `overview`, `architecture/overview`, `index`, `sources/dr-jasmine-home-ia-and-polish` (About removal superseded)
- Note: patient-first `/about`; polish (no em dashes; no MBBS in H1; no “not right fit”); still omit `/faq` `/programs` `/workshop`
- Prior same-day sync entry kept (implementation); this ingest captures full polish + provenance

## [2026-07-31] sync | Dr Jasmine About page restored

- Updated: `sites/dr-jasmine`, `overview`, `index`, `apps/dr-jasmine/CONTEXT.md`
- Route: `/about` — patient-first Clinical Trust layout (hero, story, credentials, approach, who it's for, workshop CTA)
- Nav/footer About → `/about`; home Meet band “Read full story”; sitemap + Person/MedicalWebPage JSON-LD
- Still omitted: `/faq`, `/programs`, `/workshop`

## [2026-07-30] ingest | Bulk-import LLM template + Admin logout CSRF

- Raw: `raw/inbox/2026-07-30-bulk-import-llm-template-and-logout-csrf.md`
- Source: `wiki/sources/bulk-import-llm-template-and-logout-csrf.md`
- Updated: `sites/cae`, `sites/dr-jasmine`, `cae-admin-bulk-import`, `glossary`, `architecture/routing-vercel`, `overview`, `index`
- Note: live taxonomy Copy/Download; 5–15 min + plain `.md` AI rules; parser strips chat fences; `security.allowedDomains` for gateway/Vercel logout; commit `4b50cf4`

## [2026-07-30] lint | post–Connect-gold / DJ-TOC / dual-site ingest

- Broken links: **1** fixed (`monorepo-main-staging-branch-model` → `../../raw/inbox/…git-init…`); recheck **0**
- Index orphans: **0**
- ADR 0001 updated (dual Vercel projects supersede one-project topology; host rewrite still open)
- Overview Deferred cleaned (removed done adapter / dual-project items; added Git author gate)
- Code spot-check: Connect gold, `base: "/"`, DJ `data-blog-toc` OK
- Uningested inbox: 8 older Jul 23–27 notes (deferred)
- Full report: `outputs/lint-2026-07-30.md`

## [2026-07-30] ingest | CAE Connect headline dark-mode gold

- Raw: `raw/inbox/2026-07-30-cae-connect-headline-dark-gold.md`
- Source: `wiki/sources/cae-connect-headline-dark-gold.md`
- Updated: `sites/cae`, `sources/cae-nm-zwds-brand-theme-and-public-theme-toggle`, `sources/cae-native-zwds-public-redesign`, `overview`, `index`
- Note: purple brand-gradient clip-text on elevated purple band → solid `--cae-gold` in dark; light keeps gradient; commit `4d47da1`

## [2026-07-30] ingest | Dr Jasmine blog TOC scroll-spy + section eyebrows

- Raw: `raw/inbox/2026-07-30-dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md`
- Source: `wiki/sources/dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md`
- Updated: `sites/dr-jasmine`, `overview`, `index`
- Note: surgical port from CAE Immersive Story; clinic eyebrows (`Common questions` / `References` / `Keep reading`); commit `c60d701`
- Out of scope: CAE hero chrome, theme toggle, favicon/OG

## [2026-07-30] ingest | Vercel dual-site hosting + SSR adapter

- Raw: `raw/inbox/2026-07-30-vercel-dual-site-hosting-and-ssr.md`
- Source: `wiki/sources/vercel-dual-site-hosting-and-ssr.md`
- Updated: `architecture/routing-vercel` (source link), `sources/vercel-output-directory-off-deploy-success` (prior link), `overview`, `index`
- Note: two-project topology + `@astrojs/vercel`; raw URL/`base` guidance superseded by Output Directory Off + `base: "/"` follow-ons
- Open: Git author gate for `KWen-22`; custom domains

## [2026-07-30] ingest | Vercel base `/` — unstyled UI on dedicated hosts

- Raw: `raw/inbox/2026-07-30-vercel-base-root-unstyled-ui.md`
- Source: `wiki/sources/vercel-base-root-unstyled-ui.md`
- Updated: `architecture/routing-vercel`, `sites/cae`, `sites/dr-jasmine`, `overview`, `index`, `sources/vercel-output-directory-off-deploy-success` (follow-up link)
- Note: HTML 200 + `/cae/_astro/*` 404 after Output Directory Off; `538a722` sets `base: "/"` when `VERCEL=1`
- Open: custom domains; Git author gate for `KWen-22`; optional legacy path redirects

## [2026-07-30] sync | Vercel base `/` for dedicated brand projects

- Code: `apps/cae/astro.config.mjs` + `apps/dr-jasmine/astro.config.mjs` — `VERCEL=1` → `base: "/"`; local gateway keeps `/cae/` / `/dr-jasmine/`
- Also: `apps/dr-jasmine/src/data/seo/urls.ts` default base → `import.meta.env.BASE_URL`
- Updated: `architecture/routing-vercel`, `sites/cae`, `sites/dr-jasmine`, `overview`, `sources/vercel-output-directory-off-deploy-success`, `index`
- Why: fixed `base` prefix made HTML request `/cae/_astro/*` while Vercel served `/_astro/*` (unstyled UI)
- After deploy: open host root (`https://seo-web-cae.vercel.app/`), not `/cae/`

## [2026-07-30] ingest | Vercel Output Directory off — dual-site deploy success

- Raw: `raw/inbox/2026-07-30-vercel-output-directory-off-deploy-success.md`
- Source: `wiki/sources/vercel-output-directory-off-deploy-success.md`
- Updated: `architecture/routing-vercel`, `sites/cae`, `sites/dr-jasmine`, `overview`, `index`
- Note: Output Directory=`dist` caused Success + platform NOT_FOUND; Off + Redeploy fixed `seo-web-cae` / `seo-web-dr-jasmine`. Open `/cae/` and `/dr-jasmine/` (not bare `/`)
- Open: root redirects; custom domains + drop `base`; Git author gate for `KWen-22`

## [2026-07-30] sync | Vercel dual-project SSR + conditional adapters

- Updated: `architecture/routing-vercel.md`, `overview.md`, root `CONTEXT.md`
- Code: `VERCEL=1` → `@astrojs/vercel`; else `@astrojs/node`; root `.npmrc` hoist; frozen-lockfile install in per-app `vercel.json`
- Open: Vercel team must turn Off Output Directory override, keep Include-files-outside-root On, and fix Git author access for `KWen-22` (or Redeploy from a team member)

## [2026-07-30] ingest | Dr Jasmine bulk import schedule UI

- Raw: `raw/inbox/2026-07-30-dr-jasmine-bulk-import-schedule-ui.md`
- Source: `wiki/sources/dr-jasmine-bulk-import-schedule-ui.md`
- Updated: `sites/dr-jasmine` (import route + Related), `sources/cae-bulk-import-schedule-ui` (DJ port no longer deferred), glossary (Bulk import both brands), overview related sources, index
- Note: surgical port from CAE; DJ cover upload / slug / Wellness branding preserved; shipped in `24e7c68` with CAE schedule UI
- Scheduling still lazy time-gate — no cron

## [2026-07-29] ingest | CAE bulk import schedule UI

- Raw: `raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md`
- Source: `wiki/sources/cae-bulk-import-schedule-ui.md`
- Updated: `sites/cae` (import route + smoke + lib paths), `sources/cae-admin-bulk-import` (schedule claims), glossary (Bulk import), overview related sources, index
- Note: DJ schedule port deferred (`docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md`); dashboard Bulk import button exists on both brands
- Scheduling still lazy time-gate — no cron

## [2026-07-29] ingest | monorepo main + staging branch model

- Raw: `raw/inbox/2026-07-29-monorepo-main-staging-branch-model.md`
- Source: `wiki/sources/monorepo-main-staging-branch-model.md`
- Updated: `architecture/monorepo` (branch table), `architecture/routing-vercel` (deploy branches), architecture overview, overview, glossary (`main`/`staging`/feature branch), index
- Open: GitHub default still `cae` → delete `origin/cae` after switch; retarget hosts off retired brand tips

## [2026-07-29] sync | merge CAE + Dr Jasmine onto main

- Merged `cae` (native ZWDS public redesign) into `main` after fast-forward from `dr-jasmine`
- Both brand apps live under `apps/cae` and `apps/dr-jasmine` on one branch
- Wiki conflicts resolved to keep CAE native chrome claims + full DJ site docs

## [2026-07-28] lint | post–native-ZWDS-redesign vault health

- Broken wiki links: **0** (spot-checked new source paths)
- Index orphans fixed: added missing Immersive Story + Jul 28 brand/native sources
- Code spot-check: `HomePage.astro` → native `home/*`; media + `BlogLayout` use SiteHeader/SiteFooter
- Uningested inbox (deferred): older Jul 24 blog notes + git-init + series drafts — see lint report
- Full report: `outputs/lint-2026-07-28-native-zwds-redesign.md`

## [2026-07-28] ingest | cae-native-zwds-public-redesign

- Raw: `raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md`
- New source: `wiki/sources/cae-native-zwds-public-redesign.md`
- Native home/media/blog chrome cutover; Immersive Story polish (TOC spy, FAQ chevron, byline socials)
- Updated: `sites/cae`, `overview`, `architecture/overview`, glossary, index; noted GHL live chrome superseded

## [2026-07-28] ingest | cae-nm-zwds-brand-theme-and-public-theme-toggle

- Raw: `raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md`
- New source: `wiki/sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md`
- nm-zwds tokens/gradient, public Light/Dark toggle, logo home URL fix
- Updated: `sites/cae`, glossary, index

## [2026-07-28] ingest | Dr Jasmine homepage Health Insights band (Option B)

- Raw: `raw/inbox/2026-07-28-dr-jasmine-homepage-blog-band.md`
- Source: `wiki/sources/dr-jasmine-homepage-blog-band.md`
- Updated: `sites/dr-jasmine.md` (home stack + Insights), `packages/blog.md` consumers, overview, architecture overview, index; note on home IA source that no-blog-band rule is superseded for this teaser
- Locked: latest 3 image `PostCard`s after Proof; omit when empty

## [2026-07-28] ingest | Dr Jasmine responsive audit — no code changes

- Raw: `raw/inbox/2026-07-28-dr-jasmine-responsive-audit.md`
- Source: `wiki/sources/dr-jasmine-responsive-audit.md`
- Updated: `sites/dr-jasmine.md` (responsive pass; no polish PR), overview residual QA, index
- Decision: public site mobile-responsive — ship as-is

## [2026-07-28] lint | DJ home IA + Admin/blog readability ingest

- Broken wiki links: see `outputs/lint-2026-07-28-dr-jasmine.md`
- Fixed stale Option A multi-page IA claims in `sites/dr-jasmine.md` + `overview.md` + `index.md`
- Ingested home IA collapse + Admin theme / light blog readability sources

## [2026-07-28] ingest | Dr Jasmine Admin brand theme + light blog readability

- Raw: `raw/inbox/2026-07-28-dr-jasmine-admin-theme-and-blog-readability.md`
- Source: `wiki/sources/dr-jasmine-admin-theme-and-blog-readability.md`
- Updated: `sites/dr-jasmine.md` (Admin forest theme; light blog; slug conventions; site_id isolation note)

## [2026-07-28] ingest | Dr Jasmine home IA collapse + polish

- Raw: `raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md`
- Source: `wiki/sources/dr-jasmine-home-ia-and-polish.md`
- Updated: `sites/dr-jasmine.md` (single-home IA; removed about/workshop/programs/faq), overview, index

## [2026-07-27] ingest | Dr Jasmine Option A true website + brand tokens

- Raw: `raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md`
- Source page: `wiki/sources/dr-jasmine-option-a-true-website.md`
- Updated: `sites/dr-jasmine.md` (Forest/Gold/Ivory brand token table + intended vs interim CSS note), index, overview Deferred
- Open: reconcile `tokens-public.css` to product palette

## [2026-07-27] sync | Dr Jasmine Option A true website T12 closeout

- Status: Option A Clinical Trust public IA live — Home, About, Programs, Workshop, Blog, FAQ (native Astro; GHL lift archive only)
- Wiki: `sites/dr-jasmine.md` site map + Option A smoke; overview / architecture / index one-liners
- Root: `CONTEXT.md`, `CONTEXT-MAP.md`, `README.md` — DJ described as Option A marketing site (not GHL homepage)
- Plan: `docs/implementation-plan/dr-jasmine-true-website.md` T1–T12 marked done; residual human QA listed
- Smoke (agent): typecheck + build pass; gateway `:4321` all six public routes + admin login/gate OK; workshop → `registerUrl`; blog PublicLayout chrome; desktop/mobile + Auth CRUD = human

## [2026-07-27] sync | Dr Jasmine T12 closeout — active app

- Status: `@seo/dr-jasmine` is an **active** independent app (no longer deferred)
- Wiki: `sites/dr-jasmine.md` (routes, env, smoke); source `sources/dr-jasmine-ghl-capture.md`
- Updated: overview, architecture overview/monorepo/routing-vercel, index, cms Admin-vs-CMS note
- Root: `CONTEXT.md`, `CONTEXT-MAP.md`, `README.md` — DJ live; CMS deferred
- Future-enhancements: Workstream A superseded by `docs/implementation-plan/dr-jasmine-landing-and-admin.md`
- Smoke (agent): typecheck + build pass; direct `:4323` landing/blog/login OK; gateway/`/cms` verified in code; Auth/CRUD/CTA human; Docker `db reset` pending; missing `admin/author.astro` residual
- Plan: T1–T12 marked done

## [2026-07-27] sync | Dr Jasmine implementation started

- Status: scaffolding in progress (no longer deferred forever)
- Seed: DJ Author + 6 starter Categories in `supabase/seed.sql` (`site_id` `…0002`)
- Domain language: `apps/dr-jasmine/CONTEXT.md` (`registerUrl` placeholder → `https://doctorjasmine.com/register`)
- Plan: `docs/implementation-plan/dr-jasmine-landing-and-admin.md` (T3 Wave-0 stub; full closeout is T12)
- Updated: `sites/dr-jasmine.md`

## [2026-07-27] lint | post–immersive-story vault health

- Broken wiki links: **0**; index orphans: **0**
- Code spot-check OK: `blog-page--immersive`; no `blog-article-paper` in `apps/cae/src`
- Reading-paper claims only as historical/superseded
- Uningested inbox (deferred): admin-blog-posting-accepted, first Zi Wei post, git-init, admin-ui-ux, public-blog-redesign, **reading-paper (superseded)**, blog-post-polish, zi-wei-9-post-series
- Full report: `outputs/lint-2026-07-27-immersive-story.md`

## [2026-07-27] ingest | cae-blog-immersive-story-redesign

- Raw: `raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md`
- New source: `wiki/sources/cae-blog-immersive-story-redesign.md`
- Public `/cae/blog/[slug]` Immersive Story: dark continuous scroll, in-hero takeaway, 56rem column, TOC rail, related strip; light paper removed
- Updated: `sites/cae`, `overview`, glossary, `sources/cae-homepage-blog-bento`, index

## [2026-07-27] ingest | cae-admin-bulk-import

- Raw: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`
- New source: `wiki/sources/cae-admin-bulk-import.md`
- Admin Bulk import: multi-post Markdown (`===NEW POST===`), copyable writer/LLM template, per-post hero slots, respects scheduled `publishAt`
- Updated: `sites/cae`, `packages/blog`, `overview`, glossary, index

## [2026-07-27] ingest | cae-admin-postform-simplifications

- Raw: `raw/inbox/2026-07-27-cae-admin-postform-simplifications.md`
- New source: `wiki/sources/cae-admin-postform-simplifications.md`
- Admin PostForm: preview slug/reading time; Summary; hero→OG; no separate SEO fields; auto same-category related; tag typeahead; Published vs Scheduled select
- Updated: `sites/cae`, `packages/blog`, `overview`, glossary, index

## [2026-07-27] ingest | cae-blog-scheduled-publishing

- Raw: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`
- New source: `wiki/sources/cae-blog-scheduled-publishing.md`
- Lazy time-gate: `published` + `published_at <= now()`; Admin Scheduled computed; migration applied on linked remote
- Updated: `sites/cae`, `packages/blog`, `architecture/supabase`, `overview` (removed from Deferred), glossary, index

## [2026-07-27] sync | CAE scheduled publishing language

- Publish semantics: `status = published` = approved; public live when `published_at <= now()`; Admin **Scheduled** = computed label (no DB status, no cron)
- Updated: `sites/cae`, `packages/blog`; deferred doc marked Implemented; `apps/cae/CONTEXT.md` language aligned
- Plan: `docs/implementation-plan/cae-blog-scheduling.md` (Task F)

## [2026-07-27] ingest | cae-homepage-blog-bento

- Raw: `raw/inbox/2026-07-27-cae-homepage-blog-bento.md`
- New source: `wiki/sources/cae-homepage-blog-bento.md`
- Homepage Insights soft bento replaces Offerings; home SSR for newest 4 Posts; hero `#insights`
- Updated: `sites/cae`, `overview`, `architecture/overview`, index

## [2026-07-23] sync | CAE Admin Blog live (T12 wiki + smoke)

- Documented CAE Admin at `/cae/admin` as live authoring surface (login, posts CRUD, Author, categories)
- Clarified **Admin ≠ CMS**: `sites/cms.md` remains deferred shared platform
- Synced schema: `authors`, `categories`, posts editorial columns, Storage `media` paths (`cae/blog/covers|body|authors`)
- Documented public `/cae/blog` + Admin routes; smoke checklist on `sites/cae.md`
- Updated packages `@seo/db` / `@seo/blog`, overview, architecture overview + monorepo, glossary, index
- Task split T1–T12 marked done in `docs/cae-admin-blog-agent-tasks.md`

## [2026-07-23] lint | post–SEO-improvements vault health

- Broken wiki links: **0**; index orphans: **0**
- SEO raw ingested; code spot-check OK (`SeoHead`, `seoHtmlPass`, sitemap, `robots.txt`, `PUBLIC_SITE_ORIGIN`)
- Uningested inbox (deferred): `2026-07-23-git-init-github-remote.md` (unrelated)
- Glossary: **SEO remapper pass**; full report: `outputs/lint-2026-07-23-cae-seo.md`

## [2026-07-23] ingest | cae-seo-improvements

- Raw: `raw/inbox/2026-07-23-cae-seo-improvements.md`
- New source: `wiki/sources/cae-seo-improvements.md`
- Updated: `sites/cae` (SEO stack), `sources/cae-ghl-section-lift-and-media-page`, `sources/cms-media-library-and-cae-image-alt`, glossary, overview, index

## [2026-07-23] lint | post–section-lift vault health

- Broken wiki links: **0**; index orphans: **0**
- Ingested missing inbox: `cae-ghl-1to1-native-parity` → superseded source stub
- Fixed stale: `architecture/supabase.md` (`website/*/config.ts` → `apps/cae/src/site-config.ts`); ADR 0001 historical `website/` deploy wording; independent-app Vercel open question marked resolved
- Glossary: added **GHL section lift**
- Code spot-check OK: `HomePage` → `ghl/*`, `/media/` route, vault captures, `vercel.json` → `@seo/cae`
- Full report: `outputs/lint-2026-07-23-section-lift.md`

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
