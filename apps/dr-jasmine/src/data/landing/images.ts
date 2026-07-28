/**
 * @fileoverview Astro-friendly static imports for Dr Jasmine landing image slots.
 *
 * Keys match `__GHL_ASSET_*__` tokens from `lift-ghl-sections.mjs` and
 * `src/assets/ghl/manifest.json`.
 */

import danHenryPortrait from "../../assets/ghl/dan-henry-portrait.jpg";
import drJasminePortrait from "../../assets/ghl/dr-jasmine-portrait.jpg";
import disclaimerBg from "../../assets/ghl/disclaimer-bg.jpeg";

/**
 * Typed landing image map keyed by logical slot names used by the GHL remapper.
 */
export const landingImages = {
  danHenryPortrait,
  drJasminePortrait,
  disclaimerBg,
} as const;

/** Logical slot keys for {@link landingImages}. */
export type LandingImageKey = keyof typeof landingImages;

/** Imported asset module type for any landing image slot. */
export type LandingImageAsset = (typeof landingImages)[LandingImageKey];

/**
 * Preferred alt text per slot (empty string = decorative).
 */
export const landingImageAlts: Readonly<Record<LandingImageKey, string>> = {
  danHenryPortrait: "Dan Henry",
  drJasminePortrait: "Dr. Jasmine",
  disclaimerBg: "",
};

/**
 * Type guard for landing image slot keys.
 *
 * @param value - Candidate slot name from tokens or props
 * @returns True when `value` is a known {@link LandingImageKey}
 */
export function isLandingImageKey(value: string): value is LandingImageKey {
  return Object.prototype.hasOwnProperty.call(landingImages, value);
}

/**
 * Resolves a logical landing image slot to its static import.
 *
 * @param key - Slot name from {@link LandingImageKey}
 * @returns Astro/Vite image module for the slot
 */
export function getLandingImage(key: LandingImageKey): LandingImageAsset {
  return landingImages[key];
}
