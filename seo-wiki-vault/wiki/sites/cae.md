# Site: CAE

| Field | Value |
|-------|--------|
| Code home | `apps/cae/` (`@seo/cae`) |
| Slug | `cae` |
| Project id | `00000000-0000-4000-8000-000000000001` |
| Enabled | Independent app (`apps/cae`) |
| Astro `base` | `/cae/` |
| Output | **Server** (`@astrojs/node`) — Media marketing prerendered; **home SSR** (Blog band); Admin + `/blog` SSR |
| Dev port | `4322` (gateway proxies `/cae` from `:4321`) |
| Domains (config) | `cae.localhost`, `www.cae.localhost`, `caegoh.com`, `www.caegoh.com` |
| Seed domains | `cae.localhost` only (www / production hosts not in `seed.sql` yet) |
| SEO origin | `PUBLIC_SITE_ORIGIN` (default `https://caegoh.com`) + `base: "/cae/"` |
| Status | **Homepage** (GHL lift + Insights Blog bento) + **Media & Press** + **Admin Blog** + public `/cae/blog` |

Domain language: [`apps/cae/CONTEXT.md`](../../../apps/cae/CONTEXT.md) — **Admin ≠ CMS**.

## Pages

### Public

| Route | Status |
|-------|--------|
| `/cae/` (via gateway) | Homepage — `HomePage` + `HomeLayout` + `ghl/*` + **Insights Blog bento** (`HomeInsights`); **SSR** |
| `/cae/media/` | Media & Press — `MediaLayout` + `components/ghl/media/*` (prerendered) |
| `/cae/blog` | Live post list — SSR via `@seo/blog` `listPublishedPosts` (`status = published` and `published_at <= now()`) |
| `/cae/blog/[slug]` | Live post detail — **Immersive Story** UI (dark continuous scroll); drafts, archived, and not-yet-due (scheduled) never public |

### Admin (authenticated; no public signup)

| Route | Purpose |
|-------|---------|
| `/cae/admin/login` | Email/password login (Supabase Auth) |
| `/cae/admin/logout` | Clears session |
| `/cae/admin` | Dashboard — counts (incl. Scheduled) + recent drafts |
| `/cae/admin/posts` | Post list with filters: All / Draft / Published (live) / Scheduled / Archived; link to Bulk import |
| `/cae/admin/posts/new` | Create Post |
| `/cae/admin/posts/import` | **Bulk import** — one Markdown doc → many Posts; per-post hero uploads; respects `status` / `publishAt` |
| `/cae/admin/posts/[id]/edit` | Edit Post (TipTap body, FAQ, sources, tags typeahead, category; related auto on public) |
| `/cae/admin/author` | Single CAE Author profile (name, bio, photo) |
| `/cae/admin/categories` | List / add / rename site-scoped Categories |

Middleware redirects unauthenticated `/admin/**` (except login) to login. Always writes `site_id = cae` project id.

**Not the CMS.** Shared multi-brand authoring remains deferred at [CMS](cms.md) (`apps/cms` not scaffolded).

## Smoke checklist (Admin → public blog)

Use gateway preview (`pnpm dev` → `http://127.0.0.1:4321`) or CAE alone (`:4322` with `/cae` base). Requires Supabase env + an Auth user created in the dashboard (no signup UI).

1. **Login** — open `/cae/admin/login`, sign in with provisioned credentials → land on `/cae/admin`.
2. **Author** — `/cae/admin/author`: set name / bio / optional photo (upload or URL). Seed default: **Cae Goh**.
3. **Categories** (optional) — `/cae/admin/categories`: confirm seven starters or add/rename.
4. **Draft** — `/cae/admin/posts/new`: fill title (slug auto), summary, category, body; save as **Draft**. Confirm it does **not** appear on `/cae/blog`.
5. **Publish now** — edit the Post → set status **Published** → save. Goes live immediately (`published_at` stamped now). Slug locks after first publish/schedule.
6. **Schedule** — set status **Scheduled**, pick future **Publish at**, save. Admin list shows Scheduled; public stays hidden until due (lazy time-gate; no cron).
7. **Bulk import** (optional) — `/cae/admin/posts/import`: Copy template → paste filled multi-post Markdown → attach covers per post → Import. Scheduled rows should land under the Scheduled filter.
8. **Public** — open `/cae/blog` (list) then `/cae/blog/[slug]` (detail): hero with key takeaway + date/read time, FAQ, sources, Author byline, same-category related strip, TOC rail from H2. Meta/OG use Title, Summary, and hero image.

Also check: **archive** hides from public but stays in Admin; **delete** (confirm) removes permanently. Confirm newest **live** Posts appear in the homepage Insights bento after Press.

## Marketing pages (GHL section lift)

Treat `apps/cae/` as the CAE site root. Marketing funnels keep **original GHL section IDs/classes** and sanitized capture CSS under `.hl_page-preview--content`.

**Homepage composition (locked):** LogoBar → Nav → Hero → Press → **Blog (`HomeInsights` soft bento)** → Pillars → Platform → SocialProof → TestimonialCarousel → Connect → Footer.

- Blog band replaces former Offerings (“LIFE STARTS AT YOUR FULL POTENTIAL” / `section-gZkeGFtHWF`). Offerings fragments remain on disk but are **unwired**.
- Newest **4** live Posts via `@seo/blog` `listPublishedPostsPage` (time-gated); feature cell = newest; empty set hides the section.
- Anchor `id="insights"`; hero LEARN MORE → `#insights` (GHL hash remapped in `remapHtml.ts`).
- Source: [cae-homepage-blog-bento](../sources/cae-homepage-blog-bento.md).

| Path | Role |
|------|------|
| `src/pages/index.astro` | Homepage route (**SSR**; fetches recent Posts) |
| `src/pages/media/index.astro` | Media & Press route |
| `src/components/HomePage.astro` | Homepage composition (`ghl/*` + `HomeInsights`) |
| `src/components/home/HomeInsights.astro` · `home-insights.css` | Soft bento Blog band (wired exception under `home/`) |
| `src/components/ghl/*` | Homepage section components + fragments |
| `src/components/ghl/media/*` | Media page sections + fragments |
| `src/layouts/HomeLayout.astro` | Homepage chrome + `styles/ghl/ghl-page.css` + SEO head |
| `src/layouts/MediaLayout.astro` | Media chrome + `styles/ghl/media-page.css` + SEO head |
| `src/layouts/BaseLayout.astro` | Blog / other pages (shared SEO head basics) |
| `src/layouts/AdminLayout.astro` | Admin chrome (auth shell) |
| `src/components/seo/SeoHead.astro` | Description, robots, canonical, OG, Twitter, favicon, JSON-LD |
| `src/components/ghl/seoHtmlPass.ts` | Remapper SEO pass (alts, loading, single-h1) |
| `src/components/blog/*` | Public blog UI — index magazine tiles; slug **Immersive Story** (hero takeaway, TOC rail, breakout images, related strip) |
| `src/components/admin/*` | Admin React islands (login, TipTap, PostForm, BulkImportForm, tags typeahead, widgets) |
| `src/lib/bulk-import.ts` · `bulk-import-template.ts` | Multi-post Markdown parse + copyable writer/LLM template |
| `src/lib/site-url.ts` · `src/data/home/{meta,jsonld}.ts` | Origin helpers + meta / structured data |
| `src/styles/ghl/*` | Runtime sanitized capture CSS + host patches |
| `src/assets/` · `src/assets/media/` | Local images |
| `src/data/home/*` | Typed helpers (image map / meta / alts for remapper) |
| `src/components/home/*` · `src/styles/home/*` | Mostly **parked** native BEM; **`HomeInsights` is wired** |
| `public/robots.txt` · `@astrojs/sitemap` | Crawl files (`site` in `astro.config.mjs`) |

Session sources: [cae-ghl-section-lift-and-media-page](../sources/cae-ghl-section-lift-and-media-page.md) · [cae-seo-improvements](../sources/cae-seo-improvements.md) · [cae-homepage-blog-bento](../sources/cae-homepage-blog-bento.md) · [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md) · [cae-admin-postform-simplifications](../sources/cae-admin-postform-simplifications.md) · [cae-admin-bulk-import](../sources/cae-admin-bulk-import.md) · [cae-blog-immersive-story-redesign](../sources/cae-blog-immersive-story-redesign.md)

Task split: [`docs/implementation-plan/cae-admin-blog-agent-tasks.md`](../../../docs/implementation-plan/cae-admin-blog-agent-tasks.md) (T1–T12).

### Capture archives (immutable, not Vite-imported)

| Archive | Live URL |
|---------|----------|
| [`raw/research/cae-ghl-capture/`](../../raw/research/cae-ghl-capture/) | https://caegoh.com/ |
| [`raw/research/cae-ghl-capture-media/`](../../raw/research/cae-ghl-capture-media/) | https://caegoh.com/media |

`website/` (including `website/cae/`) has been **removed** — do not resurrect a shared shell.

## Images (current)

- Marketing pages use local assets under `apps/cae/src/assets/` (+ `assets/media/` for press cards).
- **Interim alts / loading / heading outline** applied in `seoHtmlPass.ts` after GHL remappers (typed copy from `data/home/*`). See [cae-seo-improvements](../sources/cae-seo-improvements.md).
- **Blog Admin uploads** go to Supabase Storage bucket `media` under `cae/blog/covers|body|authors/` (see [supabase](../architecture/supabase.md)). URL paste still allowed.
- Long-term Media Library UI still deferred (`docs/future-enhancements/cms-media-library.md`).

## SEO (current)

| Concern | Approach |
|---------|----------|
| Document head | `SeoHead.astro` on home / media / base layouts |
| Canonical / OG URLs | `PUBLIC_SITE_ORIGIN` + Astro `base` |
| Crawl | `robots.txt` + `@astrojs/sitemap` |
| Structured data | Home: Organization + Person + WebSite; Media: CollectionPage |
| Blog posts | Meta/OG from Title + Summary + hero (Admin no longer has separate SEO/OG fields) |
| Single h1 | Hero / media-articles primary sections; other fragments demote h1→h2 |
| UI rule | Remapper attribute/tag patches only — no layout CSS restyle |

## Next

- Superior review of homepage Insights bento + `/cae/media/` vs live GHL (visual + SEO smoke)
- Decide fate of unwired Offerings GHL fragments after acceptance
- Delete remaining parked `components/home/*` BEM (keep `HomeInsights`) after acceptance
- Align seed domains with site config / production hosts
- Apex cutover (`base: "/"`) when replacing caegoh.com path prefix
- Migrate funnel popups/forms to in-repo destinations when needed
- Richer media-article alts via CMS Media Library when it ships
- Scheduled publishing: **implemented** — [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md) · [scheduled-publishing.md](../../../docs/future-enhancements/scheduled-publishing.md) · plan [cae-blog-scheduling.md](../../../docs/implementation-plan/cae-blog-scheduling.md)
- Admin PostForm simplifications (previews, Summary, tag typeahead, auto related, Published vs Scheduled select): [cae-admin-postform-simplifications](../sources/cae-admin-postform-simplifications.md)
- Deferred blog extras: [featured posts](../../../docs/future-enhancements/featured-posts.md) (homepage currently uses newest-4 only, not a Featured flag)
- Public post UI (**Immersive Story**): [cae-blog-immersive-story-redesign](../sources/cae-blog-immersive-story-redesign.md) — index `LeadPost` / further polish still open
