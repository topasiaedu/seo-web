/**
 * @fileoverview Authenticated Admin Post CRUD helpers (always site-scoped).
 */

import type {
  BlogSupabaseClient,
  PostInsert,
  PostRowWithJoins,
  PostUpdate,
} from "./database.js";
import { throwOnError } from "./errors.js";
import { mapBlogPost, serializeFaq, serializeSources } from "./mappers.js";
import type {
  BlogPost,
  CreatePostInput,
  ListPostsOptions,
  PostStatus,
  UpdatePostInput,
} from "./types.js";

/** Nested select that hydrates author and category when FKs are set. */
const POST_SELECT_WITH_JOINS =
  "*, author:authors(*), category:categories(*)" as const;

/**
 * Normalizes a status filter into a non-empty list, or `undefined` for “all”.
 *
 * @param status - Single status, list, or omitted.
 * @returns Statuses to pass to `.in()`, or `undefined`.
 */
function normalizeStatusFilter(
  status: ListPostsOptions["status"],
): PostStatus[] | undefined {
  if (status === undefined) {
    return undefined;
  }
  if (typeof status === "string") {
    return [status];
  }
  return [...status];
}

/**
 * When `status` is explicitly `"published"` and `publishedAt` is null/undefined,
 * stamps `published_at` to now (Decision 1). Does not throw.
 *
 * A bare `{ publishedAt: null }` without an explicit `status: "published"` in
 * the same call does **not** trigger this stamp.
 *
 * @param status - Optional status from create/update input.
 * @param publishedAt - Optional go-live timestamp from the same call.
 * @returns ISO timestamp to write, `null` when clearing without publish, or
 *   `undefined` when the field should be omitted from the patch/insert.
 */
function resolvePublishedAtForWrite(
  status: PostStatus | undefined,
  publishedAt: string | null | undefined,
): string | null | undefined {
  if (status === "published" && (publishedAt === null || publishedAt === undefined)) {
    return new Date().toISOString();
  }
  return publishedAt;
}

/**
 * Coerces optional text to `""` for Postgres `NOT NULL DEFAULT ''` columns.
 *
 * Explicit `null` does not use the column default and violates the constraint;
 * empty string is the domain “no override / no value” sentinel.
 *
 * @param value - Domain string, or `null` meaning clear / unset.
 * @returns Non-null string for the insert/update row.
 */
function notNullText(value: string | null): string {
  return value ?? "";
}

/**
 * Maps {@link CreatePostInput} to a posts insert row.
 *
 * @param input - Domain create payload.
 * @returns Snake_case insert object.
 */
function toPostInsert(input: CreatePostInput): PostInsert {
  const row: PostInsert = {
    site_id: input.siteId,
    slug: input.slug,
    title: input.title,
  };

  if (input.excerpt !== undefined) {
    row.excerpt = input.excerpt;
  }
  if (input.bodyMd !== undefined) {
    row.body_md = input.bodyMd;
  }
  if (input.status !== undefined) {
    row.status = input.status;
  }
  const publishedAt = resolvePublishedAtForWrite(input.status, input.publishedAt);
  if (publishedAt !== undefined) {
    row.published_at = publishedAt;
  }
  if (input.authorId !== undefined) {
    row.author_id = input.authorId;
  }
  if (input.readingTimeMinutes !== undefined) {
    row.reading_time_minutes = input.readingTimeMinutes;
  }
  if (input.heroImageUrl !== undefined) {
    row.hero_image_url = notNullText(input.heroImageUrl);
  }
  if (input.heroImageAlt !== undefined) {
    row.hero_image_alt = notNullText(input.heroImageAlt);
  }
  if (input.ogImageUrl !== undefined) {
    row.og_image_url = notNullText(input.ogImageUrl);
  }
  if (input.keyTakeaway !== undefined) {
    row.key_takeaway = notNullText(input.keyTakeaway);
  }
  if (input.faq !== undefined) {
    row.faq = serializeFaq(input.faq);
  }
  if (input.sources !== undefined) {
    row.sources = serializeSources(input.sources);
  }
  if (input.categoryId !== undefined) {
    row.category_id = input.categoryId;
  }
  if (input.tags !== undefined) {
    row.tags = input.tags;
  }
  if (input.seoTitle !== undefined) {
    row.seo_title = notNullText(input.seoTitle);
  }
  if (input.seoDescription !== undefined) {
    row.seo_description = notNullText(input.seoDescription);
  }
  if (input.relatedPostIds !== undefined) {
    row.related_post_ids = input.relatedPostIds;
  }

  return row;
}

/**
 * Maps {@link UpdatePostInput} to a posts update row.
 *
 * @param input - Domain update payload.
 * @returns Snake_case update object.
 */
function toPostUpdate(input: UpdatePostInput): PostUpdate {
  const row: PostUpdate = {};

  if (input.slug !== undefined) {
    row.slug = input.slug;
  }
  if (input.title !== undefined) {
    row.title = input.title;
  }
  if (input.excerpt !== undefined) {
    row.excerpt = input.excerpt;
  }
  if (input.bodyMd !== undefined) {
    row.body_md = input.bodyMd;
  }
  if (input.status !== undefined) {
    row.status = input.status;
  }
  const publishedAt = resolvePublishedAtForWrite(input.status, input.publishedAt);
  if (publishedAt !== undefined) {
    row.published_at = publishedAt;
  }
  if (input.authorId !== undefined) {
    row.author_id = input.authorId;
  }
  if (input.readingTimeMinutes !== undefined) {
    row.reading_time_minutes = input.readingTimeMinutes;
  }
  if (input.heroImageUrl !== undefined) {
    row.hero_image_url = notNullText(input.heroImageUrl);
  }
  if (input.heroImageAlt !== undefined) {
    row.hero_image_alt = notNullText(input.heroImageAlt);
  }
  if (input.ogImageUrl !== undefined) {
    row.og_image_url = notNullText(input.ogImageUrl);
  }
  if (input.keyTakeaway !== undefined) {
    row.key_takeaway = notNullText(input.keyTakeaway);
  }
  if (input.faq !== undefined) {
    row.faq = serializeFaq(input.faq);
  }
  if (input.sources !== undefined) {
    row.sources = serializeSources(input.sources);
  }
  if (input.categoryId !== undefined) {
    row.category_id = input.categoryId;
  }
  if (input.tags !== undefined) {
    row.tags = input.tags;
  }
  if (input.seoTitle !== undefined) {
    row.seo_title = notNullText(input.seoTitle);
  }
  if (input.seoDescription !== undefined) {
    row.seo_description = notNullText(input.seoDescription);
  }
  if (input.relatedPostIds !== undefined) {
    row.related_post_ids = input.relatedPostIds;
  }

  return row;
}

/**
 * Lists Posts for a site (any status), newest `updated_at` first.
 *
 * Requires an authenticated client with RLS permission to manage posts.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param options - Optional status filter.
 * @returns Matching posts with nested author/category when present.
 */
export async function listPosts(
  client: BlogSupabaseClient,
  siteId: string,
  options: ListPostsOptions = {},
): Promise<BlogPost[]> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError("@seo/blog listPosts: siteId must be a non-empty string");
  }

  let query = client
    .from("posts")
    .select(POST_SELECT_WITH_JOINS)
    .eq("site_id", siteId)
    .order("updated_at", { ascending: false });

  const statuses = normalizeStatusFilter(options.status);
  if (statuses !== undefined && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;
  throwOnError(error, "listPosts");

  const rows = (data ?? []) as PostRowWithJoins[];
  return rows.map(mapBlogPost);
}

/**
 * Loads one Post by id for a site, or `null` if missing / wrong site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param postId - Post UUID.
 * @returns The post, or `null`.
 */
export async function getPostById(
  client: BlogSupabaseClient,
  siteId: string,
  postId: string,
): Promise<BlogPost | null> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError("@seo/blog getPostById: siteId must be a non-empty string");
  }
  if (typeof postId !== "string" || postId.trim().length === 0) {
    throw new TypeError("@seo/blog getPostById: postId must be a non-empty string");
  }

  const { data, error } = await client
    .from("posts")
    .select(POST_SELECT_WITH_JOINS)
    .eq("site_id", siteId)
    .eq("id", postId)
    .maybeSingle();

  throwOnError(error, "getPostById");

  if (data === null) {
    return null;
  }

  return mapBlogPost(data as PostRowWithJoins);
}

/**
 * Creates a Post for a site.
 *
 * When `input.status` is `"published"` and `publishedAt` is null/undefined,
 * silently stamps `published_at` to now (Decision 1). A bare
 * `{ publishedAt: null }` without `status: "published"` does not stamp.
 *
 * @param client - Authenticated Supabase client.
 * @param input - Create payload (`siteId` required).
 * @returns The created post (with joins when FKs resolve).
 */
export async function createPost(
  client: BlogSupabaseClient,
  input: CreatePostInput,
): Promise<BlogPost> {
  if (typeof input.siteId !== "string" || input.siteId.trim().length === 0) {
    throw new TypeError("@seo/blog createPost: siteId must be a non-empty string");
  }
  if (typeof input.slug !== "string" || input.slug.trim().length === 0) {
    throw new TypeError("@seo/blog createPost: slug must be a non-empty string");
  }
  if (typeof input.title !== "string" || input.title.trim().length === 0) {
    throw new TypeError("@seo/blog createPost: title must be a non-empty string");
  }

  const { data, error } = await client
    .from("posts")
    .insert(toPostInsert(input))
    .select(POST_SELECT_WITH_JOINS)
    .single();

  throwOnError(error, "createPost");

  if (data === null) {
    throw new Error("@seo/blog createPost: insert returned no row");
  }

  return mapBlogPost(data as PostRowWithJoins);
}

/**
 * Updates a Post scoped by `siteId` + `postId`.
 *
 * **Slug lock:** Callers must not change `slug` after the Post is first published.
 * The Admin UI enforces this; this helper does not reject a slug change on its own.
 *
 * When `input.status` is explicitly `"published"` and `publishedAt` is
 * null/undefined, silently stamps `published_at` to now (Decision 1). A bare
 * `{ publishedAt: null }` without `status: "published"` in the same call does
 * not trigger the stamp.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param postId - Post UUID.
 * @param input - Partial fields to update.
 * @returns The updated post.
 * @throws If no matching row exists for the site.
 */
export async function updatePost(
  client: BlogSupabaseClient,
  siteId: string,
  postId: string,
  input: UpdatePostInput,
): Promise<BlogPost> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError("@seo/blog updatePost: siteId must be a non-empty string");
  }
  if (typeof postId !== "string" || postId.trim().length === 0) {
    throw new TypeError("@seo/blog updatePost: postId must be a non-empty string");
  }

  const patch = toPostUpdate(input);
  if (Object.keys(patch).length === 0) {
    const existing = await getPostById(client, siteId, postId);
    if (existing === null) {
      throw new Error("@seo/blog updatePost: post not found for site");
    }
    return existing;
  }

  const { data, error } = await client
    .from("posts")
    .update(patch)
    .eq("site_id", siteId)
    .eq("id", postId)
    .select(POST_SELECT_WITH_JOINS)
    .maybeSingle();

  throwOnError(error, "updatePost");

  if (data === null) {
    throw new Error("@seo/blog updatePost: post not found for site");
  }

  return mapBlogPost(data as PostRowWithJoins);
}

/**
 * Permanently deletes a Post scoped by `siteId` + `postId` (hard delete).
 *
 * Distinct from archiving (`status = "archived"`).
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param postId - Post UUID.
 * @throws If no matching row exists for the site.
 */
export async function deletePost(
  client: BlogSupabaseClient,
  siteId: string,
  postId: string,
): Promise<void> {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError("@seo/blog deletePost: siteId must be a non-empty string");
  }
  if (typeof postId !== "string" || postId.trim().length === 0) {
    throw new TypeError("@seo/blog deletePost: postId must be a non-empty string");
  }

  const { data, error } = await client
    .from("posts")
    .delete()
    .eq("site_id", siteId)
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  throwOnError(error, "deletePost");

  if (data === null) {
    throw new Error("@seo/blog deletePost: post not found for site");
  }
}
