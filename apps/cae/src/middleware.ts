/**
 * @fileoverview CAE request middleware: Supabase cookie session + Admin auth gate.
 *
 * Protects `/admin/**` under Astro `base: "/cae/"` except `/admin/login`.
 * Unauthenticated Admin requests redirect to the login page.
 */

import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";
import {
  createServerClient,
  parseCookieHeader,
  type CookieOptions,
  type SupabaseCookieMethods,
} from "@seo/db";

/**
 * Per-request Supabase client created by {@link createServerClient}.
 */
type RequestSupabaseClient = ReturnType<typeof createServerClient>;

/**
 * Cookie name/value pair written via Astro `cookies.set`.
 */
type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Strips Astro `base` from a request pathname so route checks use app-relative paths.
 *
 * @param pathname - Full URL pathname (may include base, e.g. `/cae/admin`).
 * @param baseUrl - Astro `import.meta.env.BASE_URL` (e.g. `/cae/`).
 * @returns Path relative to the app root (e.g. `/admin`).
 */
function pathnameWithoutBase(pathname: string, baseUrl: string): string {
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (trimmedBase.length === 0 || trimmedBase === "/") {
    return pathname.length > 0 ? pathname : "/";
  }
  if (pathname === trimmedBase) {
    return "/";
  }
  if (pathname.startsWith(`${trimmedBase}/`)) {
    const rest = pathname.slice(trimmedBase.length);
    return rest.length > 0 ? rest : "/";
  }
  return pathname;
}

/**
 * Joins Astro `base` with an app-relative path for redirects and links.
 *
 * @param baseUrl - Astro `import.meta.env.BASE_URL` (e.g. `/cae/`).
 * @param path - App-relative path (with or without leading slash).
 * @returns Absolute-from-origin path including base (e.g. `/cae/admin/login`).
 */
function joinBase(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const relative = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${relative}`;
}

/**
 * Returns true when the app path is under Admin and is not the login page.
 *
 * @param appPath - Path without Astro base (e.g. `/admin/posts`).
 * @returns Whether the route requires an authenticated Admin user.
 */
function isProtectedAdminPath(appPath: string): boolean {
  if (appPath === "/admin/login" || appPath.startsWith("/admin/login/")) {
    return false;
  }
  return appPath === "/admin" || appPath.startsWith("/admin/");
}

/**
 * Builds a per-request Supabase server client wired to Astro cookies.
 *
 * @param context - Astro middleware context (request + cookies).
 * @returns Supabase client bound to this request's cookie jar.
 */
function createRequestSupabase(context: APIContext): RequestSupabaseClient {
  const cookieMethods: SupabaseCookieMethods = {
    getAll() {
      return parseCookieHeader(context.request.headers.get("Cookie") ?? "");
    },
    setAll(cookiesToSet: CookieToSet[]) {
      cookiesToSet.forEach(({ name, value, options }) => {
        context.cookies.set(name, value, options);
      });
    },
  };

  return createServerClient(
    {
      url: import.meta.env.PUBLIC_SUPABASE_URL,
      anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    },
    cookieMethods,
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered marketing pages have no request cookies; skip session wiring.
  if (context.isPrerendered) {
    return next();
  }

  const supabase = createRequestSupabase(context);
  context.locals.supabase = supabase;

  // Refresh / validate session before the response is committed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appPath = pathnameWithoutBase(
    context.url.pathname,
    import.meta.env.BASE_URL,
  );

  if (isProtectedAdminPath(appPath) && user === null) {
    return context.redirect(joinBase(import.meta.env.BASE_URL, "admin/login"));
  }

  return next();
});
