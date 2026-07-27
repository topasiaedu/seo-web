# Source: CAE Admin PostForm authoring simplifications

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-27-cae-admin-postform-simplifications.md](../../raw/inbox/2026-07-27-cae-admin-postform-simplifications.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | [cae-blog-scheduled-publishing](cae-blog-scheduled-publishing.md) |

## Takeaways

- Admin Post create/edit drops redundant fields so editors type less and reuse existing values.
- **Slug** and **reading time** are preview-only (from Title / Body); no manual override.
- **Summary** is the UI label for stored `excerpt`; **Hero image description** labels `hero_image_alt`.
- One cover image only: hero upload/URL; **OG reuses hero** on save. Separate SEO title/description UI removed (public falls back to Title / Summary).
- **Related posts picker removed**; public “Continue reading” auto-shows up to 3 other **live** posts in the **same category**.
- **Tags** field is a typeahead over existing site tags (prefix then contains); still allows new tags.
- Publish select: **Draft / Published / Scheduled / Archived**. Published = go live now; Scheduled shows **Publish at** (future required). DB status unchanged — Scheduled remains `published` + future `published_at`.

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/components/admin/PostForm.tsx` | Publish intent + previews + save mapping |
| `apps/cae/src/components/admin/TagsInput.tsx` | Tag chips + search catalog |
| `apps/cae/src/components/blog/resolve-related.ts` | Same-category related (live only) |
| `apps/cae/src/pages/admin/posts/new.astro` · `…/[id]/edit.astro` | `existingTags` for typeahead |

Deleted: `RelatedPostsPicker.tsx`

## Affects

- [sites/cae.md](../sites/cae.md) — Admin PostForm UX + related auto
- [packages/blog.md](../packages/blog.md) — no API change; note Admin intent mapping
- [overview.md](../overview.md) — Admin authoring simplification
- [glossary.md](../glossary.md) — Summary / Publish intent terms

## Open questions / deferred (from raw)

1. Drop unused DB columns later (`seo_*`, `related_post_ids`, dedicated `og_image_url`) vs keep for compatibility
2. Dedicated tag catalog query if Post volume grows
3. Tune related-post limit (default 3)

## Does not change

- Lazy scheduling time-gate / RLS / Admin list Scheduled filter
- TipTap, FAQ, sources, categories, Author Admin
- Homepage Insights bento
