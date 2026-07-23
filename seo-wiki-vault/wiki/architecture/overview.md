# Architecture overview

Multi-brand SEO monorepo: **one Astro app per brand** behind a **path gateway**, sharing one Supabase project.

- **Local preview:** `@seo/gateway` (`:4321`) proxies `/cae` → `@seo/cae` (`:4322`).
- **CAE** is the first brand app (`apps/cae`) — homepage + `/media/` via **GHL section lift** (sanitized capture in-app); vault scrapes stay in `seo-wiki-vault/raw/research/`.
- **CMS / Dr Jasmine** are not scaffolded yet — when started, create `apps/dr-jasmine` and `apps/cms` ([deferred doc](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md)).
- Legacy `website/` shell (site-pages integration + shared registry) has been **removed**.
- Shared data access via `@seo/db` and `@seo/blog` only once those APIs land (placeholders today).

See also: [monorepo](monorepo.md), [routing-vercel](routing-vercel.md), [supabase](supabase.md).
