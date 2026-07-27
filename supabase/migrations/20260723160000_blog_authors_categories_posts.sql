-- CAE Admin Blog Wave 0 (T1): site-scoped authors + categories, posts editorial fields,
-- updated_at triggers, RLS, and public Storage bucket `media` for blog images.
-- No `featured` column (deferred; see docs/future-enhancements/featured-posts.md).

-- ---------------------------------------------------------------------------
-- Authors: one byline profile per site (UNIQUE site_id).
-- ---------------------------------------------------------------------------

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.sites (id) on delete cascade,
  name text not null default '',
  bio text not null default '',
  photo_url text not null default '',
  updated_at timestamptz not null default now()
);

comment on table public.authors is
  'Site-scoped Author byline profile. Exactly one row per site (UNIQUE site_id).';

-- ---------------------------------------------------------------------------
-- Categories: site-scoped taxonomy; unique slug within a site.
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  slug text not null,
  name text not null,
  unique (site_id, slug)
);

create index if not exists categories_site_id_idx
  on public.categories (site_id);

comment on table public.categories is
  'Site-scoped Category labels for Posts. Brands do not share Categories.';

-- ---------------------------------------------------------------------------
-- Posts: editorial / SEO columns (keep existing slug/title/excerpt/body_md/status).
-- faq jsonb: [{ "question": string, "answer": string }, ...]
-- sources jsonb: [{ "label": string, "url": string }, ...]
-- ---------------------------------------------------------------------------

alter table public.posts
  add column if not exists reading_time_minutes integer,
  add column if not exists hero_image_url text not null default '',
  add column if not exists hero_image_alt text not null default '',
  add column if not exists og_image_url text not null default '',
  add column if not exists key_takeaway text not null default '',
  add column if not exists faq jsonb not null default '[]'::jsonb,
  add column if not exists sources jsonb not null default '[]'::jsonb,
  add column if not exists category_id uuid references public.categories (id) on delete set null,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists seo_title text not null default '',
  add column if not exists seo_description text not null default '',
  add column if not exists related_post_ids uuid[] not null default '{}'::uuid[];

create index if not exists posts_category_id_idx
  on public.posts (category_id);

-- Wire posts.author_id → authors.id (nullable OK for drafts until Author exists).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_author_id_fkey'
  ) then
    alter table public.posts
      add constraint posts_author_id_fkey
      foreign key (author_id) references public.authors (id) on delete set null;
  end if;
end $$;

comment on column public.posts.faq is
  'JSON array of FAQ items: [{ "question": "...", "answer": "..." }, ...]';
comment on column public.posts.sources is
  'JSON array of sources: [{ "label": "...", "url": "..." }, ...]';
comment on column public.posts.related_post_ids is
  'Optional related Post UUIDs (same site); validated in app queries.';

-- ---------------------------------------------------------------------------
-- updated_at triggers (posts + authors)
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

drop trigger if exists authors_set_updated_at on public.authors;
create trigger authors_set_updated_at
  before update on public.authors
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public read for blog; authenticated manage (site scope via app queries).
-- Existing posts/sites policies from 20260722100000 remain in effect.
-- ---------------------------------------------------------------------------

alter table public.authors enable row level security;
alter table public.categories enable row level security;

-- Authors
drop policy if exists "Public read authors" on public.authors;
create policy "Public read authors"
  on public.authors
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage authors" on public.authors;
create policy "Editors manage authors"
  on public.authors
  for all
  to authenticated
  using (true)
  with check (true);

-- Categories
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Editors manage categories" on public.categories;
create policy "Editors manage categories"
  on public.categories
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage: public bucket `media` for brand blog assets.
--
-- Path convention (bucket-relative; aligns with docs/future-enhancements/cms-media-library.md
-- plus CAE Admin author photos under blog/authors):
--
--   media/
--     {site_slug}/                    -- e.g. cae | dr-jasmine
--       site/                         -- landing / brand assets (future)
--       blog/
--         covers/                     -- hero / cover images
--         body/                       -- inline body images
--         authors/                    -- Author profile photos
--
-- Examples:
--   cae/blog/covers/my-post-cover.webp
--   cae/blog/body/diagram-1.webp
--   cae/blog/authors/cae-goh.webp
--
-- Full Media Library UI is deferred; Admin uploads use these paths directly.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update
  set public = excluded.public;

-- Public may read objects in the media bucket (CDN / public URLs).
drop policy if exists "Public read media objects" on storage.objects;
create policy "Public read media objects"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Authenticated editors may upload / update / delete under media.
drop policy if exists "Authenticated insert media objects" on storage.objects;
create policy "Authenticated insert media objects"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Authenticated update media objects" on storage.objects;
create policy "Authenticated update media objects"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "Authenticated delete media objects" on storage.objects;
create policy "Authenticated delete media objects"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
