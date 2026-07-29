/**
 * @fileoverview Bulk Post import parsing for Dr Jasmine Admin.
 *
 * Authors write one or more Posts in a single Markdown document. Each Post is
 * a YAML frontmatter block (`---` ... `---`) followed by its Markdown body.
 * Multiple posts in one document are separated by a line containing only
 * `===NEW POST===`.
 *
 * This module only parses and validates text into a typed, review-ready
 * shape. It never talks to Supabase — {@link BulkImportForm} resolves
 * categories, uploads images, and calls `@seo/blog` `createPost` per row.
 */

import type { BlogSupabaseClient } from "@seo/blog";
import { load as loadYaml } from "js-yaml";

/** Canonical divider line writers place between posts in one document. */
export const POST_DIVIDER_LINE = "===NEW POST===";

/** Divider line between posts in a bulk-import document (case/space-insensitive). */
const POST_DIVIDER_PATTERN = /^[ \t]*={3,}\s*NEW POST\s*={3,}[ \t]*$/im;

/** Frontmatter block: opening `---`, YAML body, closing `---`, then the Markdown body. */
const FRONTMATTER_PATTERN = /^\s*---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/;

/** Strips HTML comment blocks (used for writer/LLM instructions in templates). */
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/g;

/** Slug format enforced across single and bulk Post creation. */
export const SLUG_FORMAT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Public Storage bucket for brand media assets. */
const MEDIA_BUCKET_ID = "media" as const;

/** Object-key prefix for Dr Jasmine Post hero / OG cover images (inside the media bucket). */
export const DJ_BLOG_COVERS_PREFIX = "dr-jasmine/blog/covers" as const;

/** Maximum accepted cover upload size (5 MiB). */
const MAX_BLOG_COVER_BYTES = 5 * 1024 * 1024;

/**
 * Converts a title into a URL-safe slug (draft auto-slug helper).
 *
 * Shared by the bulk-import parser so rows derive the same slug from the same
 * title as the single-Post Admin form (CAE parity).
 *
 * @param title - Post title text.
 * @returns Lowercase hyphenated slug (may be empty for a title with no
 *   alphanumeric characters).
 */
export function slugifyTitle(title: string): string {
  if (typeof title !== "string") {
    throw new TypeError("slugifyTitle: title must be a string");
  }

  return title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * Sanitizes a browser filename for use in a Storage object key.
 *
 * @param filename - Original `File.name` from the browser.
 * @returns Lowercase safe filename with a fallback when empty.
 */
function sanitizeStorageFilename(filename: string): string {
  if (typeof filename !== "string") {
    throw new TypeError("sanitizeStorageFilename: filename must be a string");
  }

  const base = filename.trim().toLowerCase();
  const cleaned = base.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
  if (cleaned.length === 0 || cleaned === "." || cleaned === "..") {
    return "cover";
  }
  return cleaned.slice(0, 120);
}

/**
 * Validates that a candidate is a non-empty image File within size limits.
 *
 * @param file - Candidate upload (may be null when the file input is empty).
 * @returns The same File when valid.
 * @throws When the file is missing, not an image, or too large.
 */
function assertBlogCoverImageFile(file: File | null): File {
  if (file === null) {
    throw new Error("Choose an image file to upload.");
  }
  if (!(file instanceof File)) {
    throw new TypeError("assertBlogCoverImageFile: expected a File");
  }
  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }
  if (typeof file.type !== "string" || !file.type.startsWith("image/")) {
    throw new Error("Cover upload must be an image file.");
  }
  if (file.size > MAX_BLOG_COVER_BYTES) {
    throw new Error("Cover image must be 5 MB or smaller.");
  }
  return file;
}

/**
 * Uploads a Post cover image to Supabase Storage and returns its public URL.
 *
 * Object key: `dr-jasmine/blog/covers/{timestamp}-{sanitized-filename}`.
 *
 * @param client - Authenticated Supabase client (browser or server).
 * @param file - Validated image file.
 * @returns Public HTTPS URL for the uploaded object.
 */
export async function uploadBulkImportCoverImage(
  client: BlogSupabaseClient,
  file: File,
): Promise<string> {
  if (client === null || typeof client !== "object") {
    throw new TypeError("uploadBulkImportCoverImage: client is required");
  }

  const imageFile = assertBlogCoverImageFile(file);
  const timestamp = Date.now().toString(10);
  const sanitizedName = sanitizeStorageFilename(imageFile.name);
  const objectPath = [DJ_BLOG_COVERS_PREFIX, `${timestamp}-${sanitizedName}`].join("/");

  const uploadResult = await client.storage.from(MEDIA_BUCKET_ID).upload(objectPath, imageFile, {
    upsert: false,
    contentType: imageFile.type,
    cacheControl: "3600",
  });

  if (uploadResult.error !== null) {
    throw new Error(`Cover upload failed: ${uploadResult.error.message}`);
  }

  const publicResult = client.storage.from(MEDIA_BUCKET_ID).getPublicUrl(objectPath);
  const publicUrl = publicResult.data.publicUrl;
  if (typeof publicUrl !== "string" || publicUrl.trim().length === 0) {
    throw new Error("Cover upload succeeded but no public URL was returned.");
  }

  return publicUrl.trim();
}

/**
 * Prepares raw bulk-import text for parsing.
 *
 * Removes HTML comment blocks (template instructions for writers/LLMs) so a
 * pasted annotated template still imports correctly.
 *
 * @param raw - Pasted or uploaded document text.
 * @returns Text with instructional HTML comments removed.
 */
export function prepareBulkImportRawText(raw: string): string {
  if (typeof raw !== "string") {
    throw new TypeError("prepareBulkImportRawText: raw must be a string");
  }
  return raw.replace(HTML_COMMENT_PATTERN, "").trim();
}

/** Writer-facing publish intent, matching the Admin Post form's status options. */
export type BulkImportStatusIntent = "draft" | "published" | "scheduled" | "archived";

/** One FAQ entry parsed from frontmatter. */
export type BulkImportFaqItem = {
  question: string;
  answer: string;
};

/** One source/citation entry parsed from frontmatter. */
export type BulkImportSourceItem = {
  label: string;
  url?: string;
};

/**
 * One parsed Post entry from a bulk-import document.
 *
 * `categoryAction` / `categoryId` / `slugConflict` start at their "unresolved"
 * defaults from {@link parseBulkImportDocument} and are filled in by
 * {@link resolveBulkImportRows} once the caller supplies the site's existing
 * categories and slugs. Hero images are attached per post in the Admin UI
 * (not by filename in the Markdown).
 */
export type ParsedBulkPost = {
  /** 1-based position in the source document (for user-facing messages). */
  index: number;
  title: string;
  slug: string;
  slugWasExplicit: boolean;
  excerpt: string;
  bodyMd: string;
  categoryName: string | null;
  tags: string[];
  keyTakeaway: string | null;
  /** Optional already-hosted cover URL from frontmatter. */
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  faq: BulkImportFaqItem[];
  sources: BulkImportSourceItem[];
  statusIntent: BulkImportStatusIntent;
  /**
   * Always `null` after parse — go-live times come from Admin section 4
   * (Malaysia Time), not Markdown. Kept on the type so the form can merge UI
   * schedule state without reshaping the row.
   */
  publishAtIso: string | null;
  /** Blocking problems; a row with any entry here cannot be imported. */
  errors: string[];
  /** Non-blocking, informational notes shown in the preview. */
  notes: string[];
  /** Filled in by {@link resolveBulkImportRows}. */
  slugConflict: "duplicate" | "existing" | null;
  /** Filled in by {@link resolveBulkImportRows}. */
  categoryAction: "match" | "create" | "none";
  /** Filled in by {@link resolveBulkImportRows}; set when `categoryAction === "match"`. */
  categoryId: string | null;
};

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
 * Reads an optional trimmed string field from parsed frontmatter.
 *
 * @param data - Parsed frontmatter object.
 * @param key - Field name.
 * @returns Trimmed string, or `null` when absent / blank / not a string.
 */
function readOptionalString(data: Record<string, unknown>, key: string): string | null {
  const value = data[key];
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Reads a string array field (e.g. `tags`) from parsed frontmatter.
 *
 * @param data - Parsed frontmatter object.
 * @param key - Field name.
 * @returns Trimmed, non-empty, de-duplicated (case-insensitive) strings.
 */
function readStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value)) {
    return [];
  }

  const seenLower = new Set<string>();
  const result: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }
    const trimmed = entry.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) {
      continue;
    }
    const lower = trimmed.toLowerCase();
    if (seenLower.has(lower)) {
      continue;
    }
    seenLower.add(lower);
    result.push(trimmed);
  }
  return result;
}

/**
 * Reads and validates the `faq` frontmatter array.
 *
 * @param data - Parsed frontmatter object.
 * @param notes - Mutable notes array; skipped entries are recorded here.
 * @returns Valid FAQ items only.
 */
function readFaqArray(data: Record<string, unknown>, notes: string[]): BulkImportFaqItem[] {
  const value = data["faq"];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    notes.push("`faq` was not a list — ignored.");
    return [];
  }

  const items: BulkImportFaqItem[] = [];
  value.forEach((entry, entryIndex) => {
    if (!isRecord(entry)) {
      notes.push(`FAQ item ${String(entryIndex + 1)} skipped: not an object.`);
      return;
    }
    const question = typeof entry["question"] === "string" ? entry["question"].trim() : "";
    const answer = typeof entry["answer"] === "string" ? entry["answer"].trim() : "";
    if (question.length === 0 || answer.length === 0) {
      notes.push(`FAQ item ${String(entryIndex + 1)} skipped: needs question and answer.`);
      return;
    }
    items.push({ question, answer });
  });
  return items;
}

/**
 * Reads and validates the `sources` frontmatter array.
 *
 * @param data - Parsed frontmatter object.
 * @param notes - Mutable notes array; skipped entries are recorded here.
 * @returns Valid source items only.
 */
function readSourcesArray(
  data: Record<string, unknown>,
  notes: string[],
): BulkImportSourceItem[] {
  const value = data["sources"];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    notes.push("`sources` was not a list — ignored.");
    return [];
  }

  const items: BulkImportSourceItem[] = [];
  value.forEach((entry, entryIndex) => {
    if (!isRecord(entry)) {
      notes.push(`Source ${String(entryIndex + 1)} skipped: not an object.`);
      return;
    }
    const label = typeof entry["label"] === "string" ? entry["label"].trim() : "";
    if (label.length === 0) {
      notes.push(`Source ${String(entryIndex + 1)} skipped: needs a label.`);
      return;
    }
    const rawUrl = entry["url"];
    if (typeof rawUrl === "string" && rawUrl.trim().length > 0) {
      items.push({ label, url: rawUrl.trim() });
      return;
    }
    items.push({ label });
  });
  return items;
}

/**
 * Converts a frontmatter `status` value into a {@link BulkImportStatusIntent}.
 *
 * @param data - Parsed frontmatter object.
 * @param errors - Mutable errors array; an invalid value is recorded here.
 * @returns The status intent (defaults to `"draft"` when absent).
 */
function readStatusIntent(data: Record<string, unknown>, errors: string[]): BulkImportStatusIntent {
  const raw = data["status"];
  if (raw === undefined || raw === null) {
    return "draft";
  }
  if (typeof raw !== "string") {
    errors.push('"status" must be one of: draft, published, scheduled, archived.');
    return "draft";
  }
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "draft" ||
    normalized === "published" ||
    normalized === "scheduled" ||
    normalized === "archived"
  ) {
    return normalized;
  }
  errors.push(
    `"status: ${raw}" is not valid. Use one of: draft, published, scheduled, archived.`,
  );
  return "draft";
}

/**
 * Splits a bulk-import document into raw per-post chunks.
 *
 * @param raw - Full pasted / uploaded document text.
 * @returns Non-blank chunks, one per Post, in document order.
 */
export function splitBulkImportDocument(raw: string): string[] {
  if (typeof raw !== "string") {
    throw new TypeError("splitBulkImportDocument: raw must be a string");
  }

  return raw
    .split(POST_DIVIDER_PATTERN)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

/**
 * Parses one raw chunk (frontmatter + body) into a {@link ParsedBulkPost}.
 *
 * Cross-entry fields (`slugConflict`, `categoryAction`, `categoryId`) are left
 * at their unresolved defaults; call {@link resolveBulkImportRows} to fill them in.
 *
 * @param index - 1-based position in the source document.
 * @param chunk - Trimmed chunk text for one Post.
 * @returns The parsed entry.
 */
export function parseBulkImportEntry(index: number, chunk: string): ParsedBulkPost {
  const errors: string[] = [];
  const notes: string[] = [];

  const match = FRONTMATTER_PATTERN.exec(chunk);
  if (match === null) {
    errors.push('Missing frontmatter block. Start the post with "---", metadata, then "---".');
    return {
      index,
      title: "",
      slug: "",
      slugWasExplicit: false,
      excerpt: "",
      bodyMd: "",
      categoryName: null,
      tags: [],
      keyTakeaway: null,
      heroImageUrl: null,
      heroImageAlt: null,
      faq: [],
      sources: [],
      statusIntent: "draft",
      publishAtIso: null,
      errors,
      notes,
      slugConflict: null,
      categoryAction: "none",
      categoryId: null,
    };
  }

  const frontmatterYaml = match[1] ?? "";
  const body = match[2] ?? "";

  let data: Record<string, unknown> = {};
  try {
    const loaded: unknown = loadYaml(frontmatterYaml);
    if (isRecord(loaded)) {
      data = loaded;
    } else if (loaded !== undefined && loaded !== null) {
      errors.push("Frontmatter must be a set of `key: value` fields.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "could not parse YAML.";
    errors.push(`Frontmatter could not be read: ${message}`);
  }

  const title = readOptionalString(data, "title") ?? "";
  if (title.length === 0) {
    errors.push("Missing title.");
  }

  const explicitSlug = readOptionalString(data, "slug");
  const slugWasExplicit = explicitSlug !== null;
  const slug = explicitSlug ?? slugifyTitle(title);
  if (slugWasExplicit && !SLUG_FORMAT_PATTERN.test(slug)) {
    errors.push("Slug must be lowercase letters, numbers, and hyphens only.");
  } else if (slug.length === 0) {
    errors.push("Could not derive a slug from the title — add an explicit `slug` field.");
  }

  const statusIntent = readStatusIntent(data, errors);
  const bodyMd = body.trim();
  if ((statusIntent === "published" || statusIntent === "scheduled") && bodyMd.length === 0) {
    errors.push(`Body is required to ${statusIntent === "scheduled" ? "schedule" : "publish"} a post.`);
  }

  const publishAtRaw = data["publishAt"] ?? data["publishedAt"];
  if (publishAtRaw !== undefined && publishAtRaw !== null) {
    notes.push(
      "`publishAt` in the Markdown is ignored — set go-live times in section 4 (Malaysia Time).",
    );
  }

  const heroImageUrlRaw = readOptionalString(data, "heroImageUrl");
  const heroImageUrl =
    heroImageUrlRaw !== null && /^https?:\/\//i.test(heroImageUrlRaw) ? heroImageUrlRaw : null;
  if (heroImageUrlRaw !== null && heroImageUrl === null) {
    errors.push('"heroImageUrl" must start with http:// or https://.');
  }
  if (readOptionalString(data, "heroImage") !== null) {
    notes.push(
      "`heroImage` in the Markdown is ignored — upload a cover for this post in section 3.",
    );
  }

  return {
    index,
    title,
    slug,
    slugWasExplicit,
    excerpt: readOptionalString(data, "excerpt") ?? "",
    bodyMd,
    categoryName: readOptionalString(data, "category"),
    tags: readStringArray(data, "tags"),
    keyTakeaway: readOptionalString(data, "keyTakeaway"),
    heroImageUrl,
    heroImageAlt: readOptionalString(data, "heroImageAlt"),
    faq: readFaqArray(data, notes),
    sources: readSourcesArray(data, notes),
    statusIntent,
    /** Go-live times are set in Admin section 4; Markdown publishAt is ignored. */
    publishAtIso: null,
    errors,
    notes,
    slugConflict: null,
    categoryAction: "none",
    categoryId: null,
  };
}

/**
 * Parses a full bulk-import document into per-post entries.
 *
 * @param raw - Full pasted / uploaded document text (one or more posts).
 * @returns Parsed entries in document order (may be empty for blank input).
 */
export function parseBulkImportDocument(raw: string): ParsedBulkPost[] {
  const prepared = prepareBulkImportRawText(raw);
  return splitBulkImportDocument(prepared).map((chunk, chunkIndex) =>
    parseBulkImportEntry(chunkIndex + 1, chunk),
  );
}

/** Minimal category shape needed to resolve `category` names against known rows. */
export type BulkImportCategoryLookup = {
  id: string;
  name: string;
};

/** Inputs needed to resolve cross-entry fields on a batch of parsed rows. */
export type ResolveBulkImportRowsOptions = {
  /** Existing site categories (case-insensitive name match). */
  categories: readonly BulkImportCategoryLookup[];
  /** Slugs already used by Posts on this site. */
  existingSlugs: ReadonlySet<string>;
};

/**
 * Fills in cross-entry fields that a single-entry parse cannot know:
 * duplicate/conflicting slugs and category match-or-create.
 *
 * Pure function — returns a new array; does not mutate `entries`.
 * Hero images are attached per post in the Admin UI, not resolved here.
 *
 * @param entries - Rows from {@link parseBulkImportDocument}.
 * @param options - Site categories and existing slugs.
 * @returns New rows with cross-entry fields resolved.
 */
export function resolveBulkImportRows(
  entries: readonly ParsedBulkPost[],
  options: ResolveBulkImportRowsOptions,
): ParsedBulkPost[] {
  const { categories, existingSlugs } = options;

  const slugFirstSeenAt = new Map<string, number>();
  for (const entry of entries) {
    if (entry.slug.length === 0) {
      continue;
    }
    if (!slugFirstSeenAt.has(entry.slug)) {
      slugFirstSeenAt.set(entry.slug, entry.index);
    }
  }

  const categoriesByLowerName = new Map<string, BulkImportCategoryLookup>();
  for (const category of categories) {
    categoriesByLowerName.set(category.name.trim().toLowerCase(), category);
  }

  return entries.map((entry) => {
    let slugConflict: ParsedBulkPost["slugConflict"] = null;
    if (entry.slug.length > 0) {
      const firstSeenAt = slugFirstSeenAt.get(entry.slug);
      if (firstSeenAt !== undefined && firstSeenAt !== entry.index) {
        slugConflict = "duplicate";
      } else if (existingSlugs.has(entry.slug)) {
        slugConflict = "existing";
      }
    }

    let categoryAction: ParsedBulkPost["categoryAction"] = "none";
    let categoryId: string | null = null;
    if (entry.categoryName !== null) {
      const matched = categoriesByLowerName.get(entry.categoryName.trim().toLowerCase());
      if (matched !== undefined) {
        categoryAction = "match";
        categoryId = matched.id;
      } else {
        categoryAction = "create";
      }
    }

    return {
      ...entry,
      slugConflict,
      categoryAction,
      categoryId,
    };
  });
}

/**
 * Whether a resolved row can be imported as-is.
 *
 * @param entry - A row returned by {@link resolveBulkImportRows}.
 * @returns `true` when there are no blocking errors or slug conflicts.
 */
export function isBulkImportRowReady(entry: ParsedBulkPost): boolean {
  return entry.errors.length === 0 && entry.slugConflict === null;
}
