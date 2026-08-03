/**
 * @fileoverview Hero band copy for the CAE homepage.
 */

import type { HomeImageKey } from "./images.ts";
import { assertHomeHref } from "./nav.ts";

/**
 * Primary hero messaging: brand, supporting tagline, and CTA.
 * Slogan fields remain for legacy GHL/SEO remappers; not shown in the live hero UI.
 */
export const homeHero = {
  brand: "CAE GOH",
  /** Legacy slogan copy (not rendered on the video hero). */
  sloganLabel: "POWER & BREAKTHROUGH FOR EVERYONE",
  sloganAlt: "Power and breakthrough for everyone",
  sloganTitle: "CAE brand slogan",
  /** Logical image key retained for any legacy consumers. */
  sloganImageKey: "heroSlogan" satisfies HomeImageKey,
  tagline: "Discover Your Destiny with Zi Wei Dou Shu Consulting",
  ctaLabel: "LEARN MORE",
  ctaHref: assertHomeHref("#insights"),
} as const;

/** Shape of {@link homeHero}. */
export type HomeHero = typeof homeHero;
