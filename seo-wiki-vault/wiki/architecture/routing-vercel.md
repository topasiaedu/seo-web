# Routing on Vercel / local gateway

## Intent (target)

- Path gateway in front of one Astro app per brand
- Prefer **host-based** branding over path prefixes for public SEO in production
- Independent apps: CAE + Dr Jasmine live; CMS deferred

## Local preview (current)

1. **`@seo/gateway`** listens on **4321** (`0.0.0.0`).
2. Proxies `/cae` → `http://127.0.0.1:4322` (`@seo/cae`, Astro `base: "/cae/"`).
3. Proxies `/dr-jasmine` → `http://127.0.0.1:4323` (`@seo/dr-jasmine`, Astro `base: "/dr-jasmine/"`).
4. `/cms` on the gateway returns **not migrated yet** (`DEFERRED_PATH_PREFIXES = ["/cms"]`).
5. Root `pnpm dev` starts gateway + CAE + Dr Jasmine concurrently.

## Deploy branches (current)

- Prefer Git production branch **`main`** and pre-prod **`staging`** (full monorepo on both).
- Do **not** deploy from retired brand-only tips (`cae` / `dr-jasmine` content branches). Point each Vercel project at `main` or `staging` and set root / filter to `apps/cae` or `apps/dr-jasmine` as needed.
- Branch model source: [monorepo-main-staging-branch-model](../sources/monorepo-main-staging-branch-model.md).

## Vercel projects (current)

Two projects, one GitHub repo (`topasiaedu/seo-web`):

| Project | Root Directory | Install / Build | Domain (target) |
|---------|----------------|-----------------|-----------------|
| `seo-web-cae` | `apps/cae` | `cd ../.. && pnpm install --frozen-lockfile` / `pnpm --filter @seo/cae build` | `caegoh.com` |
| `seo-web-dr-jasmine` | `apps/dr-jasmine` | same pattern for `@seo/dr-jasmine` | `doctorjasmine.com` |

Required dashboard flags (**confirmed working 2026-07-30**):

- **Include files outside of the Root Directory in the Build Step:** On
- **Output Directory override:** Off (empty) — `@astrojs/vercel` writes `.vercel/output`
- Production Git branch: `main`

**Do not** set Output Directory to `dist`. That setting caused Success deploys with platform `404 NOT_FOUND` on `/`, `/cae/`, and even prerendered `/cae/media/`. Fix: turn override Off and Redeploy (new build). Source: [vercel-output-directory-off-deploy-success](../sources/vercel-output-directory-off-deploy-success.md).

Adapter selection in each app `astro.config.mjs`:

- `VERCEL=1` → `@astrojs/vercel`
- otherwise → `@astrojs/node` standalone (local Windows / Node hosts)

**Astro `base` is environment-conditional** (same flag as the adapter):

| Host | `VERCEL=1` | Astro `base` | Why |
|------|------------|--------------|-----|
| Vercel project per brand | Yes | `/` | Build Output API serves routes + `/_astro/*` at host root; prefixed asset URLs 404 |
| Local gateway / Node | No | `/cae/` or `/dr-jasmine/` | Gateway proxies path prefixes to each app port |

Do **not** keep a fixed `/cae/` or `/dr-jasmine/` `base` on dedicated Vercel projects — HTML will link `/cae/_astro/...` while files live at `/_astro/...` (unstyled page + broken images).

Gateway stays local-preview only. Custom domains (`caegoh.com`, `doctorjasmine.com`) use the same apex `/` base once pointed at each project.

Preview entries after a healthy deploy:

- CAE: `https://seo-web-cae.vercel.app/` (not `/cae/`)
- Dr Jasmine: project URL at `/` (not `/dr-jasmine/`)

### Known deploy blockers (human / dashboard)

1. Git author must have Vercel project access (team rule) — commits from `KWen-22` were blocked until invited or gate disabled. **Status:** confirm with team whether resolved.
2. Mixed Root Directory / Build Command across brands (e.g. Root=`apps/dr-jasmine` but build `@seo/cae`) fails output detection.
3. Leaving Output Directory=`dist` after the SSR adapter switch breaks Build Output API detection. **Resolved** when override is Off ([source](../sources/vercel-output-directory-off-deploy-success.md)).

Source notes: [vercel-dual-site-hosting-and-ssr](../../raw/inbox/2026-07-30-vercel-dual-site-hosting-and-ssr.md) · [output-directory-off success](../sources/vercel-output-directory-off-deploy-success.md).

## Root `vercel.json`

Still points at CAE for any project linked at repo root. Prefer per-app `apps/cae/vercel.json` and `apps/dr-jasmine/vercel.json` with Root Directory set to each app.

## Key files

- `apps/gateway/src/` — path proxy (`/cae`, `/dr-jasmine`; deferred `/cms`)
- `apps/cae/astro.config.mjs` — `base: "/cae/"`, port 4322, conditional Vercel/Node adapter
- `apps/dr-jasmine/astro.config.mjs` — `base: "/dr-jasmine/"`, port 4323, conditional Vercel/Node adapter
- `apps/cae/vercel.json` / `apps/dr-jasmine/vercel.json`
- `vercel.json` (root fallback for CAE-linked projects)
- `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md` (CMS only)
- `docs/implementation-plan/dr-jasmine-landing-and-admin.md`
- `docs/implementation-plan/dr-jasmine-true-website.md`
