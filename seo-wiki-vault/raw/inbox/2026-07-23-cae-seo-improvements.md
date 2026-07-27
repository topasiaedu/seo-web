# Session notes: CAE website SEO improvements

**Date:** 2026-07-23  
**Kind:** Chat / implementation session  
**Related:**
- Runtime app: `apps/cae/` (`@seo/cae`, `base: "/cae/"`)
- Live brand origin (SEO default): `https://caegoh.com`
- Prior session (marketing runtime): `raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md`
- Related design (future alt via CMS): `docs/future-enhancements/cms-media-library.md`, `raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md`
- Plan (Cursor): `cae_seo_improvements` — UI-safe SEO for GHL-lifted home + media  
**Topic:** Harden crawl/share/a11y metadata on CAE marketing pages **without** changing GHL lift layout or visual design.

---

## Decisions from session

1. **UI safety is non-negotiable.** SEO work must not rewire `HomePage` to parked `components/home/*`, edit GHL section CSS for styling, change class/ID/section order, or replace `<img>` with Astro `<Image>` inside fragments.
2. **Remapper-only DOM mutations.** Live HTML is GHL fragments via `set:html`. Attribute patches + heading tag renames go through `remapHtml` / `remapMediaHtml` (+ shared `seoHtmlPass`) so re-lifts stay patchable.
3. **Production SEO origin default:** `https://caegoh.com` via `PUBLIC_SITE_ORIGIN` (overrideable). Compose with Astro `base: "/cae/"` until an apex cutover (`base: "/"`).
4. **One `<h1>` per page.** Fragments remap independently, so policy is section-aware:
   - Primary sections keep first h1: homepage hero `section-GdS5u8Huz`, media articles `section-D3OvNABS8F`
   - All other fragments demote every `<h1>` → `<h2>` (tag rename only; classes untouched)
5. **Heading demotion is UI-safe here:** in `ghl-page.css` / `media-page.css`, every `h1` rule also targets `h2`. Typography is class-driven (`.heading-*`, `.cheading-*`). Belt-and-suspenders UA margin equalizer added in `host-patch.css`.
6. **Blog scaffold excluded from sitemap** until Supabase posts exist.
7. **Out of scope this pass:** native BEM rewire, blog SEO, font self-hosting, `<main>` landmarks, asset recompression, Storage/CMS media library.

---

## What shipped (code)

### Document head + site identity

| Path | Role |
|------|------|
| `apps/cae/src/components/seo/SeoHead.astro` | Shared description, robots, canonical, OG, Twitter, favicon, optional JSON-LD |
| `apps/cae/src/layouts/HomeLayout.astro` | Wires `SeoHead` + home JSON-LD |
| `apps/cae/src/layouts/MediaLayout.astro` | Wires `SeoHead` + media JSON-LD |
| `apps/cae/src/layouts/BaseLayout.astro` | Blog/other pages get same head basics (no JSON-LD graph yet) |
| `apps/cae/src/data/home/meta.ts` | `homeMeta` + `mediaMeta` (+ `requireMetaString`) |
| `apps/cae/src/data/home/jsonld.ts` | `buildHomeJsonLd` (Organization / Person / WebSite), `buildMediaJsonLd` (CollectionPage) |
| `apps/cae/src/lib/site-url.ts` | `getSiteOrigin`, `toAbsoluteUrl`, `toCanonicalUrl`, `normalizeBase` |
| `apps/cae/src/site-config.ts` | Domains list includes `caegoh.com` / `www.caegoh.com` for identity notes |
| `apps/cae/.env.example` · `.env.local` | `PUBLIC_SITE_ORIGIN=https://caegoh.com` |
| `apps/cae/src/env.d.ts` | Types for `PUBLIC_SITE_ORIGIN` |

### Sitemap + robots

| Path | Role |
|------|------|
| `apps/cae/astro.config.mjs` | `site` from env (default caegoh.com); `@astrojs/sitemap` with `filter` excluding `/blog` |
| `apps/cae/public/robots.txt` | `Allow: /`; `Sitemap: https://caegoh.com/cae/sitemap-index.xml` |
| `apps/cae/package.json` | Dependency `@astrojs/sitemap` |

Build emits under `apps/cae/dist/`: `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml` (URLs: `/cae/`, `/cae/media/` only).

### Image alts + loading (GHL path)

| Path | Role |
|------|------|
| `apps/cae/src/components/ghl/seoHtmlPass.ts` | Shared post-pass: alt fill from `data/home/*`, hero eager + `fetchpriority="high"`, logo eager, lazy/decoding defaults, aria-label URL cleanup, h1 policy |
| `apps/cae/src/components/ghl/remapHtml.ts` | Calls `applySeoHtmlPass` after token remap |
| `apps/cae/src/components/ghl/media/remapMediaHtml.ts` | Same for media fragments |

Notable behaviors:
- Hero slogan: meaningful alt from `homeHero.sloganAlt`; `loading="eager"`; `fetchpriority="high"`
- Nav/logo: alt from `homeNav.logoAlt` (replaces `Brand Logo` / empty alt)
- Press / offerings / platform / testimonials: alts from typed data modules; filename matchers for media hashed URLs
- Decorative `decor-star` and data-URI SVGs: intentional empty `alt=""`
- Remaining media article images without titles: fallback `"Press coverage featuring Cae Goh"`
- `aria-label="https://…"` → `"Cae Goh home"`

### Heading hierarchy + host patch

- Demotion implemented in `seoHtmlPass.ts` (see decisions above).
- `apps/cae/src/styles/ghl/host-patch.css` — zero UA margin on headings inside `.c-heading` / `.text-output` under `.hl_page-preview--content`.

---

## Verification (how to check)

### Build / preview

```powershell
pnpm --filter @seo/cae build
pnpm --filter @seo/cae preview
```

Open:
- http://localhost:4322/cae/
- http://localhost:4322/cae/media/
- http://localhost:4322/cae/robots.txt
- http://localhost:4322/cae/sitemap-index.xml

(Gateway path: http://localhost:4321/cae/ if using monorepo `pnpm dev`.)

### View source / grep expectations

| Check | Home | Media |
|-------|------|-------|
| `meta name="description"` | yes | yes |
| `meta name="robots" content="index,follow"` | yes | yes |
| `link rel="canonical"` | `https://caegoh.com/cae/` | `https://caegoh.com/cae/media/` |
| Open Graph + Twitter tags | yes | yes |
| `application/ld+json` | Organization + Person + WebSite | CollectionPage |
| `<h1` count | **1** | **1** |
| Hero `fetchpriority="high"` | yes | n/a |
| `alt="Brand Logo"` | none | none |
| Empty content alts | decorative stars only | decorative SVG only |

### UI smoke

Desktop + ~375px: hero, press, offerings, pillars, platform, testimonials, connect, footer, media articles — spacing/type/images must match pre-SEO look. If anything drifts, revert the offending remapper / host-patch rule (SEO does not win over layout).

### Optional public validators (after deploy / tunnel)

- Facebook Sharing Debugger — OG
- Twitter Card Validator — cards
- Google Rich Results Test / schema.org validator — JSON-LD

---

## Does not change

- GHL fragment HTML structure, class names, IDs, section order
- Parked native BEM homepage (`components/home/*` still unwired)
- CTA / funnel external URLs
- Blog content wiring

---

## Follow-ups / open questions

1. When cutting over to apex `caegoh.com` without `/cae/` prefix: set Astro `base: "/"` and refresh canonical/sitemap/robots accordingly.
2. Per-post blog SEO when `@seo/blog` + Supabase posts ship (include in sitemap then).
3. Richer per-article alts on media page once CMS Media Library / `media` table exists (see cms-media-library notes).
4. Confirm Facebook `sameAs` URL in JSON-LD matches the live profile the brand wants listed.
5. Whether production deploy should set `PUBLIC_SITE_ORIGIN` explicitly in the host env (Vercel/Render) rather than relying on the code default.

---

## Affects (for wiki ingest)

- `wiki/sites/cae.md` — SEO head, sitemap, remapper pass
- `wiki/sources/` — new source summary for this raw note
- Possibly `wiki/concepts/` if a reusable “GHL remapper SEO pass” concept is useful
- `wiki/overview.md` — only if platform-level SEO posture should be mentioned
