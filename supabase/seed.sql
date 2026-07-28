-- Seed site rows. UUIDs must match website/*/config.ts projectId values.
-- CAE site_id: 00000000-0000-4000-8000-000000000001

insert into public.sites (id, slug, name, domains)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'cae',
    'CAE',
    array['cae.localhost']
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'dr-jasmine',
    'Dr Jasmine',
    array['dr-jasmine.localhost']
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- CAE Author (one byline profile per site). Editable later in Admin.
-- ---------------------------------------------------------------------------

insert into public.authors (site_id, name, bio, photo_url)
values (
  '00000000-0000-4000-8000-000000000001',
  'Cae Goh',
  '',
  ''
)
on conflict (site_id) do nothing;

-- ---------------------------------------------------------------------------
-- CAE starter Categories (site-scoped). Admin may add/rename later.
-- ---------------------------------------------------------------------------

insert into public.categories (site_id, slug, name)
values
  ('00000000-0000-4000-8000-000000000001', 'zi-wei-dou-shu', 'Zi Wei Dou Shu'),
  ('00000000-0000-4000-8000-000000000001', 'life-strategy', 'Life Strategy'),
  ('00000000-0000-4000-8000-000000000001', 'relationships', 'Relationships'),
  ('00000000-0000-4000-8000-000000000001', 'career-business', 'Career & Business'),
  ('00000000-0000-4000-8000-000000000001', 'consultations', 'Consultations'),
  ('00000000-0000-4000-8000-000000000001', 'academy', 'Academy'),
  ('00000000-0000-4000-8000-000000000001', 'speaking-media', 'Speaking & Media')
on conflict (site_id, slug) do nothing;

-- ---------------------------------------------------------------------------
-- Dr Jasmine Author (one byline profile per site). Editable later in Admin.
-- ---------------------------------------------------------------------------

insert into public.authors (site_id, name, bio, photo_url)
values (
  '00000000-0000-4000-8000-000000000002',
  'Dr Jasmine',
  '',
  ''
)
on conflict (site_id) do nothing;

-- ---------------------------------------------------------------------------
-- Dr Jasmine starter Categories (site-scoped). Admin may add/rename later.
-- ---------------------------------------------------------------------------

insert into public.categories (site_id, slug, name)
values
  ('00000000-0000-4000-8000-000000000002', 'diabetes-reversal', 'Diabetes Reversal'),
  ('00000000-0000-4000-8000-000000000002', 'blood-sugar', 'Blood Sugar'),
  ('00000000-0000-4000-8000-000000000002', 'metabolic-health', 'Metabolic Health'),
  ('00000000-0000-4000-8000-000000000002', 'nutrition-lifestyle', 'Nutrition & Lifestyle'),
  ('00000000-0000-4000-8000-000000000002', 'patient-stories', 'Patient Stories'),
  ('00000000-0000-4000-8000-000000000002', 'workshops-webinars', 'Workshops & Webinars')
on conflict (site_id, slug) do nothing;
