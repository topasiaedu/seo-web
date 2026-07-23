# Supabase

Shared project for all sites.

## Tables (migration)

File: `supabase/migrations/20260722100000_sites_and_posts.sql`

### `sites`

- `id` uuid PK (default `gen_random_uuid()`)
- `slug` text unique not null
- `name` text not null
- `domains` text[] default `{}`
- `settings` jsonb default `{}`
- `created_at` timestamptz

### `posts`

- `id` uuid PK
- `site_id` uuid FK → `sites` (cascade delete)
- `slug`, `title`, `excerpt`, `body_md`
- `status` text check: `draft` | `published` | `archived` (default `draft`)
- `published_at`, `updated_at`, `author_id`
- **UNIQUE** `(site_id, slug)`
- Index: `(site_id, status)`

## RLS

- `Public read published posts` — SELECT for `anon`/`authenticated` where `status = 'published'`
- `Public read sites` — SELECT sites for `anon`/`authenticated`
- `Editors manage posts` — ALL for `authenticated` (tighten roles later)

## Seed

`supabase/seed.sql` inserts `cae` and `dr-jasmine` with fixed UUIDs matching `website/*/config.ts`. CMS is not seeded.

## Client usage

Public sites: anon key + RLS. CMS: user session. No service role in the browser.

## Deferred: Storage + `media` table

Not migrated yet. Agreed shape (CAE is the clone template):

- **Bucket:** one public bucket `media`
- **Paths:** `{site_slug}/site/...` and `{site_slug}/blog/covers|body/...`
- **Table `media`:** `site_id`, `kind` (`site` | `blog`), optional `post_id`, `filename`, `bucket_path`, `public_url`, `alt_text`, `title`, mime/size, `uploaded_by`
- **RLS (planned):** public read on objects; authenticated insert/update/delete (tighten roles with CMS)

Design: `docs/future-enhancements/cms-media-library.md` · Source: [cms-media-library-and-cae-image-alt](../sources/cms-media-library-and-cae-image-alt.md)
