# Site: Dr Jasmine

| Field | Value |
|-------|--------|
| Code home | `apps/dr-jasmine/` (`@seo/dr-jasmine`) |
| Slug | `dr-jasmine` |
| Project id | `00000000-0000-4000-8000-000000000002` |
| Enabled | Independent app (`apps/dr-jasmine`) |
| Astro `base` | `/dr-jasmine/` |
| Output | **Server** (`@astrojs/node`) — GHL-sourced home + Admin + `/blog` SSR |
| Dev port | `4323` (gateway proxies `/dr-jasmine` from `:4321`) |
| Domains (config) | `dr-jasmine.localhost`, `doctorjasmine.com`, `www.doctorjasmine.com` |
| Seed domains | `dr-jasmine.localhost` only |
| SEO origin | `PUBLIC_SITE_ORIGIN` (default `https://doctorjasmine.com`) + `base: "/dr-jasmine/"` |
| Status | **Active** — single-home public site (GHL bands + Health Insights teaser) + Admin Blog + public `/dr-jasmine/blog` |

Domain language: [`apps/dr-jasmine/CONTEXT.md`](../../../apps/dr-jasmine/CONTEXT.md) — **Admin ≠ CMS**.

Plans:

- Landing + Admin (complete): [dr-jasmine-landing-and-admin.md](../../../docs/implementation-plan/dr-jasmine-landing-and-admin.md)
- Option A true website (T1–T12 complete; **live IA later collapsed** — see [home IA polish](../sources/dr-jasmine-home-ia-and-polish.md)): [dr-jasmine-true-website.md](../../../docs/implementation-plan/dr-jasmine-true-website.md)
- Responsive audit (2026-07-28; **pass — no code changes**): [dr-jasmine-responsive-audit.md](../../../docs/implementation-plan/dr-jasmine-responsive-audit.md) · [source](../sources/dr-jasmine-responsive-audit.md)

CMS remains deferred (shared platform).

## Responsive (public)

**Pass (2026-07-28).** Home + blog index + blog slug are mobile-friendly: viewport meta, fluid containers, stacked→multi-col grids, hamburger nav `<768px`. Playwright showed **0px** page horizontal overflow at 320–1440. Decision: ship as-is; no polish PR. Details: [responsive audit source](../sources/dr-jasmine-responsive-audit.md).

## Design (Clinical Trust / patient-portal aligned)

- Primary CTA: **Join free workshop** → `registerUrl` (no native `/workshop`)
- Home CTA wording: **Secure My Seat** → same `registerUrl`
- No phone/email in v1 chrome; Instagram + LinkedIn only (`site-config.social`)
- Dan Henry **not** on native public site
- Typography: **DM Serif Display** (display) + **Plus Jakarta Sans** (body)
- GHL fragments under `src/components/ghl/` are **archive/reference only**

### Brand tokens (live in `tokens-public.css` + Admin/blog)

| Token | Hex | Role |
|-------|-----|------|
| Primary / Forest | `#2D5E4C` | Buttons, H1 titles, rings, category chip |
| Primary hover | `#244D3F` | Hover |
| Accent / Gold | `#B8860B` | Highlights; Admin draft badges |
| Background | `#FAF8F5` | Warm ivory page / blog / Admin light bg |
| Depth | `#EDE8E1` | Secondary panels |
| Surface | `#FFFFFF` | Elevated surfaces |
| Text / Ink | `#1C1917` | Main text |
| Text muted | `#78716C` | Muted |

Admin theme (`admin-theme.css`) matches this palette (no longer CAE purple). Blog uses light ivory (not CAE dark Immersive Story).

## Pages

### Public IA (2026-07-28)

All public routes use `PublicLayout` (SiteNav + SiteFooter). Nav: Home (logo), About → `/#dj-home-meet`, Blog, workshop CTA. FAQ lives on home (+ footer deep-link).

| Route | Purpose |
|-------|---------|
| `/dr-jasmine/` | Brand home — GHL LDP bands + Meet + testimonials + **Health Insights** (latest 3 Posts) + FAQ accordion; **SSR**; CTAs → `registerUrl` |
| `/dr-jasmine/blog/` | Live post list — light ivory magazine index |
| `/dr-jasmine/blog/[slug]` | Live post detail — **light** promise-first story (takeaway → dek → byline/socials → body); not CAE dark immersive |
| `/dr-jasmine/admin/**` | Brand Admin (login-only) |

**Removed** (do not recreate without CONTEXT + wiki update): `/about`, `/faq`, `/programs`, `/workshop`.

### Home stack (top → bottom)

1. Hero (GHL split)
2. Discover
3. Meet Dr. Jasmine (`#dj-home-meet`)
4. Testimonials (marquee)
5. **Health Insights** (`HomeBlog`) — newest **3** live Posts as image `PostCard` tiles; omitted when empty; View all → `/blog` ([source](../sources/dr-jasmine-homepage-blog-band.md))
6. Workshop closing CTA
7. FAQ accordion

### Admin (authenticated; no public signup)

| Route | Purpose |
|-------|---------|
| `/dr-jasmine/admin/login` | Email/password login (Supabase Auth); forest/ivory theme |
| `/dr-jasmine/admin/logout` | Clears session |
| `/dr-jasmine/admin` | Dashboard — counts (incl. Scheduled) + recent drafts |
| `/dr-jasmine/admin/posts` | Filters: All / Draft / Published (live) / Scheduled / Archived; Bulk import link |
| `/dr-jasmine/admin/posts/new` | Create Post |
| `/dr-jasmine/admin/posts/import` | Bulk Markdown import; slug conflicts skipped |
| `/dr-jasmine/admin/posts/[id]/edit` | Edit Post (TipTap + Quote; FAQ; sources; tags; category; cover; schedule) |
| `/dr-jasmine/admin/author` | Single DJ Author profile |
| `/dr-jasmine/admin/categories` | Site-scoped Categories |

Always writes `site_id = …0002`. Same feature set as CAE Admin via `@seo/blog`; **data never cross-posts** to CAE (`…0001`).

### Blog slug conventions (body markdown)

Documented in [admin theme + blog readability](../sources/dr-jasmine-admin-theme-and-blog-readability.md): pull quotes, `In clinic:` callouts, key-number paragraphs, step lists, green `→` bullets, FAQ chevron.

## Env

Copy `apps/dr-jasmine/.env.example` → `apps/dr-jasmine/.env.local`:

| Variable | Role |
|----------|------|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional |
| `PUBLIC_SITE_ORIGIN` | Canonical / OG origin (default `https://doctorjasmine.com`) |
| `HOST` / `PORT` | Node bind (`0.0.0.0` / `4323`) |

## Seed / data

- Site row + Author (**Dr Jasmine**) + 6 starter Categories in `supabase/seed.sql` (`site_id` `…0002`)
- Storage prefix: `dr-jasmine/blog/{covers\|body\|authors}/`

## Marketing / GHL archive

Immutable capture: `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/` → [source summary](../sources/dr-jasmine-ghl-capture.md).

## Smoke checklist (current)

Use gateway (`pnpm dev` → `:4321`) or DJ alone (`:4323`).

| Check | Notes |
|-------|--------|
| `/dr-jasmine/` home | GHL copy bands; Health Insights after Proof when ≥1 live Post; Join free workshop / Secure My Seat → `registerUrl` |
| No `/about` `/workshop` `/faq` `/programs` | Expect 404 |
| `/dr-jasmine/blog` | Light ivory index |
| `/dr-jasmine/blog/[slug]` | Green H1; takeaway/dek/byline socials; light body |
| `/dr-jasmine/admin` | Forest/ivory chrome; site-scoped posts only |
| Isolation | CAE `/cae` unchanged; DJ posts absent from CAE |

### Human leftover

1. Docker → `supabase db reset` if seed missing  
2. Auth CRUD / schedule / bulk import smoke  
3. Optional visual brand-test on a physical phone (responsive baseline already audited; no code work queued)

## Related

- [Home IA polish](../sources/dr-jasmine-home-ia-and-polish.md) · [Homepage Health Insights band](../sources/dr-jasmine-homepage-blog-band.md) · [Admin theme + blog readability](../sources/dr-jasmine-admin-theme-and-blog-readability.md) · [Option A tokens](../sources/dr-jasmine-option-a-true-website.md) · [Responsive audit](../sources/dr-jasmine-responsive-audit.md)
- [Overview](../overview.md) · [CAE](cae.md) · [CMS](cms.md)
