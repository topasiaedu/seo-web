-- Seed site rows. UUIDs must match website/*/config.ts projectId values.

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
