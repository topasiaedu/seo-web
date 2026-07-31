# Session notes: Dr Jasmine curated Instagram Reels (Option C)

**Date:** 2026-07-31  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Related:**  
- Site socials already pointed at `https://www.instagram.com/drjasminechiew/` (`site-config.social`)  
- Prior DJ IA: `raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md`, `raw/inbox/2026-07-31-dr-jasmine-about-page.md`  
- Prior homepage teaser pattern: `raw/inbox/2026-07-28-dr-jasmine-homepage-blog-band.md`  
**Topic:** Add a manually curated Instagram Reels showcase (no Meta Graph API / auto-sync). Public `/reels` + Admin CRUD + home teaser (up to 3). Official Instagram embed players.

---

## Research summary (why Option C)

| Approach | Auto-update? | Notes |
|----------|--------------|--------|
| Instagram Graph API (Creator/Business + token refresh) | Yes (poll + cache) | Deferred — App Review, 60-day tokens, no “new post” webhook |
| Third-party widget | Yes | Cost / less design control |
| **Manual URL curation (Option C)** | No | **Shipped** — paste permalink in Admin |
| oEmbed alone | No | Does not list latest Reels; thumbnail/author fields removed; caption autofill unreliable / ToS risk |

**Locked MVP:** Option C — Admin pastes up to **6** Instagram `/reel/` or `/p/` URLs. No title/caption fields (embed shows Instagram’s own UI). No thumbnail upload.

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Public route | `/reels` (under Astro base) |
| 2 | Primary nav | **Reels** link (About · Reels · Blog) |
| 3 | Admin | `/admin/reels` — paste URL + published toggle; max 6 |
| 4 | Display | Instagram official `embed.js` players (`blockquote.instagram-media`) |
| 5 | Title/caption | **Removed** — embed supplies all needed copy |
| 6 | Layout `/reels` | No hero; **Featured Reels** H1 + Follow CTA; compact **3-col × 2-row** grid on desktop |
| 7 | Home teaser | Up to **3** embeds after Proof / before Health Insights; “View all Reels” |
| 8 | Footer Connect | **No** “Featured Reels” button (Explore still has Reels; Instagram profile link kept) |
| 9 | Out of scope | Graph API, oEmbed autofill, on-site video download, CAE reels |

---

## What shipped

### Data

- Table `public.instagram_reels` (site-scoped): `permalink`, `sort_order`, `is_published`, timestamps  
- Migrations:  
  - `supabase/migrations/20260731120000_instagram_reels.sql`  
  - `supabase/migrations/20260731133000_instagram_reels_drop_title_caption.sql` (drops title/caption if present)  
- RLS: anon reads `is_published = true`; authenticated manage  
- App enforces max **6** rows per site on create  
- Types on `@seo/blog` `Database` (`InstagramReelRow` / Insert / Update)

### App helpers / UI

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/lib/instagram-reels.ts` | Normalize IG URL; list/create/update/delete/reorder; `listPublishedReels(..., { limit })` |
| `apps/dr-jasmine/src/pages/admin/reels/index.astro` | Admin CRUD (categories-style form POST) |
| `apps/dr-jasmine/src/layouts/AdminLayout.astro` | Nav **Reels** |
| `apps/dr-jasmine/src/pages/reels/index.astro` | Public page |
| `apps/dr-jasmine/src/components/reels/*` | `InstagramReelEmbed`, `InstagramEmbedScript`, `reels.css` |
| `apps/dr-jasmine/src/components/home/HomeReels.astro` | Home band (≤3) |
| `apps/dr-jasmine/src/pages/index.astro` | Fetches `HOME_REELS_LIMIT = 3`; renders `HomeReels` when non-empty |
| `SiteNav` / footer Explore | Reels link |
| SEO | `PUBLIC_SITEMAP_SEGMENTS` + `SSR_SITEMAP_SEGMENTS` include `reels`; `buildReelsJsonLd` |

### Ops note

Apply migrations before Admin/public Reels work against a live DB (`supabase db push` / project migrate). Until then, queries fail if the table is missing.

---

## Deferred / open

1. Meta Graph API auto-sync + thumbnail cache (Option A) when Professional account + App Review are ready  
2. Drag-and-drop reorder UI in Admin (API helper `reorderReels` exists; UI not wired)  
3. Optional CSS scale if Instagram iframe min-width still fights 3-col layout on some viewports  

---

## Affects (for wiki ingest)

- `wiki/sites/dr-jasmine.md` — IA: `/reels`, Admin Reels, home Featured Reels band  
- `wiki/architecture/supabase.md` — `instagram_reels` migrations/table  
- `wiki/architecture/overview.md` · `wiki/overview.md` — DJ surface list  
- `wiki/packages/blog.md` — Database types mention if present  
- `apps/dr-jasmine/CONTEXT.md` — already updated in-session
