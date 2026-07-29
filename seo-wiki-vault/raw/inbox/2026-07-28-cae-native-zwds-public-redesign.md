# Session notes: CAE native ZWDS public redesign cutover

**Date:** 2026-07-28  
**Kind:** Chat / implementation notes  
**Branch:** `cae`  
**Related:**  
- Prior raw (tokens + theme toggle; GHL still primary then): `raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md`  
- Plan: `docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md`  
- Reference: `docs/references/nm-zwds-design-theme-color-scheme.md`  
- Prior blog UI: `raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md`  
- `apps/cae/src/components/HomePage.astro`  
- `apps/cae/src/layouts/HomeLayout.astro` · `MediaLayout.astro`  
- `apps/cae/src/components/home/*` · `styles/home/*` · `styles/home/decorative.css`  
- `apps/cae/src/components/media/MediaArticles.astro` · `pages/media/index.astro`  
- `apps/cae/src/components/blog/BlogLayout.astro` · `blog-page.css` · `[slug].astro`  
- `apps/cae/src/components/blog/TableOfContents.astro` · `AuthorByline.astro` · `FaqSection.astro`  
- `apps/cae/CONTEXT.md` (Brand theme)  
**Topic:** Cut public marketing + blog chrome from GHL lift to **native** ZWDS-themed components so home, media, and blog share one design language (tokens, gold accents, SiteHeader/SiteFooter).

---

## Problem

After nm-zwds token alignment, public surfaces still felt split:

1. **Homepage** still composed of GHL capture sections with patch CSS — light mode fought photo backgrounds; decorative language was inconsistent.
2. **Media** still used GHL MediaNav/Footer chrome.
3. **Blog** Immersive Story body was dark-first, but chrome was still GHL MediaNav/Footer — not the same shell as the redesigned home.
4. Light/dark QA and brand cohesion needed a **native** stack, not more GHL overrides.

---

## Design direction (locked in session)

| Choice | Detail |
|--------|--------|
| Primary path | **Native cutover** — wire `components/home/*` on HomePage; stop treating GHL as live home |
| Visual language | Purple Star / Zi Wei Dou Shu: deep night, gold interactive, cream light shell, Archivo Black display, Hanken Grotesk UI |
| Chrome | Shared **SiteHeader** + **SiteFooter** on home, media, blog |
| Hero | Full-bleed photo only (+ readability scrim); **no** starfield / chart-arc / constellation overlays |
| Thin rainbow bars | Removed from chrome (CTA gradients / Connect gradient text kept) |
| Footer | Copyright **plain text** — no terms link |
| Funnel URLs | Keep intentional product funnels in data where still present; home logo stays app base |

---

## What shipped

### Homepage (native)

`HomePage.astro` composition (locked):

```text
SiteHeader → Hero → PressMarquee → HomeInsights → Pillars → Platform
→ Testimonials → ConnectCta → SiteFooter
```

- `HomeLayout` loads `global.css` + `decorative.css` (not GHL page CSS as primary).
- Hero: photo background + left-weighted scrim; CSS slogan pill; brand-gradient primary CTA; ghost secondary → blog.
- Pillars: no photo bg clip; gold number badges.
- Platform: inline SVG icons (daily/weekly/monthly); no phone frame.
- Connect: “Connect with me” + Instagram/Facebook only (event/book panels removed from this surface).
- Footer: always-deep `#1A0F2E`; copyright string only (no `<a>`).
- Insights soft bento retained (SSR newest 4 live Posts).
- Nav: SUCCESS STORIES → `/#success-stories` so it works off-home.

### Media `/cae/media/`

- Native `SiteHeader` / `SiteFooter` + `MediaArticles` grid from `data/home/media.ts`.
- Press logos: `object-fit: contain` on cream panels (fixed prior `cover` crop).

### Blog index + slug chrome

- `BlogLayout.astro`: native chrome (`SiteHeader` / `SiteFooter` + `decorative.css` + `blog-page.css`).
- Magazine index: gold eyebrows/chips; `--blog-nav-offset` for sticky header; `main.blog-page` exempt from narrow global main scaffold.

### Blog `/blog/[slug]` polish (on Immersive Story)

| Area | Behavior |
|------|----------|
| Hero | Starfield when no hero image; gold “Zi Wei Dou Shu” eyebrow; solid back + category pills (gold hover) |
| Accents | Gold tags, TOC, takeaways, blockquotes, H3s, author rings, FAQ/source eyebrows |
| FAQ | CSS chevron on `<summary>`; rotates when open |
| TOC | **Scroll spy** sets `aria-current` on the section in view; active row highlighted (dim others) |
| Byline | Instagram + Facebook pills **under** author name (`homeCta.social`) |
| Related | Insights-like radial band + “More insights” eyebrow |
| Author card | End-of-article socials unchanged pattern |

### Tokens / residual GHL

- Public surfaces prefer `--cae-*` tokens; GHL fragments remain on disk for archive / optional reuse but are **unwired** from live HomePage/Media/Blog chrome.
- Capture CSS may still hold legacy hex if anything still imports it — do not treat as brand source of truth.

---

## Verification

- `pnpm --filter @seo/cae typecheck` — pass (during slug / chrome work)
- Live `pnpm dev` used for visual QA in session
- Human Appendix B (375/1280 light+dark) still recommended as formal smoke

---

## Open / deferred

- [ ] Formal Appendix B visual smoke at 375 + 1280 (home, media, blog, slug, Admin) light + dark
- [ ] Wire or drop unused index `LeadPost` (older magazine plan)
- [ ] Whether to delete or archive unwired GHL homepage components later (not required for cutover)
- [ ] Commit/push redesign wave on `cae` when ready

---

## Supersedes / relates

| Prior | Relationship |
|-------|----------------|
| GHL section lift as **live home/media chrome** | **Superseded** for runtime composition — vault captures still archive |
| Jul 28 brand-theme raw (“accept GHL until native cutover”) | Cutover **done**; that open item closed |
| Jul 27 Immersive Story | Still the article layout; this pass adds native chrome + polish (TOC spy, FAQ chevron, byline socials, gold language) |
| Homepage Blog bento | **Kept** inside native home stack |

---

## Source of truth for agents

- Live home: `components/home/*` + `HomePage.astro` — **not** `components/ghl/*`
- Shared chrome: `SiteHeader` / `SiteFooter` / `BlogLayout`
- Tokens: `styles/tokens.css` + `brand-gradient.css` + `decorative.css`
- Hex roles: `docs/references/nm-zwds-design-theme-color-scheme.md`
- Do **not** reintroduce GHL capture as the primary public marketing path without a new product decision
