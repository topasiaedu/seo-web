# Architecture overview

Multi-brand SEO monorepo: **one Astro app per brand** behind a **path gateway**, sharing one Supabase project. Git integration is **`main` + `staging`** (both apps always on the tree); see [monorepo branches](monorepo.md#git-branches-integration-model).

- **Local preview:** `@seo/gateway` (`:4321`) proxies `/cae` → `@seo/cae` (`:4322`) and `/dr-jasmine` → `@seo/dr-jasmine` (`:4323`). `/cms` remains “not migrated yet”.
- **CAE** (`apps/cae`) — **native ZWDS** homepage (Insights Blog soft bento; home SSR) + native `/media/`; **Admin** at `/cae/admin` and **public blog** at `/cae/blog` (server mode). Historical GHL scrapes stay in `seo-wiki-vault/raw/research/`; live public chrome is native (`components/home/*` + SiteHeader/SiteFooter).
- **Dr Jasmine** (`apps/dr-jasmine`) — native site (`/` + `/about` + `/reels` + `/blog` + `/admin`); home SSR pulls curated Reels teaser + latest Posts for Health Insights; **no** `/workshop` `/programs` `/faq` pages. GHL capture is archive only: `raw/research/dr-jasmine-ghl-capture/`.
- **Admin ≠ CMS** — brand Admins author that brand’s Posts only; shared `apps/cms` remains deferred ([cms](../sites/cms.md)).
- Legacy `website/` shell (site-pages integration + shared registry) has been **removed**.
- Shared data access via live `@seo/db` clients and `@seo/blog` CRUD ([db](../packages/db.md), [blog](../packages/blog.md)); public Posts are live-gated on `published_at`.

See also: [monorepo](monorepo.md), [routing-vercel](routing-vercel.md), [supabase](supabase.md).
