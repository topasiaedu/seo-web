# Session notes: CAE Zi Wei Dou Shu 9-post series (bulk import draft)

**Date:** 2026-07-27  
**Kind:** Chat / content authoring (bulk-import Markdown series)  
**Related:**  
- Bulk import artifact: `docs/blog/cae/blog-draft/zi-wei-dou-shu-9-post-series.md`  
- Hero image folder (expected): `docs/blog/cae/blog-draft/images/`  
- First Post paste sheet: `docs/blog/cae/blog-post/intro-to-zi-wei-dou-shu.md`  
- Prior first-Post raw: `raw/inbox/2026-07-23-cae-first-blog-post-intro-zi-wei-dou-shu.md`  
- Bulk import feature: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`  
- Scheduling model: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`  
- Admin import UI: `apps/cae/src/pages/admin/posts/import.astro`  
- Parser: `apps/cae/src/lib/bulk-import.ts`  
**Topic:** Author a **9-Post beginner/strategic Zi Wei Dou Shu series** as one Admin Bulk Import Markdown document, pre-scheduled across August–early September 2026, continuing after the published intro Post.

---

## Context

CAE already has (or is preparing) an intro Post: **Intro to Zi Wei Dou Shu**. The next content wave is a multi-post curriculum that deepens palaces, stars, Four Transformations, reading method, San He vs Si Hua, decade cycles, 2026 Bing activations, the Life/Wealth/Career trio, and Zi Wei vs BaZi / Western astrology.

Instead of nine separate Admin paste sheets, the series is authored as **one bulk-import file** matching the writer format from the bulk import session (`===NEW POST===` separators + YAML frontmatter + Markdown body).

---

## Artifact

| Path | Role |
|------|------|
| `docs/blog/cae/blog-draft/zi-wei-dou-shu-9-post-series.md` | **Bulk import source** — 9 Posts in one file |
| `docs/blog/cae/blog-draft/images/` | Intended home for per-Post hero assets (upload in Admin after parse; not Git runtime URLs) |

Header comment in the file marks it as CAE Blog bulk import for the Zi Wei Dou Shu series and points editors to upload heroes from the draft images folder.

---

## Series decisions

1. **Format:** Admin Bulk Import Markdown (multi-Post), not nine single paste sheets.
2. **Category:** `Zi Wei Dou Shu` on every Post.
3. **Status in frontmatter:** `scheduled` (Admin label) → import stores `published` + future `publishAt` / `published_at`.
4. **Cadence:** roughly every 3–4 days, all `09:00+08:00`, from **2026-08-05** through **2026-09-02**.
5. **Key takeaway + FAQ + sources** live in frontmatter; Body stays prose under headings (same discipline as the first Post).
6. **Hero images:** not embedded in the Markdown file; per-Post upload in Bulk Import UI after parse. `heroImageAlt` is provided in frontmatter for each Post.
7. **Sources:** lightweight classical attribution (e.g. Chen Tuan tradition) where used — not a full bibliography.
8. **Relationship to intro Post:** series assumes the intro exists; related-posts linking may be added later in Admin (not required in the bulk file).

---

## Post inventory (9)

| # | Title | Slug | Publish at (+08) |
|---|-------|------|------------------|
| 1 | The 12 Palaces of Zi Wei Dou Shu: Your Life Map Explained | `zi-wei-dou-shu-12-palaces` | 2026-08-05 09:00 |
| 2 | The Stars of Zi Wei Dou Shu: Major, Supporting, and What They Mean | `zi-wei-dou-shu-stars` | 2026-08-08 09:00 |
| 3 | Four Transformations in Zi Wei Dou Shu: Lu, Quan, Ke, and Ji Explained | `zi-wei-dou-shu-four-transformations` | 2026-08-12 09:00 |
| 4 | How to Read a Zi Wei Dou Shu Chart: A Clear Beginner Path | `how-to-read-zi-wei-dou-shu-chart` | 2026-08-15 09:00 |
| 5 | San He vs Four Transformations: Two Ways to Understand Zi Wei Dou Shu | `zi-wei-san-he-vs-four-transformations` | 2026-08-19 09:00 |
| 6 | Decade Cycles in Zi Wei Dou Shu: Your 10-Year Life Seasons | `zi-wei-dou-shu-decade-cycles` | 2026-08-22 09:00 |
| 7 | 2026 Bing Year Activations in Zi Wei Dou Shu: Tian Tong, Tian Ji, Wen Chang, Lian Zhen | `zi-wei-dou-shu-2026-activations` | 2026-08-26 09:00 |
| 8 | Life, Wealth, and Career Palaces: The Strategic Trio in Zi Wei Dou Shu | `zi-wei-life-wealth-career-palaces` | 2026-08-29 09:00 |
| 9 | Zi Wei Dou Shu vs BaZi (and Western Astrology): Which System Do You Need? | `zi-wei-dou-shu-vs-bazi` | 2026-09-02 09:00 |

### Curriculum spine

1. Domains (12 palaces)  
2. Actors (stars)  
3. Activations (Lu / Quan / Ke / Ji)  
4. Method (how to read)  
5. Schools (San He vs Four Transformations)  
6. Timing seasons (Da Xian / decade cycles)  
7. Current climate (2026 Bing)  
8. Practical trio (Life / Wealth / Career)  
9. Positioning vs other systems (BaZi / Western)

Tone: strategic beginner clarity; usable chart literacy; avoid daily-horoscope fluff.

---

## Import / publish checklist (not done in this note alone)

1. Confirm Category `Zi Wei Dou Shu` exists in Admin.  
2. Open `/cae/admin/posts/import`, paste or upload the series Markdown.  
3. Review parsed Posts; attach hero images + verify alts.  
4. Confirm each schedule lands as **Scheduled** (future `published_at`).  
5. Smoke: public list/detail stay hidden until each `publishAt`.  
6. Optionally set related Posts (intro ↔ series, and series cross-links).

---

## What this note is not

- Does **not** mean the 9 Posts are already in Supabase.  
- Does **not** ship hero/OG binary assets (folder referenced; upload is Admin-side).  
- Does **not** replace the first-Post paste sheet workflow for one-off Posts.

---

## Follow-ups

- Generate or place hero images under `docs/blog/cae/blog-draft/images/` named to match slugs.  
- Run bulk import on staging/prod Admin and verify scheduled visibility gate.  
- Promote wiki source page after import is accepted (lint → `wiki/sources/…`).  
- Consider linking series Posts to `intro-to-zi-wei-dou-shu` via related Posts.
