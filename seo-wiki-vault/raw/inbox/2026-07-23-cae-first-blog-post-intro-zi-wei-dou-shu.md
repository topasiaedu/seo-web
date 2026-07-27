# Session notes: CAE first blog Post — Intro to Zi Wei Dou Shu

**Date:** 2026-07-23  
**Kind:** Chat / content authoring session (paste-ready Post + assets)  
**Related:**
- Brand app: `apps/cae/` (`@seo/cae`)
- Domain language: `apps/cae/CONTEXT.md` (Admin ≠ CMS; Post / Category / Tag / Body)
- Admin create form: `apps/cae/src/components/admin/PostForm.tsx`
- Prior Admin Blog build: `docs/cae-admin-blog-agent-tasks.md` (T1–T12); wiki site page `wiki/sites/cae.md`
- Live SEO origin: `https://caegoh.com` + Astro `base: "/cae/"`
**Topic:** Prepare CAE’s **first blog Post** as copy-paste materials for Admin → Create new Post, including hero/OG images and a paragraph-style Body (no list dumps).

---

## Decisions from session

1. **Content is authored outside Admin first**, then pasted field-by-field into `/cae/admin/posts/new`. Source of truth for paste is `docs/blog/cae/blog-post/intro-to-zi-wei-dou-shu.md`.
2. **No em dashes (`—`) in published Post copy.** Em dashes were stripped from the working draft and replaced with commas, colons, or semicolons. Markdown `---` rules stayed (not em dashes). En dashes in `Yin–Yang` and year ranges (`2024–2027`) were left unless later asked to remove.
3. **Key takeaway and FAQ are Admin fields**, not Body markdown. Body must not duplicate those sections.
4. **Body should be paragraph prose under headings**, not numbered (`1 2 3`) or bullet (`a b c`) content dumps. Tables for palaces / activations were converted into headed paragraph sections.
5. **Paste Body in TipTap Markdown mode** (Admin note: Visual paste is not a guaranteed markdown import).
6. **Category for this Post:** `Zi Wei Dou Shu` (seeded site Category).
7. **Status for first save:** Draft (publish later after smoke). Author comes from site Author profile (not per-Post).
8. **Images for this Post live in docs for handoff**, then upload via Admin to Supabase Storage (`media/cae/blog/covers/`). Do not rely on Git paths at runtime for public blog covers.
9. **Separate hero and OG assets** (same theme; OG simplified/centered for social thumbnails).

---

## Artifacts produced

| Path | Role |
|------|------|
| `docs/blog/cae/blog-draft/intro-to-zi-wei-dou-shu.md` | Working editorial draft (earlier location / draft tree) |
| `docs/blog/cae/blog-post/intro-to-zi-wei-dou-shu.md` | **Paste sheet** — one block per Admin form field |
| `docs/blog/cae/blog-post/intro-to-zi-wei-dou-shu-hero.png` | Hero / cover image (16:9, CAE plum star-chart look) |
| `docs/blog/cae/blog-post/intro-to-zi-wei-dou-shu-og.png` | Dedicated OG / social image (16:9, simpler center focal) |

### Public URL after publish (expected)

- List: `/cae/blog`
- Detail: `/cae/blog/intro-to-zi-wei-dou-shu`
- Canonical (prod default): `https://caegoh.com/cae/blog/intro-to-zi-wei-dou-shu`

---

## Post field map (paste sheet summary)

| Admin field | Value / guidance |
|-------------|------------------|
| **Title** | Intro to Zi Wei Dou Shu: Why Purple Star Astrology Is Rare, and How to Read Your Chart |
| **Slug** | `intro-to-zi-wei-dou-shu` |
| **Excerpt** | Practical intro to China’s royal destiny system, 2026 Four Transformations climate, and reading the 12 palaces with purpose |
| **Status** | Draft (until ready) |
| **Category** | Zi Wei Dou Shu |
| **Body** | Paragraph-style markdown under headings (What Is ZWDS → Closing); no Key takeaway / FAQ inside Body |
| **Reading time** | Auto from Body (~200 wpm); no manual override unless desired |
| **Key takeaway** | Life-direction system + 2026 Bing activations (Tian Tong Lu, Tian Ji Quan, Wen Chang Ke, Lian Zhen Ji) |
| **Hero image** | Upload `intro-to-zi-wei-dou-shu-hero.png` |
| **Hero image alt** | `Zi Wei Dou Shu purple star astrology chart for life direction and timing` |
| **OG image** | Upload `intro-to-zi-wei-dou-shu-og.png` |
| **SEO title** | Intro to Zi Wei Dou Shu: Why Purple Star Astrology Is Rare |
| **SEO description** | Same as excerpt |
| **Tags** | Zi Wei Dou Shu; Purple Star Astrology; Four Transformations; 12 palaces; 2026 activations |
| **FAQ** | 10 Q/A pairs (definition, BaZi vs Zi Wei, rarity, beginner palaces, Lu/Quan/Ke/Ji, 2026 stars, Ji meaning, birth time, San He vs Si Hua, ethics) |
| **Sources** | Empty for v1 (optional Chen Tuan attribution later) |
| **Related posts** | Empty (first Post) |

---

## Body content shape (after rewrite)

Headings only as structure; content is narrative paragraphs:

1. What Is Zi Wei Dou Shu?
2. Four Principles for Reading Your Chart (purpose / adjust / empty cup / empower)
3. Why Purple Star Astrology Is Rare (royal origins → now available)
4. Two Major Styles (San He + Four Transformations)
5. Yin and Yang: The Law Behind the Chart
6. The 2026 Activation Climate (Tian Tong / Tian Ji / Wen Chang / Lian Zhen)
7. The 12 Palaces (one subheading + paragraph per palace)
8. How to Read a Zi Wei Chart
9. A Simple 2026 Reading Framework
10. Closing

Editorial tone: strategic clarity for beginners; avoid daily-horoscope fluff; no em dashes.

---

## Image notes

- Visual direction matches CAE marketing purple (`#140625` / amethyst accents): circular chart wheel, luminous central star, no text overlays.
- Hero: richer atmospheric cover for post detail.
- OG: cleaner centered composition for feed thumbnails.
- Upload path after Admin save: Supabase Storage bucket `media` → `cae/blog/covers/…` (URL stored on Post `hero_image_url` / `og_image_url`).

---

## What was not done in this session

- Did **not** insert the Post into Supabase via code/API (human pastes in Admin).
- Did **not** publish (left as Draft guidance).
- Did **not** change Admin UI or public blog rendering code.
- Did **not** run full ingest into `wiki/sources/` in this note’s creation step (raw intake only unless a follow-up ingest is requested).
- Did **not** add Sources citations or related Posts (none available yet).

---

## Follow-ups / open questions

1. Confirm published Post appears on `/cae/blog` and `/cae/blog/intro-to-zi-wei-dou-shu` after status → Published.
2. Confirm sitemap policy: earlier SEO pass excluded `/blog` until posts existed — revisit whether published blog routes should enter `@astrojs/sitemap` now that a real Post exists.
3. Optional ingest: compile this raw note into `wiki/sources/cae-first-blog-post-intro-zi-wei-dou-shu.md` and sync `wiki/sites/cae.md` “first Post shipped” when publish is confirmed.
4. Whether en dashes (`Yin–Yang`, `2024–2027`) should also be removed for house style consistency.
5. Whether to keep draft tree (`docs/blog/cae/blog-draft/`) or treat `blog-post/` paste sheet as the only content handoff going forward.

---

## Session outcome

CAE’s first blog Post package is ready for Admin paste: field-mapped markdown, paragraph Body, 10 FAQs, tags/SEO, hero + OG PNGs, and hero alt text. Publish remains a human Admin step after upload + review.
