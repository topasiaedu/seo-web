/**
 * @fileoverview Shared error helper for Supabase query results.
 */

/**
 * Throws a package-scoped error when a Supabase response includes `error`.
 *
 * @param error - Supabase error object or null.
 * @param context - Short description of the failing operation.
 * @throws Error with a `@seo/blog` prefix when `error` is non-null.
 */
export function throwOnError(
  error: { message: string } | null,
  context: string,
): void {
  if (error !== null) {
    throw new Error(`@seo/blog ${context}: ${error.message}`);
  }
}
