# Session notes: Dr Jasmine About page restored + polish

**Date:** 2026-07-31  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Prior raw:**  
- `raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md` (collapsed IA; removed `/about`)  
- `raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md` (original Option A multi-page IA)  
**Related code:**  
- `apps/dr-jasmine/CONTEXT.md`  
- `apps/dr-jasmine/src/pages/about/index.astro`  
- `apps/dr-jasmine/src/components/about/**`  
- `apps/dr-jasmine/src/data/site/about-copy.ts`  
- `apps/dr-jasmine/src/data/site/credentials.ts` (GHL-verbatim; home Meet unchanged)  
- `apps/dr-jasmine/src/data/site/pillars.ts`  
- `apps/dr-jasmine/src/data/seo/jsonld-pages.ts` (`buildAboutJsonLd`)  
- `apps/dr-jasmine/src/data/seo/urls.ts` (sitemap includes `about`)  
- `apps/dr-jasmine/astro.config.mjs` (`ssrSitemapSegments`)  
- `apps/dr-jasmine/src/components/site/SiteNav.astro`  
- `apps/dr-jasmine/src/components/site/SiteFooter.astro`  
- `apps/dr-jasmine/src/components/home/HomeMeetDoctor.astro`  
**Topic:** Restored a patient-first standalone `/about` page (Clinical Trust), wired nav/footer, then polished copy/layout (no inventing unconfirmed clinic rules).

---

## Summary

Reintroduced **`/about`** after the 2026-07-28 single-home collapse. Page is patient-facing (LinkedIn facts rewritten for patients, not corporate/HR tone). Home Meet band remains a teaser with **Read full story** → `/about`. Workshop CTAs still go only to `registerUrl`. `/faq`, `/programs`, `/workshop` stay omitted.

Wiki site page / overview / CONTEXT were updated during implementation; this raw note is the durable session capture for polish decisions that followed.

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Route | `/about` (local `/dr-jasmine/about/`; Vercel `/about/`) |
| 2 | Tone | Patient-first clinical; not LinkedIn executive About |
| 3 | Nav About | → `/about` (not `/#dj-home-meet`) |
| 4 | Home Meet | Keep GHL credential bullets; add “Read full story” → `/about` |
| 5 | CTA | `RegisterCta` → `registerUrl` only (“Join free workshop”) |
| 6 | Contact chrome | No phone/email (LinkedIn email stays off-page) |
| 7 | Dan Henry | Not on About |
| 8 | Asia Pacific centre award | **Omitted** until attribution confirmed (was org/Clinixero-adjacent) |
| 9 | Em dash `—` | **None** in About visible copy |
| 10 | Hero name | `Dr Jasmine Chiew` (**no MBBS** in H1); MBBS remains on education line only |
| 11 | “Not the right fit” column | **Removed** — drafted qualifier, not LinkedIn/official |
| 12 | “Who this is for” bullets | Drafted for layout (not LinkedIn lists); kept as audience band pending Dr confirmation |

### Content provenance

| Block | Source |
|-------|--------|
| Hero role / support (insulin resistance framing) | LinkedIn headline + About rewrite |
| Story paragraphs | LinkedIn About + patient rewrite |
| Education (MBBS, Manipal) | LinkedIn |
| GHL credential bullets (research, decade, 1,000+, countries) | GHL LDP / `credentials.ts` (verbatim) |
| Secondary facts (HRDC, 300+ workshops, KL) | LinkedIn |
| Approach pillars | Existing `pillars.ts` (site framework) |
| Who this is for titles/labels | **Drafted** (not LinkedIn) |
| Not the right fit | **Drafted then removed** |

---

## Public IA (after this change)

```text
/                  Home (GHL LDP bands + Meet teaser + FAQ accordion)
/about             Patient-first About (SSR)
/blog              Public blog (SSR)
/blog/[slug]       Post detail
/admin/**          Brand Admin (unchanged)

Still omitted: /faq, /programs, /workshop
```

Nav: Home (logo) · About · Blog · Join free workshop  
Footer Explore: Home · About · Blog

---

## About page stack (live)

1. **Hero** — split name + portrait; role line; support; workshop CTA  
2. **Story** — justified body; Instagram + LinkedIn  
3. **Training & trust signals** — featured education band + 2-col trust grid (no numbers, no gold accent) + secondary fact strip  
4. **Approach** — three pillars (text stacks)  
5. **Who this is for** — atmospheric 2×2 statement grid (title + label; forest arrow marks)  
6. **Closing CTA** — deep forest band, “Free workshop” eyebrow, large headline, inverted cream button → `registerUrl`

---

## Files added / owned

| Path | Role |
|------|------|
| `src/pages/about/index.astro` | Route + PublicLayout + SEO |
| `src/components/about/AboutHero.astro` | Hero |
| `src/components/about/AboutStory.astro` | Story |
| `src/components/about/AboutCredentials.astro` | Training & trust |
| `src/components/about/AboutApproach.astro` | Pillars |
| `src/components/about/AboutFit.astro` | Who this is for |
| `src/components/about/AboutCta.astro` | Closing CTA |
| `src/components/about/about.css` | About-only styles |
| `src/data/site/about-copy.ts` | About marketing copy module |

SEO: `buildAboutJsonLd` → Person + MedicalWebPage (+ Organization/WebSite). Sitemap SSR segments include `about`.

---

## Polish pass notes (same day, after first ship)

1. Removed **MBBS** from hero H1 only.  
2. Stripped all em dashes from About visible strings.  
3. Story section: centered briefly, then **justified** body (final).  
4. Credentials: dropped gold accents and numbering; education featured; 2-col trust labels.  
5. Removed **Not the right fit** (unconfirmed).  
6. Redesigned **Who this is for** as eye-catching 2×2 grid.  
7. Redesigned closing CTA as richer forest conversion band.

---

## Out of scope (unchanged)

- Restoring `/faq`, `/programs`, `/workshop`  
- Phone / email in chrome  
- CMS / Admin blog model changes  
- CAE app  
- Publishing invented personal biography beyond LinkedIn + GHL facts  
- Claiming Reverse Diabetes Centre of the Year as a personal award

---

## Agent follow-up (ingest)

When ingesting this note into the wiki:

1. Write or refresh `wiki/sources/dr-jasmine-about-page.md` (summary + link to this raw).  
2. Confirm `wiki/sites/dr-jasmine.md` IA matches: `/about` live; `/faq` `/programs` `/workshop` still omitted.  
3. Append `wiki/log.md`: `## [2026-07-31] ingest | Dr Jasmine About page restored + polish`  
4. Touch `wiki/index.md` / `overview.md` if source page is new.

Note: a partial **sync** log entry for About restore may already exist from the implementation session; ingest should de-dupe or extend, not invent contradictory IA.
