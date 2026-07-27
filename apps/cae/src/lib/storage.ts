/**
 * @fileoverview Supabase Storage helpers for CAE Admin blog image uploads.
 *
 * Bucket: `media`. Cover objects live under `cae/blog/covers/`
 * (full logical path: `media/cae/blog/covers/...`).
 */

import type { BlogSupabaseClient } from "@seo/blog";

/** Public Storage bucket for brand media assets. */
export const MEDIA_BUCKET_ID = "media" as const;

/** Object-key prefix for CAE Post hero / OG cover images (inside the media bucket). */
export const CAE_BLOG_COVERS_PREFIX = "cae/blog/covers" as const;

/** Maximum accepted cover upload size (5 MiB). */
export const MAX_BLOG_COVER_BYTES = 5 * 1024 * 1024;

/**
 * Sanitizes a browser filename for use in a Storage object key.
 *
 * @param filename - Original `File.name` from the browser.
 * @returns Lowercase safe filename with a fallback when empty.
 */
export function sanitizeStorageFilename(filename: string): string {
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
export function assertBlogCoverImageFile(file: File | null): File {
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
 * Object key: `cae/blog/covers/{timestamp}-{sanitized-filename}`.
 *
 * @param client - Authenticated Supabase client (browser or server).
 * @param file - Validated image file.
 * @returns Public HTTPS URL for the uploaded object.
 */
export async function uploadBlogCoverImage(
  client: BlogSupabaseClient,
  file: File,
): Promise<string> {
  if (client === null || typeof client !== "object") {
    throw new TypeError("uploadBlogCoverImage: client is required");
  }

  const imageFile = assertBlogCoverImageFile(file);
  const timestamp = Date.now().toString(10);
  const sanitizedName = sanitizeStorageFilename(imageFile.name);
  const objectPath = [CAE_BLOG_COVERS_PREFIX, `${timestamp}-${sanitizedName}`].join(
    "/",
  );

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
