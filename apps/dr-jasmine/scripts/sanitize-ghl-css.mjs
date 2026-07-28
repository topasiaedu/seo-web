/**
 * @fileoverview Copy vault capture CSS into the app tree, sanitize for
 * PostCSS/Vite, and strip CDN background URLs (replaced by bg-overrides.css).
 *
 * Usage (from repo root):
 *   node apps/dr-jasmine/scripts/sanitize-ghl-css.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const captureCss = path.join(
  root,
  "seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/_ghl-extract/ghl-page.css",
);
const outPath = path.join(__dirname, "../src/styles/ghl/ghl-page.css");

/**
 * @param {string} css
 * @returns {string}
 */
function sanitize(css) {
  let out = css;
  const before = out.length;

  // Broken icon :before rule — backslash eats the closing quote across a newline.
  out = out.replace(
    /content:\s*'\\'\s*;?\s*\n\s*font-family:\s*'';\s*/g,
    "content:'';font-family:'';",
  );
  out = out.replace(
    /content:\s*"\\"\s*;?\s*\n\s*font-family:\s*""\s*;?\s*/g,
    'content:"";font-family:"";',
  );

  out = out.replace(/font-weight:\s*undefined/g, "font-weight:400");
  out = out.replace(/box-shadow:\s*undefined/g, "box-shadow:none");
  out = out.replace(/:\s*undefined/g, ":initial");
  out = out.replace(/width:\s*auto%/g, "width:auto");

  // Remove CDN background urls for disclaimer section — bg-overrides.css supplies local files.
  out = out.replace(
    /background:\s*url\(https:\/\/images\.leadconnectorhq\.com\/image\/[^)]*666136581848ae65069c5b9f\.jpeg[^)]*\)\s*;?/gi,
    "/* disclaimer bg remapped via bg-overrides.css */",
  );

  // Drop Google Fonts @import (layout should load fonts explicitly).
  out = out.replace(
    /@import\s+url\(['"]?https:\/\/fonts\.googleapis\.com[^'")]+['"]?\);?/gi,
    "/* google fonts import removed — load via layout */",
  );

  // Premature `}` after `.top-bar` sticky props left visual rules orphaned (PostCSS fail).
  out = out.replace(
    /(\.top-bar\s*\{[\s\S]*?z-index:\s*9999\s*!important\s*;)\s*\}\s*(\/\*[^*]*\*\/\s*)*background-color:/g,
    "$1\n    background-color:",
  );

  console.log(
    `Sanitized ghl-page.css (${String(before)} → ${String(out.length)} bytes)`,
  );
  const leftover = out.match(/content:\s*'\\'/g);
  console.log(
    "leftover broken content:",
    leftover === null ? 0 : leftover.length,
  );
  return out;
}

function main() {
  if (!fs.existsSync(captureCss)) {
    throw new Error(`Capture CSS missing: ${captureCss}`);
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const raw = fs.readFileSync(captureCss, "utf8");
  const cleaned = sanitize(raw);
  fs.writeFileSync(outPath, cleaned, "utf8");
  console.log(`Wrote ${outPath}`);
}

main();
