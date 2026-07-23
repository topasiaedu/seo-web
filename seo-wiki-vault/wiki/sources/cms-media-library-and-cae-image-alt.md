# Source: CMS Media Library design + CAE image alt/title

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md](../../raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md) |
| Also in repo | `docs/future-enhancements/cms-media-library.md` |
| Ingested | 2026-07-23 |

## Takeaways

- Long-term images belong in **one** Supabase Storage bucket `media`, paths `/{site_slug}/site|blog/...` — not growing binary trees in Git.
- **Alt/title** are first-class media metadata (`media` table + CMS Media Library). Interim landing alt work originally landed on the GHL dump; **live CAE marketing pages** use local `apps/cae/src/assets/` (+ `assets/media/`) remapped from capture CDN URLs — see [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md).
- Media Library UI, Storage migration, and uploading site binaries to Supabase are **deferred**; design archived in repo docs.
- CAE remains the clone template: new sites add a `sites` row and use the same Storage path convention.

## Affects

- [sites/cae.md](../sites/cae.md) — GHL lift + local assets; Storage rewire still deferred
- [sites/cms.md](../sites/cms.md) — future `/cms/media` authoring surface
- [architecture/supabase.md](../architecture/supabase.md) — planned `media` table + Storage bucket (not migrated yet)
- [packages/blog.md](../packages/blog.md) — planned `MediaAsset` / cover image fields
- [overview.md](../overview.md) — Deferred media library clarified
- [sources/cae-ghl-section-lift-and-media-page.md](cae-ghl-section-lift-and-media-page.md) — current marketing runtime

## Open questions (from raw)

- When to migrate `apps/cae/src/assets/` (+ `assets/media/`) → Storage (paths in raw still said `website/cae/assets/` — outdated)
- Decorative vs content treatment for rating/neon icons
- Tighten Storage write RLS beyond “any authenticated”

## Stale raw paths

The inbox raw file still mentions `website/cae/ghl-clone/page.html` and GHL CDN `src` — those are **historical**. Do not treat them as current runtime; see [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md).
