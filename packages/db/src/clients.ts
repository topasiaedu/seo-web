/**
 * @fileoverview Supabase client factories for browser islands and Astro SSR.
 */

import {
  createBrowserClient as createSsrBrowserClient,
  createServerClient as createSsrServerClient,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { SupabaseCookieMethods } from "./cookies.js";
import {
  requireSupabasePublicEnv,
  type SupabasePublicEnvInput,
} from "./env.js";

/**
 * Creates a Supabase client for React islands / browser code.
 *
 * Session cookies are managed via `document.cookie` by `@supabase/ssr`.
 * Pass the same public URL and anon key used on the server.
 *
 * @param env - Public Supabase URL and anon key (validated via {@link requireSupabasePublicEnv}).
 * @returns A browser-scoped Supabase client.
 *
 * @example
 * ```ts
 * const supabase = createBrowserClient({
 *   url: import.meta.env.PUBLIC_SUPABASE_URL,
 *   anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
 * });
 * ```
 */
export function createBrowserClient(
  env: SupabasePublicEnvInput,
): SupabaseClient {
  const { url, anonKey } = requireSupabasePublicEnv(env);
  return createSsrBrowserClient(url, anonKey);
}

/**
 * Creates a per-request Supabase client for Astro middleware, pages, and APIs.
 *
 * Always construct a new client per request — never share across requests.
 * Wire `cookies.getAll` / `cookies.setAll` to Astro's cookie APIs so auth
 * token refreshes are written back to the response.
 *
 * @param env - Public Supabase URL and anon key (validated via {@link requireSupabasePublicEnv}).
 * @param cookies - Cookie adapter (`getAll` required; `setAll` recommended in middleware).
 * @returns A server-scoped Supabase client bound to the request cookies.
 *
 * @example
 * ```ts
 * // In Astro middleware (see package README for full wiring):
 * const supabase = createServerClient(
 *   {
 *     url: import.meta.env.PUBLIC_SUPABASE_URL,
 *     anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
 *   },
 *   {
 *     getAll: () => parseCookieHeader(context.request.headers.get("Cookie") ?? ""),
 *     setAll: (cookiesToSet) => {
 *       cookiesToSet.forEach(({ name, value, options }) => {
 *         context.cookies.set(name, value, options);
 *       });
 *     },
 *   },
 * );
 * ```
 */
export function createServerClient(
  env: SupabasePublicEnvInput,
  cookies: SupabaseCookieMethods,
): SupabaseClient {
  const { url, anonKey } = requireSupabasePublicEnv(env);
  return createSsrServerClient(url, anonKey, { cookies });
}
