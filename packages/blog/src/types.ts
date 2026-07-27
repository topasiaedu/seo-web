/**
 * @fileoverview Domain types for posts, authors, categories, and Admin inputs.
 */

/**
 * Allowed publication states for a Post row.
 */
export type PostStatus = "draft" | "published" | "archived";

/**
 * One FAQ entry stored on a Post (`faq` jsonb).
 */
export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * One citation / source entry stored on a Post (`sources` jsonb).
 */
export type SourceItem = {
  label: string;
  url?: string;
};

/**
 * Site-scoped byline profile (one Author per brand / `site_id`).
 */
export type Author = {
  id: string;
  siteId: string;
  name: string;
  bio: string;
  photoUrl: string | null;
  updatedAt: string;
};

/**
 * Site-scoped Category used for grouping Posts.
 */
export type Category = {
  id: string;
  siteId: string;
  slug: string;
  name: string;
};

/**
 * Full Post shape returned by public and Admin query helpers.
 *
 * Nested `author` / `category` are populated when the query joins those tables;
 * otherwise they are `null`.
 */
export type BlogPost = {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string;
  authorId: string | null;
  readingTimeMinutes: number | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  ogImageUrl: string | null;
  keyTakeaway: string | null;
  faq: FaqItem[];
  sources: SourceItem[];
  categoryId: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  relatedPostIds: string[];
  author: Author | null;
  category: Category | null;
};

/**
 * Fields accepted when creating a Post (Admin).
 *
 * Callers should set `siteId` to the brand’s `sites.id` UUID.
 * Slug may be chosen freely while the Post is a draft; after first publish,
 * callers must not change `slug` (Admin UI enforces the lock).
 */
export type CreatePostInput = {
  siteId: string;
  slug: string;
  title: string;
  excerpt?: string;
  bodyMd?: string;
  status?: PostStatus;
  publishedAt?: string | null;
  authorId?: string | null;
  readingTimeMinutes?: number | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  ogImageUrl?: string | null;
  keyTakeaway?: string | null;
  faq?: FaqItem[];
  sources?: SourceItem[];
  categoryId?: string | null;
  tags?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  relatedPostIds?: string[];
};

/**
 * Partial fields accepted when updating a Post (Admin).
 *
 * `siteId` is never updated here — scope is always applied via the query filter.
 *
 * **Slug lock:** Callers must not change `slug` after the Post is first published.
 * Enforcement lives in the Admin UI (v1); these helpers do not reject a slug change.
 */
export type UpdatePostInput = {
  slug?: string;
  title?: string;
  excerpt?: string;
  bodyMd?: string;
  status?: PostStatus;
  publishedAt?: string | null;
  authorId?: string | null;
  readingTimeMinutes?: number | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  ogImageUrl?: string | null;
  keyTakeaway?: string | null;
  faq?: FaqItem[];
  sources?: SourceItem[];
  categoryId?: string | null;
  tags?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  relatedPostIds?: string[];
};

/**
 * Optional filters for Admin post lists.
 */
export type ListPostsOptions = {
  /** When set, only Posts with one of these statuses are returned. */
  status?: PostStatus | readonly PostStatus[];
};

/**
 * Fields for creating or updating the single Author row for a site.
 */
export type UpsertAuthorInput = {
  name: string;
  bio?: string;
  photoUrl?: string | null;
};

/**
 * Fields for creating a Category under a site.
 */
export type CreateCategoryInput = {
  slug: string;
  name: string;
};

/**
 * Optional filters / paging for public published post lists (blog index).
 */
export type ListPublishedPostsOptions = {
  /** When set, only posts in this category slug are returned. */
  categorySlug?: string;
  /** Max rows to return (clamped server-side; default 12). */
  limit?: number;
  /** Row offset for paging (default 0). */
  offset?: number;
};

/**
 * One page of published posts plus total matching count.
 */
export type PublishedPostsPage = {
  posts: BlogPost[];
  total: number;
};
