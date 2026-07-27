/**
 * @fileoverview One-shot generator: sanitize GHL preview HTML, split by section,
 * remap known CDN media IDs to Astro asset placeholders, write fragment HTML files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const captureHtml = path.join(
  root,
  "seo-wiki-vault/raw/research/cae-ghl-capture/_ghl-extract/preview-cleaned.html",
);
const outDir = path.join(__dirname, "../src/components/ghl/fragments");

/** @type {ReadonlyArray<{ id: string; file: string }>} */
const SECTIONS = [
  { id: "section-us5zIkycRg", file: "logo-bar.html" },
  { id: "section-CfDAEFyJd7", file: "nav.html" },
  { id: "section-GdS5u8Huz", file: "hero.html" },
  { id: "section-JP6zPvfGtS", file: "press.html" },
  { id: "section-gZkeGFtHWF", file: "offerings.html" },
  { id: "section-m2EB8Ft6xN2", file: "pillars.html" },
  { id: "section-eLWtYi2DVK", file: "platform.html" },
  { id: "section-3vDFXLsKtI3", file: "social-proof.html" },
  { id: "section-WpyBRTO4O1", file: "testimonial-carousel.html" },
  { id: "section-gyxX8rymSw9", file: "connect.html" },
  { id: "section-R2YzY26o5TE", file: "footer.html" },
];

/**
 * Media filename / path fragment → HomeImageKey token used as __GHL_ASSET_key__.
 * Matched against full CDN URLs (substring).
 * @type {ReadonlyArray<[string, string]>}
 */
const MEDIA_TO_KEY = [
  ["67f10ca0e06ab0135af56cc0.png", "logo"],
  ["67f10f9ce06ab00367f56eca.png", "heroSlogan"],
  ["68a5af49821cc74b1bdfd365.jpeg", "heroBg"],
  ["6877a37f1db1291e184636bd.svg", "pressAp"],
  ["6878720d4e2184e89da3351a.png", "pressNewsbreak"],
  ["6877abd59ee714fcdb5cf4cc.png", "pressDigitalJournal"],
  ["68779ca3204f2d3df0d3b716.png", "pressPrimeTime"],
  ["6877ac4a1db12948804660f4.png", "pressCeoTimes"],
  ["6877ac78204f2d1facd3f201.png", "pressNyReview"],
  ["6877aca6e2aa7cc657ce7191.png", "pressWomensInsider"],
  ["6877acf1c019ad946157f741.png", "pressUsaNews"],
  ["67f53ff44f87eafcd8dbe323.jpeg", "offeringConsult"],
  ["67f53ff46735136eace08432.jpeg", "offeringWorkshop"],
  ["67f53ff46735136511e08431.jpeg", "offeringLearnZwds"],
  ["67f53ff4cafd9fdc54fb1845.jpeg", "offeringInsider"],
  ["66ab67258f484e307761421d.jpeg", "offeringsBg"],
  ["66ab65d38f484e8aee614113.jpeg", "pillarsBg"],
  ["67f140b9f10fee4503b24ecc.png", "pillarsCollage"],
  ["67f25ac5f10fee1d2cb4ddbd.png", "platformApp"],
  ["a7bd65e5-8409-4f17-87c1-709f3ab9c480.png", "platformDaily"],
  ["b7d56432-003b-4270-acf7-5b4786d3f843.png", "platformWeekly"],
  ["e842b1f7-1449-4101-8091-a9deb564d6d3.png", "platformMonthly"],
  ["68a247b64fa1aa44364a1eba.png", "testimonialPortrait1"],
  ["67f3bb1498b997d8234700af.png", "testimonialPortrait2"],
  ["64ae9dc8-c50a-40f9-a455-949506c98c66.png", "testimonialPortrait3"],
  ["53c53ac0-5974-420d-bc0d-0707a1e96199.png", "decorStar"],
  ["a4c8edea-a11c-4d9d-8b38-942ed8a8c6c9.jpeg", "connectPanelBg"],
];

/**
 * Strips Vue/SSR comment noise and nested document shells from custom-code.
 * @param {string} html
 * @returns {string}
 */
function sanitize(html) {
  let out = html;
  out = out.replace(/<!---->/g, "");
  out = out.replace(/<!--\[-->/g, "");
  out = out.replace(/<!--\]-->/g, "");
  out = out.replace(/<!--teleport start-->/g, "");
  out = out.replace(/<!--teleport end-->/g, "");
  // Drop empty spans EXCEPT the mobile nav hamburger host (`span::before` icon).
  out = out.replace(/<span><\/span>/g, "");
  // Re-inject hamburger span if the mobile toggle was emptied.
  out = out.replace(
    /(class="[^"]*nav-menu-mobile[^"]*"[^>]*>)(<\/div>)/,
    "$1<span></span>$2",
  );
  // Nested full documents inside custom-code containers → keep style + body content only
  out = out.replace(
    /(<div id="custom-code-[^"]+"[^>]*class="custom-code-container[^"]*"[^>]*>)\s*<!DOCTYPE html>[\s\S]*?<body[^>]*>/gi,
    "$1",
  );
  out = out.replace(
    /<\/body>\s*<\/html>\s*(<\/div>)/gi,
    "$1",
  );
  // Drop Cloudflare beacon scripts
  out = out.replace(/<script[^>]*cloudflareinsights[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<script type="module"[^>]*beacon[^>]*>[\s\S]*?<\/script>/gi, "");
  // Drop nested font links inside widgets (layout already loads fonts)
  out = out.replace(
    /<link href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/gi,
    "",
  );
  // Drop nested head remnants that may remain after body extraction failures
  out = out.replace(/<!DOCTYPE html>/gi, "");
  out = out.replace(/<html[^>]*>/gi, "");
  out = out.replace(/<\/html>/gi, "");
  out = out.replace(/<head>[\s\S]*?<\/head>/gi, (block) => {
    const styleMatch = block.match(/<style>[\s\S]*?<\/style>/gi);
    return styleMatch ? styleMatch.join("\n") : "";
  });
  out = out.replace(/<\/?body[^>]*>/gi, "");
  // Convert CTA buttons that look like primary CTAs to anchors (keep classes)
  out = out.replace(
    /<button([^>]*class="([^"]*cbutton-[^"]*)"[^>]*)>([\s\S]*?)<\/button>/gi,
    (full, attrs, _cls, inner) => {
      // Prefer data / aria label text
      const labelMatch = attrs.match(/aria-label="([^"]*)"/i);
      const textMatch = inner.match(/class="main-heading-button">([^<]*)</);
      const label = (textMatch?.[1] ?? labelMatch?.[1] ?? "Learn more").trim();
      // Strip id=_btn suffix quirks; keep class list; remove type
      let aAttrs = attrs
        .replace(/\s*id="[^"]*_btn"/i, "")
        .replace(/\s*type="[^"]*"/i, "");
      // Try to find a nearby href from original button — default hash Insights for hero
      let href = "#insights";
      if (/LEARN MORE/i.test(label)) {
        href = "#insights";
      }
      return `<a href="${href}"${aAttrs}>${inner}</a>`;
    },
  );
  // Collapse whitespace between tags lightly
  out = out.replace(/>\s+</g, "><");
  return out.trim();
}

/**
 * Replaces CDN image URLs with __GHL_ASSET_key__ tokens.
 * @param {string} html
 * @returns {string}
 */
function tokenizeAssets(html) {
  let out = html;
  for (const [media, key] of MEDIA_TO_KEY) {
    const token = `__GHL_ASSET_${key}__`;
    // Replace any URL that contains this media id (including leadconnector wrappers)
    const re = new RegExp(
      `https://[^"'\\s)]+${media.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"'\\s)]*`,
      "g",
    );
    out = out.replace(re, token);
  }
  return out;
}

/**
 * Finds the outermost section element for a given id.
 * @param {string} html
 * @param {string} sectionId
 * @returns {string}
 */
function extractSection(html, sectionId) {
  const marker = `id="${sectionId}"`;
  const idIdx = html.indexOf(marker);
  if (idIdx === -1) {
    throw new Error(`Section not found: ${sectionId}`);
  }
  // Walk back to the opening <div of this section
  const openStart = html.lastIndexOf("<div", idIdx);
  if (openStart === -1) {
    throw new Error(`Open tag not found for ${sectionId}`);
  }
  let depth = 0;
  let i = openStart;
  while (i < html.length) {
    if (html.startsWith("<div", i)) {
      depth += 1;
      i += 4;
      continue;
    }
    if (html.startsWith("</div>", i)) {
      depth -= 1;
      i += 6;
      if (depth === 0) {
        return html.slice(openStart, i);
      }
      continue;
    }
    i += 1;
  }
  throw new Error(`Unclosed section: ${sectionId}`);
}

/**
 * Strips nested <script> blocks from carousel (we load TS separately).
 * @param {string} html
 * @returns {string}
 */
function stripInlineScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let raw = fs.readFileSync(captureHtml, "utf8");
  // Work inside preview-container content if present
  const previewOpen = raw.indexOf('id="preview-container"');
  if (previewOpen !== -1) {
    const after = raw.indexOf(">", previewOpen) + 1;
    raw = raw.slice(after);
  }

  const report = [];
  for (const { id, file } of SECTIONS) {
    let section = extractSection(raw, id);
    section = sanitize(section);
    section = stripInlineScripts(section);
    section = tokenizeAssets(section);
    // Press / carousel: ensure widget <style> selectors are scoped enough —
    // leave as-is (original used body; we override in widget CSS files).
    const outPath = path.join(outDir, file);
    fs.writeFileSync(outPath, `${section}\n`, "utf8");
    report.push({ file, bytes: Buffer.byteLength(section, "utf8") });
  }

  // Write media key list for the Astro remapper
  const keys = [...new Set(MEDIA_TO_KEY.map(([, k]) => k))];
  fs.writeFileSync(
    path.join(outDir, "asset-keys.json"),
    `${JSON.stringify(keys, null, 2)}\n`,
    "utf8",
  );

  console.log("Wrote fragments:");
  for (const row of report) {
    console.log(`  ${row.file} (${row.bytes} bytes)`);
  }
}

main();
