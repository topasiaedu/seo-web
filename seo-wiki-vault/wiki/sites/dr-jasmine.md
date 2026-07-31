# Site: Dr Jasmine

| Field | Value |
|-------|--------|
| Code home | `apps/dr-jasmine/` (`@seo/dr-jasmine`) |
| Slug | `dr-jasmine` |
| Project id | `00000000-0000-4000-8000-000000000002` |
| Enabled | Independent app (`apps/dr-jasmine`) |
| Astro `base` | Local `/dr-jasmine/`; Vercel (`VERCEL=1`) `/` |
| Output | **Server** — on Vercel: `@astrojs/vercel`; locally / Node hosts: `@astrojs/node` standalone. Home + About + Reels + Admin + `/blog` SSR |
| Dev port | `4323` (gateway proxies `/dr-jasmine` from `:4321`) |
| Domains (config) | `dr-jasmine.localhost`, `doctorjasmine.com`, `www.doctorjasmine.com` |
| Seed domains | `dr-jasmine.localhost` only |
| SEO origin | `PUBLIC_SITE_ORIGIN` (default `https://doctorjasmine.com`) + env-conditional `base` |
| Status | **Active** — home (GHL LDP bands + Featured Reels teaser + Health Insights) + **About** + **`/reels`** + Admin Blog + public blog. **Vercel** project `seo-web-dr-jasmine` — open `/` (assets at `/_astro/`); local gateway still `/dr-jasmine/`; Output Directory must stay Off. Base fix: [vercel-base-root-unstyled-ui](../sources/vercel-base-root-unstyled-ui.md) |

Domain language: [`apps/dr-jasmine/CONTEXT.md`](../../../apps/dr-jasmine/CONTEXT.md) — **Admin ≠ CMS**.

Plans:

- Landing + Admin (complete): [dr-jasmine-landing-and-admin.md](../../../docs/implementation-plan/dr-jasmine-landing-and-admin.md)
- Option A true website (T1–T12 complete; **live IA later collapsed** — see [home IA polish](../sources/dr-jasmine-home-ia-and-polish.md)): [dr-jasmine-true-website.md](../../../docs/implementation-plan/dr-jasmine-true-website.md)
- Bulk import schedule UI (complete): [dr-jasmine-bulk-import-schedule-ui.md](../../../docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md) · [source](../sources/dr-jasmine-bulk-import-schedule-ui.md)
- Responsive audit (2026-07-28; **pass — no code changes**): [dr-jasmine-responsive-audit.md](../../../docs/implementation-plan/dr-jasmine-responsive-audit.md) · [source](../sources/dr-jasmine-responsive-audit.md)

CMS remains deferred (shared platform).

## Responsive (public)

**Pass (2026-07-28).** Home + blog index + blog slug are mobile-friendly: viewport meta, fluid containers, stacked→multi-col grids, hamburger nav `<768px`. Playwright showed **0px** page horizontal overflow at 320–1440. Decision: ship as-is; no polish PR. Details: [responsive audit source](../sources/dr-jasmine-responsive-audit.md).

## Design (Clinical Trust / patient-portal aligned)

- Primary CTA: **Join free workshop** → `registerUrl` (no native `/workshop`)
- Home CTA wording: **Secure My Seat** → same `registerUrl`
- Nav **About** → `/about`; **Reels** → `/reels`; home Meet band teases with “Read full story”
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

### Public IA (2026-07-31)

All public routes use `PublicLayout` (SiteNav + SiteFooter). Nav: Home (logo), About → `/about`, **Reels** → `/reels`, Blog, workshop CTA. FAQ lives on home (+ footer deep-link).

| Route | Purpose |
|-------|---------|
| `/dr-jasmine/` | Brand home — GHL LDP bands + Meet teaser (“Read full story” → About) + testimonials + **Featured Reels** (latest ≤3 curated embeds) + **Health Insights** (latest 3 Posts) + FAQ accordion; **SSR**; CTAs → `registerUrl` |
| `/dr-jasmine/about/` | Patient-first About — hero (no MBBS in H1), story, training & trust, approach, who it's for, forest CTA; Person/MedicalWebPage JSON-LD; **SSR** ([source](../sources/dr-jasmine-about-page.md)) |
| `/dr-jasmine/reels/` | Curated Instagram Reels (max 6) — official `embed.js` players; 3×2 compact grid; Follow CTA; **SSR** ([source](../sources/dr-jasmine-curated-instagram-reels.md)) |
| `/dr-jasmine/blog/` | Live post list — light ivory magazine index |
| `/dr-jasmine/blog/[slug]` | Live post detail — **light** promise-first story (takeaway → dek → byline/socials → body); TOC scroll-spy + section eyebrows (`Common questions` / `References` / `Keep reading`); not CAE dark immersive ([TOC/eyebrows](../sources/dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md)) |
| `/dr-jasmine/admin/**` | Brand Admin (login-only) |

**Still omitted** (do not recreate without CONTEXT + wiki update): `/faq`, `/programs`, `/workshop`.

### Home stack (top → bottom)

1. Hero (GHL split)
2. Discover
3. Meet Dr. Jasmine (`#dj-home-meet`) — credentials teaser + link to `/about`
4. Testimonials (marquee)
5. **Featured Reels** (`HomeReels`) — up to **3** official Instagram embeds; omitted when empty; View all → `/reels` ([source](../sources/dr-jasmine-curated-instagram-reels.md))
6. **Health Insights** (`HomeBlog`) — newest **3** live Posts as image `PostCard` tiles; omitted when empty; View all → `/blog` ([source](../sources/dr-jasmine-homepage-blog-band.md))
7. Workshop closing CTA
8. FAQ accordion

### Reels stack (top → bottom)

1. Featured Reels H1 + Follow on Instagram (no marketing hero)
2. Compact embed grid (1 / 2 / 3 cols by breakpoint; desktop 3×2 for six items)
3. Stay connected footer CTA → Instagram profile

Admin curation: paste permalink only (no title/caption). Migrations must be applied before use.

### About stack (top → bottom)

1. Hero (`Dr Jasmine Chiew` brand-first, **no MBBS** in H1 + portrait + workshop CTA)
2. Story (justified patient-facing bio + socials)
3. Training & trust signals (featured MBBS education + 2-col GHL trust grid; no numbering/gold; HRDC/speaking/KL strip)
4. Approach (three pillars from shared data)
5. Who it's for (2×2 statement grid; drafted audience copy pending confirmation)
6. Closing CTA (deep forest band → `registerUrl`)

Detail + polish decisions: [dr-jasmine-about-page](../sources/dr-jasmine-about-page.md).

### Admin (authenticated; no public signup)

| Route | Purpose |
|-------|---------|
| `/dr-jasmine/admin/login` | Email/password login (Supabase Auth); forest/ivory theme |
| `/dr-jasmine/admin/logout` | Clears session |
| `/dr-jasmine/admin` | Dashboard — counts (incl. Scheduled) + recent drafts; **Bulk import** + New post |
| `/dr-jasmine/admin/posts` | Filters: All / Draft / Published (live) / Scheduled / Archived; Bulk import link |
| `/dr-jasmine/admin/posts/new` | Create Post |
| `/dr-jasmine/admin/posts/import` | **Bulk import** — one Markdown doc → many Posts; Copy/Download live taxonomy template; per-post heroes; **section 4** MYT schedule / cadence (not Markdown `publishAt`); DJ cover upload kept |
| `/dr-jasmine/admin/posts/[id]/edit` | Edit Post (TipTap + Quote; FAQ; sources; tags; category; cover; schedule) |
| `/dr-jasmine/admin/author` | Single DJ Author profile |
| `/dr-jasmine/admin/categories` | Site-scoped Categories |
| `/dr-jasmine/admin/reels` | Curated Instagram Reels (max 6 permalinks; publish toggle) |

Always writes `site_id = …0002`. Same feature set as CAE Admin via `@seo/blog`; **data never cross-posts** to CAE (`…0001`). Reels are DJ-only (`instagram_reels`).

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
| `/dr-jasmine/` home | GHL copy bands; Featured Reels after Proof when ≥1 curated Reel; Health Insights after that when ≥1 live Post; Meet → “Read full story” → About; Join free workshop / Secure My Seat → `registerUrl` |
| `/dr-jasmine/about/` | Patient-first About; nav About active; CTAs → `registerUrl` |
| `/dr-jasmine/reels/` | Official Instagram embeds; Follow CTA; nav Reels active |
| No `/workshop` `/faq` `/programs` | Expect 404 |
| `/dr-jasmine/blog` | Light ivory index |
| `/dr-jasmine/blog/[slug]` | Green H1; takeaway/dek/byline socials; light body; TOC highlights current H2; FAQ/Sources/Related eyebrows |
| `/dr-jasmine/admin` | Forest/ivory chrome; site-scoped posts only |
| `/dr-jasmine/admin/reels` | Paste IG URL; max 6; published toggle |
| Isolation | CAE `/cae` unchanged; DJ posts absent from CAE |

### Human leftover

1. Docker → `supabase db reset` if seed missing  
2. Auth CRUD / schedule / bulk import smoke (incl. section 4 MYT cadence → Scheduled → public hide until due; Copy template taxonomy; Logout behind gateway/Vercel)  
3. Optional visual brand-test on a physical phone (responsive baseline already audited; no code work queued)

## Related

- [Vercel Output Directory Off deploy success](../sources/vercel-output-directory-off-deploy-success.md) · [Bulk import schedule UI](../sources/dr-jasmine-bulk-import-schedule-ui.md) · [Bulk-import LLM template + logout CSRF](../sources/bulk-import-llm-template-and-logout-csrf.md) · [Blog TOC scroll-spy + eyebrows](../sources/dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md) · [About page restored + polish](../sources/dr-jasmine-about-page.md) · [Curated Instagram Reels](../sources/dr-jasmine-curated-instagram-reels.md) · [Home IA polish](../sources/dr-jasmine-home-ia-and-polish.md) · [Homepage Health Insights band](../sources/dr-jasmine-homepage-blog-band.md) · [Admin theme + blog readability](../sources/dr-jasmine-admin-theme-and-blog-readability.md) · [Option A tokens](../sources/dr-jasmine-option-a-true-website.md) · [Responsive audit](../sources/dr-jasmine-responsive-audit.md)
- [Overview](../overview.md) · [CAE](cae.md) · [CMS](cms.md)
