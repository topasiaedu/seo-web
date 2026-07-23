# Glossary

| Term | Meaning |
|------|---------|
| **Brand app** | Independent Astro package under `apps/<slug>` (`@seo/<slug>`) with its own `base` and port. |
| **Gateway** | `apps/gateway` — local path front door that proxies `/cae` (and later other brands) to upstream apps. |
| **Site** | A brand or CMS surface — live apps under `apps/<slug>/`; deferred apps are not scaffolded yet. |
| **Site slug** | Stable string id in code and URLs (`cae`, `dr-jasmine`, `cms`). |
| **Project id / site_id** | UUID primary key in Supabase `sites.id`; all posts and queries key off this, not the slug alone. |
| **Post** | Blog article row in `posts`, always belonging to one `site_id`. |
| **CMS** | Planned authoring UI (`apps/cms`) for creating/editing posts across sites; not scaffolded yet. |
| **Media Library** | Deferred CMS UI (`/cms/media`) to upload images and edit `alt` / `title` per site. |
| **Media kind** | Planned enum on media rows: `site` (landing/brand) vs `blog` (covers/body). |
| **Storage path** | Planned Supabase path: `media/{site_slug}/site|blog/...` in one shared bucket. |
| **Host rewrite** | Planned production middleware maps `Host` → brand app (ADR 0001); not wired on Vercel yet. |
