/**
 * @fileoverview Capture https://doctorjasmine.com/register (resolves to join page)
 * into the immutable vault research dump. Run once; never overwrite after commit.
 *
 * Usage (from repo root):
 *   node apps/dr-jasmine/scripts/capture-ghl-page.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const outDir = path.join(
  root,
  "seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/_ghl-extract",
);
const REGISTER_URL = "https://doctorjasmine.com/register";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Extracts the outermost element matching a marker substring in an attribute.
 *
 * @param {string} html
 * @param {string} marker
 * @returns {string}
 */
function extractByMarker(html, marker) {
  const idIdx = html.indexOf(marker);
  if (idIdx === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }
  const openStart = html.lastIndexOf("<div", idIdx);
  if (openStart === -1) {
    throw new Error(`Open <div not found for marker: ${marker}`);
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
  throw new Error(`Unclosed element for marker: ${marker}`);
}

/**
 * @param {string} html
 * @returns {string[]}
 */
function extractStyleBlocks(html) {
  const blocks = [];
  const re = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let match = re.exec(html);
  while (match !== null) {
    const body = match[1] ?? "";
    if (body.trim().length > 0) {
      blocks.push(body);
    }
    match = re.exec(html);
  }
  return blocks;
}

/**
 * @param {string} html
 * @returns {string[]}
 */
function extractStylesheetHrefs(html) {
  const hrefs = [];
  const re = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  let match = re.exec(html);
  while (match !== null) {
    const tag = match[0];
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (hrefMatch?.[1]) {
      hrefs.push(hrefMatch[1]);
    }
    match = re.exec(html);
  }
  return hrefs;
}

/**
 * @param {string} href
 * @param {string} base
 * @returns {string}
 */
function resolveUrl(href, base) {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

/**
 * Collects unique image / background CDN URLs from HTML + CSS.
 *
 * @param {string} text
 * @returns {string[]}
 */
function collectAssetUrls(text) {
  const urls = new Set();
  const re =
    /https?:\/\/(?:assets\.cdn\.filesafe\.space|storage\.googleapis\.com|stcdn\.leadconnectorhq\.com|cdn\.msgsndr\.com|images\.leadconnectorhq\.com)[^"'\\s)]+/gi;
  let match = re.exec(text);
  while (match !== null) {
    const url = match[0].replace(/&amp;/g, "&");
    urls.add(url);
    match = re.exec(text);
  }
  return [...urls].sort();
}

async function main() {
  if (fs.existsSync(path.join(outDir, "raw.html"))) {
    console.error(
      "Capture already exists at",
      outDir,
      "- refusing to overwrite (raw is immutable).",
    );
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const res = await fetch(REGISTER_URL, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${String(res.status)}`);
  }
  const finalUrl = res.url;
  const rawHtml = await res.text();
  const capturedAt = new Date().toISOString();

  fs.writeFileSync(path.join(outDir, "raw.html"), rawHtml, "utf8");

  const preview = extractByMarker(rawHtml, 'id="preview-container"');
  fs.writeFileSync(path.join(outDir, "preview-cleaned.html"), preview, "utf8");

  const styleBlocks = extractStyleBlocks(rawHtml);
  const hrefs = extractStylesheetHrefs(rawHtml);
  fs.writeFileSync(
    path.join(outDir, "stylesheets.html"),
    hrefs.map((h) => `<link rel="stylesheet" href="${h}">`).join("\n"),
    "utf8",
  );

  const linkedCss = [];
  for (const href of hrefs) {
    const abs = resolveUrl(href, finalUrl);
    if (abs.includes("fonts.googleapis.com") || abs.includes("fonts.gstatic.com")) {
      continue;
    }
    try {
      const cssRes = await fetch(abs, {
        headers: { "user-agent": USER_AGENT, accept: "text/css,*/*" },
      });
      if (cssRes.ok) {
        const text = await cssRes.text();
        linkedCss.push(`/* from ${abs} */\n${text}`);
        console.log("fetched css", abs, text.length);
      } else {
        console.warn("skip css", abs, cssRes.status);
      }
    } catch (error) {
      console.warn("css fetch error", abs, error);
    }
  }

  const combined = [...styleBlocks, ...linkedCss].join("\n\n");
  fs.writeFileSync(path.join(outDir, "styles.css"), combined, "utf8");
  fs.writeFileSync(path.join(outDir, "ghl-page.css"), combined, "utf8");

  const sectionIds = [
    ...new Set(
      [...preview.matchAll(/id="(section-[^"]+)"/g)].map((m) => m[1]),
    ),
  ];
  fs.writeFileSync(
    path.join(outDir, "section-ids.json"),
    `${JSON.stringify(sectionIds, null, 2)}\n`,
    "utf8",
  );

  const assetUrls = collectAssetUrls(`${preview}\n${combined}`);
  fs.writeFileSync(
    path.join(outDir, "asset-urls.json"),
    `${JSON.stringify(assetUrls, null, 2)}\n`,
    "utf8",
  );

  const meta = {
    startUrl: REGISTER_URL,
    finalUrl,
    capturedAt,
    contentBytes: Buffer.byteLength(rawHtml, "utf8"),
    previewBytes: Buffer.byteLength(preview, "utf8"),
    cssBytes: Buffer.byteLength(combined, "utf8"),
    styleBlockCount: styleBlocks.length,
    linkedStylesheetCount: linkedCss.length,
    sectionIds,
    assetUrlCount: assetUrls.length,
  };
  fs.writeFileSync(
    path.join(outDir, "capture-meta.json"),
    `${JSON.stringify(meta, null, 2)}\n`,
    "utf8",
  );

  const readme = `# Dr Jasmine GHL capture (register / join)

Immutable research dump of the live workshop registration funnel.

| Field | Value |
|-------|--------|
| Start URL | ${REGISTER_URL} |
| Resolved URL | ${finalUrl} |
| Captured at | ${capturedAt} |
| Method | \`node apps/dr-jasmine/scripts/capture-ghl-page.mjs\` (HTTP fetch, follow redirects) |

**Live site does not read this folder.** Runtime lift lives under \`apps/dr-jasmine/src/components/ghl/\` + \`apps/dr-jasmine/src/styles/ghl/\`.

## Layout

| Path | Notes |
|------|--------|
| \`_ghl-extract/raw.html\` | Full HTTP response body |
| \`_ghl-extract/preview-cleaned.html\` | \`#preview-container\` slice |
| \`_ghl-extract/styles.css\` / \`ghl-page.css\` | Inline \`<style>\` blocks + linked sheets (fonts skipped) |
| \`_ghl-extract/stylesheets.html\` | External stylesheet link tags |
| \`_ghl-extract/section-ids.json\` | GHL \`section-*\` ids in DOM order |
| \`_ghl-extract/asset-urls.json\` | CDN image / media URLs discovered in HTML+CSS |
| \`_ghl-extract/capture-meta.json\` | Provenance metadata |

## Section inventory (capture order)

${sectionIds.map((id, i) => `${i + 1}. \`${id}\``).join("\n")}

## Immutability

Do **not** edit files under this folder after the first write. Re-capture goes to a new dated sibling folder if needed.

## Regenerate lift (runtime copies)

From repo root, after a capture exists:

\`\`\`bash
node apps/dr-jasmine/scripts/download-ghl-assets.mjs
node apps/dr-jasmine/scripts/lift-ghl-sections.mjs
node apps/dr-jasmine/scripts/sanitize-ghl-css.mjs
\`\`\`

See \`apps/dr-jasmine/scripts/README.md\`.
`;

  fs.writeFileSync(
    path.join(outDir, "..", "README.md"),
    `${readme}\n`,
    "utf8",
  );

  console.log("finalUrl", finalUrl);
  console.log("preview bytes", Buffer.byteLength(preview, "utf8"));
  console.log("css bytes", Buffer.byteLength(combined, "utf8"));
  console.log("sections", sectionIds);
  console.log("assets", assetUrls.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
