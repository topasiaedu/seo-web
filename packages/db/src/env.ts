/**
 * @fileoverview Public Supabase env validation shared by browser and server clients.
 */

/**
 * Public env bag required to talk to Supabase from the browser or server.
 */
export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

/**
 * Raw public env input before validation (e.g. `import.meta.env` values).
 */
export type SupabasePublicEnvInput = {
  url: string | undefined;
  anonKey: string | undefined;
};

/**
 * Validates and returns Supabase public credentials.
 *
 * @param env - Raw URL and anon key values (often from `import.meta.env`).
 * @returns Normalized credentials.
 * @throws If either value is missing or blank.
 */
export function requireSupabasePublicEnv(
  env: SupabasePublicEnvInput,
): SupabasePublicEnv {
  const url = env.url?.trim() ?? "";
  const anonKey = env.anonKey?.trim() ?? "";
  if (url.length === 0 || anonKey.length === 0) {
    throw new Error(
      "@seo/db: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are required.",
    );
  }
  return { url, anonKey };
}
