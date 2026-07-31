# Source: Dr Jasmine curated Instagram Reels (Option C)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-31-dr-jasmine-curated-instagram-reels.md](../../raw/inbox/2026-07-31-dr-jasmine-curated-instagram-reels.md) |
| Ingested | 2026-07-31 |
| Kind | Session notes (research + implementation) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [dr-jasmine-homepage-blog-band](dr-jasmine-homepage-blog-band.md) (home teaser pattern); [dr-jasmine-about-page](dr-jasmine-about-page.md) |

## Takeaways

- Shipped **Option C**: manually curated Instagram permalinks (max **6**), **no** Meta Graph API / auto-sync / oEmbed caption scrape.
- Public **`/reels`**: official Instagram `embed.js` players; no page hero; compact **3×2** grid; Follow CTA to profile.
- Home: **Featured Reels** band (up to **3** embeds) after Proof / before Health Insights; omitted when empty; View all → `/reels`.
- Admin **`/admin/reels`**: paste URL + published toggle only (title/caption columns dropped — embed shows IG copy).
- Nav includes **Reels**; footer Explore has Reels; footer Connect does **not** duplicate “Featured Reels”.
- Data: `public.instagram_reels` + RLS; helpers in `apps/dr-jasmine/src/lib/instagram-reels.ts`; types on `@seo/blog` `Database`.

## Key code / migrations

| Path | Role |
|------|------|
| `supabase/migrations/20260731120000_instagram_reels.sql` | Create table + RLS |
| `supabase/migrations/20260731133000_instagram_reels_drop_title_caption.sql` | Drop title/caption if present |
| `apps/dr-jasmine/src/lib/instagram-reels.ts` | CRUD + URL normalize + `limit` |
| `apps/dr-jasmine/src/pages/reels/index.astro` | Public page |
| `apps/dr-jasmine/src/pages/admin/reels/index.astro` | Admin |
| `apps/dr-jasmine/src/components/home/HomeReels.astro` | Home teaser |
| `apps/dr-jasmine/src/components/reels/InstagramReelEmbed.astro` | Shared embed markup |
| `apps/dr-jasmine/src/components/reels/InstagramEmbedScript.astro` | Shared `embed.js` boot |

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — `/reels` + Admin Reels + home band
- [architecture/supabase.md](../architecture/supabase.md) — table + migrations
- [overview.md](../overview.md) · [architecture/overview.md](../architecture/overview.md)

## Open (from raw)

1. Graph API auto-sync + thumbnails when Professional account / App Review ready  
2. Admin drag-reorder UI (`reorderReels` helper exists, UI not wired)  
3. Apply migrations on each environment before using Admin/public Reels against live DB  
