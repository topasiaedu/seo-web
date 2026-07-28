/**
 * @fileoverview Shared helpers for Dr Jasmine Admin login / logout flows.
 */

import type { createServerClient } from "@seo/db";

/**
 * Supabase server client attached by middleware (`Astro.locals.supabase`).
 */
export type LocalsSupabaseClient = ReturnType<typeof createServerClient>;

/**
 * Joins Astro `base` with an app-relative Admin path.
 *
 * @param baseUrl - Astro `import.meta.env.BASE_URL` (e.g. `/dr-jasmine/`).
 * @param path - App-relative path (with or without leading slash), e.g. `admin/login`.
 * @returns Absolute-from-origin path including base (e.g. `/dr-jasmine/admin/login`).
 */
export function joinAdminPath(baseUrl: string, path: string): string {
  if (typeof baseUrl !== "string") {
    throw new Error("joinAdminPath requires a string baseUrl.");
  }
  if (typeof path !== "string" || path.trim().length === 0) {
    throw new Error("joinAdminPath requires a non-empty path.");
  }
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const relative = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${relative}`;
}

/**
 * Returns the request-scoped Supabase client or throws when middleware did not attach one.
 *
 * @param supabase - `Astro.locals.supabase` (may be undefined on prerendered routes).
 * @returns Bound server client for this request.
 */
export function requireLocalsSupabase(
  supabase: LocalsSupabaseClient | undefined,
): LocalsSupabaseClient {
  if (supabase === undefined) {
    throw new Error(
      "Supabase client missing from locals; Admin routes require middleware session wiring.",
    );
  }
  return supabase;
}

/**
 * Maps Supabase Auth sign-in failures to short, user-facing messages.
 *
 * @param message - Raw `AuthError.message` from Supabase (or empty).
 * @returns Clear copy suitable for the login form.
 */
export function mapLoginErrorMessage(message: string): string {
  const normalized = typeof message === "string" ? message.trim().toLowerCase() : "";

  if (normalized.length === 0) {
    return "Sign-in failed. Check your email and password, then try again.";
  }
  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (normalized.includes("email not confirmed")) {
    return "This email is not confirmed yet. Confirm it in Supabase Auth, then try again.";
  }
  if (normalized.includes("user not found")) {
    return "No Admin user exists for that email.";
  }
  if (normalized.includes("too many requests") || normalized.includes("rate limit")) {
    return "Too many sign-in attempts. Wait a moment and try again.";
  }
  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "Could not reach the auth service. Check your connection and try again.";
  }

  return "Sign-in failed. Check your email and password, then try again.";
}

/**
 * Validates email/password fields from a login form submission.
 *
 * @param email - Candidate email string.
 * @param password - Candidate password string.
 * @returns Trimmed credentials, or an error message when invalid.
 */
export function parseLoginCredentials(
  email: unknown,
  password: unknown,
): { email: string; password: string } | { error: string } {
  if (typeof email !== "string" || email.trim().length === 0) {
    return { error: "Enter your email address." };
  }
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter your password." };
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail.includes("@") || trimmedEmail.length < 3) {
    return { error: "Enter a valid email address." };
  }

  return { email: trimmedEmail, password };
}
