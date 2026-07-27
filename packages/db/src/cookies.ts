/**
 * @fileoverview Cookie adapter types for Astro (and other SSR) session wiring.
 */

import type {
  CookieMethodsServer,
  CookieOptions,
  GetAllCookies,
  SetAllCookies,
} from "@supabase/ssr";

/**
 * Cookie options passed when writing auth session cookies.
 * Re-exported from `@supabase/ssr` for call-site typing.
 */
export type { CookieOptions };

/**
 * Reads all request cookies as `{ name, value }` pairs.
 * Prefer this over per-cookie `get` (deprecated in `@supabase/ssr`).
 */
export type { GetAllCookies };

/**
 * Writes auth cookies (and optional cache-control headers) onto the response.
 * Prefer this over per-cookie `set` / `remove` (deprecated in `@supabase/ssr`).
 */
export type { SetAllCookies };

/**
 * Cookie methods required by {@link createServerClient}.
 *
 * Astro middleware should implement `getAll` + `setAll` so token refreshes
 * persist on the response. `setAll` may be omitted on pages that cannot mutate
 * cookies (middleware must still refresh the session).
 *
 * @see README.md for an Astro middleware example.
 */
export type SupabaseCookieMethods = CookieMethodsServer;
