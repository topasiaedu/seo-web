/**
 * @fileoverview Social Media hub copy and platform links for `/cae/social/`.
 * Order matters: Xiaohongshu (XHS), Instagram, then Facebook.
 * XHS is kept in data for Admin, but hidden on public pages until covers are ready.
 */

import type { HomeImageKey } from "./images.ts";
import { assertHomeHref, type HomeHref } from "./nav.ts";

/**
 * External social platform shown as a primary hub button.
 */
export type SocialPlatform = {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  readonly href: HomeHref;
  readonly ctaLabel: string;
  readonly iconAlt: string;
  readonly iconTitle: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly iconImageKey: HomeImageKey;
  /**
   * When false, the platform section is omitted on public `/social` and home teaser
   * (Admin can still curate rows).
   */
  readonly publicVisible: boolean;
};

/**
 * Page chrome and ordered platform buttons for the Social Media route.
 */
export const homeSocial = {
  eyebrow: "Follow along",
  heading: "Social Media",
  lede: "Stay connected with Cae on Instagram and Facebook for insights, updates, and community.",
  platforms: [
    {
      id: "xiaohongshu",
      label: "Xiaohongshu",
      shortLabel: "XHS / RedNote",
      description: "Notes and short takes in Chinese — follow CAE GOH on RedNote.",
      href: assertHomeHref(
        "https://www.rednote.com/user/profile/6a19467f000000000d035c00",
      ),
      ctaLabel: "Open Xiaohongshu",
      iconAlt: "Xiaohongshu",
      iconTitle: "Follow Cae on Xiaohongshu (RedNote)",
      iconImageKey: "socialXiaohongshu",
      /** Hidden publicly until note cover thumbnails are available. */
      publicVisible: false,
    },
    {
      id: "instagram",
      label: "Instagram",
      shortLabel: "Instagram",
      description: "Visual updates and behind-the-scenes with @caegoh.",
      href: assertHomeHref("https://www.instagram.com/caegoh/"),
      ctaLabel: "Open Instagram",
      iconAlt: "Instagram",
      iconTitle: "Follow Cae on Instagram",
      iconImageKey: "socialInstagram",
      publicVisible: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      shortLabel: "Facebook",
      description: "News, events, and community updates on Facebook.",
      href: assertHomeHref("https://www.facebook.com/caegoh"),
      ctaLabel: "Open Facebook",
      iconAlt: "Facebook",
      iconTitle: "Follow Cae on Facebook",
      iconImageKey: "socialFacebook",
      publicVisible: true,
    },
  ] as const satisfies readonly SocialPlatform[],
} as const;

/** Shape of {@link homeSocial}. */
export type HomeSocial = typeof homeSocial;
