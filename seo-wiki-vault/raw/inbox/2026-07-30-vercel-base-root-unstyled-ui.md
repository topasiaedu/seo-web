# Session notes: Vercel unstyled UI → env-conditional Astro `base: "/"`

**Date:** 2026-07-30  
**Kind:** Chat / deploy diagnosis + code fix  
**Related:** Vercel projects `seo-web-cae`, `seo-web-dr-jasmine`; GitHub `topasiaedu/seo-web`; prior raw `2026-07-30-vercel-output-directory-off-deploy-success.md`  
**Topic:** Live HTML rendered but CSS/images broken; root cause was Astro `base` path prefix vs dedicated Vercel host root; fixed with `VERCEL=1` → `base: "/"`.

---

## Symptom

After Output Directory was turned **Off** and deploys reported Success, [https://seo-web-cae.vercel.app/](https://seo-web-cae.vercel.app/) showed:

- Full homepage HTML (nav labels, hero copy, Insights, etc.)
- **No stylesheet layout** (default browser typography, stacked unstyled chrome)
- Broken `<img>` for logo / press logos / photos
- Some assets still visible: inline SVG `data:` URIs (e.g. AP press logo) and Google Fonts

Looks like “UI did not match what we developed,” but the design code was fine — production asset URLs 404’d.

---

## Live evidence (diagnosis)

| URL | HTTP |
|-----|------|
| `https://seo-web-cae.vercel.app/` | **200** HTML |
| `https://seo-web-cae.vercel.app/blog/` | **200** |
| `https://seo-web-cae.vercel.app/cae/` | **404** `NOT_FOUND` |
| `https://seo-web-cae.vercel.app/cae/_astro/*.css` / `*.png` | **404** |
| `https://seo-web-cae.vercel.app/_astro/*.css` | **200** |

HTML emitted by Astro linked styles/images as `/cae/_astro/...` because `astro.config.mjs` had fixed `base: "/cae/"`.  
`@astrojs/vercel` Build Output API on a **dedicated** brand project serves routes and static files at the **host root** (`/`, `/_astro/...`), not under `/cae/`.

Same pattern applies to Dr Jasmine (`base: "/dr-jasmine/"` vs project root).

---

## Why both brands in one monorepo is still fine

| Layer | CAE | Dr Jasmine |
|-------|-----|------------|
| Code | `apps/cae` | `apps/dr-jasmine` |
| Vercel project | `seo-web-cae` | `seo-web-dr-jasmine` |
| Local gateway | `/cae/` → `:4322` | `/dr-jasmine/` → `:4323` |
| Dedicated Vercel host | should be `/` | should be `/` |

One repo → two apps → two hosts. Path prefixes are for **local gateway** only, not for per-brand Vercel projects.

---

## Fix (shipped)

Commit: **`538a722`** on `main` — `fix(deploy): use Astro base / on Vercel for CAE and Dr Jasmine.`

In `apps/cae/astro.config.mjs` and `apps/dr-jasmine/astro.config.mjs` (same flag as the adapter):

```js
const useVercelAdapter = process.env.VERCEL === "1";
const basePath = useVercelAdapter ? "/" : "/cae/"; // or "/dr-jasmine/"
```

Also: `apps/dr-jasmine/src/data/seo/urls.ts` — `buildSitemapCustomPages` default base → `import.meta.env.BASE_URL` (no hardcoded `/dr-jasmine/`).

### Checks before push

- `pnpm --filter @seo/cae typecheck` — pass  
- `pnpm --filter @seo/dr-jasmine typecheck` — pass  
- Local `astro build` both apps — pass (`@astrojs/node`)  
- `VERCEL=1` config eval → `base: "/"` for both apps  

### After redeploy

Open **host root**, not the old prefixes:

- CAE: `https://seo-web-cae.vercel.app/`
- Dr Jasmine: project URL at `/`

Expect CSS/images at `/_astro/...` to 200. Local `pnpm dev` + gateway still uses `/cae/` and `/dr-jasmine/`.

---

## Relation to prior “Output Directory off” note

Prior raw claimed working entries were `/cae/` and `/dr-jasmine/` with bare `/` 404. That matched fixed path `base` **intent**, but after Output Directory Off the **actual** Vercel routing served SSR HTML at `/` while assets under `/cae/_astro/` 404’d — hence unstyled UI.

This session **supersedes URL guidance**: dedicated Vercel hosts use `base: "/"`. Prior note remains valid for **Output Directory must stay Off**.

---

## Affects (for wiki ingest)

- New `wiki/sources/vercel-base-root-unstyled-ui.md` (this note)
- `wiki/architecture/routing-vercel.md` — cite this source; key files note conditional base
- `wiki/sites/cae.md` / `wiki/sites/dr-jasmine.md` — already env-conditional base; link source
- `wiki/overview.md` — cite this source next to deploy line
- Prior source `vercel-output-directory-off-deploy-success` — point follow-up here

---

## Open questions

1. Custom domains `caegoh.com` / `doctorjasmine.com` pointed at matching projects (apex `/` already matches Vercel base).
2. Git author access for `KWen-22` on the Vercel team — confirm status.
3. Optional: redirects from legacy `/cae/*` or `/dr-jasmine/*` preview bookmarks → host-root paths (only if anyone bookmarked the old prefixes).
