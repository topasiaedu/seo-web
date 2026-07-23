# Site: Dr Jasmine

| Field | Value |
|-------|--------|
| Code home | (not scaffolded — planned `apps/dr-jasmine`) |
| Slug | `dr-jasmine` |
| Project id | `00000000-0000-4000-8000-000000000002` |
| Domains (planned) | `dr-jasmine.localhost` |
| Status | **Deferred** — independent `@seo/dr-jasmine` app not started |

## Independent app (deferred)

Do not scaffold `apps/dr-jasmine` yet. Follow-on plan: [independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

The legacy `website/dr-jasmine/` stub was removed with the `website/` shell. Scaffold under `apps/dr-jasmine` when unblocked (same pattern as `apps/cae`).

## Activation checklist (when started)

1. Scaffold `@seo/dr-jasmine` under `apps/dr-jasmine` with `base: "/dr-jasmine/"`
2. Add gateway proxy `/dr-jasmine` → port 4323
3. Confirm Supabase seed row (already present)
4. Attach production domain when ready for public SEO
5. Update this wiki page + `overview.md` + `log.md`
