# Package: @seo/blog

Path: `packages/blog`

Site-scoped blog domain: types + Supabase query helpers. Callers pass a client from `@seo/db`.

## Current exports

### Types

| Export | Role |
|--------|------|
| `PostStatus` | `"draft" \| "published" \| "archived"` |
| `BlogPost`, `Author`, `Category` | Domain shapes |
| `FaqItem`, `SourceItem` | JSON field item types |
| `CreatePostInput`, `UpdatePostInput`, `ListPostsOptions` | Admin write / filter inputs |
| `CreateCategoryInput`, `UpsertAuthorInput` | Author / category inputs |
| `BlogSupabaseClient`, `Database` | Client typing |

### Public queries

Public helpers return **live** posts only: `status = published`, non-null `published_at`, and `published_at <= now()` (lazy time-gate; no cron). Admin **Scheduled** is a computed label for `published` + future `published_at`, not a `PostStatus`. CAE Admin maps UI intent **Published** (go live now) / **Scheduled** (future Publish at) onto that stored shape — see [cae-admin-postform-simplifications](../sources/cae-admin-postform-simplifications.md). The same mapping is used by **Bulk import** (`createPost` / `createCategory` from parsed Markdown) — see [cae-admin-bulk-import](../sources/cae-admin-bulk-import.md).

| Export | Role |
|--------|------|
| `listPublishedPosts(client, siteId)` | Live posts for a site |
| `listPublishedPostsPage(client, siteId, options?)` | Paginated live posts (+ category filter); count and page queries both time-gated |
| `getPublishedPostBySlug(client, siteId, slug)` | Single live post |
| `isPostLive` / `isPostScheduled` | Visibility helpers (Scheduled = computed, not a DB status) |

### Admin queries

| Export | Role |
|--------|------|
| `listPosts` / `getPostById` / `createPost` / `updatePost` / `deletePost` | Full CRUD (auth session required) |
| `getAuthorForSite` / `upsertAuthorForSite` | One Author per `site_id` |
| `listCategories` / `createCategory` / `renameCategory` | Site-scoped categories |

### Helpers

| Export | Role |
|--------|------|
| `readingTimeMinutesFromMarkdown(md)` | ~200 wpm estimate |
| `blogPackageName` | `"@seo/blog"` constant |

## Consumers

- **CAE public blog** — `apps/cae/src/pages/blog/*` + `components/blog/*` (slug = Immersive Story; see [cae-blog-immersive-story-redesign](../sources/cae-blog-immersive-story-redesign.md))
- **CAE Admin** — `apps/cae/src/pages/admin/*` + `components/admin/*`

Always filter by `site_id`. CAE hardcodes its project id from `site-config.ts`.

## Deferred

- `MediaKind` / `MediaAsset` types (when Media Library ships)
- Featured post helpers (see `docs/future-enhancements/featured-posts.md`)

Scheduled publishing: **implemented** via lazy time-gate — [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md) · [scheduled-publishing.md](../../../docs/future-enhancements/scheduled-publishing.md) · plan [cae-blog-scheduling.md](../../../docs/implementation-plan/cae-blog-scheduling.md)

Schema: [supabase](../architecture/supabase.md) · Media design: [cms-media-library-and-cae-image-alt](../sources/cms-media-library-and-cae-image-alt.md)
