-- Curated Instagram Reels showcase (Dr Jasmine Option C).
-- Site-scoped rows; public reads published only; authenticated editors manage all.
-- Permalink only — Instagram’s official embed supplies title/caption on the public page.

create table if not exists public.instagram_reels (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  permalink text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, permalink),
  constraint instagram_reels_sort_order_nonneg check (sort_order >= 0),
  constraint instagram_reels_permalink_nonempty check (char_length(trim(permalink)) > 0)
);

comment on table public.instagram_reels is
  'Manually curated Instagram Reel/post permalinks for public brand pages (max 6 published per site, enforced in app).';

create index if not exists instagram_reels_site_id_sort_idx
  on public.instagram_reels (site_id, sort_order asc, created_at desc);

create index if not exists instagram_reels_site_published_idx
  on public.instagram_reels (site_id, is_published, sort_order asc);

drop trigger if exists instagram_reels_set_updated_at on public.instagram_reels;
create trigger instagram_reels_set_updated_at
  before update on public.instagram_reels
  for each row
  execute function public.set_updated_at();

alter table public.instagram_reels enable row level security;

drop policy if exists "Public read published instagram reels" on public.instagram_reels;
create policy "Public read published instagram reels"
  on public.instagram_reels
  for select
  to anon
  using (is_published = true);

drop policy if exists "Authenticated read instagram reels" on public.instagram_reels;
create policy "Authenticated read instagram reels"
  on public.instagram_reels
  for select
  to authenticated
  using (true);

drop policy if exists "Editors manage instagram reels" on public.instagram_reels;
create policy "Editors manage instagram reels"
  on public.instagram_reels
  for all
  to authenticated
  using (true)
  with check (true);
