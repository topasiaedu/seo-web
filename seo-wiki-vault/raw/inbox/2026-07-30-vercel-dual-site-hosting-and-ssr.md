# Session notes: Vercel dual-site hosting + SSR 404 fix

**Date:** 2026-07-30 (session spanned 2026-07-29 → 2026-07-30)  
**Kind:** Chat / deploy topology + Vercel config + adapter change  
**Related:** Remote `https://github.com/topasiaedu/seo-web.git`; apps `@seo/cae`, `@seo/dr-jasmine`; Vercel projects `seo-web-cae`, `seo-web-dr-jasmine`  
**Topic:** How to host CAE and Dr Jasmine as two Vercel projects from one monorepo; why static `dist` deploys 404; switch to `@astrojs/vercel`; Git-author access gate on auto-deploy.

---

## Intent

1. Teach hosting **two brand sites** on Vercel from the same Git repo.
2. Fix CAE/DJ production deploys that “succeeded” but returned **404: NOT_FOUND**.
3. Understand why empty commits from GitHub user **`KWen-22`** were blocked (“Git author must have access to the project on Vercel”) even though other repos auto-deploy without a Vercel login.

---

## Topology (locked recommendation)

**Two Vercel projects, one GitHub repo** (`topasiaedu/seo-web`). Local gateway (`@seo/gateway` on `:4321`) stays **local-preview only** — not the Vercel front door.

| Vercel project | Root Directory | Build filter | Domain (target) | Astro `base` |
|----------------|----------------|--------------|-----------------|--------------|
| CAE (`seo-web-cae`) | `apps/cae` | `pnpm --filter @seo/cae build` | `caegoh.com` | `/cae/` |
| Dr Jasmine (`seo-web-dr-jasmine`) | `apps/dr-jasmine` | `pnpm --filter @seo/dr-jasmine build` | `doctorjasmine.com` | `/dr-jasmine/` |

Both projects:

- Production Git branch: **`main`** (pre-prod: `staging` if used)
- **Include files outside the root directory in the Build Step:** On (pnpm workspace)
- Install: `cd ../.. && pnpm install`
- Build: `cd ../.. && pnpm --filter @seo/<slug> build`

Do **not** mix brands on one project (e.g. Root Directory `apps/dr-jasmine` + build `@seo/cae` — observed misconfig in session).

---

## Failures observed

### 1. Missing Output Directory `"dist"`

- Build log showed Astro completing (`dist/client/_astro/...`, “Server built”, “Complete!”).
- Vercel then: **No Output Directory named "dist" found**.
- Cause: **Root Directory vs Output Directory mismatch**.
  - With Root Directory = `apps/cae`, Output must be **`dist`** (relative), not `apps/cae/dist`.
  - With Root Directory = repo root, Output must be **`apps/cae/dist`**, not bare `dist`.
- Dashboard override of Output Directory can win over / conflict with `vercel.json`.

### 2. Deploy “success” then 404 on site URL

- Root cause: apps used **`output: "server"` + `@astrojs/node` (standalone)**.
- Vercel with Output Directory = `dist` only publishes a **static** folder; it does **not** run `node dist/server/entry.mjs`.
- Home / blog / admin are SSR (`prerender = false`) → no root `index.html` in static publish → **404: NOT_FOUND**.
- Secondary: Astro `base` means public URLs are **`/cae/`** and **`/dr-jasmine/`**, not bare `/`.

### 3. Git author blocked auto-deploy

- Empty commits `4c11567`, later `215db93` (and prior) authored as **`KWen-22`**.
- Checks failed: *“Git author KWen-22 must have access to the project on Vercel to create deployments”* / “Deployment was blocked”.
- **Not** because the GitHub repo is private. Private vs public only gates clone access.
- This is an **optional Vercel team/project rule**: commit author must be on the Vercel team.
- Other projects the developer uses may omit that rule → push → webhook → build without any Vercel account. Mental model “I’m a GitHub collaborator; Vercel just builds” is correct for those; **this** team has the stricter gate on.

---

## Code changes shipped (repo)

| Item | Detail |
|------|--------|
| Adapter | Both apps: `@astrojs/node` → **`@astrojs/vercel@8.x`** (Astro 5 peer; do **not** use adapter v11 which wants Astro 7) |
| Config | `apps/cae/astro.config.mjs`, `apps/dr-jasmine/astro.config.mjs` — `adapter: vercel()` |
| Per-app `vercel.json` | `apps/cae/vercel.json`, `apps/dr-jasmine/vercel.json` — install/build with `cd ../.. && pnpm …`; **no** `outputDirectory` |
| Root `vercel.json` | Removed `outputDirectory: "apps/cae/dist"`; still points CAE build command for root-linked projects |
| Commits | `43cc81d` adapter switch; empty rebuild triggers `4c11567`, `215db93` |

Local Windows build may hit `EPERM` on symlink when packing `.vercel/output` — Vercel Linux builders are fine; don’t treat local EPERM as “adapter broken.”

---

## Dashboard checklist (after adapter)

For **each** project:

1. Root Directory = `apps/cae` or `apps/dr-jasmine`
2. Include files outside root = **On**
3. Install / Build overrides as in topology table above
4. **Output Directory override = OFF** (empty) — `@astrojs/vercel` writes `.vercel/output`; Vercel auto-detects
5. Env: Supabase keys + `PUBLIC_SITE_ORIGIN` per brand
6. After deploy, open **`/cae/`** or **`/dr-jasmine/`**, not `/`

---

## Access / process notes (human)

1. Invite GitHub user **`KWen-22`** to the Vercel team **or** disable “Git author must have access…” **or** Redeploy from owner dashboard.
2. Until that gate is fixed, empty commits from `KWen-22` will push to GitHub but **not** create Vercel deployments.
3. Host-based branding (apex `/` on each custom domain, drop path `base`) remains **deferred** — see ADR / routing wiki intent.

---

## Affects (for wiki ingest)

- `wiki/architecture/routing-vercel.md` — two-project topology; SSR adapter; dashboard Output Directory
- `wiki/sites/cae.md` / `wiki/sites/dr-jasmine.md` — production host notes
- `wiki/overview.md` / `CONTEXT.md` deploy note — retire “static dist only” assumption for CAE
- Open: Git author access policy; custom domains live; host-based routing

---

## Open questions

1. Has Output Directory override been turned **off** on both Vercel projects after `43cc81d`?
2. Will team invite `KWen-22` or disable the author-access gate?
3. When to drop Astro `base` `/cae/` and `/dr-jasmine/` for host-only URLs on production domains?
)
