/**
 * @fileoverview Sanitize GHL capture CSS so PostCSS/Vite can parse it.
 * Fixes broken `content:'\'` + newline + `font-family: ''` sequences from
 * the extract, and replaces invalid `undefined` tokens.
 */
import fs from "node:fs";

const path = "e:/projects/seo-website/apps/cae/src/styles/ghl/ghl-page.css";
let css = fs.readFileSync(path, "utf8");

const before = css.length;

// Broken icon :before rule — backslash eats the closing quote across a newline.
css = css.replace(
  /content:\s*'\\'\s*;?\s*\n\s*font-family:\s*'';\s*/g,
  "content:'';font-family:'';",
);

// Same pattern with double quotes if present
css = css.replace(
  /content:\s*"\\"\s*;?\s*\n\s*font-family:\s*""\s*;?\s*/g,
  'content:"";font-family:"";',
);

// Invalid JS-ish tokens dumped into CSS
css = css.replace(/font-weight:\s*undefined/g, "font-weight:400");
css = css.replace(/box-shadow:\s*undefined/g, "box-shadow:none");
css = css.replace(/:\s*undefined/g, ":initial");

// Invalid width:auto%
css = css.replace(/width:\s*auto%/g, "width:auto");

fs.writeFileSync(path, css, "utf8");
console.log(`Sanitized ghl-page.css (${String(before)} → ${String(css.length)} bytes)`);

// Verify no remaining broken content patterns
const leftover = css.match(/content:\s*'\\'/g);
console.log("leftover broken content:", leftover === null ? 0 : leftover.length);
