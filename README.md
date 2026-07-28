# SEO Website

Multi-brand SEO monorepo (pnpm workspaces). One Astro app per brand under `apps/`.

## Local preview

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts **gateway** (`:4321`), **CAE** (`:4322`), and **Dr Jasmine** (`:4323`) together. Open:

- [http://127.0.0.1:4321/cae](http://127.0.0.1:4321/cae)
- [http://127.0.0.1:4321/dr-jasmine](http://127.0.0.1:4321/dr-jasmine)

| Script | What it runs |
|--------|----------------|
| `pnpm dev` | `@seo/gateway` + `@seo/cae` + `@seo/dr-jasmine` (concurrent) |
| `pnpm dev:gateway` | Gateway only |
| `pnpm dev:cae` | CAE Astro app only |
| `pnpm dev:dr-jasmine` | Dr Jasmine Astro app only |
| `pnpm build` / `pnpm build:cae` | `pnpm --filter @seo/cae build` |
| `pnpm build:dr-jasmine` | `pnpm --filter @seo/dr-jasmine build` |
| `pnpm preview` | Preview the CAE static build |

## Env

- **CAE:** copy `apps/cae/.env.example` → `apps/cae/.env.local`
- **Dr Jasmine:** copy `apps/dr-jasmine/.env.example` → `apps/dr-jasmine/.env.local`
- **Gateway (optional):** `apps/gateway/.env.example` for non-default `PORT`
- Root `.env.example` is a pointer only — no brand secrets at repo root

## Layout

| Path | Package | Role |
|------|---------|------|
| `apps/cae` | `@seo/cae` | CAE brand site |
| `apps/dr-jasmine` | `@seo/dr-jasmine` | Dr Jasmine brand site (Option A marketing + Admin + blog) |
| `apps/gateway` | `@seo/gateway` | Path front door for local preview |
| `packages/*` | shared | `@seo/db`, `@seo/blog`, tsconfig |
| `seo-wiki-vault/` | — | Project knowledge wiki |

**CMS** as an independent app remains **deferred**: [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md). Dr Jasmine Workstream A in that doc is superseded by [docs/implementation-plan/dr-jasmine-landing-and-admin.md](docs/implementation-plan/dr-jasmine-landing-and-admin.md) and [docs/implementation-plan/dr-jasmine-true-website.md](docs/implementation-plan/dr-jasmine-true-website.md). There is no legacy `website/` shell.

## Deploy

Root `vercel.json` builds `@seo/cae` → `apps/cae/dist`. The app uses Astro `base: "/cae/"`, so the live site is served under `/cae/`. Build Dr Jasmine with `pnpm build:dr-jasmine` (production host wiring separate).
