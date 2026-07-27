/**
 * @fileoverview Blog domain types and site-scoped Supabase query helpers.
 *
 * Callers create a Supabase client (via `@seo/db`) and pass it into every helper.
 * Public helpers are safe with the anon key; Admin helpers require an authenticated session.
 */

export type {
  Author,
  BlogPost,
  Category,
  CreateCategoryInput,
  CreatePostInput,
  FaqItem,
  ListPostsOptions,
  ListPublishedPostsOptions,
  PostStatus,
  PublishedPostsPage,
  SourceItem,
  UpdatePostInput,
  UpsertAuthorInput,
} from "./types.js";

export type { BlogSupabaseClient, Database } from "./database.js";

export { readingTimeMinutesFromMarkdown } from "./reading-time.js";

export { isPostLive, isPostScheduled } from "./visibility.js";
export type { PostVisibilityFields } from "./visibility.js";

export {
  getPublishedPostBySlug,
  listPublishedPosts,
  listPublishedPostsPage,
} from "./posts-public.js";

export {
  createPost,
  deletePost,
  getPostById,
  listPosts,
  updatePost,
} from "./posts-admin.js";

export { getAuthorForSite, upsertAuthorForSite } from "./authors.js";

export {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from "./categories.js";

/**
 * Package identity constant (kept for smoke imports / diagnostics).
 */
export const blogPackageName = "@seo/blog" as const;
