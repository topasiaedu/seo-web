/**
 * @fileoverview CAE site identity — keep in sync with Supabase `sites` row for slug `cae`.
 */

/**
 * Code-side description of a deployable brand module.
 */
export type SiteConfig = {
  /** URL and folder slug, e.g. `"cae"`. */
  slug: string;
  /**
   * Supabase `sites.id` UUID.
   * Use a placeholder until seed migration assigns the real id.
   */
  projectId: string;
  /** Human-readable brand name. */
  name: string;
  /** Production hostnames that map to this site (no protocol). */
  domains: readonly string[];
  /** When false, site exists but is not registered for routing yet. */
  enabled: boolean;
};

/**
 * CAE brand configuration.
 * Replace `projectId` with the UUID from `supabase/seed.sql` after migration.
 */
export const caeSiteConfig = {
  slug: "cae",
  projectId: "00000000-0000-4000-8000-000000000001",
  name: "CAE",
  /** Local gateway hosts; production SEO origin is `PUBLIC_SITE_ORIGIN` / caegoh.com. */
  domains: ["cae.localhost", "www.cae.localhost", "caegoh.com", "www.caegoh.com"],
  enabled: true,
} as const satisfies SiteConfig;
