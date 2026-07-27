# `@seo/db`

Shared Supabase client factories for brand apps (e.g. CAE Admin) and future surfaces.

## Exports

| Export | Role |
|--------|------|
| `requireSupabasePublicEnv(env)` | Validates `url` + `anonKey` |
| `createBrowserClient(env)` | Browser / React island client |
| `createServerClient(env, cookies)` | Astro SSR / middleware client (cookie session) |
| `parseCookieHeader(header)` | Helper for `cookies.getAll` in Astro |
| `SupabasePublicEnv` / `SupabaseCookieMethods` | Shared types |

## Astro middleware (cookie session)

Pass Astro request/response cookies into `createServerClient` with the modern
`getAll` / `setAll` API (compatible with `@supabase/ssr`):

```ts
import { defineMiddleware } from "astro:middleware";
import {
  createServerClient,
  parseCookieHeader,
} from "@seo/db";

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(
    {
      url: import.meta.env.PUBLIC_SUPABASE_URL,
      anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    },
    {
      getAll() {
        return parseCookieHeader(context.request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, options);
        });
      },
    },
  );

  // Refresh / validate session before the response is committed.
  await supabase.auth.getUser();

  context.locals.supabase = supabase;
  return next();
});
```

## Browser islands

```ts
import { createBrowserClient } from "@seo/db";

const supabase = createBrowserClient({
  url: import.meta.env.PUBLIC_SUPABASE_URL,
  anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
});
```

Do not invent ad-hoc env wiring in apps — extend this package instead.
