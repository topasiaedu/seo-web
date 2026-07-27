# Architecture overview

Multi-brand SEO monorepo: **one Astro app per brand** behind a **path gateway**, sharing one Supabase project.

- **Local preview:** `@seo/gateway` (`:4321`) proxies `/cae` → `@seo/cae` (`:4322`).
- **CAE** is the first brand app (`apps/cae`) — homepage (GHL lift + Insights Blog soft bento; home SSR) + `/media/` via **GHL section lift**; **Admin** at `/cae/admin` and **public blog** at `/cae/blog` (server mode). Vault scrapes stay in `seo-wiki-vault/raw/research/`.
- **Admin ≠ CMS** — CAE Admin authors CAE Posts only; shared `apps/cms` remains deferred ([cms](../sites/cms.md)).
- **CMS / Dr Jasmine** are not scaffolded yet — when started, create `apps/dr-jasmine` and `apps/cms` ([deferred doc](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md)).
- Legacy `website/` shell (site-pages integration + shared registry) has been **removed**.
- Shared data access via live `@seo/db` clients and `@seo/blog` CRUD ([db](../packages/db.md), [blog](../packages/blog.md)); public Posts are live-gated on `published_at`.

See also: [monorepo](monorepo.md), [routing-vercel](routing-vercel.md), [supabase](supabase.md).
