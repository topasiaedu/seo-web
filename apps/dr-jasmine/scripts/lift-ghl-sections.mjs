/**
 * @fileoverview Sanitize GHL capture HTML, split by top-level section, remap
 * CDN media to `__GHL_ASSET_*__` tokens, write fragment HTML files.
 *
 * Usage (from repo root):
 *   node apps/dr-jasmine/scripts/lift-ghl-sections.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const captureHtml = path.join(
  root,
  "seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/_ghl-extract/preview-cleaned.html",
);
const outDir = path.join(__dirname, "../src/components/ghl/fragments");

/**
 * Top-level GHL sections → semantic fragment filenames.
 * Inventory mapping documented in scripts/README.md + SECTIONS_INVENTORY.md.
 *
 * @type {ReadonlyArray<{ id: string; file: string; inventory: string }>}
 */
const SECTIONS = [
  {
    id: "section-GLe69CVwOE",
    file: "banner-webinar.html",
    inventory: "1a — top banner / free webinar",
  },
  {
    id: "section--f-kMZ9azH",
    file: "banner-live.html",
    inventory: "1b — LIVE strip",
  },
  {
    id: "section-JznNLwNnfV",
    file: "hero.html",
    inventory: "2 — hero headline + subcopy",
  },
  {
    id: "section-0Po5h7CrMv",
    file: "main-body.html",
    inventory:
      "3–6 — authority + primary CTA + discover + countdown (single GHL section)",
  },
  {
    id: "section-agbqSXhonD",
    file: "testimonials.html",
    inventory: "7 — testimonials",
  },
  {
    id: "section-jPa9qaoewV",
    file: "faq.html",
    inventory: "8 — FAQ",
  },
  {
    id: "section-4vgQdH__sU",
    file: "closing-cta.html",
    inventory: "9 — closing CTA",
  },
  {
    id: "section-bNQ2yZ6r2DO",
    file: "dan-henry-cta.html",
    inventory: "extra — post-closing Dan Henry CTA strip (DOM order after 9)",
  },
  {
    id: "section-IPYkI1fQ26g",
    file: "disclaimer.html",
    inventory: "10 — legal / medical disclaimer footer",
  },
];

/**
 * Media filename / path fragment → LandingImageKey token.
 * Matched as substring against full CDN URLs (including leadconnector wrappers).
 *
 * @type {ReadonlyArray<[string, string]>}
 */
const MEDIA_TO_KEY = [
  ["69a1b392524b714c4459dfa3.jpg", "danHenryPortrait"],
  ["697376e3ef7d8ec82d869ab4.jpg", "drJasminePortrait"],
  ["666136581848ae65069c5b9f.jpeg", "disclaimerBg"],
];

/** Live register funnel URL token replaced at runtime by remapHtml. */
const REGISTER_TOKEN = "__GHL_REGISTER_URL__";

/**
 * Strips Vue/SSR comment noise and nested document shells from custom-code.
 *
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
  out = out.replace(/<span><\/span>/g, "");

  // Nested full documents inside custom-code containers → keep style + body content only
  out = out.replace(
    /(<div id="custom-code-[^"]+"[^>]*class="custom-code-container[^"]*"[^>]*>)\s*<!DOCTYPE html>[\s\S]*?<body[^>]*>/gi,
    "$1",
  );
  out = out.replace(/<\/body>\s*<\/html>\s*(<\/div>)/gi, "$1");

  out = out.replace(
    /<script[^>]*cloudflareinsights[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  out = out.replace(
    /<script type="module"[^>]*beacon[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  out = out.replace(
    /<link href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/gi,
    "",
  );
  out = out.replace(/<!DOCTYPE html>/gi, "");
  out = out.replace(/<html[^>]*>/gi, "");
  out = out.replace(/<\/html>/gi, "");
  out = out.replace(/<head>[\s\S]*?<\/head>/gi, (block) => {
    const styleMatch = block.match(/<style>[\s\S]*?<\/style>/gi);
    return styleMatch ? styleMatch.join("\n") : "";
  });
  out = out.replace(/<\/?body[^>]*>/gi, "");

  // Convert Secure My Seat (and sibling) GHL buttons to anchors targeting register.
  out = out.replace(
    /<button([^>]*class="([^"]*cbutton-[^"]*)"[^>]*)>([\s\S]*?)<\/button>/gi,
    (full, attrs, _cls, inner) => {
      const labelMatch = attrs.match(/aria-label="([^"]*)"/i);
      const textMatch = inner.match(/class="main-heading-button">([^<]*)</);
      const label = (textMatch?.[1] ?? labelMatch?.[1] ?? "Secure My Seat").trim();
      let aAttrs = attrs
        .replace(/\s*id="[^"]*_btn"/i, "")
        .replace(/\s*type="[^"]*"/i, "")
        .replace(/\s*data-animation-class="[^"]*"/i, "");
      const href = /Secure My Seat/i.test(label)
        ? REGISTER_TOKEN
        : REGISTER_TOKEN;
      return `<a href="${href}"${aAttrs}>${inner}</a>`;
    },
  );

  out = out.replace(/>\s+</g, "><");
  return out.trim();
}

/**
 * Replaces CDN image URLs with `__GHL_ASSET_key__` tokens.
 *
 * @param {string} html
 * @returns {string}
 */
function tokenizeAssets(html) {
  let out = html;
  for (const [media, key] of MEDIA_TO_KEY) {
    const token = `__GHL_ASSET_${key}__`;
    const escaped = media.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Full absolute URLs containing this media id (leadconnector wrappers included)
    const re = new RegExp(
      `https://[^"'\\s)]+${escaped}[^"'\\s)]*`,
      "g",
    );
    out = out.replace(re, token);
  }
  return out;
}

/**
 * Finds the outermost section element for a given id.
 *
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
 * Strips nested `<script>` blocks (countdown/FAQ JS rebuilt by T11).
 *
 * @param {string} html
 * @returns {string}
 */
function stripInlineScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

/**
 * Extracts the countdown custom-code widget for optional T11 use.
 *
 * @param {string} html
 * @returns {string | null}
 */
function extractCountdownWidget(html) {
  const marker = 'id="custom-code-PA0sQFYqt7N"';
  if (!html.includes(marker)) {
    return null;
  }
  try {
    return extractSection(html, "custom-code-PA0sQFYqt7N");
  } catch {
    // custom-code ids are on divs — extractSection walks `<div` which works
    return null;
  }
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let raw = fs.readFileSync(captureHtml, "utf8");
  const previewOpen = raw.indexOf('id="preview-container"');
  if (previewOpen !== -1) {
    const after = raw.indexOf(">", previewOpen) + 1;
    raw = raw.slice(after);
  }

  /** @type {Array<{ file: string; bytes: number; inventory: string }>} */
  const report = [];
  for (const { id, file, inventory } of SECTIONS) {
    let section = extractSection(raw, id);
    section = sanitize(section);
    section = stripInlineScripts(section);
    section = tokenizeAssets(section);
    const outPath = path.join(outDir, file);
    fs.writeFileSync(outPath, `${section}\n`, "utf8");
    report.push({
      file,
      bytes: Buffer.byteLength(section, "utf8"),
      inventory,
    });
  }

  // Optional countdown widget extract (also present inside main-body.html)
  const countdownRaw = extractCountdownWidget(raw);
  if (countdownRaw !== null) {
    let widget = sanitize(countdownRaw);
    widget = stripInlineScripts(widget);
    widget = tokenizeAssets(widget);
    fs.writeFileSync(
      path.join(outDir, "countdown-widget.html"),
      `${widget}\n`,
      "utf8",
    );
    report.push({
      file: "countdown-widget.html",
      bytes: Buffer.byteLength(widget, "utf8"),
      inventory: "6 (subset) — countdown custom-code only",
    });
  }

  const keys = [...new Set(MEDIA_TO_KEY.map(([, k]) => k))];
  fs.writeFileSync(
    path.join(outDir, "asset-keys.json"),
    `${JSON.stringify(keys, null, 2)}\n`,
    "utf8",
  );

  const inventoryDoc = `# Fragment ↔ inventory map

Generated by \`lift-ghl-sections.mjs\`. Do not hand-edit; re-run the lift script.

| Fragment | GHL section id | Plan inventory |
|----------|----------------|----------------|
${SECTIONS.map(
  (s) => `| \`${s.file}\` | \`${s.id}\` | ${s.inventory} |`,
).join("\n")}
${countdownRaw !== null ? `| \`countdown-widget.html\` | \`custom-code-PA0sQFYqt7N\` | 6 (subset) — countdown custom-code only |` : ""}

## Notes for T11

- Inventory items **3–6** (authority, primary CTA, discover, countdown) are **one** GHL section: \`main-body.html\` (\`section-0Po5h7CrMv\`). Compose that fragment once; do not expect separate top-level sections.
- \`dan-henry-cta.html\` appears **after** closing CTA in live DOM order — keep that order unless product asks otherwise.
- \`Secure My Seat\` buttons are rewritten to \`<a href="__GHL_REGISTER_URL__">\`; runtime remapper substitutes \`https://doctorjasmine.com/register\`.
- Inline \`<script>\` blocks are stripped; countdown tick + FAQ accordion need T11 client scripts (or leave FAQ as static open/closed CSS if GHL markup already expands).
- Countdown target from capture script: \`webinarDate = "2026 Aug 4 8:00 PM"\` (local time). Markup ids: \`#cta-d\`, \`#cta-h\`, \`#cta-m\`, \`#cta-s\`. Full script remains in vault \`preview-cleaned.html\` near \`custom-code-PA0sQFYqt7N\`.
- Suggested T11 composition order (Astro wrappers under \`components/ghl/\`):
  1. \`BannerWebinar\` + \`BannerLive\`
  2. \`Hero\`
  3. \`MainBody\` (authority + CTA + discover + countdown shell)
  4. \`Testimonials\`
  5. \`Faq\`
  6. \`ClosingCta\`
  7. \`DanHenryCta\`
  8. \`Disclaimer\`
- Layout CSS imports: \`@/styles/ghl/ghl-runtime.css\`, \`ghl-page.css\`, \`host-patch.css\`, \`bg-overrides.css\`. Wrap in \`#preview-container.hl_page-preview--content\`.
`;

  fs.writeFileSync(
    path.join(outDir, "SECTIONS_INVENTORY.md"),
    `${inventoryDoc}\n`,
    "utf8",
  );

  console.log("Wrote fragments:");
  for (const row of report) {
    console.log(`  ${row.file} (${String(row.bytes)} bytes) — ${row.inventory}`);
  }
}

main();
