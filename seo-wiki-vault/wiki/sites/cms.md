# Site: CMS

| Field | Value |
|-------|--------|
| Code home | (not scaffolded — planned `apps/cms`) |
| Slug | `cms` |
| Project id | `00000000-0000-4000-8000-000000000099` (code identity; not in `seed.sql`) |
| Domains (planned) | `cms.localhost` |
| Role | Blog authoring for all public sites |
| Status | **Deferred** — independent `@seo/cms` app not started |

## Independent app (deferred)

Do not scaffold `apps/cms` yet. Follow-on plan: [independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

The legacy `website/cms/` stubs were removed with the `website/` shell. Rebuild pages under `apps/cms` when unblocked.

## Planned pages

| Route | Purpose |
|-------|---------|
| `/cms` | Home links |
| `/cms/login` | Supabase Auth form |
| `/cms/posts` | List/create/edit by `site_id` |
| `/cms/media` | Media Library (upload, alt/title edit, copy URL) |

## Media Library (deferred)

Agreed design (not built): site + kind filters, upload into Supabase Storage `media/{slug}/site|blog/...`, side panel for `alt_text` / `title`.

- Repo design doc: `docs/future-enhancements/cms-media-library.md`
- Wiki source: [cms-media-library-and-cae-image-alt](../sources/cms-media-library-and-cae-image-alt.md)

## Rules

- Posts always store a target `site_id`
- Prefer Auth + RLS; never put service role in the browser
- Future media rows always store a target `site_id` (+ `kind`: site | blog)
