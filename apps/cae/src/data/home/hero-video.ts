/**
 * @fileoverview Homepage full-bleed teaser video (Supabase Storage).
 * Used as the main hero background media plane (not a second section).
 */

/**
 * Absolute HTTPS URL for a publicly readable MP4.
 */
export type HeroVideoSrc = `https://${string}`;

/**
 * Ensures a string is an https URL for the hero teaser.
 *
 * @param value - Candidate URL
 * @returns The same value when valid
 */
function assertHttpsSrc(value: string): HeroVideoSrc {
  if (typeof value !== "string" || !value.startsWith("https://")) {
    throw new Error(`assertHttpsSrc requires an https URL, got: ${value}`);
  }
  return value as HeroVideoSrc;
}

/**
 * Object path inside the public `media` bucket (no leading slash).
 */
export const HERO_VIDEO_OBJECT_PATH = "cae/hero-video/HeroVideo.mp4" as const;

/**
 * Builds the public Storage URL from the project origin.
 *
 * @param supabaseUrl - `PUBLIC_SUPABASE_URL` origin (no trailing slash required)
 * @returns Absolute MP4 URL
 */
export function buildHeroVideoSrc(supabaseUrl: string): HeroVideoSrc {
  const base = supabaseUrl.trim().replace(/\/+$/, "");
  if (base.length === 0) {
    throw new Error("buildHeroVideoSrc requires a non-empty Supabase URL.");
  }
  return assertHttpsSrc(
    `${base}/storage/v1/object/public/media/${HERO_VIDEO_OBJECT_PATH}`,
  );
}

/**
 * Copy and accessibility labels for the homepage video band.
 */
export const homeHeroVideo = {
  /** Visually hidden section title for assistive tech. */
  heading: "Meet CAE",
  /** Accessible name for the video element. */
  videoLabel: "CAE Goh introduction teaser video",
  /** Mute control when sound is off (autoplay default). */
  unmuteLabel: "Unmute video",
  /** Mute control when sound is on. */
  muteLabel: "Mute video",
  /**
   * Fallback absolute URL when `PUBLIC_SUPABASE_URL` is missing at build time.
   * Prefer {@link buildHeroVideoSrc} with the env origin in components.
   */
  fallbackSrc: assertHttpsSrc(
    "https://uxwzgycgmtailguvmmsv.supabase.co/storage/v1/object/public/media/cae/hero-video/HeroVideo.mp4",
  ),
} as const;

/** Shape of {@link homeHeroVideo}. */
export type HomeHeroVideo = typeof homeHeroVideo;
