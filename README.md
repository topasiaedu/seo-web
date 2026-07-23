# SEO Website

Multi-brand SEO monorepo (pnpm workspaces). One Astro app per brand under `apps/`.

## Local preview (CAE)

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts **gateway** (`:4321`) and **CAE** (`:4322`) together. Open [http://127.0.0.1:4321/cae](http://127.0.0.1:4321/cae).

| Script | What it runs |
|--------|----------------|
| `pnpm dev` | `@seo/gateway` + `@seo/cae` (concurrent) |
| `pnpm dev:gateway` | Gateway only |
| `pnpm dev:cae` | CAE Astro app only |
| `pnpm build` / `pnpm build:cae` | `pnpm --filter @seo/cae build` |
| `pnpm preview` | Preview the CAE static build |

## Env

- **CAE:** copy `apps/cae/.env.example` → `apps/cae/.env.local`
- **Gateway (optional):** `apps/gateway/.env.example` for non-default `PORT`
- Root `.env.example` is a pointer only — no brand secrets at repo root

## Layout

| Path | Package | Role |
|------|---------|------|
| `apps/cae` | `@seo/cae` | CAE brand site (source of truth) |
| `apps/gateway` | `@seo/gateway` | Path front door for local preview |
| `packages/*` | shared | `@seo/db`, `@seo/blog`, tsconfig |
| `seo-wiki-vault/` | — | Project knowledge wiki |

Dr Jasmine and CMS as independent apps are **deferred**: [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md). When started, scaffold them under `apps/` (same pattern as CAE) — there is no legacy `website/` shell.

## Deploy

Root `vercel.json` builds `@seo/cae` → `apps/cae/dist`. The app uses Astro `base: "/cae/"`, so the live site is served under `/cae/`.
