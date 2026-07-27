/// <reference types="astro/client" />

/**
 * Public and server env vars available to the CAE Astro app.
 */
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  /** Absolute origin for SEO URLs, e.g. `https://caegoh.com`. */
  readonly PUBLIC_SITE_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Per-request locals attached by `src/middleware.ts`.
 */
declare namespace App {
  interface Locals {
    /**
     * Supabase server client bound to this request's cookies.
     * Omitted while prerendering static marketing pages.
     */
    supabase?: ReturnType<typeof import("@seo/db").createServerClient>;
  }
}
