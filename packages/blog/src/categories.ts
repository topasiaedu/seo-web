/**
 * @fileoverview Site-scoped Category list / create / rename / delete helpers.
 */

import type { BlogSupabaseClient, CategoryInsert } from "./database.js";
import { throwOnError } from "./errors.js";
import { mapCategory } from "./mappers.js";
import type { Category, CreateCategoryInput } from "./types.js";

/**
 * Lists Categories for a site, sorted by name ascending.
 *
 * @param client - Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @returns Categories belonging to the site.
 */
export async function listCategories(
  client: BlogSupabaseClient,
  siteId: string,
): Promise<Category[]> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog listCategories: siteId must be a non-empty string",
    );
  }

  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("site_id", siteId)
    .order("name", { ascending: true });

  throwOnError(error, "listCategories");

  return (data ?? []).map(mapCategory);
}

/**
 * Creates a Category under a site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param input - Slug and display name.
 * @returns The created category.
 */
export async function createCategory(
  client: BlogSupabaseClient,
  siteId: string,
  input: CreateCategoryInput,
): Promise<Category> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog createCategory: siteId must be a non-empty string",
    );
  }
  if (typeof input.slug !== "string" || input.slug.trim().length === 0) {
    throw new TypeError(
      "@seo/blog createCategory: slug must be a non-empty string",
    );
  }
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    throw new TypeError(
      "@seo/blog createCategory: name must be a non-empty string",
    );
  }

  const row: CategoryInsert = {
    site_id: siteId,
    slug: input.slug.trim(),
    name: input.name.trim(),
  };

  const { data, error } = await client
    .from("categories")
    .insert(row)
    .select("*")
    .single();

  throwOnError(error, "createCategory");

  if (data === null) {
    throw new Error("@seo/blog createCategory: insert returned no row");
  }

  return mapCategory(data);
}

/**
 * Renames a Category scoped by `siteId` + `categoryId` (slug unchanged).
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param categoryId - Category UUID.
 * @param name - New display name.
 * @returns The updated category.
 * @throws If no matching row exists for the site.
 */
export async function renameCategory(
  client: BlogSupabaseClient,
  siteId: string,
  categoryId: string,
  name: string,
): Promise<Category> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog renameCategory: siteId must be a non-empty string",
    );
  }
  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog renameCategory: categoryId must be a non-empty string",
    );
  }
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new TypeError(
      "@seo/blog renameCategory: name must be a non-empty string",
    );
  }

  const { data, error } = await client
    .from("categories")
    .update({ name: name.trim() })
    .eq("site_id", siteId)
    .eq("id", categoryId)
    .select("*")
    .maybeSingle();

  throwOnError(error, "renameCategory");

  if (data === null) {
    throw new Error("@seo/blog renameCategory: category not found for site");
  }

  return mapCategory(data);
}

/**
 * Deletes a Category scoped by `siteId` + `categoryId`.
 *
 * Posts that referenced this category keep their rows; `posts.category_id`
 * is set to null by the database foreign key (`ON DELETE SET NULL`).
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param categoryId - Category UUID.
 * @throws If no matching row exists for the site.
 */
export async function deleteCategory(
  client: BlogSupabaseClient,
  siteId: string,
  categoryId: string,
): Promise<void> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog deleteCategory: siteId must be a non-empty string",
    );
  }
  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    throw new TypeError(
      "@seo/blog deleteCategory: categoryId must be a non-empty string",
    );
  }

  const { data, error } = await client
    .from("categories")
    .delete()
    .eq("site_id", siteId)
    .eq("id", categoryId)
    .select("id")
    .maybeSingle();

  throwOnError(error, "deleteCategory");

  if (data === null) {
    throw new Error("@seo/blog deleteCategory: category not found for site");
  }
}
