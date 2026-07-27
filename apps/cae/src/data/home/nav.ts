/**
 * @fileoverview Primary navigation and shared homepage href helpers.
 */

import type { HomeImageKey } from "./images.ts";

/**
 * Absolute, hash, or root-relative href used by homepage links.
 */
export type HomeHref = `https://${string}` | `http://${string}` | `#${string}` | `/${string}`;

/**
 * Ensures a string is a usable navigation href for Astro templates.
 *
 * @param value - Candidate href from content config
 * @returns The same value when valid
 */
export function assertHomeHref(value: string): HomeHref {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("assertHomeHref requires a non-empty string.");
  }
  const trimmed = value.trim();
  const isAbsolute = trimmed.startsWith("https://") || trimmed.startsWith("http://");
  const isHash = trimmed.startsWith("#");
  const isPath = trimmed.startsWith("/");
  if (!isAbsolute && !isHash && !isPath) {
    throw new Error(`Invalid home href: ${trimmed}`);
  }
  return trimmed as HomeHref;
}

/**
 * Single header navigation item.
 */
export type NavLink = {
  readonly label: string;
  readonly href: HomeHref;
};

/**
 * Sticky header / logo navigation copy and destinations.
 */
export const homeNav = {
  logoAlt: "CAE brand logo in white script",
  logoTitle: "CAE",
  /** Logical image key resolved by {@link getHomeImage}. */
  logoImageKey: "logo" satisfies HomeImageKey,
  homeHref: assertHomeHref("/"),
  links: [
    {
      label: "SUCCESS STORIES",
      href: assertHomeHref("#success-stories"),
    },
    {
      label: "BLOG",
      href: assertHomeHref("/blog/"),
    },
    {
      label: "MEDIA & PRESS",
      href: assertHomeHref("/media/"),
    },
  ] as const satisfies readonly NavLink[],
} as const;

/** Shape of {@link homeNav}. */
export type HomeNav = typeof homeNav;
