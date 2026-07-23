# Site: CAE

| Field | Value |
|-------|--------|
| Code home | `apps/cae/` (`@seo/cae`) |
| Slug | `cae` |
| Project id | `00000000-0000-4000-8000-000000000001` |
| Enabled | Independent app (`apps/cae`) |
| Astro `base` | `/cae/` |
| Dev port | `4322` (gateway proxies `/cae` from `:4321`) |
| Domains (config) | `cae.localhost`, `www.cae.localhost` |
| Seed domains | `cae.localhost` only (www not in `seed.sql` yet) |
| Status | **Homepage + Media & Press shipped** as **GHL section lift**; blog still scaffold |

## Pages

| Route | Status |
|-------|--------|
| `/cae/` (via gateway) | Homepage — `HomePage` + `HomeLayout` + `components/ghl/*` |
| `/cae/media/` | Media & Press — `MediaLayout` + `components/ghl/media/*` |
| `/cae/blog` | Placeholder list (Supabase not wired) |
| `/cae/blog/[slug]` | Dynamic stub; `getStaticPaths` returns `[]` |

## Marketing pages (GHL section lift)

Treat `apps/cae/` as the CAE site root. Marketing funnels keep **original GHL section IDs/classes** and sanitized capture CSS under `.hl_page-preview--content`.

| Path | Role |
|------|------|
| `src/pages/index.astro` | Homepage route |
| `src/pages/media/index.astro` | Media & Press route |
| `src/components/HomePage.astro` | Homepage composition (`ghl/*`) |
| `src/components/ghl/*` | Homepage section components + fragments |
| `src/components/ghl/media/*` | Media page sections + fragments |
| `src/layouts/HomeLayout.astro` | Homepage chrome + `styles/ghl/ghl-page.css` |
| `src/layouts/MediaLayout.astro` | Media chrome + `styles/ghl/media-page.css` |
| `src/layouts/BaseLayout.astro` | Blog / other pages |
| `src/styles/ghl/*` | Runtime sanitized capture CSS + host patches |
| `src/assets/` · `src/assets/media/` | Local images |
| `src/data/home/*` | Typed helpers still used for image map / meta (native BEM data largely parked) |
| `src/components/home/*` · `src/styles/home/*` | **Parked** native BEM rewrite (unwired) |

Session source: [cae-ghl-section-lift-and-media-page](../sources/cae-ghl-section-lift-and-media-page.md)

### Capture archives (immutable, not Vite-imported)

| Archive | Live URL |
|---------|----------|
| [`raw/research/cae-ghl-capture/`](../../raw/research/cae-ghl-capture/) | https://caegoh.com/ |
| [`raw/research/cae-ghl-capture-media/`](../../raw/research/cae-ghl-capture-media/) | https://caegoh.com/media |

`website/` (including `website/cae/`) has been **removed** — do not resurrect a shared shell.

## Images (current)

- Marketing pages use local assets under `apps/cae/src/assets/` (+ `assets/media/` for press cards).
- Long-term target: Supabase Storage `media/cae/site/...` + Media Library (see [source summary](../sources/cms-media-library-and-cae-image-alt.md); design: `docs/future-enhancements/cms-media-library.md`).

## Next

- Superior review of homepage + `/cae/media/` vs live GHL
- Delete parked `components/home/*` after acceptance
- Wire blog via `@seo/blog` once clients exist
- Align seed domains with site config
- Production domain / multi-app deploy polish
- Migrate funnel popups/forms to in-repo destinations when needed
