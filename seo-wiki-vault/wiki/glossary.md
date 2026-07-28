# Glossary

| Term | Meaning |
|------|---------|
| **Brand app** | Independent Astro package under `apps/<slug>` (`@seo/<slug>`) with its own `base` and port. |
| **Gateway** | `apps/gateway` — local path front door that proxies `/cae` (and later other brands) to upstream apps. |
| **Site** | A brand or CMS surface — live apps under `apps/<slug>/` (e.g. CAE, Dr Jasmine); deferred surfaces (e.g. CMS) are not scaffolded yet. |
| **Site slug** | Stable string id in code and URLs (`cae`, `dr-jasmine`, `cms`). |
| **Project id / site_id** | UUID primary key in Supabase `sites.id`; all posts and queries key off this, not the slug alone. |
| **Post** | Blog article row in `posts`, always belonging to one `site_id`. |
| **Published** | Post `status = published` (approved). Publicly visible only when `published_at` is set and `<= now()`. In CAE Admin, choosing **Published** means go live now. |
| **Scheduled** | Admin label / PostForm intent for a Published Post whose `published_at` is still in the future. Not a DB status — stored as `published` + future `published_at`. |
| **Publish at** | Admin datetime field → `published_at` (UTC). Shown when intent is Scheduled; go-live time for the public blog (lazy time-gate; no cron). |
| **Summary** | Admin label for Post `excerpt` — teaser on cards / homepage / meta description fallback. Distinct from **Key takeaway** (on-page callout). |
| **Key takeaway** | Optional on-page callout in the post **hero** (under title, above date/read time); not used for listings or meta. |
| **Immersive Story** | CAE public post layout (`/cae/blog/[slug]`): dark continuous scroll, cinematic hero, in-hero takeaway, ~56rem reading column, breakout images, TOC rail, related strip. Replaces the former light “reading paper” article surface. Dr Jasmine `/blog/[slug]` uses a separate **light ivory** promise-first layout (not Immersive Story). |
| **Author** | Site-scoped byline profile for a brand’s posts (one per brand for now). Brands do not share Authors. |
| **Admin** | Per-brand authenticated authoring UI inside a brand app (e.g. `/cae/admin`). CAE Admin authors CAE posts only. |
| **Bulk import** | CAE Admin flow (`/cae/admin/posts/import`) that creates many Posts from one Markdown document (`===NEW POST===` separators + YAML frontmatter). Per-post hero uploads in UI; `status` / `publishAt` respected. |
| **CMS** | Future shared authoring platform across brands (`apps/cms` planned later). Not the same as Admin; do not treat CAE Admin as the CMS. |
| **Media Library** | Deferred CMS UI (`/cms/media`) to upload images and edit `alt` / `title` per site. Distinct from Admin’s direct Storage uploads. |
| **Media kind** | Planned enum on media rows: `site` (landing/brand) vs `blog` (covers/body). |
| **Storage path** | Live bucket `media` with paths `{site_slug}/site|blog/covers|body|authors/...`. Admin uses blog paths today; Media Library UI deferred. |
| **Category** | Site-scoped Post label (one primary Category per Post). Brands do not share Categories. |
| **Host rewrite** | Planned production middleware maps `Host` → brand app (ADR 0001); not wired on Vercel yet. |
| **GHL section lift** | Marketing-page approach: sanitize captured GoHighLevel HTML (keep section `id`/`class`) + CSS under `.hl_page-preview--content`, remap CDN images to local assets. Runtime lives in `apps/cae/src/components/ghl/` + `styles/ghl/`; vault `_ghl-extract` stays archive-only. |
| **SEO remapper pass** | UI-safe post-process on remapped GHL HTML (`seoHtmlPass.ts`): fill image alts, set loading/fetchpriority, demote spare `<h1>`→`<h2>`, fix URL aria-labels — without changing classes, IDs, or layout CSS. |
