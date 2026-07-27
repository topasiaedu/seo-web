/**
 * @fileoverview Map snake_case DB rows to camelCase domain types.
 */

import type { AuthorRow, CategoryRow, Json, PostRowWithJoins } from "./database.js";
import type { Author, BlogPost, Category, FaqItem, PostStatus, SourceItem } from "./types.js";

/**
 * Narrows an unknown value to a plain object record.
 *
 * @param value - Candidate value.
 * @returns Whether `value` is a non-null, non-array object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Parses `faq` jsonb into a typed array; invalid entries are skipped.
 *
 * @param value - Raw jsonb from Supabase.
 * @returns Valid FAQ items only.
 */
export function parseFaq(value: Json): FaqItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const items: FaqItem[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) {
      continue;
    }
    const question = entry["question"];
    const answer = entry["answer"];
    if (typeof question !== "string" || typeof answer !== "string") {
      continue;
    }
    items.push({ question, answer });
  }
  return items;
}

/**
 * Parses `sources` jsonb into a typed array; invalid entries are skipped.
 *
 * @param value - Raw jsonb from Supabase.
 * @returns Valid source items only.
 */
export function parseSources(value: Json): SourceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const items: SourceItem[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) {
      continue;
    }
    const label = entry["label"];
    if (typeof label !== "string") {
      continue;
    }
    const url = entry["url"];
    if (url === undefined || url === null) {
      items.push({ label });
      continue;
    }
    if (typeof url !== "string") {
      continue;
    }
    items.push({ label, url });
  }
  return items;
}

/**
 * Normalizes a joined row that may arrive as an object, a one-element array, or null.
 *
 * @param value - Nested select result from PostgREST.
 * @returns The single row or `null`.
 */
function unwrapJoinRow<T>(value: T | T[] | null | undefined): T | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    const first = value[0];
    return first === undefined ? null : first;
  }
  return value;
}

/**
 * Maps an `authors` row to the domain `Author` type.
 *
 * @param row - Database author row.
 * @returns Domain author.
 */
export function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    bio: row.bio,
    photoUrl: row.photo_url,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps a `categories` row to the domain `Category` type.
 *
 * @param row - Database category row.
 * @returns Domain category.
 */
export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    siteId: row.site_id,
    slug: row.slug,
    name: row.name,
  };
}

/**
 * Asserts a posts.status string is a known {@link PostStatus}.
 *
 * @param status - Raw status from the database.
 * @returns Typed status.
 * @throws If the value is not a known status.
 */
function mapPostStatus(status: string): PostStatus {
  if (status === "draft" || status === "published" || status === "archived") {
    return status;
  }
  throw new Error(`@seo/blog: unexpected post status "${status}"`);
}

/**
 * Maps a posts row (optionally with author/category joins) to {@link BlogPost}.
 *
 * @param row - Database post row, possibly including nested joins.
 * @returns Domain blog post.
 */
export function mapBlogPost(row: PostRowWithJoins): BlogPost {
  const authorRow = unwrapJoinRow(row.author);
  const categoryRow = unwrapJoinRow(row.category);

  return {
    id: row.id,
    siteId: row.site_id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyMd: row.body_md,
    status: mapPostStatus(row.status),
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    authorId: row.author_id,
    readingTimeMinutes: row.reading_time_minutes,
    heroImageUrl: row.hero_image_url,
    heroImageAlt: row.hero_image_alt,
    ogImageUrl: row.og_image_url,
    keyTakeaway: row.key_takeaway,
    faq: parseFaq(row.faq ?? []),
    sources: parseSources(row.sources ?? []),
    categoryId: row.category_id,
    tags: row.tags ?? [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    relatedPostIds: row.related_post_ids ?? [],
    author: authorRow === null ? null : mapAuthor(authorRow),
    category: categoryRow === null ? null : mapCategory(categoryRow),
  };
}

/**
 * Serializes FAQ items for a jsonb column write.
 *
 * @param items - Domain FAQ items.
 * @returns Plain JSON-compatible array.
 */
export function serializeFaq(items: readonly FaqItem[]): Json {
  return items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}

/**
 * Serializes source items for a jsonb column write.
 *
 * @param items - Domain source items.
 * @returns Plain JSON-compatible array.
 */
export function serializeSources(items: readonly SourceItem[]): Json {
  return items.map((item) => {
    if (item.url === undefined) {
      return { label: item.label };
    }
    return { label: item.label, url: item.url };
  });
}
