/**
 * @fileoverview UI-safe SEO HTML post-pass for Dr Jasmine GHL-lifted fragments.
 *
 * Mutates only attributes and heading tag names — never classes, IDs, or layout.
 *
 * Heading policy (per fragment, because each section remaps independently):
 * - Primary fragments (hero): keep the first `<h1>`, demote the rest.
 * - All other fragments: demote every `<h1>` → `<h2>`.
 */

import {
  isLandingImageKey,
  landingImageAlts,
} from "@/data/landing/images";

/** GHL section ids that own the page-level `<h1>`. */
const PRIMARY_H1_SECTION_RE = /id=["']section-JznNLwNnfV["']/i;

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
 * Builds src-substring → preferred alt map from landing image slots.
 *
 * @param urls - Remapped LandingImageKey → URL map
 * @returns List of matchers applied in order
 */
function buildAltMatchers(
  urls: Readonly<Record<string, string>>,
): ReadonlyArray<{ readonly test: RegExp; readonly alt: string }> {
  const matchers: Array<{ test: RegExp; alt: string }> = [];

  for (const key of Object.keys(landingImageAlts)) {
    if (!isLandingImageKey(key)) {
      continue;
    }
    const alt = landingImageAlts[key];
    matchers.push({
      test: new RegExp(`__GHL_ASSET_${key}__`, "i"),
      alt,
    });
    const url = urls[key];
    if (typeof url === "string" && url.length > 0) {
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchers.push({ test: new RegExp(escaped, "i"), alt });
    }
  }

  matchers.push({ test: /dan-henry-portrait/i, alt: landingImageAlts.danHenryPortrait });
  matchers.push({
    test: /dr-jasmine-portrait/i,
    alt: landingImageAlts.drJasminePortrait,
  });
  matchers.push({ test: /disclaimer-bg/i, alt: "" });

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

  const isPortrait =
    /dan-henry-portrait|dr-jasmine-portrait|__GHL_ASSET_(?:danHenry|drJasmine)Portrait__/i.test(
      src,
    );

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

  if (hasEmptyAlt(out)) {
    const isDataUri = /^data:/i.test(src);
    if (!isDataUri) {
      out = setAttr(out, "alt", "Dr Jasmine workshop");
    } else {
      out = setAttr(out, "alt", "");
    }
  }

  if (isPortrait) {
    const loading = getAttr(out, "loading");
    if (loading === undefined || loading.trim().length === 0) {
      out = setAttr(out, "loading", "lazy");
    }
  } else {
    const loading = getAttr(out, "loading");
    if (loading === undefined || loading.trim().length === 0) {
      out = setAttr(out, "loading", "lazy");
    }
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
 * Applies UI-safe SEO fixes to remapped (or tokenized) GHL HTML.
 *
 * @param html - HTML string
 * @param urls - Asset key → URL map (may be empty)
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

  const keepFirstH1 = PRIMARY_H1_SECTION_RE.test(out);
  out = demoteH1Tags(out, keepFirstH1);

  return out;
}
