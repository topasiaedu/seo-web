# Future enhancement: CMS Media Library + Supabase Storage

**Status:** Archived design — not implemented yet  
**Date:** 2026-07-22  
**Reference site:** CAE (`apps/cae/`) — prove the pattern here, then clone for other brand apps under `apps/`

---

## Why

- Landing and blog images will grow quickly; keeping large binaries in Git hits repo size limits and slows clones.
- All public sites share one Supabase project; media needs a **multi-site** layout keyed by `sites.slug` (apps under `apps/<slug>/`).
- Editors need a single place to upload images and maintain **alt text** and **title** for SEO and accessibility.

---

## Storage architecture

One public Supabase Storage bucket named `media`. Paths are keyed by `sites.slug` and separated by purpose:

```text
media/
  {site_slug}/                  # e.g. cae | dr-jasmine
    site/                       # landing, brand, press, section images
    blog/
      covers/                   # featured / cover images
      body/                     # inline images inside post markdown
```

Example:

```text
media/cae/site/logo.png
media/cae/blog/covers/my-post-cover.webp
media/cae/blog/body/diagram-1.webp
```

**New site clone checklist**

1. Insert a `sites` row (slug + domains), same as today.
2. Upload brand/landing assets under `media/{slug}/site/`.
3. Route blog uploads to `media/{slug}/blog/covers/` or `.../body/`.
4. No new bucket and no new schema per site.

---

## Database: `media` table

Suggested migration (implement when this feature is built):

```sql
create type public.media_kind as enum ('site', 'blog');

create table public.media (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites (id) on delete cascade,
  kind        public.media_kind not null,
  post_id     uuid references public.posts (id) on delete set null,
  filename    text not null,
  bucket_path text not null unique,
  public_url  text not null,
  alt_text    text not null default '',
  title       text not null default '',
  mime_type   text not null,
  file_size   int  not null,
  uploaded_by uuid references auth.users (id),
  created_at  timestamptz not null default now(),
  check (
    (kind = 'site' and post_id is null)
    or (kind = 'blog')
  )
);

create index media_site_kind_idx on public.media (site_id, kind);
create index media_post_id_idx on public.media (post_id);
```

Also configure Storage RLS on bucket `media`:

- Public `SELECT` (read) for public assets
- Authenticated `INSERT` / `UPDATE` / `DELETE` for editors

**Path helper:** `` `${siteSlug}/${kind}/${subfolder}/${filename}` ``  
where `subfolder` is empty for `site`, or `covers` / `body` for `blog`.

Optional later nesting (`blog/{post_id}/...`) is not required for v1; `post_id` on the row is enough.

---

## Shared types (`@seo/blog`)

When implementing, add:

```typescript
export type MediaKind = "site" | "blog";

export interface MediaAsset {
  id: string;
  siteId: string;
  kind: MediaKind;
  postId: string | null;
  filename: string;
  bucketPath: string;
  publicUrl: string;
  altText: string;
  title: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}
```

Wire `BlogPost` with optional `coverImageId` / `coverImage` referencing a `MediaAsset` with `kind: "blog"`.

---

## CMS UI: `/media`

Page: `apps/cms/src/pages/media/index.astro` (to be built when `@seo/cms` is scaffolded)

```text
/media
├── Toolbar: [Site selector] [Kind: All | Site | Blog] [Upload]
├── Image grid: thumbnails + filename + alt preview
└── Side panel (on click):
    ├── Preview
    ├── Title
    ├── Alt Text
    ├── Kind (site | blog) + optional Post link
    ├── Public URL (copy)
    └── Save / Delete
```

**Behaviour**

- Upload chooses **site** + **kind** → Storage path ` {slug}/{kind}/... ` → insert `media` row
- Edit alt/title in the side panel (SEO source of truth for managed assets)
- Filter by site + kind so landing assets stay separate from blog uploads
- Copy public URL for markdown / page use

---

## Non-goals for the first Media Library build

- Do **not** require rewriting the current CAE homepage assets (`apps/cae/src/assets/` + `src/data/home/images.ts`) to Supabase URLs in the same PR. Landing images may stay local until a deliberate rewire.
- Do **not** invent a second Storage bucket per site.
- Per-post Storage folders are optional later; prefer `post_id` metadata first.

---

## Current interim approach (already done)

- CAE landing `alt` / `title` attributes live **in code** on Astro `<Image>` / `<img>` usage under `apps/cae` (see `src/data/home/images.ts` and section components).
- Local mirrors under `apps/cae/src/assets/` remain in the repo until a migration to Storage is scheduled.
