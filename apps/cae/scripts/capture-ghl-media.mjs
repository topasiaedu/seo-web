/**
 * @fileoverview Capture https://caegoh.com/media via fetch (no Playwright).
 * Saves raw HTML, preview-container slice, and concatenated <style> + linked CSS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const outDir = path.join(
  root,
  "seo-wiki-vault/raw/research/cae-ghl-capture-media/_ghl-extract",
);
const MEDIA_URL = "https://caegoh.com/media";

/**
 * @param {string} html
 * @returns {string}
 */
function extractPreview(html) {
  const marker = 'id="preview-container"';
  const idIdx = html.indexOf(marker);
  if (idIdx === -1) {
    throw new Error("preview-container not found");
  }
  const openStart = html.lastIndexOf("<div", idIdx);
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
  throw new Error("Unclosed preview-container");
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

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const res = await fetch(MEDIA_URL, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      accept: "text/html",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${String(res.status)}`);
  }
  const rawHtml = await res.text();
  fs.writeFileSync(path.join(outDir, "raw.html"), rawHtml, "utf8");

  const preview = extractPreview(rawHtml);
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
    const abs = resolveUrl(href, MEDIA_URL);
    // Skip Google Fonts CSS (layout already loads fonts)
    if (abs.includes("fonts.googleapis.com")) {
      continue;
    }
    try {
      const cssRes = await fetch(abs, {
        headers: { "user-agent": "Mozilla/5.0", accept: "text/css,*/*" },
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

  fs.writeFileSync(
    path.join(outDir, "..", "README.md"),
    `# CAE Media & Press GHL capture

Immutable research dump of ${MEDIA_URL} (captured ${new Date().toISOString().slice(0, 10)}).

Runtime lift: \`apps/cae/src/pages/media/index.astro\` + \`apps/cae/src/components/ghl/media/\`.

| File | Notes |
|------|--------|
| \`raw.html\` | Full HTTP response |
| \`preview-cleaned.html\` | \`#preview-container\` slice |
| \`styles.css\` / \`ghl-page.css\` | Inline \`<style>\` blocks + linked sheets |
| \`stylesheets.html\` | External stylesheet link tags |
`,
    "utf8",
  );

  console.log("preview bytes", Buffer.byteLength(preview, "utf8"));
  console.log("css bytes", Buffer.byteLength(combined, "utf8"));
  console.log("style blocks", styleBlocks.length, "linked", linkedCss.length);
  // Peek section ids
  const ids = [...preview.matchAll(/id="(section-[^"]+)"/g)].map((m) => m[1]);
  console.log("sections", [...new Set(ids)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
