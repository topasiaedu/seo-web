-- Curated hybrid social features (CAE Option C).
-- Instagram / Facebook: permalink only (official embeds on public pages).
-- Xiaohongshu: permalink + title + cover_image_url (display cards).
-- Site-scoped; public reads published only; authenticated editors manage all.

create table if not exists public.social_features (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  platform text not null,
  permalink text not null,
  title text null,
  cover_image_url text null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, platform, permalink),
  constraint social_features_platform_check
    check (platform in ('instagram', 'facebook', 'xiaohongshu')),
  constraint social_features_sort_order_nonneg check (sort_order >= 0),
  constraint social_features_permalink_nonempty
    check (char_length(trim(permalink)) > 0)
);

comment on table public.social_features is
  'Manually curated social posts for public brand pages: IG/FB embeds and XHS cards (max 6 published per platform, enforced in app).';

create index if not exists social_features_site_id_sort_idx
  on public.social_features (site_id, sort_order asc, created_at desc);

create index if not exists social_features_site_platform_published_idx
  on public.social_features (site_id, platform, is_published, sort_order asc);

drop trigger if exists social_features_set_updated_at on public.social_features;
create trigger social_features_set_updated_at
  before update on public.social_features
  for each row
  execute function public.set_updated_at();

alter table public.social_features enable row level security;

drop policy if exists "Public read published social features" on public.social_features;
create policy "Public read published social features"
  on public.social_features
  for select
  to anon
  using (is_published = true);

drop policy if exists "Authenticated read social features" on public.social_features;
create policy "Authenticated read social features"
  on public.social_features
  for select
  to authenticated
  using (true);

drop policy if exists "Editors manage social features" on public.social_features;
create policy "Editors manage social features"
  on public.social_features
  for all
  to authenticated
  using (true)
  with check (true);
