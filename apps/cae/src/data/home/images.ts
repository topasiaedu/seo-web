/**
 * @fileoverview Astro-friendly static imports for CAE homepage image slots.
 *
 * Source assets live under `src/assets/`. Slot keys match homepage data
 * modules (`offering*`, `press*`, `testimonial*`, `pillar*`, `platform*`,
 * social keys) so {@link getHomeImage} resolves without component aliases.
 *
 * Foundation pass (2026-07-23): re-verified every asset against the live
 * caegoh.com GHL capture (`seo-wiki-vault/raw/research/cae-ghl-capture/`)
 * and fixed several mismatches inherited from the previous asset intake:
 * - `hero-portrait.png` was actually the "POWER & BREAKTHROUGH" slogan pill,
 *   not a portrait — renamed to `hero-slogan.png` and wired to `heroSlogan`
 *   directly (no more `heroSlogan: heroPortrait` alias to a misnamed file).
 * - The eight `press-*.png` files were shifted one slot from their filename
 *   (e.g. `press-ap.png` held the Newsbreak mark). Re-sorted by actual
 *   logo content; the real Associated Press mark was missing locally, so
 *   it was re-downloaded from the GHL capture's CDN reference
 *   (`storage.googleapis.com/msgsndr/.../6877a37f1db1291e184636bd.svg`,
 *   alt "APNews Logo") as `press-ap.svg`. The old `featured-divider.svg`
 *   turned out to be a byte-for-byte duplicate of that same AP mark (not a
 *   divider graphic) and an unused key, so it was removed.
 * - `testimonial-1..4.jpeg` were the four *offering* card photos all along
 *   (helmet / studio / library / eyes-through-leaves match the `offerings.ts`
 *   alt text exactly) — renamed to `offering-*.jpeg` and wired to
 *   `offeringConsult/Workshop/LearnZwds/Insider`. The purple-gradient
 *   `section-bg-*.jpeg` files that previously stood in for these cards were
 *   removed (they were decorative gradients, not offering photography).
 * - `platform-visual.png` / `members-visual.png` / `cta-visual.png` were
 *   circular headshots — wrong for the platform app mockup or pillars
 *   collage, but they are exactly the three testimonial portraits described
 *   in `testimonials.ts` (dark-haired woman / woman in white top / man in
 *   white tee). Renamed to `testimonial-portrait-{1,2,3}.png`.
 * - `pillar-academy.png` (an app-dashboard mockup) and `pillar-speaking.png`
 *   (a glowing heart icon) were actually the Platform section's app visual
 *   and "Daily reading" icon; `icon-daily.png` / `icon-weekly.png` were
 *   likewise a step off (analytics-badge and star icons, matching the
 *   Platform section's Weekly/Monthly copy, not Daily/Weekly). Renamed to
 *   `platform-app.png` / `platform-icon-daily.png` / `platform-icon-weekly.png`
 *   / `platform-icon-monthly.png` per their actual content.
 * - `pillar-consultations.png` was the 10-photo "Ancient Wisdom" collage,
 *   not a Consultations icon — renamed to `pillars-collage.png` and wired
 *   to `pillarsCollage`.
 * - The live GHL capture has no per-item icon for the Consultations /
 *   Academy / Speaking pillar bar (`Pillars.astro` is text-only).
 *
 * Grok relaunch verification (2026-07-23): every local file below was
 * SHA-256 compared to its GHL CDN counterpart under
 * `assets.cdn.filesafe.space/OjRihR4hKrEVcA3qJMfk/media/` (or
 * `storage.googleapis.com/msgsndr/...` for press marks). All required
 * slots match exactly; offering card order was confirmed against the
 * heading copy adjacent to each media id in `body-noscript.html`.
 * `press-ceotimes` / `press-womensinsider` are black marks (transparent
 * canvas) — correct for the light `--cae-press-bg` band.
 */

import logo from "../../assets/logo.png";
import heroBg from "../../assets/hero-bg.jpeg";
import heroSlogan from "../../assets/hero-slogan.png";
import pressAp from "../../assets/press-ap.svg?url";
import pressNewsbreak from "../../assets/press-newsbreak.png";
import pressDigitalJournal from "../../assets/press-digitaljournal.png";
import pressPrimeTime from "../../assets/press-primetime.png";
import pressCeoTimes from "../../assets/press-ceotimes.png";
import pressNyReview from "../../assets/press-nyreview.png";
import pressWomensInsider from "../../assets/press-womensinsider.png";
import pressUsaNews from "../../assets/press-usanews.png";
import offeringConsult from "../../assets/offering-consult.jpeg";
import offeringWorkshop from "../../assets/offering-workshop.jpeg";
import offeringLearnZwds from "../../assets/offering-learn-zwds.jpeg";
import offeringInsider from "../../assets/offering-insider.jpeg";
import offeringsBg from "../../assets/offerings-bg.jpeg";
import pillarsCollage from "../../assets/pillars-collage.png";
import pillarsBg from "../../assets/pillars-bg.jpeg";
import connectPanelBg from "../../assets/connect-panel-bg.jpeg";
import platformApp from "../../assets/platform-app.png";
import platformIconDaily from "../../assets/platform-icon-daily.png";
import platformIconWeekly from "../../assets/platform-icon-weekly.png";
import platformIconMonthly from "../../assets/platform-icon-monthly.png";
import decorStar from "../../assets/decor-star.png";
import testimonialPortrait1 from "../../assets/testimonial-portrait-1.png";
import testimonialPortrait2 from "../../assets/testimonial-portrait-2.png";
import testimonialPortrait3 from "../../assets/testimonial-portrait-3.png";
/** `?url` keeps SVG slots as string paths (Astro otherwise yields SVG components). */
import instagram from "../../assets/instagram.svg?url";
import facebook from "../../assets/facebook.svg?url";
import xiaohongshu from "../../assets/xiaohongshu.svg?url";

/**
 * Typed homepage image map keyed by logical slot names used by content modules
 * and Astro section components.
 */
export const homeImages = {
  logo,
  heroBg,
  /** Hero slogan pill artwork ("POWER & BREAKTHROUGH FOR EVERYONE") used by `hero.ts`. */
  heroSlogan,
  pressAp,
  pressNewsbreak,
  pressDigitalJournal,
  pressPrimeTime,
  pressCeoTimes,
  pressNyReview,
  pressWomensInsider,
  pressUsaNews,
  /** Consult offering card photo (flight helmet) used by `offerings.ts`. */
  offeringConsult,
  /** Workshop offering card photo (creative studio) used by `offerings.ts`. */
  offeringWorkshop,
  /** Learn ZWDS offering card photo (library aisle) used by `offerings.ts`. */
  offeringLearnZwds,
  /** Insider offering card photo (eyes through leaves) used by `offerings.ts`. */
  offeringInsider,
  /** Offerings section background (GHL bg-section-gZkeGFtHWF). */
  offeringsBg,
  /** Ancient Wisdom 10-photo collage slot used by `pillars.ts`. */
  pillarsCollage,
  /** Pillars / Ancient Wisdom section background (GHL bg-section-m2EB8Ft6xN2). */
  pillarsBg,
  /** Connect CTA panel photo texture (GHL row Mk59g9CqkV background). */
  connectPanelBg,
  /** Platform app dashboard mockup slot used by `platform.ts`. */
  platformApp,
  /** Daily rhythm "glowing heart" icon slot used by `platform.ts`. */
  platformDaily: platformIconDaily,
  /** Weekly rhythm "analytics + badge" icon slot used by `platform.ts`. */
  platformWeekly: platformIconWeekly,
  /** Monthly rhythm "glowing star" icon slot used by `platform.ts`. */
  platformMonthly: platformIconMonthly,
  /** Five-star rating artwork used on static testimonial cards. */
  decorStar,
  testimonialPortrait1,
  testimonialPortrait2,
  testimonialPortrait3,
  instagram,
  facebook,
  xiaohongshu,
  /** Social icon slots used by `cta.ts` and the Social Media hub. */
  socialInstagram: instagram,
  socialFacebook: facebook,
  socialXiaohongshu: xiaohongshu,
} as const;

/** Logical slot keys for {@link homeImages}. */
export type HomeImageKey = keyof typeof homeImages;

/** Imported asset module type for any homepage image slot. */
export type HomeImageAsset = (typeof homeImages)[HomeImageKey];

/**
 * Press-logo slots in Featured On marquee order (matches live capture).
 */
export const pressImageKeys = [
  "pressAp",
  "pressNewsbreak",
  "pressDigitalJournal",
  "pressPrimeTime",
  "pressCeoTimes",
  "pressNyReview",
  "pressWomensInsider",
  "pressUsaNews",
] as const satisfies ReadonlyArray<HomeImageKey>;

/** Union of press marquee image keys. */
export type PressImageKey = (typeof pressImageKeys)[number];

/**
 * Type guard for homepage image slot keys.
 * @param value - Candidate slot name from content or props
 * @returns True when `value` is a known {@link HomeImageKey}
 */
export function isHomeImageKey(value: string): value is HomeImageKey {
  return Object.prototype.hasOwnProperty.call(homeImages, value);
}

/**
 * Resolves a logical homepage image slot to its static import.
 * @param key - Slot name from {@link HomeImageKey}
 * @returns Astro/Vite image module for the slot
 */
export function getHomeImage(key: HomeImageKey): HomeImageAsset {
  return homeImages[key];
}
