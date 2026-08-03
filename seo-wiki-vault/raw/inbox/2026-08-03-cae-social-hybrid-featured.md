# Session notes: CAE Social Media page + hybrid featured social

**Date:** 2026-07-31 → 2026-08-03  
**Kind:** Chat / research + implementation notes (human-directed vault intake)  
**App:** `apps/cae` (`@seo/cae`)  
**Related:**  
- Sister pattern: `raw/inbox/2026-07-31-dr-jasmine-curated-instagram-reels.md` (DJ Option C IG embeds)  
- CAE native chrome: `raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md`  
- Connect socials (IG/FB only historically): homepage `ConnectCta` / `data/home/cta.ts`  
**Topic:** Add public `/social` hub + Admin-curated hybrid featured posts (Instagram/Facebook official embeds; Xiaohongshu cards). Homepage teaser band. RedNote profile URL research.

---

## Research: RedNote / Xiaohongshu profile + note URLs

| Question | Finding |
|----------|---------|
| Search URL with `xsec_token` + `xsec_source=pc_search` | **Not permanent** — short-lived discovery token (hours–days) |
| Stable profile link for site buttons | Path only: `https://www.rednote.com/user/profile/{userId}` (no query) |
| CAE profile used | `https://www.rednote.com/user/profile/6a19467f000000000d035c00` (rednote ID `27254399276`) |
| `xhslink.com` shorts | Fragile for evergreen site buttons — prefer profile path |
| Official XHS website embed / iframe | **None** reliable — cards (cover + title + link) are the practical path |
| Instagram / Facebook embeds | Official oEmbed / embed.js / FB SDK; Meta tokenless oEmbed available for public content |
| Note URLs for featured XHS | Prefer `/explore/{noteId}` after stripping `xsec_*` (and related share tracking params) |

**Hybrid C (locked):** IG + FB = paste permalink → official players. XHS = title + cover + link → branded card (no unofficial in-page XHS player).

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Public route | `/social/` (nav **SOCIAL MEDIA**; under Astro base) |
| 2 | Hub layout | Page intro + **per-platform sections** (follow button + featured content in each section) |
| 3 | Section order | Xiaohongshu → Instagram → Facebook (data order); **XHS publicVisible = false** until covers ready |
| 4 | Surfaces | Full showcase on `/social`; home **Featured on Social** after Insights / before Pillars (max **3** by global `sort_order`) |
| 5 | Admin | `/admin/social` — platform select; IG/FB URL + published; XHS URL + title + cover upload/URL |
| 6 | Limits | Max **6** curated rows **per platform** (app-enforced); home first **3** published across platforms |
| 7 | Data model | New `public.social_features` — **do not** overload DJ `instagram_reels` |
| 8 | Cover storage | Supabase `media` bucket `cae/social/covers/...` |
| 9 | Out of scope | Graph API auto-sync, unofficial XHS players, drag-reorder UI |

---

## What shipped

### Public Social hub (before featured CRUD)

- Nav: `data/home/nav.ts` — **SOCIAL MEDIA** → `/social/`
- Page: `pages/social/index.astro` (+ `SocialLayout`, `SocialHub`, styles)
- Platform profile links in `data/home/social.ts` (XHS permanent profile, IG, FB)
- Asset: `assets/xiaohongshu.svg`
- Later UX: buttons **split into respective sections** inside `SocialFeatured` (intro-only `SocialHub`)
- Later: `publicVisible: false` on Xiaohongshu — public `/social` + home teaser show **Instagram + Facebook only**; Admin still lists XHS

### Hybrid featured social (Admin + embeds/cards)

#### Data

- Table `public.social_features` (site-scoped):  
  `platform` (`instagram` \| `facebook` \| `xiaohongshu`), `permalink`, `title`, `cover_image_url`, `sort_order`, `is_published`, timestamps  
- Unique `(site_id, platform, permalink)`  
- Migration: `supabase/migrations/20260731160000_social_features.sql`  
- RLS: anon reads `is_published = true`; authenticated manage  
- Types on `@seo/blog` `Database` (`SocialFeatureRow` / Insert / Update / `SocialFeaturePlatform`)  
- Applied on SEO-Website Supabase project (`uxwzgycgmtailguvmmsv`); PostgREST schema reload may be needed after DDL

#### App helpers / UI

| Path | Role |
|------|------|
| `apps/cae/src/lib/social-features.ts` | Normalize IG/FB/XHS URLs; CRUD; `listPublishedSocialFeatures`; per-platform max 6; home limit 3 |
| `apps/cae/src/lib/storage.ts` | `uploadSocialCoverImage` → `cae/social/covers/` |
| `apps/cae/src/pages/admin/social/index.astro` | Admin CRUD (multipart for XHS covers) |
| `apps/cae/src/layouts/AdminLayout.astro` | Nav **Social** |
| `apps/cae/src/components/social/InstagramEmbed.astro` + `InstagramEmbedScript.astro` | Official IG embed (DJ pattern) |
| `apps/cae/src/components/social/FacebookEmbed.astro` + `FacebookEmbedScript.astro` | `fb-post` / `fb-video` + SDK |
| `apps/cae/src/components/social/XiaohongshuCard.astro` | Cover + title + outbound link |
| `apps/cae/src/components/social/SocialFeatured.astro` | Per-platform section = follow CTA + featured grid |
| `apps/cae/src/components/home/HomeFeaturedSocial.astro` | Home teaser (filters out XHS while hidden) |
| `pages/index.astro` / `HomePage.astro` | Fetch + render teaser when non-empty |
| `/social` | **SSR** (`prerender = false`) so featured rows load live |

### Ops note

Apply `social_features` migration on each Supabase env before Admin/public featured social works. Until the table exists, public queries can 500 (`Could not find the table 'public.social_features' in the schema cache`).

---

## XHS note URL normalize examples (Admin paste)

Stable form after stripping `xsec_*` (titles from live notes at research time):

1. 离开你的人其实是来成全你的贵人 — `https://www.rednote.com/explore/6a6047700000000002003c00`  
2. 有这 3 个面相特征的人 通常很值得深交 — `https://www.rednote.com/explore/6a58657d000000000c003001`  
3. 你最讨厌的人可能是你的镜子 — `https://www.rednote.com/explore/6a570bd90000000002003c00`  
4. 你的嘴角，正在影响你的运气 — `https://www.rednote.com/explore/6a508e2f000000000e021800`  
5. 真正会拉你一把的贵人长这样！ — `https://www.rednote.com/explore/6a4dd63a000000000e021800`  
6. 这种面相的人，千万不要深交！！！ — `https://www.rednote.com/explore/6a3b5c7e000000000e038400`  

Public XHS section remains **hidden** until staff can supply cover images (`publicVisible: true` on `homeSocial.platforms` xiaohongshu entry).

---

## Deferred / open

1. Re-enable public Xiaohongshu section when covers are available (`publicVisible: true` + populate Admin XHS rows)  
2. Optional: scrape or manually batch cover assets for the six notes above  
3. Drag-and-drop reorder UI for `sort_order`  
4. Graph API / auto-sync for IG/FB (same deferral as DJ Reels)  
5. Vault ingest: compile this raw into `wiki/sources/` + update `wiki/sites/cae.md` / log / index when asked  

---

## Suggested wiki ingest targets

- `wiki/sources/cae-social-hybrid-featured.md` (new)  
- `wiki/sites/cae.md` — `/social`, Admin Social, `social_features`, home Featured Social, XHS visibility flag  
- `wiki/packages/blog.md` — `social_features` types if noted  
- `wiki/architecture/supabase.md` — table + migration  
- `wiki/log.md` + `wiki/index.md`
