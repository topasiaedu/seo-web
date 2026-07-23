-- Multi-site schema scaffold for SEO website monorepo.
-- Apply when connecting Supabase; projectIds in website/*/config.ts match seed UUIDs.

create extension if not exists "pgcrypto";

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  domains text[] not null default '{}',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  slug text not null,
  title text not null,
  excerpt text not null default '',
  body_md text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  author_id uuid,
  unique (site_id, slug)
);

create index if not exists posts_site_id_status_idx
  on public.posts (site_id, status);

alter table public.sites enable row level security;
alter table public.posts enable row level security;

-- Public can read published posts only.
create policy "Public read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

-- Public can read sites (for domain/slug metadata if needed).
create policy "Public read sites"
  on public.sites
  for select
  to anon, authenticated
  using (true);

-- Authenticated editors can manage posts (tighten with roles later).
create policy "Editors manage posts"
  on public.posts
  for all
  to authenticated
  using (true)
  with check (true);
