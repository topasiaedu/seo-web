/**
 * @fileoverview Public (anon-safe) published Post queries.
 */

import type { BlogSupabaseClient, PostRowWithJoins } from "./database.js";
import { throwOnError } from "./errors.js";
import { mapBlogPost } from "./mappers.js";
import type {
  BlogPost,
  ListPublishedPostsOptions,
  PublishedPostsPage,
} from "./types.js";

/** Nested select that hydrates author and category when FKs are set. */
const POST_SELECT_WITH_JOINS =
  "*, author:authors(*), category:categories(*)" as const;

/**
 * Validates a non-empty site id string for public query helpers.
 *
 * @param siteId - Brand `sites.id` UUID.
 * @param fnName - Helper name for error messages.
 */
function assertSiteId(siteId: string, fnName: string): void {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(`@seo/blog ${fnName}: siteId must be a non-empty string`);
  }
}

/**
 * Resolves a category id for a site + slug, or `null` when missing.
 *
 * @param client - Supabase client (anon or authenticated).
 * @param siteId - Brand `sites.id` UUID.
 * @param categorySlug - Category URL slug.
 * @returns Category UUID, or `null`.
 */
async function resolveCategoryIdBySlug(
  client: BlogSupabaseClient,
  siteId: string,
  categorySlug: string,
): Promise<string | null> {
  const slug = categorySlug.trim();
  if (slug.length === 0) {
    return null;
  }

  const { data, error } = await client
    .from("categories")
    .select("id")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();

  throwOnError(error, "resolveCategoryIdBySlug");

  if (data === null || typeof data.id !== "string") {
    return null;
  }

  return data.id;
}

/**
 * Lists published Posts for a site, newest `published_at` first.
 *
 * Safe to call with an anon Supabase client (RLS allows public read of published).
 * Prefer {@link listPublishedPostsPage} for index UIs that need paging/filters.
 *
 * @param client - Supabase client (anon or authenticated).
 * @param siteId - Brand `sites.id` UUID.
 * @returns Published posts with nested author/category when present.
 */
export async function listPublishedPosts(
  client: BlogSupabaseClient,
  siteId: string,
): Promise<BlogPost[]> {
  assertSiteId(siteId, "listPublishedPosts");

  const { data, error } = await client
    .from("posts")
    .select(POST_SELECT_WITH_JOINS)
    .eq("site_id", siteId)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false, nullsFirst: false });

  throwOnError(error, "listPublishedPosts");

  const rows = (data ?? []) as PostRowWithJoins[];
  return rows.map(mapBlogPost);
}

/**
 * Lists a page of published Posts with optional category filter.
 *
 * When `categorySlug` does not match a category for the site, returns an empty
 * page (`total: 0`) so the index can show a clear empty state.
 *
 * @param client - Supabase client (anon or authenticated).
 * @param siteId - Brand `sites.id` UUID.
 * @param options - Optional category slug, limit, and offset.
 * @returns Page of posts plus total matching count.
 */
export async function listPublishedPostsPage(
  client: BlogSupabaseClient,
  siteId: string,
  options: ListPublishedPostsOptions = {},
): Promise<PublishedPostsPage> {
  assertSiteId(siteId, "listPublishedPostsPage");

  const rawLimit = options.limit;
  const rawOffset = options.offset;
  const limit =
    typeof rawLimit === "number" && Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.floor(rawLimit), 100)
      : 12;
  const offset =
    typeof rawOffset === "number" && Number.isFinite(rawOffset) && rawOffset > 0
      ? Math.floor(rawOffset)
      : 0;

  const categorySlug =
    typeof options.categorySlug === "string" ? options.categorySlug.trim() : "";

  let categoryId: string | null = null;
  if (categorySlug.length > 0) {
    categoryId = await resolveCategoryIdBySlug(client, siteId, categorySlug);
    if (categoryId === null) {
      return { posts: [], total: 0 };
    }
  }

  // Same ISO instant for count + page so pagination totals stay consistent.
  const liveAtIso = new Date().toISOString();

  let countQuery = client
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", liveAtIso);

  if (categoryId !== null) {
    countQuery = countQuery.eq("category_id", categoryId);
  }

  const { count, error: countError } = await countQuery;
  throwOnError(countError, "listPublishedPostsPage.count");

  const total = typeof count === "number" && count >= 0 ? count : 0;

  let pageQuery = client
    .from("posts")
    .select(POST_SELECT_WITH_JOINS)
    .eq("site_id", siteId)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", liveAtIso)
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (categoryId !== null) {
    pageQuery = pageQuery.eq("category_id", categoryId);
  }

  const { data, error } = await pageQuery;
  throwOnError(error, "listPublishedPostsPage");

  const rows = (data ?? []) as PostRowWithJoins[];
  return {
    posts: rows.map(mapBlogPost),
    total,
  };
}

/**
 * Loads one published Post by slug for a site, or `null` if not found / not published.
 *
 * Safe to call with an anon Supabase client.
 *
 * @param client - Supabase client (anon or authenticated).
 * @param siteId - Brand `sites.id` UUID.
 * @param slug - URL slug under `/blog/{slug}`.
 * @returns The published post, or `null`.
 */
export async function getPublishedPostBySlug(
  client: BlogSupabaseClient,
  siteId: string,
  slug: string,
): Promise<BlogPost | null> {
  assertSiteId(siteId, "getPublishedPostBySlug");
  if (typeof slug !== "string" || slug.trim().length === 0) {
    throw new TypeError(
      "@seo/blog getPublishedPostBySlug: slug must be a non-empty string",
    );
  }

  const { data, error } = await client
    .from("posts")
    .select(POST_SELECT_WITH_JOINS)
    .eq("site_id", siteId)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  throwOnError(error, "getPublishedPostBySlug");

  if (data === null) {
    return null;
  }

  return mapBlogPost(data as PostRowWithJoins);
}
