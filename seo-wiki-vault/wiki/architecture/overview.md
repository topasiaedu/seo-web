# Architecture overview

Multi-brand SEO monorepo: **one Astro app per brand** behind a **path gateway**, sharing one Supabase project.

- **Local preview:** `@seo/gateway` (`:4321`) proxies `/cae` → `@seo/cae` (`:4322`) and `/dr-jasmine` → `@seo/dr-jasmine` (`:4323`). `/cms` remains “not migrated yet”.
- **CAE** (`apps/cae`) — homepage (GHL lift + Insights Blog soft bento; home SSR) + `/media/` via **GHL section lift**; **Admin** at `/cae/admin` and **public blog** at `/cae/blog` (server mode). Vault scrapes stay in `seo-wiki-vault/raw/research/`.
- **Dr Jasmine** (`apps/dr-jasmine`) — single-home native site (`/` + `/blog` + `/admin`); home SSR pulls latest Posts for Health Insights teaser; no `/about` `/workshop` `/programs` `/faq` pages. GHL capture is archive only: `raw/research/dr-jasmine-ghl-capture/`.
- **Admin ≠ CMS** — brand Admins author that brand’s Posts only; shared `apps/cms` remains deferred ([cms](../sites/cms.md)).
- Legacy `website/` shell (site-pages integration + shared registry) has been **removed**.
- Shared data access via live `@seo/db` clients and `@seo/blog` CRUD ([db](../packages/db.md), [blog](../packages/blog.md)); public Posts are live-gated on `published_at`.

See also: [monorepo](monorepo.md), [routing-vercel](routing-vercel.md), [supabase](supabase.md).
