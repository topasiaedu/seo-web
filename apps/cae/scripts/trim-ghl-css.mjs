/**
 * @fileoverview Truncate trailing custom-code widget CSS from ghl-page.css
 * (duplicate of press/carousel widgets; contains parse-breaking fragments).
 */
import fs from "node:fs";

const path = "e:/projects/seo-website/apps/cae/src/styles/ghl/ghl-page.css";
const css = fs.readFileSync(path, "utf8");
const marker = "\n\n    body {\n      margin: 0;\n      background-color: #100022;";
const idx = css.indexOf(marker);
if (idx === -1) {
  console.error("Widget CSS marker not found");
  process.exit(1);
}
const trimmed = css.slice(0, idx).trimEnd() + "\n";
fs.writeFileSync(path, trimmed, "utf8");
console.log(`Trimmed ghl-page.css to ${String(trimmed.length)} bytes (cut at ${String(idx)})`);
