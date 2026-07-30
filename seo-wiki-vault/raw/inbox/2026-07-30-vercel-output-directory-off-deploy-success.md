# Session notes: Vercel dual-site deploy success (Output Directory off)

**Date:** 2026-07-30  
**Kind:** Chat / deploy verification  
**Related:** Vercel projects `seo-web-cae`, `seo-web-dr-jasmine`; GitHub `topasiaedu/seo-web`; prior raw `2026-07-30-vercel-dual-site-hosting-and-ssr.md`  
**Topic:** Confirmed working production deploys after correcting dashboard Build & Output settings; root URL vs Astro `base` path behavior.

---

## Outcome

Both brand projects now **deploy successfully** and serve the SSR apps when visited under their Astro `base` paths (not the bare domain root).

| Project | Preview host | Working public entry |
|---------|--------------|----------------------|
| `seo-web-cae` | `https://seo-web-cae.vercel.app` | **`/cae/`** |
| `seo-web-dr-jasmine` | `https://seo-web-dr-jasmine.vercel.app` (or project URL) | **`/dr-jasmine/`** |

Bare `/` on each Vercel host still 404s by design while Astro `base` remains `/cae/` or `/dr-jasmine/`.

---

## Locked dashboard settings (both projects)

| Setting | Value |
|---------|--------|
| Framework | Astro |
| Root Directory | `apps/cae` or `apps/dr-jasmine` |
| Include files outside of the Root Directory in the Build Step | **On** |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm --filter @seo/<slug> build` |
| **Output Directory** | **Off / empty** (do **not** set `dist`) |
| Production Git branch | `main` |

### Critical correction

Earlier guidance and leftover dashboard state used **Output Directory = `dist`**. That is correct only for a mistaken static publish of a Node/`dist` layout.

With `@astrojs/vercel` (`VERCEL=1` during build), the adapter writes **`.vercel/output`** (Build Output API: static + serverless). Leaving Output Directory = `dist` produced:

- Deployment status: **Success**
- Live responses: Vercel platform **`404 NOT_FOUND`** (`X-Vercel-Error: NOT_FOUND`) on `/`, `/cae/`, `/cae/media/`, etc.

Turning Output Directory **off** and redeploying fixed serving.

---

## Code posture (already on `main`)

- Conditional adapter in `apps/cae/astro.config.mjs` and `apps/dr-jasmine/astro.config.mjs`:
  - `VERCEL=1` → `@astrojs/vercel`
  - else → `@astrojs/node` standalone (local Windows / Node hosts)
- Per-app `apps/*/vercel.json`: install/build with monorepo root `cd ../..`
- Root `.npmrc`: `shamefully-hoist=true` for pnpm + NFT on Vercel
- Official Vercel Astro docs still show legacy `@astrojs/vercel/serverless`; Astro’s current import is `import vercel from "@astrojs/vercel"` (unified). Repo uses the unified import.

Commit of note: `0cea4a5` — conditional adapters + hoist + frozen lockfile installs.

---

## URL / SEO notes

- Preview and custom domains must open **`/cae/`** or **`/dr-jasmine/`** until host-based routing drops Astro `base` (deferred; ADR 0001 intent).
- Optional follow-ups (not done this session):
  1. Redirect `/` → `/cae/` (or `/dr-jasmine/`) per project via Astro `redirects` or Vercel routing once SSR is healthy.
  2. Custom domains `caegoh.com` / `doctorjasmine.com` pointed at the matching project.
  3. Git author access for `KWen-22` on the Vercel team (or disable author gate) so empty/auto deploys from that GitHub user are not blocked.

---

## Verification pattern

After settings change: **Redeploy with a new build** (not only “redeploy existing”). Then:

```text
GET https://seo-web-cae.vercel.app/cae/     → 200 (HTML)
GET https://seo-web-cae.vercel.app/         → 404 expected until root redirect
```

Same pattern for Dr Jasmine under `/dr-jasmine/`.

---

## Affects (for wiki ingest)

- `wiki/architecture/routing-vercel.md` — mark Output Directory off as confirmed working; close “deploy success + 404” open item
- `wiki/sites/cae.md` / `wiki/sites/dr-jasmine.md` — production host + adapter note
- `wiki/overview.md` — deploy line: dual projects live on Vercel SSR
- Prior open questions from dual-site hosting raw: Output Directory off — **resolved**

---

## Open questions

1. When to add `/` → base-path redirects on each Vercel project?
2. When to attach custom domains and drop path `base` for host-only URLs?
3. Is the Git author access gate for `KWen-22` resolved on the team?
