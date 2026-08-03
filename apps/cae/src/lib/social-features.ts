/**
 * @fileoverview Site-scoped curated social features CRUD for CAE Admin / public pages.
 *
 * Max six published (and total) items per platform per site (app-enforced).
 * Instagram / Facebook: permalink only — official embeds supply chrome publicly.
 * Xiaohongshu: permalink + title + cover image — display cards (no unofficial player).
 */

import type {
  BlogSupabaseClient,
  SocialFeatureInsert,
  SocialFeaturePlatform,
  SocialFeatureRow,
  SocialFeatureUpdate,
} from "@seo/blog";

/** Maximum curated items per platform (published or draft). */
export const MAX_SOCIAL_FEATURES_PER_PLATFORM = 6 as const;

/** Maximum items on the homepage Featured Social band. */
export const HOME_FEATURED_SOCIAL_LIMIT = 3 as const;

/**
 * Domain shape for a curated social feature row.
 */
export type SocialFeature = {
  readonly id: string;
  readonly siteId: string;
  readonly platform: SocialFeaturePlatform;
  readonly permalink: string;
  readonly title: string | null;
  readonly coverImageUrl: string | null;
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

/**
 * Input for creating a curated social feature.
 */
export type CreateSocialFeatureInput = {
  readonly platform: SocialFeaturePlatform;
  readonly permalink: string;
  readonly title?: string;
  readonly coverImageUrl?: string;
  readonly isPublished?: boolean;
};

/**
 * Input for updating an existing social feature.
 */
export type UpdateSocialFeatureInput = {
  readonly permalink?: string;
  readonly title?: string | null;
  readonly coverImageUrl?: string | null;
  readonly isPublished?: boolean;
  readonly sortOrder?: number;
};

/**
 * Options for listing published features on public pages.
 */
export type ListPublishedSocialFeaturesOptions = {
  readonly platform?: SocialFeaturePlatform;
  readonly limit?: number;
};

/**
 * Maps a database row to the domain {@link SocialFeature} shape.
 *
 * @param row - Supabase `social_features` row.
 * @returns Domain feature object.
 */
function mapFeature(row: SocialFeatureRow): SocialFeature {
  return {
    id: row.id,
    siteId: row.site_id,
    platform: row.platform,
    permalink: row.permalink,
    title: row.title,
    coverImageUrl: row.cover_image_url,
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
 * Type guard for {@link SocialFeaturePlatform}.
 *
 * @param value - Candidate platform string.
 * @returns Whether the value is a supported platform.
 */
export function isSocialFeaturePlatform(
  value: string,
): value is SocialFeaturePlatform {
  return (
    value === "instagram" ||
    value === "facebook" ||
    value === "xiaohongshu"
  );
}

/**
 * Parses and asserts a platform string from Admin form input.
 *
 * @param raw - Candidate platform value.
 * @returns Typed platform.
 */
export function parseSocialFeaturePlatform(raw: string): SocialFeaturePlatform {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!isSocialFeaturePlatform(trimmed)) {
    throw new Error("Choose Instagram, Facebook, or Xiaohongshu.");
  }
  return trimmed;
}

/**
 * Human label for a platform id.
 *
 * @param platform - Feature platform.
 * @returns Display label.
 */
export function socialFeaturePlatformLabel(
  platform: SocialFeaturePlatform,
): string {
  if (platform === "instagram") {
    return "Instagram";
  }
  if (platform === "facebook") {
    return "Facebook";
  }
  return "Xiaohongshu";
}

/**
 * Strips volatile Xiaohongshu / RedNote query params while keeping a stable href.
 *
 * @param parsed - Parsed URL instance.
 * @returns URL without `xsec_*` and similar tracking params.
 */
function stripVolatileQuery(parsed: URL): URL {
  const cleaned = new URL(parsed.href);
  const keysToDelete: string[] = [];
  cleaned.searchParams.forEach((_value, key) => {
    if (
      key.startsWith("xsec_") ||
      key === "share_id" ||
      key === "shareRedId" ||
      key === "xhsshare" ||
      key === "apptime" ||
      key === "app_platform" ||
      key === "app_version"
    ) {
      keysToDelete.push(key);
    }
  });
  for (const key of keysToDelete) {
    cleaned.searchParams.delete(key);
  }
  return cleaned;
}

/**
 * Normalizes and validates an Instagram post or Reel permalink.
 *
 * @param raw - User-pasted URL string.
 * @returns Canonical `https://www.instagram.com/(reel|p)/{code}/` URL.
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
 * Whether a Facebook path should render as a video plugin (`fb-video`).
 *
 * @param permalink - Canonical Facebook URL.
 * @returns True for video / reel / watch paths.
 */
export function isFacebookVideoPermalink(permalink: string): boolean {
  try {
    const parsed = new URL(permalink);
    const path = parsed.pathname.toLowerCase();
    return (
      path.includes("/videos/") ||
      path.includes("/reel/") ||
      path.includes("/watch") ||
      parsed.searchParams.has("v")
    );
  } catch {
    return false;
  }
}

/**
 * Normalizes and validates a public Facebook post, video, or reel URL.
 *
 * @param raw - User-pasted URL string.
 * @returns Canonical https Facebook URL without hash.
 */
export function normalizeFacebookPermalink(raw: string): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new Error("Paste a Facebook post, video, or reel URL.");
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(
      "That does not look like a valid URL. Use a full Facebook link (https://...).",
    );
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (
    host !== "facebook.com" &&
    host !== "fb.com" &&
    host !== "fb.watch" &&
    host !== "m.facebook.com"
  ) {
    throw new Error("URL must be a facebook.com link.");
  }

  const path = parsed.pathname;
  const hasPost =
    /\/posts\//i.test(path) ||
    /\/permalink\.php/i.test(path) ||
    /\/photo\.php/i.test(path) ||
    /\/photos\//i.test(path);
  const hasVideo =
    /\/videos\//i.test(path) ||
    /\/reel\//i.test(path) ||
    /\/watch/i.test(path) ||
    parsed.searchParams.has("v");
  const hasStoryFbid = parsed.searchParams.has("story_fbid");

  if (!hasPost && !hasVideo && !hasStoryFbid) {
    throw new Error(
      "URL must point to a public Facebook post, video, or reel.",
    );
  }

  const canonicalHost =
    host === "fb.watch" ? "www.facebook.com" : "www.facebook.com";
  const cleaned = new URL(parsed.href);
  cleaned.protocol = "https:";
  cleaned.hostname = canonicalHost;
  cleaned.hash = "";
  cleaned.username = "";
  cleaned.password = "";

  return cleaned.toString();
}

/**
 * Normalizes a Xiaohongshu / RedNote note URL for storage.
 *
 * Accepts `xiaohongshu.com`, `rednote.com`, and `xhslink.com` note links.
 * Profile-only URLs are rejected (profile stays the hub button).
 *
 * @param raw - User-pasted URL string.
 * @returns Cleaned https URL with volatile query params removed.
 */
export function normalizeXiaohongshuPermalink(raw: string): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new Error("Paste a Xiaohongshu / RedNote note URL.");
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(
      "That does not look like a valid URL. Use a full Xiaohongshu or RedNote link.",
    );
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const allowedHosts = new Set([
    "xiaohongshu.com",
    "rednote.com",
    "xhslink.com",
  ]);
  if (!allowedHosts.has(host)) {
    throw new Error(
      "URL must be a xiaohongshu.com, rednote.com, or xhslink.com link.",
    );
  }

  const path = parsed.pathname.toLowerCase();
  if (path.includes("/user/profile/")) {
    throw new Error(
      "Use a note/post link for featured content — the profile link is already on the Social hub buttons.",
    );
  }

  const isNotePath =
    path.includes("/explore/") ||
    path.includes("/discovery/item/") ||
    path.includes("/search_result/") ||
    host === "xhslink.com";

  if (!isNotePath) {
    throw new Error(
      "URL must point to a Xiaohongshu / RedNote note (not a generic page).",
    );
  }

  const cleaned = stripVolatileQuery(parsed);
  cleaned.protocol = "https:";
  cleaned.hash = "";
  cleaned.username = "";
  cleaned.password = "";

  return cleaned.toString();
}

/**
 * Normalizes a permalink for the given platform.
 *
 * @param platform - Feature platform.
 * @param raw - User-pasted URL.
 * @returns Canonical permalink.
 */
export function normalizeSocialPermalink(
  platform: SocialFeaturePlatform,
  raw: string,
): string {
  if (platform === "instagram") {
    return normalizeInstagramPermalink(raw);
  }
  if (platform === "facebook") {
    return normalizeFacebookPermalink(raw);
  }
  return normalizeXiaohongshuPermalink(raw);
}

/**
 * Validates XHS title + cover requirements; clears fields for IG/FB.
 *
 * @param platform - Feature platform.
 * @param title - Optional title.
 * @param coverImageUrl - Optional cover URL.
 * @returns Normalized nullable title and cover for storage.
 */
function resolvePlatformFields(
  platform: SocialFeaturePlatform,
  title: string | undefined | null,
  coverImageUrl: string | undefined | null,
): { title: string | null; coverImageUrl: string | null } {
  if (platform === "xiaohongshu") {
    const trimmedTitle =
      typeof title === "string" ? title.trim() : "";
    if (trimmedTitle.length === 0) {
      throw new Error("Xiaohongshu features need a title.");
    }
    const trimmedCover =
      typeof coverImageUrl === "string" ? coverImageUrl.trim() : "";
    if (trimmedCover.length === 0) {
      throw new Error("Xiaohongshu features need a cover image.");
    }
    try {
      const coverUrl = new URL(trimmedCover);
      if (coverUrl.protocol !== "https:" && coverUrl.protocol !== "http:") {
        throw new Error("Cover image must be an http(s) URL.");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cover image")) {
        throw error;
      }
      throw new Error("Cover image must be a valid URL.");
    }
    return { title: trimmedTitle, coverImageUrl: trimmedCover };
  }

  return { title: null, coverImageUrl: null };
}

/**
 * Lists all curated features for Admin (published and draft), ordered by sort.
 *
 * @param client - Supabase client (authenticated for Admin).
 * @param siteId - Brand `sites.id` UUID.
 * @param platform - Optional platform filter.
 * @returns Features for the site.
 */
export async function listSocialFeaturesForAdmin(
  client: BlogSupabaseClient,
  siteId: string,
  platform?: SocialFeaturePlatform,
): Promise<SocialFeature[]> {
  assertSiteId(siteId, "listSocialFeaturesForAdmin");

  let query = client
    .from("social_features")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (platform !== undefined) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;
  throwOnError(error, "listSocialFeaturesForAdmin");
  return (data ?? []).map(mapFeature);
}

/**
 * Lists published curated features for public pages.
 *
 * @param client - Supabase client (anon-safe via RLS).
 * @param siteId - Brand `sites.id` UUID.
 * @param options - Optional platform filter and limit.
 * @returns Published features in display order.
 */
export async function listPublishedSocialFeatures(
  client: BlogSupabaseClient,
  siteId: string,
  options: ListPublishedSocialFeaturesOptions = {},
): Promise<SocialFeature[]> {
  assertSiteId(siteId, "listPublishedSocialFeatures");

  const platformLimit = MAX_SOCIAL_FEATURES_PER_PLATFORM;
  const rawLimit = options.limit;
  const limit =
    typeof rawLimit === "number" &&
    Number.isFinite(rawLimit) &&
    rawLimit > 0
      ? Math.min(
          Math.floor(rawLimit),
          options.platform !== undefined
            ? platformLimit
            : platformLimit * 3,
        )
      : options.platform !== undefined
        ? platformLimit
        : platformLimit * 3;

  let query = client
    .from("social_features")
    .select("*")
    .eq("site_id", siteId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options.platform !== undefined) {
    query = query.eq("platform", options.platform);
  }

  const { data, error } = await query;
  throwOnError(error, "listPublishedSocialFeatures");
  return (data ?? []).map(mapFeature);
}

/**
 * Creates a curated social feature. Blocks when the platform already has max rows.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param input - Platform, permalink, and XHS fields when needed.
 * @returns The created feature.
 */
export async function createSocialFeature(
  client: BlogSupabaseClient,
  siteId: string,
  input: CreateSocialFeatureInput,
): Promise<SocialFeature> {
  assertSiteId(siteId, "createSocialFeature");

  const platform = input.platform;
  if (!isSocialFeaturePlatform(platform)) {
    throw new Error("Choose Instagram, Facebook, or Xiaohongshu.");
  }

  const permalink = normalizeSocialPermalink(platform, input.permalink);
  const fields = resolvePlatformFields(
    platform,
    input.title,
    input.coverImageUrl,
  );

  const existing = await listSocialFeaturesForAdmin(client, siteId, platform);
  if (existing.length >= MAX_SOCIAL_FEATURES_PER_PLATFORM) {
    throw new Error(
      `You can feature at most ${String(MAX_SOCIAL_FEATURES_PER_PLATFORM)} ${socialFeaturePlatformLabel(platform)} items. Remove one before adding another.`,
    );
  }

  const allForSort = await listSocialFeaturesForAdmin(client, siteId);
  const nextSort =
    allForSort.length === 0
      ? 0
      : Math.max(...allForSort.map((feature) => feature.sortOrder)) + 1;

  const row: SocialFeatureInsert = {
    site_id: siteId,
    platform,
    permalink,
    title: fields.title,
    cover_image_url: fields.coverImageUrl,
    sort_order: nextSort,
    is_published: input.isPublished !== false,
  };

  const { data, error } = await client
    .from("social_features")
    .insert(row)
    .select("*")
    .single();

  throwOnError(error, "createSocialFeature");
  if (data === null) {
    throw new Error("createSocialFeature: insert returned no row");
  }
  return mapFeature(data);
}

/**
 * Updates an existing curated social feature for a site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param featureId - Feature row UUID.
 * @param input - Fields to change.
 * @returns The updated feature.
 */
export async function updateSocialFeature(
  client: BlogSupabaseClient,
  siteId: string,
  featureId: string,
  input: UpdateSocialFeatureInput,
): Promise<SocialFeature> {
  assertSiteId(siteId, "updateSocialFeature");
  if (typeof featureId !== "string" || featureId.trim().length === 0) {
    throw new TypeError("updateSocialFeature: featureId must be a non-empty string");
  }

  const existingList = await listSocialFeaturesForAdmin(client, siteId);
  const existing = existingList.find((feature) => feature.id === featureId);
  if (existing === undefined) {
    throw new Error("Social feature not found.");
  }

  const platform = existing.platform;
  const nextPermalink =
    input.permalink !== undefined
      ? normalizeSocialPermalink(platform, input.permalink)
      : existing.permalink;

  const nextTitle =
    input.title !== undefined ? input.title : existing.title;
  const nextCover =
    input.coverImageUrl !== undefined
      ? input.coverImageUrl
      : existing.coverImageUrl;

  const fields = resolvePlatformFields(platform, nextTitle, nextCover);

  const patch: SocialFeatureUpdate = {
    permalink: nextPermalink,
    title: fields.title,
    cover_image_url: fields.coverImageUrl,
  };

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

  const { data, error } = await client
    .from("social_features")
    .update(patch)
    .eq("id", featureId)
    .eq("site_id", siteId)
    .select("*")
    .single();

  throwOnError(error, "updateSocialFeature");
  if (data === null) {
    throw new Error("updateSocialFeature: feature not found");
  }
  return mapFeature(data);
}

/**
 * Deletes a curated social feature for a site.
 *
 * @param client - Authenticated Supabase client.
 * @param siteId - Brand `sites.id` UUID.
 * @param featureId - Feature row UUID.
 */
export async function deleteSocialFeature(
  client: BlogSupabaseClient,
  siteId: string,
  featureId: string,
): Promise<void> {
  assertSiteId(siteId, "deleteSocialFeature");
  if (typeof featureId !== "string" || featureId.trim().length === 0) {
    throw new TypeError("deleteSocialFeature: featureId must be a non-empty string");
  }

  const { error } = await client
    .from("social_features")
    .delete()
    .eq("id", featureId)
    .eq("site_id", siteId);

  throwOnError(error, "deleteSocialFeature");
}
