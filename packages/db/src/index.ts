/**
 * @fileoverview Shared Supabase client factory for all sites and Admin surfaces.
 *
 * ## Astro middleware cookie wiring
 *
 * `createServerClient` expects a `@supabase/ssr`-compatible cookie adapter with
 * `getAll` (and ideally `setAll` so refreshed tokens persist). In Astro:
 *
 * 1. Call `createServerClient` inside middleware (and optionally attach to `locals`).
 * 2. Implement `getAll` with `parseCookieHeader` on the request `Cookie` header.
 * 3. Implement `setAll` by calling `context.cookies.set(name, value, options)`
 *    for each cookie (ignore cache headers if the framework sets them elsewhere).
 * 4. Call `supabase.auth.getUser()` (or `getClaims()`) early so refreshes run
 *    before the response is committed.
 *
 * Browser/React islands should use `createBrowserClient` instead — it stores the
 * session in cookies via `document.cookie` and does not take a cookie adapter.
 *
 * @see README.md for a complete middleware snippet.
 */

export {
  requireSupabasePublicEnv,
  type SupabasePublicEnv,
  type SupabasePublicEnvInput,
} from "./env.js";

export {
  createBrowserClient,
  createServerClient,
} from "./clients.js";

export type {
  CookieOptions,
  GetAllCookies,
  SetAllCookies,
  SupabaseCookieMethods,
} from "./cookies.js";

/**
 * Parses a raw `Cookie` request header into `{ name, value }` pairs for
 * `createServerClient` `getAll` handlers.
 */
export { parseCookieHeader } from "@supabase/ssr";

/**
 * Package identity constant (useful in diagnostics / smoke checks).
 */
export const dbPackageName = "@seo/db" as const;
