/**
 * @fileoverview Site-scoped Author helpers (one Author per brand).
 */

import type { AuthorInsert, BlogSupabaseClient } from "./database.js";
import { throwOnError } from "./errors.js";
import { mapAuthor } from "./mappers.js";
import type { Author, UpsertAuthorInput } from "./types.js";

/**
 * Loads the single Author profile for a site, or `null` if none exists yet.
 *
 * @param client - Supabase client (anon may work once RLS allows public author read).
 * @param siteId - Brand `sites.id` UUID.
 * @returns The site Author, or `null`.
 */
export async function getAuthorForSite(
  client: BlogSupabaseClient,
  siteId: string,
): Promise<Author | null> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog getAuthorForSite: siteId must be a non-empty string",
    );
  }

  const { data, error } = await client
    .from("authors")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();

  throwOnError(error, "getAuthorForSite");

  if (data === null) {
    return null;
  }

  return mapAuthor(data);
}

/**
 * Creates or updates the single Author row for a site (`site_id` unique).
 *
 * Uses upsert on `site_id` so brands never get a second Author profile.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param input - Name / bio / photo fields.
 * @returns The upserted Author.
 */
export async function upsertAuthorForSite(
  client: BlogSupabaseClient,
  siteId: string,
  input: UpsertAuthorInput,
): Promise<Author> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog upsertAuthorForSite: siteId must be a non-empty string",
    );
  }
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    throw new TypeError(
      "@seo/blog upsertAuthorForSite: name must be a non-empty string",
    );
  }

  const row: AuthorInsert = {
    site_id: siteId,
    name: input.name.trim(),
  };

  if (input.bio !== undefined) {
    row.bio = input.bio;
  }
  if (input.photoUrl !== undefined) {
    row.photo_url = input.photoUrl;
  }

  const { data, error } = await client
    .from("authors")
    .upsert(row, { onConflict: "site_id" })
    .select("*")
    .single();

  throwOnError(error, "upsertAuthorForSite");

  if (data === null) {
    throw new Error("@seo/blog upsertAuthorForSite: upsert returned no row");
  }

  return mapAuthor(data);
}
