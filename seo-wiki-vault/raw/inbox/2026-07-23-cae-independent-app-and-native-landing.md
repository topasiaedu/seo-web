# Session notes: CAE independent Astro app + native landing + path gateway

**Date:** 2026-07-23  
**Kind:** Chat / multitask implementation session  
**Related repo docs:**
- `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md` (deferred)
- `docs/future-enhancements/cms-media-library.md` (unchanged this pass)
- Root `README.md`, `CONTEXT.md`  
**Topic:** Split monorepo so CAE is its own Astro project; rebuild homepage from GHL HTML dump into manageble Astro components; local path gateway for `/cae` preview.

---

## Decisions from session

1. **Monorepo root is a container, not “the website.”** Brands live under `apps/<slug>/`. Public paths are `/cae`, `/dr-jasmine`, `/cms` — never `/seo-website/...` in the URL.
2. **Architecture B — one Astro app per brand**, not a single shared Astro shell with `site-pages` mounts for CAE going forward. ADR 0003 superseded in spirit: path gateway + per-app packages.
3. **Env lives under each app** (`apps/cae/.env.local`), not the repo root. Root `.env.example` is a pointer only.
4. **Gateway listen port is not locked to 3000** (3000 was only an example). Default **4321** (or `PORT`). CAE Astro listens on **4322** with `base: "/cae/"`.
5. **CAE homepage must be native Astro** — own components, content modules, local assets, lean CSS. Stop serving dumped GHL `markup.html` / captured mega-stylesheets as the live page.
6. **Visual bar for v1 native landing:** same section order and messaging as the old funnel; maintainable CSS; pixel-perfect GHL parity not required.
7. **CTA URLs stay as editable data** for now (anchors, caegoh.com/media, predictabledestiny.com/now, social). No new form backend in this pass.
8. **Dr Jasmine and CMS independent apps are deferred** until superior accepts the CAE preview. Captured in `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md`. Do not scaffold `apps/dr-jasmine` or `apps/cms` yet.
9. **Legacy `website/` shell** keeps cms + dr-jasmine stubs only after CAE retirement. `website/cae/` removed.

---

## What shipped (code)

### Packages / apps

| Package | Path | Role |
|---------|------|------|
| `@seo/cae` | `apps/cae/` | CAE brand site — source of truth |
| `@seo/gateway` | `apps/gateway/` | Local path front door |
| `@seo/website` | `website/` | Legacy shell — cms stubs; dr-jasmine `enabled: false` |

### CAE app layout (independent project)

```text
apps/cae/
├── package.json              # @seo/cae
├── astro.config.mjs          # base: "/cae/", port 4322
├── .env.example / .env.local
└── src/
    ├── pages/index.astro     # HomeLayout + HomePage
    ├── pages/blog/...
    ├── layouts/HomeLayout.astro, BaseLayout.astro
    ├── components/HomePage.astro
    ├── components/home/      # section components
    ├── data/home/            # typed copy + images.ts (moved off content/ to avoid Astro collections)
    ├── assets/               # local images
    ├── scripts/testimonial-carousel.ts
    └── styles/tokens.css, global.css, home/*.css
```

### Homepage sections (native)

SiteHeader → Hero → PressMarquee → Offerings → Pillars → Platform → Testimonials → ConnectCta → SiteFooter.

Content: `src/data/home/*.ts`. Images: `src/assets/` + `data/home/images.ts` (includes downloaded `press-usanews.png`).

### Gateway

- Listen: `PORT || 4321`
- `/cae` → `http://127.0.0.1:4322`
- `/dr-jasmine`, `/cms` → “not migrated yet” (404-style message)

### Dev commands (repo root, pnpm)

```bash
pnpm install
pnpm dev          # gateway + CAE concurrently
# → http://127.0.0.1:4321/cae

pnpm dev:cae      # CAE only → http://127.0.0.1:4322/cae/
pnpm build:cae
```

No need to `cd apps/cae` or use npm for normal CAE preview.

---

## Multitask execution notes

Work was split for parallel sub-agents:

1. Gateway + workspace  
2a–2e. CAE scaffold / content / assets / sections top / sections bottom (parallel)  
2f. Integrate HomePage + build  
5. Merge: remove `website/cae`, root scripts/env/README, wiki/ADR  

Dr Jasmine / CMS tasks were removed from the active plan and filed under future-enhancements.

---

## Known gaps / open questions

1. **Deploy:** `vercel.json` still builds `@seo/website` only — CAE (`apps/cae`) is not that output yet. Documented gap.
2. **Visual:** some assets not fully wired in sections (pillar icons, ctaVisual, featuredDivider, testimonial4); stars may be Unicode glyphs; not pixel-matched to GHL.
3. **Preview gate:** share `/cae` with superior; only then execute `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md`.
4. **Historical paths in older wiki/raw notes** may still mention `website/cae/ghl-clone/` — superseded by `apps/cae` + vault `raw/research/cae-ghl-capture/`.

---

## Related vault / archive

- GHL scrape archive (immutable): `raw/research/cae-ghl-capture/`
- Prior interim alt notes: `raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md` (paths outdated for live CAE)
