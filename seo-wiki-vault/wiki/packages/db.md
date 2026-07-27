# Package: @seo/db

Path: `packages/db`

Shared Supabase env validation and client factories for all sites and Admin surfaces.

## Current exports

| Export | Role |
|--------|------|
| `SupabasePublicEnv` | `{ url, anonKey }` type |
| `requireSupabasePublicEnv(env)` | Validates public URL + anon key |
| `createBrowserClient()` | Browser / React-island client (cookie session via `document.cookie`) |
| `createServerClient(cookies)` | SSR / Astro middleware client (`@supabase/ssr` cookie adapter) |
| `parseCookieHeader` | Re-export from `@supabase/ssr` for Astro `getAll` |
| Cookie types | `SupabaseCookieMethods`, `GetAllCookies`, `SetAllCookies`, `CookieOptions` |
| `dbPackageName` | `"@seo/db"` constant |

Depends on `@supabase/supabase-js` and `@supabase/ssr`. See package `README.md` for Astro middleware cookie wiring.

## Usage

- **Admin / SSR pages:** `createServerClient` in middleware (and attach to `locals` as needed); call `auth.getUser()` early so refreshes run.
- **React islands (login, forms):** `createBrowserClient`.
- Sites and future CMS must not invent ad-hoc env wiring — extend this package instead.

Never expose the service role in the browser.

## Related

- Blog queries: [@seo/blog](blog.md)
- Schema / RLS: [supabase](../architecture/supabase.md)
