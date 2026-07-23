# Package: @seo/blog

Path: `packages/blog`

## Current exports

| Export | Role |
|--------|------|
| `PostStatus` | `"draft" \| "published" \| "archived"` |
| `BlogPost` | Public post shape (`id`, `siteId`, `slug`, `title`, …) |
| `blogPackageName` | Placeholder `"@seo/blog"` |

No query helpers yet. Depends on `@seo/db`.

## Planned

- `listPublishedPosts(siteId)`
- `getPublishedPost(siteId, slug)`
- CMS upsert / list helpers
- `MediaKind` / `MediaAsset` types (when Media Library ships)
- Optional `coverImage` / `coverImageId` on `BlogPost`

Should hide status filters, pagination, and markdown details behind a small interface.

Media design: [cms-media-library-and-cae-image-alt](../sources/cms-media-library-and-cae-image-alt.md)
