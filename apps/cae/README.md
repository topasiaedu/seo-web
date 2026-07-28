# @seo/cae

Independent Astro app for the **CAE** brand site.

| Field | Value |
|-------|--------|
| Package | `@seo/cae` |
| Slug | `cae` |
| Project id | `00000000-0000-4000-8000-000000000001` |
| Astro `base` | `/cae/` |
| Dev port | `4322` |
| Domains (config) | `cae.localhost`, `www.cae.localhost` |

## Scripts

```bash
pnpm --filter @seo/cae dev
pnpm --filter @seo/cae build
pnpm --filter @seo/cae preview
```

Gateway (Task 1) proxies `http://localhost:4321/cae` → this app on port 4322.

## Env

Copy `.env.example` to `.env.local` and fill Supabase keys. Brand secrets live **only** under this app (not at the repo root).

## Layout

- `src/pages/` — routes (`index`, `media`, `blog`, `blog/[slug]`)
- `src/layouts/` — `HomeLayout`, `MediaLayout`, `BaseLayout`
- `src/components/HomePage.astro` + `src/components/ghl/` — marketing pages (GHL section lift)
- `src/components/home/` — parked native BEM rewrite (unwired)
- `src/styles/ghl/` — sanitized capture CSS + host patches
- `src/data/home/` — typed helpers (image map / meta; much of native copy parked)
- `src/assets/` · `src/assets/media/` — local images
- `src/site-config.ts` — brand identity (`caeSiteConfig`)

This app is the **source of truth** for CAE. The legacy `website/` shell (including `website/cae/`) has been removed. Vault scrapes stay in `seo-wiki-vault/raw/research/cae-ghl-capture*`.

## Brand theme

Public site is **dark-first**, aligned to nm-zwds. Tokens live in `src/styles/tokens.css` + `src/styles/brand-gradient.css`; Admin in `src/styles/admin-theme.css`; GHL home/media via `src/styles/ghl/host-patch.css` / `bg-overrides.css`. See [`CONTEXT.md`](./CONTEXT.md#brand-theme), the [nm-zwds color reference](../../docs/references/nm-zwds-design-theme-color-scheme.md), and the [alignment plan](../../docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md). Do not reintroduce `#9461A3` / `#100022` as new sources of truth — use tokens.
