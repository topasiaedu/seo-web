# Source: Dr Jasmine About page restored + polish

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-31-dr-jasmine-about-page.md](../../raw/inbox/2026-07-31-dr-jasmine-about-page.md) |
| Ingested | 2026-07-31 |
| Kind | Session notes (implementation + polish) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [dr-jasmine-home-ia-and-polish](dr-jasmine-home-ia-and-polish.md) (had removed `/about`); [dr-jasmine-option-a-true-website](dr-jasmine-option-a-true-website.md) |

## Takeaways

- Restored standalone **`/about`** after the 2026-07-28 single-home collapse. Patient-first Clinical Trust tone (LinkedIn facts rewritten for patients).
- Nav/footer **About** → `/about`; home Meet keeps GHL bullets + **Read full story** link.
- CTAs still only `registerUrl`. Still omitted: `/faq`, `/programs`, `/workshop`.
- No phone/email; no Dan Henry; Asia Pacific centre award omitted until attribution confirmed.
- About visible copy: **no em dashes**; hero H1 is `Dr Jasmine Chiew` (**no MBBS**); MBBS only on education line.
- **Not the right fit** column removed (drafted, not official). **Who this is for** audience grid remains drafted pending Dr confirmation.
- SEO: `buildAboutJsonLd` (Person + MedicalWebPage); sitemap SSR includes `about`.

## About stack (live after polish)

1. Hero (split name + portrait + CTA)
2. Story (justified body + socials)
3. Training & trust (featured education; 2-col trust grid; no numbers/gold; secondary facts)
4. Approach (three pillars)
5. Who this is for (2×2 statement grid)
6. Closing CTA (deep forest band → `registerUrl`)

## Key code paths

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/pages/about/index.astro` | Route |
| `apps/dr-jasmine/src/components/about/**` | Sections + `about.css` |
| `apps/dr-jasmine/src/data/site/about-copy.ts` | Copy module |
| `apps/dr-jasmine/src/data/seo/jsonld-pages.ts` | `buildAboutJsonLd` |
| `apps/dr-jasmine/src/components/site/SiteNav.astro` | About → `/about` |
| `apps/dr-jasmine/src/components/home/HomeMeetDoctor.astro` | Read full story |

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — `/about` live IA
- [overview.md](../overview.md) · [architecture/overview.md](../architecture/overview.md)
- [dr-jasmine-home-ia-and-polish](dr-jasmine-home-ia-and-polish.md) — `/about` removal **superseded** for live IA (other omissions still hold)

## Open (from raw)

1. Confirm or replace drafted **Who this is for** titles/labels with Dr-approved wording
2. Confirm whether Asia Pacific centre award may be cited (and how attributed)
3. Optional later: `/faq` `/programs` `/workshop` only with CONTEXT + wiki update
