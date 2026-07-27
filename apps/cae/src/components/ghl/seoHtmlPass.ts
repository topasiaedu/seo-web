/**
 * @fileoverview UI-safe SEO HTML post-pass for GHL-lifted fragments.
 *
 * Mutates only attributes and heading tag names — never classes, IDs, or layout.
 *
 * Heading policy (per fragment, because each section remaps independently):
 * - Primary fragments (hero / media articles): keep the first `<h1>`, demote the rest.
 * - All other fragments: demote every `<h1>` → `<h2>`.
 */

import { homeHero } from "@/data/home/hero";
import { homeOfferings } from "@/data/home/offerings";
import { homePlatform } from "@/data/home/platform";
import { homePress } from "@/data/home/press";
import { homePillars } from "@/data/home/pillars";
import { homeTestimonials } from "@/data/home/testimonials";
import { homeNav } from "@/data/home/nav";
import { homeCta } from "@/data/home/cta";

/** GHL section ids that own the page-level `<h1>`. */
const PRIMARY_H1_SECTION_RE =
  /id=["']section-GdS5u8Huz["']|id=["']section-D3OvNABS8F["']/i;

/**
 * Escapes a string for use inside a double-quoted HTML attribute.
 *
 * @param value - Raw attribute value
 * @returns Escaped value safe for `attr="…"`
 */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Sets or replaces an attribute on an HTML start-tag string.
 *
 * @param tag - Full `<img …>` or `<a …>` opening tag
 * @param name - Attribute name
 * @param value - Attribute value (unescaped)
 * @returns Updated tag string
 */
function setAttr(tag: string, name: string, value: string): string {
  const escaped = escapeAttr(value);
  const attrRe = new RegExp(
    `\\s${name}(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]*))?`,
    "i",
  );
  if (attrRe.test(tag)) {
    return tag.replace(attrRe, ` ${name}="${escaped}"`);
  }
  return tag.replace(/>$/, ` ${name}="${escaped}">`);
}

/**
 * Reads an attribute value from an HTML start-tag, if present.
 *
 * @param tag - Opening tag
 * @param name - Attribute name
 * @returns Attribute value or `undefined`
 */
function getAttr(tag: string, name: string): string | undefined {
  const match = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  if (match === null) {
    if (new RegExp(`\\s${name}(?=[\\s>])`, "i").test(tag)) {
      return "";
    }
    return undefined;
  }
  return match[1] ?? match[2] ?? match[3];
}

/**
 * True when alt is missing or empty (`alt`, `alt=""`, `alt=''`).
 *
 * @param tag - Opening `<img>` tag
 * @returns Whether alt needs a meaningful value
 */
function hasEmptyAlt(tag: string): boolean {
  const value = getAttr(tag, "alt");
  if (value === undefined) {
    return true;
  }
  return value.trim().length === 0;
}

/**
 * Builds src-substring → preferred alt map from homepage content modules.
 *
 * @param urls - Remapped HomeImageKey → URL map (optional; token keys also matched)
 * @returns List of matchers applied in order
 */
function buildAltMatchers(
  urls: Readonly<Record<string, string>>,
): ReadonlyArray<{ readonly test: RegExp; readonly alt: string }> {
  const matchers: Array<{ test: RegExp; alt: string }> = [];

  /**
   * Registers token + resolved-URL matchers for one image slot.
   *
   * @param key - HomeImageKey string
   * @param alt - Preferred alt text (empty string marks decorative)
   */
  const pushKey = (key: string, alt: string): void => {
    matchers.push({
      test: new RegExp(`__GHL_ASSET_${key}__`, "i"),
      alt,
    });
    const url = urls[key];
    if (typeof url === "string" && url.length > 0) {
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchers.push({ test: new RegExp(escaped, "i"), alt });
    }
  };

  pushKey("heroSlogan", homeHero.sloganAlt);
  pushKey("logo", homeNav.logoAlt);
  pushKey("pillarsCollage", homePillars.wisdom.collageAlt);
  pushKey("platformApp", homePlatform.appAlt);

  for (const card of homeOfferings.cards) {
    pushKey(card.imageKey, card.imageAlt);
  }
  for (const logo of homePress.logos) {
    pushKey(logo.imageKey, logo.alt);
  }
  for (const item of homePlatform.rhythm) {
    pushKey(item.iconImageKey, item.iconAlt);
  }
  for (const card of homeTestimonials.staticQuotes) {
    pushKey(card.portraitImageKey, card.portraitAlt);
  }
  for (const link of homeCta.social) {
    pushKey(link.iconImageKey, link.iconAlt);
  }

  pushKey("decorStar", "");

  // Filename / path fragment matchers (media remaps use hashed asset URLs).
  matchers.push({ test: /decor-star/i, alt: "" });
  matchers.push({ test: /press-ap/i, alt: "APNews Logo" });
  matchers.push({ test: /press-newsbreak/i, alt: "Newsbreak Logo" });
  matchers.push({ test: /press-digitaljournal/i, alt: "DigitalJournal Logo" });
  matchers.push({ test: /press-primetime/i, alt: "PrimeTimePress Logo" });
  matchers.push({ test: /press-ceotimes/i, alt: "CEOTimes Logo" });
  matchers.push({ test: /press-nyreview/i, alt: "NYReview Logo" });
  matchers.push({ test: /press-womensinsider/i, alt: "WomensInsider Logo" });
  matchers.push({ test: /press-usanews/i, alt: "USANews Logo" });

  return matchers;
}

/**
 * Patches a single `<img>` opening tag for alt / loading hints.
 *
 * @param tag - Opening img tag
 * @param matchers - Src → alt rules
 * @returns Updated tag
 */
function patchImgTag(
  tag: string,
  matchers: ReadonlyArray<{ readonly test: RegExp; readonly alt: string }>,
): string {
  let out = tag;
  const src = getAttr(out, "src") ?? "";

  const isHeroSlogan =
    /__GHL_ASSET_heroSlogan__/i.test(src) || /hero-slogan/i.test(src);
  const isLogo =
    /__GHL_ASSET_logo__/i.test(src) ||
    (/logo\./i.test(src) && !/press-/i.test(src)) ||
    /67f10ca0e06ab0135af56cc0/i.test(src);

  if (isHeroSlogan) {
    out = setAttr(out, "alt", homeHero.sloganAlt);
    out = setAttr(out, "loading", "eager");
    out = setAttr(out, "fetchpriority", "high");
    out = setAttr(out, "decoding", "async");
    return out;
  }

  if (isLogo) {
    out = setAttr(out, "alt", homeNav.logoAlt);
    out = setAttr(out, "loading", "eager");
    out = setAttr(out, "decoding", "async");
    return out;
  }

  for (const matcher of matchers) {
    if (matcher.test.test(src)) {
      if (matcher.alt.length === 0) {
        out = setAttr(out, "alt", "");
      } else if (hasEmptyAlt(out) || getAttr(out, "alt") === "Brand Logo") {
        out = setAttr(out, "alt", matcher.alt);
      }
      break;
    }
  }

  if (hasEmptyAlt(out)) {
    const title = getAttr(out, "title");
    if (typeof title === "string" && title.trim().length > 0) {
      out = setAttr(out, "alt", title.trim());
    }
  }

  // Media article / remaining content images: prefer a descriptive fallback
  // over a bare empty alt (skip decorative data-URI SVGs and intentional empty).
  if (hasEmptyAlt(out)) {
    const isDataUri = /^data:/i.test(src);
    const isDecor = /decor-star/i.test(src);
    if (!isDataUri && !isDecor) {
      out = setAttr(out, "alt", "Press coverage featuring Cae Goh");
    } else if (isDataUri) {
      out = setAttr(out, "alt", "");
    }
  }

  const loading = getAttr(out, "loading");
  if (loading === undefined || loading.trim().length === 0) {
    out = setAttr(out, "loading", "lazy");
  }
  if (getAttr(out, "decoding") === undefined) {
    out = setAttr(out, "decoding", "async");
  }

  return out;
}

/**
 * Demotes `<h1>` tags according to keep-first vs demote-all.
 *
 * @param html - Fragment HTML
 * @param keepFirst - When true, preserve the first h1 only
 * @returns HTML with demoted headings
 */
function demoteH1Tags(html: string, keepFirst: boolean): string {
  let h1Index = 0;
  const openRanks: number[] = [];

  return html.replace(/<\/?h1\b[^>]*>/gi, (tag) => {
    if (tag.startsWith("</")) {
      const rank = openRanks.pop();
      if (keepFirst && (rank === undefined || rank === 1)) {
        return "</h1>";
      }
      return "</h2>";
    }
    h1Index += 1;
    openRanks.push(h1Index);
    if (keepFirst && h1Index === 1) {
      return tag;
    }
    return tag.replace(/^<h1\b/i, "<h2");
  });
}

/**
 * Fixes nav logo links that use a raw URL as `aria-label`.
 *
 * @param html - Fragment HTML
 * @returns HTML with readable aria-labels
 */
function patchNavAriaLabels(html: string): string {
  return html.replace(
    /aria-label="https?:\/\/[^"]+"/gi,
    'aria-label="Cae Goh home"',
  );
}

/**
 * Improves weak `alt="Brand Logo"` copy site-wide.
 *
 * @param html - Fragment HTML
 * @returns HTML with improved brand alt
 */
function patchBrandLogoAlt(html: string): string {
  return html.replace(
    /\salt=(["'])Brand Logo\1/gi,
    ` alt="${escapeAttr(homeNav.logoAlt)}"`,
  );
}

/**
 * Applies UI-safe SEO fixes to remapped (or tokenized) GHL HTML.
 *
 * @param html - HTML string
 * @param urls - Asset key → URL map (may be empty / filename-keyed for media)
 * @returns Patched HTML
 */
export function applySeoHtmlPass(
  html: string,
  urls: Readonly<Record<string, string>>,
): string {
  if (typeof html !== "string") {
    throw new Error("applySeoHtmlPass: html must be a string.");
  }

  let out = html;
  const matchers = buildAltMatchers(urls);

  out = out.replace(/<img\b[^>]*>/gi, (tag) => patchImgTag(tag, matchers));
  out = patchBrandLogoAlt(out);
  out = patchNavAriaLabels(out);

  const keepFirstH1 = PRIMARY_H1_SECTION_RE.test(out);
  out = demoteH1Tags(out, keepFirstH1);

  return out;
}
