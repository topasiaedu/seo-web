-- Task B: gate anon public reads on published_at (lazy schedule).
-- USING matches @seo/blog public query semantics:
--   status = 'published' AND published_at IS NOT NULL AND published_at <= now()
-- Decision 5: target anon ONLY. Authenticated editors keep full SELECT via
-- "Editors manage posts" (FOR ALL, USING true) — do not drop or alter that policy.

drop policy if exists "Public read published posts" on public.posts;

create policy "Public read published posts"
  on public.posts
  for select
  to anon
  using (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  );

-- Supports public list/get filters on (site_id, status, published_at).
create index if not exists posts_site_id_status_published_at_idx
  on public.posts (site_id, status, published_at desc nulls last);
