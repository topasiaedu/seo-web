# Site: CMS

| Field | Value |
|-------|--------|
| Code home | (not scaffolded — planned `apps/cms`) |
| Slug | `cms` |
| Project id | `00000000-0000-4000-8000-000000000099` (code identity; not in `seed.sql`) |
| Domains (planned) | `cms.localhost` |
| Role | **Future** shared blog authoring across all public brands |
| Status | **Deferred** — independent `@seo/cms` app not started |

## Admin vs CMS (do not conflate)

| Surface | Where | Scope | Status |
|---------|-------|-------|--------|
| **Admin** | Inside each brand app (e.g. `/cae/admin`, `/dr-jasmine/admin`) | That brand’s Posts / Author / Categories only | **Live for CAE and Dr Jasmine** — see [cae](cae.md) · [dr-jasmine](dr-jasmine.md) |
| **CMS** | Planned `apps/cms` | Cross-brand authoring + Media Library | **Deferred** |

Brand Admin is **not** the CMS. Do not scaffold `apps/cms` to “finish” blogging — that work already lives under each brand app.

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

Note: the **`media` Storage bucket and blog path convention are live** (used by CAE and Dr Jasmine Admin uploads). The Media Library **UI/table** remains deferred.

## Rules

- Posts always store a target `site_id`
- Prefer Auth + RLS; never put service role in the browser
- Future media rows always store a target `site_id` (+ `kind`: site | blog)
