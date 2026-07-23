# Package: @seo/db

Path: `packages/db`

## Current exports

| Export | Role |
|--------|------|
| `SupabasePublicEnv` | `{ url, anonKey }` type |
| `requireSupabasePublicEnv(env)` | Validates public URL + anon key |
| `dbPackageName` | Placeholder `"@seo/db"` |

Depends on `@supabase/supabase-js` but does **not** instantiate clients yet. No generated DB types.

## Planned

- `createBrowserClient()`
- `createServerClient(cookies)`

Sites/CMS must not invent ad-hoc env wiring — extend this package instead.
