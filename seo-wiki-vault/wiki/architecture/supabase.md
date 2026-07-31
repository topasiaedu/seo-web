# Supabase

Shared project for all sites.

## Migrations

| File | Role |
|------|------|
| `supabase/migrations/20260722100000_sites_and_posts.sql` | `sites`, base `posts`, initial RLS |
| `supabase/migrations/20260723160000_blog_authors_categories_posts.sql` | `authors`, `categories`, posts editorial columns, Storage bucket `media` |
| `supabase/migrations/20260727033138_posts_public_read_published_at_gate.sql` | Anon public-read RLS time-gate on `published_at`; index `(site_id, status, published_at DESC NULLS LAST)` |
| `supabase/migrations/20260731120000_instagram_reels.sql` | Curated Instagram Reels table + RLS (DJ Option C) |
| `supabase/migrations/20260731133000_instagram_reels_drop_title_caption.sql` | Drop `title`/`caption` from `instagram_reels` (embed supplies copy) |

## Tables

### `sites`

- `id` uuid PK (default `gen_random_uuid()`)
- `slug` text unique not null
- `name` text not null
- `domains` text[] default `{}`
- `settings` jsonb default `{}`
- `created_at` timestamptz

### `authors` (one byline profile per site)

- `id` uuid PK
- `site_id` uuid FK → `sites` (**UNIQUE** — one Author per brand)
- `name`, `bio`, `photo_url`
- `updated_at` (trigger-maintained)

Brands do not share Authors. CAE seed: **Cae Goh**.

### `categories` (site-scoped taxonomy)

- `id` uuid PK
- `site_id` uuid FK → `sites`
- `slug`, `name`
- **UNIQUE** `(site_id, slug)`

CAE seed (7): Zi Wei Dou Shu, Life Strategy, Relationships, Career & Business, Consultations, Academy, Speaking & Media.

### `posts`

Base columns (`20260722100000`):

- `id` uuid PK
- `site_id` uuid FK → `sites` (cascade delete)
- `slug`, `title`, `excerpt`, `body_md`
- `status` text check: `draft` | `published` | `archived` (default `draft`)
- `published_at`, `updated_at`, `author_id`
- **UNIQUE** `(site_id, slug)`
- Indexes: `(site_id, status)`; `(site_id, status, published_at DESC NULLS LAST)` (live list/get)

Editorial / SEO extensions (`20260723160000`):

| Column | Notes |
|--------|--------|
| `reading_time_minutes` | Auto ~200 wpm from body; Admin may override |
| `hero_image_url` / `hero_image_alt` | Cover |
| `og_image_url` | Social share image |
| `key_takeaway` | Callout on public post |
| `faq` jsonb | `[{ question, answer }, …]` |
| `sources` jsonb | `[{ label, url }, …]` |
| `category_id` | FK → `categories` (nullable; ON DELETE SET NULL) |
| `tags` text[] | Free-form labels |
| `seo_title` / `seo_description` | Per-post SEO |
| `related_post_ids` uuid[] | Same-site related Posts |

`author_id` FK → `authors.id` (ON DELETE SET NULL). No `featured` column (deferred).

`updated_at` triggers on `posts` and `authors`.

### `instagram_reels` (curated Instagram showcase; DJ Option C)

- `id` uuid PK
- `site_id` uuid FK → `sites`
- `permalink` text (canonical `instagram.com/(reel|p)/…` URL; unique per site)
- `sort_order` int ≥ 0
- `is_published` boolean
- `created_at` / `updated_at` (trigger)
- App enforces max **6** rows per site; title/caption removed (official embed supplies copy)
- Types on `@seo/blog` `Database`; CRUD lives in `apps/dr-jasmine/src/lib/instagram-reels.ts`
- Source: [dr-jasmine-curated-instagram-reels](../sources/dr-jasmine-curated-instagram-reels.md)

## RLS

- **Sites** — public SELECT (`anon` / `authenticated`)
- **Posts** — anon SELECT where `status = 'published'` **and** `published_at IS NOT NULL` **and** `published_at <= now()` (lazy schedule; matches `@seo/blog` public helpers). Authenticated ALL via `"Editors manage posts"` (Admin can read drafts/scheduled). Tighten roles later.
- **Authors / categories** — public SELECT; authenticated ALL
- **instagram_reels** — anon SELECT where `is_published = true`; authenticated SELECT all + manage ALL
- Site scope for writes is enforced in app queries (CAE Admin hardcodes `site_id = cae`)

Scheduled publishing source: [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md).

## Storage bucket `media`

Public bucket `media` (created in `20260723160000`). Path convention (bucket-relative):

```text
{site_slug}/
  site/                 # landing / brand assets (future Media Library)
  blog/
    covers/             # hero / cover images
    body/               # inline body images
    authors/            # Author profile photos
```

Examples: `cae/blog/covers/…`, `cae/blog/body/…`, `cae/blog/authors/…`.

RLS on `storage.objects`: public read; authenticated insert/update/delete for bucket `media`.

Full **Media Library** UI + `media` table remain deferred — Admin uploads use these paths directly. Design: `docs/future-enhancements/cms-media-library.md`.

## Seed

`supabase/seed.sql` inserts:

- Sites `cae` and `dr-jasmine` (fixed UUIDs matching `apps/cae/src/site-config.ts`)
- CAE Author **Cae Goh**
- Seven CAE categories

CMS is not seeded.

## Client usage

- Public blog / marketing: anon key + RLS via `@seo/db` `createServerClient` / `createBrowserClient`
- Admin: authenticated session cookies (Astro middleware)
- Never put service role in the browser

Package docs: [@seo/db](../packages/db.md) · [@seo/blog](../packages/blog.md)
