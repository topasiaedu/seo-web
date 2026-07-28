/**
 * @fileoverview Hero band copy for the CAE homepage.
 */

import type { HomeImageKey } from "./images.ts";
import { assertHomeHref } from "./nav.ts";

/**
 * Primary hero messaging: brand, supporting tagline, and CTA.
 */
export const homeHero = {
  brand: "CAE GOH",
  /** Visible slogan pill copy (CSS text — avoids PNG left-pad misalignment). */
  sloganLabel: "POWER & BREAKTHROUGH FOR EVERYONE",
  sloganAlt: "Power and breakthrough for everyone",
  sloganTitle: "CAE brand slogan",
  /** Logical image key retained for any legacy consumers. */
  sloganImageKey: "heroSlogan" satisfies HomeImageKey,
  tagline:
    "Discover Your Destiny with Zi Wei Dou Shu Consulting: Expert Astrological Insights to Guide Your Life's Path, Enhance Relationships, and Prosper in Business.",
  ctaLabel: "LEARN MORE",
  ctaHref: assertHomeHref("#insights"),
} as const;

/** Shape of {@link homeHero}. */
export type HomeHero = typeof homeHero;
