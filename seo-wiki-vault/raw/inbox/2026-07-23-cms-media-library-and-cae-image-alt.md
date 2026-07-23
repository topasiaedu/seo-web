# Session notes: CMS Media Library design + CAE landing image alt/title

**Date:** 2026-07-22 / 2026-07-23  
**Kind:** Chat / working notes + implemented interim code change  
**Related repo docs:** `docs/future-enhancements/cms-media-library.md`  
**Topic:** Where images live (Git vs Supabase Storage), multi-site Storage layout, CMS Media Library deferred; CAE landing `alt`/`title` fixed in code for now.

---

## Decisions from session

1. **Do not put large / growing image sets in Git long-term.** Blog posting will add many images; repo size and GitHub limits are a concern.
2. **Use one Supabase Storage bucket (`media`) for all sites**, with paths keyed by `sites.slug`. CAE is the reference site; clone the same layout for new brands.
3. **Separate site assets from blog assets** under each slug (`site/` vs `blog/covers/` + `blog/body/`).
4. **Alt text and title are metadata**, not only HTML attributes on CDN files. Long-term they live on a `media` table and in the CMS Media Library UI.
5. **Ship Media Library later.** Archive the full design under `docs/future-enhancements/`; do not build CMS `/media`, Storage migration, or asset upload in this pass.
6. **Interim for CAE landing:** write good `alt` and `title` **in code** on `<img>` tags in `website/cae/ghl-clone/page.html`. Keep local `website/cae/assets/` in the repo; do not upload them to Supabase yet. Leave GHL CDN `src` URLs unchanged.

---

## Current image reality (CAE)

- Live homepage injects captured GHL HTML from `website/cae/ghl-clone/page.html` via `website/cae/pages/index.astro`.
- Images are remote (filesafe / msgsndr / leadconnector CDNs), not Astro/`Image` components.
- Local files under `website/cae/assets/` exist as a mirror but are unused by the landing until a deliberate rewire.
- ~36 `<img>` tags on the landing; many previously had empty `alt` and no `title`.

### Interim rules applied to `page.html`

- Meaningful images: set both `alt` and `title` (human-readable, not filenames).
- Press logos: consistent brand name in `alt`; `title` like “Featured in …”.
- Prefer concise SEO/accessibility copy; do not change `src` or layout.
- Decorative-only assets: empty `alt` / omit `title` when applicable (five-star rating graphics were given explicit alt because they convey rating meaning).

---

## Agreed Storage layout (future)

```text
media/                          # single public bucket
  {site_slug}/                  # cae | dr-jasmine | …
    site/                       # landing, brand, press, section images
    blog/
      covers/                   # featured / cover images
      body/                     # inline images in post markdown
```

**New site clone checklist**

1. Insert `sites` row (slug + domains).
2. Upload brand/landing under `media/{slug}/site/`.
3. Blog uploads under `media/{slug}/blog/covers/` or `.../body/`.
4. No new bucket or schema per site.

---

## Agreed `media` table sketch (future)

Fields: `site_id`, `kind` (`site` | `blog`), optional `post_id`, `filename`, `bucket_path`, `public_url`, `alt_text`, `title`, `mime_type`, `file_size`, `uploaded_by`, `created_at`.

- Constraint: `kind = 'site'` ⇒ `post_id` is null; blog may link a post.
- Storage RLS: public read; authenticated write/update/delete.
- Path helper: `` `${siteSlug}/${kind}/${subfolder}/${filename}` ``
- Per-post Storage folders optional later; prefer `post_id` metadata in v1.

---

## Agreed CMS Media Library UI (future)

Page: `website/cms/pages/media/index.astro`

- Toolbar: site selector, kind filter (All | Site | Blog), upload
- Grid: thumbnails + filename + alt preview
- Side panel: preview, title, alt text, kind / optional post link, copy public URL, save/delete

Also planned when building: `MediaAsset` / `MediaKind` on `@seo/blog`, optional `coverImage` on `BlogPost`.

---

## Explicit non-goals (first Media Library build)

- Do not require rewriting CAE GHL clone URLs to Supabase in the same change as the Media Library.
- Do not invent a second Storage bucket per site.
- Do not treat local `assets/` upload as a prerequisite for documenting or designing the library.

---

## What was implemented in repo (this pass)

| Item | Path / note |
|------|-------------|
| Landing alt/title | `website/cae/ghl-clone/page.html` — all content `<img>` tags updated |
| Future design doc | `docs/future-enhancements/cms-media-library.md` |
| Not done | CMS `/media` UI, Storage bucket migration, uploading `website/cae/assets/`, `@seo/blog` media types |

---

## Open questions / follow-ups

- When to migrate local `website/cae/assets/` into `media/cae/site/` and optionally rewire `page.html` / CSS away from GHL CDNs.
- Whether five-star / neon icons should stay “content” alt or be treated as decorative once the design system settles.
- Auth/roles for Storage writes (today’s posts RLS is “any authenticated”; tighten later with Media Library).
