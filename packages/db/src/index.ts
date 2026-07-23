/**
 * @fileoverview Shared Supabase client factory for all sites and the CMS.
 */

/**
 * Public env bag required to talk to Supabase from the browser or server.
 */
export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

/**
 * Validates and returns Supabase public credentials.
 *
 * @param env - Raw URL and anon key values (often from `import.meta.env`).
 * @returns Normalized credentials.
 * @throws If either value is missing or blank.
 */
export function requireSupabasePublicEnv(env: {
  url: string | undefined;
  anonKey: string | undefined;
}): SupabasePublicEnv {
  const url = env.url?.trim() ?? "";
  const anonKey = env.anonKey?.trim() ?? "";
  if (url.length === 0 || anonKey.length === 0) {
    throw new Error(
      "@seo/db: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are required.",
    );
  }
  return { url, anonKey };
}

/**
 * Placeholder export so the package resolves before client helpers land.
 * Call sites will use `createBrowserClient` / `createServerClient` next.
 */
export const dbPackageName = "@seo/db" as const;
