# Session notes: Dr Jasmine Option A true website + brand tokens

**Date:** 2026-07-27  
**Branch:** `dr-jasmine`  
**Kind:** Product + implementation session notes (human-directed vault intake)

## Summary

Dr Jasmine public site was rebuilt from a GHL registration LDP homepage into an **Option A — Clinical Trust** multi-page doctor brand site for SEO + blog, with Admin/blog unchanged. Plans:

- `docs/implementation-plan/dr-jasmine-landing-and-admin.md` (scaffold + Admin + GHL lift — complete)
- `docs/implementation-plan/dr-jasmine-true-website.md` (Option A native site T1–T12 — complete; residual human QA)

Code home: `apps/dr-jasmine/` (`@seo/dr-jasmine`), gateway `/dr-jasmine` → `:4323`.

## Locked product decisions (Option A)

| Decision | Choice |
|----------|--------|
| Design direction | Clinical Trust — calm brand home; conversion on `/workshop` |
| Primary CTA | “Join free workshop” → `/workshop` |
| Workshop handoff | “Secure my seat” → `https://doctorjasmine.com/register` |
| Framing | International education brand + soft SEA credibility |
| Contact chrome | No phone/email in v1 — Instagram + LinkedIn only |
| Dan Henry | Workshop page only |
| GHL lift | Archive/reference only — not mounted on public routes |

### Social

- Instagram: https://www.instagram.com/drjasminechiew/
- LinkedIn: https://www.linkedin.com/in/jasmine-chiew-glider2626?originalSubdomain=my

## Public IA

```text
/                  Home (native Option A)
/about             About
/programs          Programs (educational)
/workshop          Conversion → GHL registerUrl
/blog              Public blog (SSR)
/blog/[slug]       Immersive story + PublicLayout chrome
/faq               FAQs + workshop CTA
/admin/**          Brand Admin (unchanged model)
```

Shared chrome: `PublicLayout` + `SiteNav` + `SiteFooter` + `RegisterCta`.

## Brand color tokens (human-provided 2026-07-27)

Product supplied the following palette after Option A shipped with interim soft-sage / deep-teal defaults in `tokens-public.css`. **Treat this table as the intended Dr Jasmine brand system** going forward; reconcile code tokens in a follow-up if they still differ.

### Brand (primary / accent)

| Token | Hex | Role |
|-------|-----|------|
| Primary / Forest | `#2D5E4C` | Buttons, active states, rings |
| Primary hover | `#244D3F` | Hover |
| Primary light | `#EEF5F1` | Soft green tint |
| Primary muted | `#3A7D66` | Mid green |
| Accent / Gold | `#B8860B` | Highlights, labels |
| Accent light | `#FAF0D6` | Soft gold tint |

### Surfaces

| Token | Hex | Role |
|-------|-----|------|
| Background | `#FAF8F5` | Warm ivory page bg |
| Depth | `#EDE8E1` | Secondary / depth panels |
| Surface / Card | `#FFFFFF` | Cards, popovers |
| Border | `#E5DFD8` | Borders / inputs |

### Text

| Token | Hex | Role |
|-------|-----|------|
| Primary / Ink | `#1C1917` | Main text (stone-900) |
| Strong | `#44403C` | Secondary strong (stone-700) |
| Secondary | `#78716C` | Muted (stone-500) |
| Tertiary | `#A8A29E` | Soft (stone-400) |

### Typography (locked earlier in Option A plan)

- Display: **Fraunces**
- Body: **DM Sans**

## What shipped in code (as of closeout)

- Wave 0–3 of true-website plan: tokens (interim), content data, PublicLayout, blog chrome, Home/About/Programs/Workshop/FAQ, SEO helpers/sitemap, CONTEXT + GHL deprecation, wiki T12 smoke
- Admin: login, posts CRUD, schedule, bulk import, author, categories — site-scoped to DJ UUID `…0002`
- Seed: Author + 6 categories in `supabase/seed.sql`

## Open questions / follow-ups

1. **Token reconciliation** — Map human Forest/Gold/Ivory table into `apps/dr-jasmine/src/styles/tokens-public.css` (and any hard-coded section CSS) so runtime matches brand sheet.
2. Human visual QA — desktop/mobile brand-test on home + workshop.
3. Human Admin smoke — Auth user + `supabase db reset` when Docker is up.
4. Optional later: delete unused `components/ghl/**` + `styles/ghl/**` after confirmation.

## Related paths

- `apps/dr-jasmine/CONTEXT.md`
- `apps/dr-jasmine/src/styles/tokens-public.css`
- `apps/dr-jasmine/src/data/site/**`
- `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/` (immutable GHL archive)
