-- Drop title/caption from curated Reels (embed UI shows Instagram’s own copy).
-- Safe if the create migration never included these columns.

alter table public.instagram_reels
  drop constraint if exists instagram_reels_title_nonempty;

alter table public.instagram_reels
  drop column if exists title;

alter table public.instagram_reels
  drop column if exists caption;
