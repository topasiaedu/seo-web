/**
 * @fileoverview Site-scoped curated Instagram Reel CRUD for Dr Jasmine Admin / public pages.
 *
 * Max six published reels per site (app-enforced). Staff paste a permalink only;
 * Instagram’s official embed supplies title/caption on the public page.
 */

import type {
  BlogSupabaseClient,
  InstagramReelInsert,
  InstagramReelRow,
  InstagramReelUpdate,
} from "@seo/blog";

/** Maximum published (and total curated) reels shown on the public page. */
export const MAX_INSTAGRAM_REELS = 6 as const;

/**
 * Domain shape for a curated Instagram Reel row.
 */
export type InstagramReel = {
  readonly id: string;
  readonly siteId: string;
  readonly permalink: string;
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

/**
 * Input for creating a curated Reel.
 */
export type CreateInstagramReelInput = {
  readonly permalink: string;
  readonly isPublished?: boolean;
};

/**
 * Input for updating an existing curated Reel.
 */
export type UpdateInstagramReelInput = {
  readonly permalink?: string;
  readonly isPublished?: boolean;
  readonly sortOrder?: number;
};

/**
 * Maps a database row to the domain {@link InstagramReel} shape.
 *
 * @param row - Supabase `instagram_reels` row.
 * @returns Domain reel object.
 */
function mapReel(row: InstagramReelRow): InstagramReel {
  return {
    id: row.id,
    siteId: row.site_id,
    permalink: row.permalink,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Throws a typed Error when a Supabase response includes an error.
 *
 * @param error - Supabase error object or null.
 * @param operation - Caller name for the message prefix.
 */
function throwOnError(
  error: { message: string } | null,
  operation: string,
): void {
  if (error !== null) {
    throw new Error(`${operation}: ${error.message}`);
  }
}

/**
 * Asserts `siteId` is a non-empty string.
 *
 * @param siteId - Candidate site UUID.
 * @param fnName - Caller name for error text.
 */
function assertSiteId(siteId: string, fnName: string): void {
  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new TypeError(`${fnName}: siteId must be a non-empty string`);
  }
}

/**
 * Normalizes and validates an Instagram post or Reel permalink.
 *
 * Accepts `instagram.com` / `www.instagram.com` hostnames and `/reel/` or `/p/` paths.
 * Strips query/hash and trailing slash for stable unique keys.
 *
 * @param raw - User-pasted URL string.
 * @returns Canonical `https://www.instagram.com/(reel|p)/{code}/` URL.
 * @throws When the URL is missing or not a valid Instagram post/Reel link.
 */
export function normalizeInstagramPermalink(raw: string): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new Error("Paste an Instagram Reel or post URL.");
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(
      "That does not look like a valid URL. Use a full Instagram link (https://...).",
    );
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "instagram.com") {
    throw new Error("URL must be an instagram.com link.");
  }

  const parts = parsed.pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  if (parts.length < 2) {
    throw new Error(
      "URL must point to a Reel or post (e.g. https://www.instagram.com/reel/...).",
    );
  }

  const kind = parts[0];
  const code = parts[1];
  if (
    (kind !== "reel" && kind !== "p") ||
    typeof code !== "string" ||
    code.length === 0
  ) {
    throw new Error(
      "URL must point to a Reel or post (e.g. https://www.instagram.com/reel/...).",
    );
  }

  if (!/^[A-Za-z0-9_-]+$/.test(code)) {
    throw new Error("Instagram media code in the URL looks invalid.");
  }

  return `https://www.instagram.com/${kind}/${code}/`;
}

/**
 * Lists all curated reels for Admin (published and draft), ordered by sort then created.
 *
 * @param client - Supabase client (authenticated for Admin).
 * @param siteId - Brand `sites.id` UUID.
 * @returns Reels for the site.
 */
export async function listReelsForAdmin(
  client: BlogSupabaseClient,
  siteId: string,
): Promise<InstagramReel[]> {
  assertSiteId(siteId, "listReelsForAdmin");

  const { data, error } = await client
    .from("instagram_reels")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  throwOnError(error, "listReelsForAdmin");
  return (data ?? []).map(mapReel);
}

/**
 * Lists published curated reels for public pages.
 *
 * @param client - Supabase client (anon-safe via RLS).
 * @param siteId - Brand `sites.id` UUID.
 * @param options - Optional limit (defaults to {@link MAX_INSTAGRAM_REELS}).
 * @returns Published reels in display order.
 */
export async function listPublishedReels(
  client: BlogSupabaseClient,
  siteId: string,
  options: { readonly limit?: number } = {},
): Promise<InstagramReel[]> {
  assertSiteId(siteId, "listPublishedReels");

  const rawLimit = options.limit;
  const limit =
    typeof rawLimit === "number" &&
    Number.isFinite(rawLimit) &&
    rawLimit > 0
      ? Math.min(Math.floor(rawLimit), MAX_INSTAGRAM_REELS)
      : MAX_INSTAGRAM_REELS;

  const { data, error } = await client
    .from("instagram_reels")
    .select("*")
    .eq("site_id", siteId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  throwOnError(error, "listPublishedReels");
  return (data ?? []).map(mapReel);
}

/**
 * Creates a curated Reel. Blocks when the site already has {@link MAX_INSTAGRAM_REELS} rows.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param input - Permalink and optional published flag.
 * @returns The created reel.
 */
export async function createReel(
  client: BlogSupabaseClient,
  siteId: string,
  input: CreateInstagramReelInput,
): Promise<InstagramReel> {
  assertSiteId(siteId, "createReel");

  const permalink = normalizeInstagramPermalink(input.permalink);

  const existing = await listReelsForAdmin(client, siteId);
  if (existing.length >= MAX_INSTAGRAM_REELS) {
    throw new Error(
      `You can feature at most ${String(MAX_INSTAGRAM_REELS)} Reels. Remove one before adding another.`,
    );
  }

  const nextSort =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((reel) => reel.sortOrder)) + 1;

  const row: InstagramReelInsert = {
    site_id: siteId,
    permalink,
    sort_order: nextSort,
    is_published: input.isPublished !== false,
  };

  const { data, error } = await client
    .from("instagram_reels")
    .insert(row)
    .select("*")
    .single();

  throwOnError(error, "createReel");
  if (data === null) {
    throw new Error("createReel: insert returned no row");
  }
  return mapReel(data);
}

/**
 * Updates an existing curated Reel for a site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param reelId - Reel row UUID.
 * @param input - Fields to change.
 * @returns The updated reel.
 */
export async function updateReel(
  client: BlogSupabaseClient,
  siteId: string,
  reelId: string,
  input: UpdateInstagramReelInput,
): Promise<InstagramReel> {
  assertSiteId(siteId, "updateReel");
  if (typeof reelId !== "string" || reelId.trim().length === 0) {
    throw new TypeError("updateReel: reelId must be a non-empty string");
  }

  const patch: InstagramReelUpdate = {};

  if (input.permalink !== undefined) {
    patch.permalink = normalizeInstagramPermalink(input.permalink);
  }
  if (input.isPublished !== undefined) {
    patch.is_published = input.isPublished;
  }
  if (input.sortOrder !== undefined) {
    if (
      typeof input.sortOrder !== "number" ||
      !Number.isFinite(input.sortOrder) ||
      input.sortOrder < 0
    ) {
      throw new Error("sortOrder must be a non-negative number.");
    }
    patch.sort_order = Math.floor(input.sortOrder);
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("Nothing to update.");
  }

  const { data, error } = await client
    .from("instagram_reels")
    .update(patch)
    .eq("id", reelId)
    .eq("site_id", siteId)
    .select("*")
    .single();

  throwOnError(error, "updateReel");
  if (data === null) {
    throw new Error("updateReel: reel not found");
  }
  return mapReel(data);
}

/**
 * Deletes a curated Reel for a site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param reelId - Reel row UUID.
 */
export async function deleteReel(
  client: BlogSupabaseClient,
  siteId: string,
  reelId: string,
): Promise<void> {
  assertSiteId(siteId, "deleteReel");
  if (typeof reelId !== "string" || reelId.trim().length === 0) {
    throw new TypeError("deleteReel: reelId must be a non-empty string");
  }

  const { error } = await client
    .from("instagram_reels")
    .delete()
    .eq("id", reelId)
    .eq("site_id", siteId);

  throwOnError(error, "deleteReel");
}

/**
 * Reassigns contiguous `sort_order` values (0..n-1) for the site's reels.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param orderedIds - Reel IDs in desired display order.
 */
export async function reorderReels(
  client: BlogSupabaseClient,
  siteId: string,
  orderedIds: readonly string[],
): Promise<void> {
  assertSiteId(siteId, "reorderReels");
  if (!Array.isArray(orderedIds)) {
    throw new TypeError("reorderReels: orderedIds must be an array");
  }

  const existing = await listReelsForAdmin(client, siteId);
  const existingIds = new Set(existing.map((reel) => reel.id));

  for (const id of orderedIds) {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("reorderReels: each id must be a non-empty string");
    }
    if (!existingIds.has(id)) {
      throw new Error("reorderReels: unknown reel id for this site");
    }
  }

  if (orderedIds.length !== existing.length) {
    throw new Error("reorderReels: orderedIds must include every reel once");
  }

  await Promise.all(
    orderedIds.map(async (id, index) => {
      const { error } = await client
        .from("instagram_reels")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("site_id", siteId);
      throwOnError(error, "reorderReels");
    }),
  );
}
