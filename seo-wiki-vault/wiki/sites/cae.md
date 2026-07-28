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
| Status | **Homepage** (native ZWDS) + **Media & Press** (native) + **Admin Blog** + public `/cae/blog` (Immersive Story + native chrome) |

Domain language: [`apps/cae/CONTEXT.md`](../../../apps/cae/CONTEXT.md) — **Admin ≠ CMS**. Brand theme (nm-zwds tokens): [`CONTEXT.md` Brand theme](../../../apps/cae/CONTEXT.md#brand-theme) · [alignment plan](../../../docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md).

## Pages

### Public

| Route | Status |
|-------|--------|
| `/cae/` (via gateway) | Homepage — native `HomePage` + `HomeLayout` + `components/home/*` + Insights Blog bento; **SSR** |
| `/cae/media/` | Media & Press — native `SiteHeader` / `MediaArticles` / `SiteFooter` (prerendered) |
| `/cae/blog` | Live post list — SSR; magazine index under `BlogLayout` (native chrome) |
| `/cae/blog/[slug]` | Live post detail — **Immersive Story** + native chrome; drafts / archived / not-yet-due never public |

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
8. **Public** — open `/cae/blog` (list) then `/cae/blog/[slug]` (detail): hero with key takeaway + date/read time, FAQ (accordion chevron), sources, Author byline + Instagram/Facebook, same-category related strip, TOC rail with active-section highlight. Meta/OG use Title, Summary, and hero image.

Also check: **archive** hides from public but stays in Admin; **delete** (confirm) removes permanently. Confirm newest **live** Posts appear in the homepage Insights bento after Press.

## Marketing pages (native ZWDS)

Treat `apps/cae/` as the CAE site root. Public marketing uses **native** BEM sections under `components/home/*` + shared `SiteHeader` / `SiteFooter`. nm-zwds tokens + decorative language (`decorative.css`).

**Homepage composition (locked):** SiteHeader → Hero → PressMarquee → **Blog (`HomeInsights` soft bento)** → Pillars → Platform → Testimonials → ConnectCta → SiteFooter.

- Blog band (Insights) remains after Press; newest **4** live Posts via `@seo/blog` (time-gated); empty set hides the section.
- Anchor `id="insights"`; hero secondary CTA → blog.
- Hero: full-bleed photo + readability scrim only (no starfield/arc/constellation overlays).
- Footer: always-deep night; copyright plain text (no link).
- **GHL section lift** remains in vault + unwired `components/ghl/*` as archive — not the live home/media/blog chrome path.
- Sources: [cae-native-zwds-public-redesign](../sources/cae-native-zwds-public-redesign.md) · [cae-nm-zwds-brand-theme-and-public-theme-toggle](../sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md) · [cae-homepage-blog-bento](../sources/cae-homepage-blog-bento.md).

| Path | Role |
|------|------|
| `src/pages/index.astro` | Homepage route (**SSR**; fetches recent Posts) |
| `src/pages/media/index.astro` | Media & Press route (prerendered) |
| `src/components/HomePage.astro` | Native homepage composition |
| `src/components/home/*` · `src/styles/home/*` | Marketing sections + chrome |
| `src/components/home/HomeInsights.astro` · `home-insights.css` | Soft bento Blog band |
| `src/components/media/MediaArticles.astro` | Media article grid |
| `src/layouts/HomeLayout.astro` | Homepage chrome + `global.css` + `decorative.css` + SEO |
| `src/layouts/MediaLayout.astro` | Media document chrome + SEO |
| `src/components/blog/BlogLayout.astro` | Public blog chrome (SiteHeader/SiteFooter) |
| `src/layouts/BaseLayout.astro` | Shared basics where still used |
| `src/layouts/AdminLayout.astro` | Admin chrome (auth shell) |
| `src/components/seo/SeoHead.astro` | Description, robots, canonical, OG, Twitter, favicon, JSON-LD |
| `src/components/blog/*` | Public blog UI — magazine index; slug Immersive Story + gold polish |
| `src/components/admin/*` | Admin React islands |
| `src/lib/bulk-import.ts` · `bulk-import-template.ts` | Multi-post Markdown parse + template |
| `src/lib/site-url.ts` · `src/lib/public-theme.ts` · `src/data/home/*` | Origin, theme, meta / images / media data |
| `src/styles/tokens.css` · `brand-gradient.css` | nm-zwds public tokens |
| `src/components/ghl/*` · `src/styles/ghl/*` | **Unwired** GHL lift archive (do not treat as live primary) |
| `src/assets/` · `src/assets/media/` | Local images |
| `public/robots.txt` · `@astrojs/sitemap` | Crawl files |

Session sources: [cae-native-zwds-public-redesign](../sources/cae-native-zwds-public-redesign.md) · [cae-nm-zwds-brand-theme-and-public-theme-toggle](../sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md) · [cae-ghl-section-lift-and-media-page](../sources/cae-ghl-section-lift-and-media-page.md) (historical lift) · [cae-seo-improvements](../sources/cae-seo-improvements.md) · [cae-homepage-blog-bento](../sources/cae-homepage-blog-bento.md) · [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md) · [cae-admin-postform-simplifications](../sources/cae-admin-postform-simplifications.md) · [cae-admin-bulk-import](../sources/cae-admin-bulk-import.md) · [cae-blog-immersive-story-redesign](../sources/cae-blog-immersive-story-redesign.md)

Task split: [`docs/implementation-plan/cae-admin-blog-agent-tasks.md`](../../../docs/implementation-plan/cae-admin-blog-agent-tasks.md) (T1–T12).

### Capture archives (immutable, not Vite-imported)

| Archive | Live URL |
|---------|----------|
| [`raw/research/cae-ghl-capture/`](../../raw/research/cae-ghl-capture/) | https://caegoh.com/ |
| [`raw/research/cae-ghl-capture-media/`](../../raw/research/cae-ghl-capture-media/) | https://caegoh.com/media |

`website/` (including `website/cae/`) has been **removed** — do not resurrect a shared shell.

## Images (current)

- Marketing pages use local assets under `apps/cae/src/assets/` (+ `assets/media/` for press cards).
- Native media logos use `object-fit: contain` on cream panels.
- **Blog Admin uploads** go to Supabase Storage bucket `media` under `cae/blog/covers|body|authors/` (see [supabase](../architecture/supabase.md)). URL paste still allowed.
- Long-term Media Library UI still deferred (`docs/future-enhancements/cms-media-library.md`).
- Historical GHL remapper SEO pass (`seoHtmlPass.ts`) applies only if GHL remappers are still invoked.

## SEO (current)

| Concern | Approach |
|---------|----------|
| Document head | `SeoHead.astro` on home / media / blog layouts |
| Canonical / OG URLs | `PUBLIC_SITE_ORIGIN` + Astro `base` |
| Crawl | `robots.txt` + `@astrojs/sitemap` |
| Structured data | Home: Organization + Person + WebSite; Media: CollectionPage |
| Blog posts | Meta/OG from Title + Summary + hero (Admin no longer has separate SEO/OG fields) |
| Theme | Public Light/Dark via `PublicThemeBoot` / `PublicThemeToggle` |

## Next

- Formal Appendix B visual smoke (375/1280, light+dark) for native public surfaces
- Decide fate of unwired GHL homepage/media components after acceptance
- Wire or drop unused blog index `LeadPost`
- Align seed domains with site config / production hosts
- Apex cutover (`base: "/"`) when replacing caegoh.com path prefix
- Migrate funnel popups/forms to in-repo destinations when needed
- Richer media-article alts via CMS Media Library when it ships
- Scheduled publishing: **implemented** — [cae-blog-scheduled-publishing](../sources/cae-blog-scheduled-publishing.md)
- Admin PostForm / Bulk import: [cae-admin-postform-simplifications](../sources/cae-admin-postform-simplifications.md) · [cae-admin-bulk-import](../sources/cae-admin-bulk-import.md)
- Deferred blog extras: [featured posts](../../../docs/future-enhancements/featured-posts.md)
- Public post UI (**Immersive Story** + native polish): [cae-blog-immersive-story-redesign](../sources/cae-blog-immersive-story-redesign.md) · [cae-native-zwds-public-redesign](../sources/cae-native-zwds-public-redesign.md)
