/**
 * @fileoverview Dr Jasmine Admin logout endpoint — clears the Supabase Auth session.
 *
 * POST only. Clears cookies via the middleware-bound server client, then
 * redirects to the login page. There is no signup route.
 */

import type { APIRoute } from "astro";
import { joinAdminPath, requireLocalsSupabase } from "../../lib/admin-auth";

/**
 * Builds a 405 response for non-POST methods.
 *
 * @param method - HTTP method from the request.
 * @returns Plain-text 405 with `Allow: POST`.
 */
function methodNotAllowed(method: string): Response {
  return new Response(`Method ${method} not allowed. Use POST.`, {
    status: 405,
    headers: {
      Allow: "POST",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

/**
 * Signs the current Admin user out and redirects to login.
 *
 * @param context - Astro API context (locals, redirect).
 * @returns Redirect response to `/dr-jasmine/admin/login` (respecting base).
 */
export const POST: APIRoute = async ({ locals, redirect }) => {
  const loginPath = joinAdminPath(import.meta.env.BASE_URL, "admin/login");
  const supabase = requireLocalsSupabase(locals.supabase);

  const { error } = await supabase.auth.signOut();
  if (error !== null) {
    // Session may already be gone; still send the user to login.
    console.error("[dr-jasmine-admin] signOut failed:", error.message);
  }

  return redirect(loginPath);
};

/**
 * Rejects GET so logout is not triggered by prefetch or accidental navigation.
 *
 * @param context - Astro API context.
 * @returns 405 Method Not Allowed.
 */
export const GET: APIRoute = async ({ request }) => {
  return methodNotAllowed(request.method);
};
