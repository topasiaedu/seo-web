/**
 * @fileoverview Lift Media & Press GHL capture into Astro fragments + sanitize CSS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const captureHtml = path.join(
  root,
  "seo-wiki-vault/raw/research/cae-ghl-capture-media/_ghl-extract/preview-cleaned.html",
);
const captureCss = path.join(
  root,
  "seo-wiki-vault/raw/research/cae-ghl-capture-media/_ghl-extract/styles.css",
);
const fragDir = path.join(__dirname, "../src/components/ghl/media/fragments");
const assetsDir = path.join(__dirname, "../src/assets/media");
const cssOut = path.join(__dirname, "../src/styles/ghl/media-page.css");

const SECTIONS = [
  { id: "section-TX7QG09A69", file: "nav.html" },
  { id: "section-D3OvNABS8F", file: "articles.html" },
  { id: "section-R2YzY26o5TE", file: "footer.html" },
];

/**
 * @param {string} url
 * @param {string} dest
 * @returns {Promise<void>}
 */
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, { headers: { "user-agent": "Mozilla/5.0" } }, (res) => {
        if (
          res.statusCode !== undefined &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          typeof res.headers.location === "string"
        ) {
          file.close();
          fs.unlinkSync(dest);
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${String(res.statusCode)} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (error) => {
        file.close();
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(error);
      });
  });
}

/**
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
  // Keep hamburger span; strip other empty spans then restore hamburger
  out = out.replace(/<span><\/span>/g, "");
  out = out.replace(
    /(class="[^"]*nav-menu-mobile[^"]*"[^>]*>)(<\/div>)/,
    "$1<span></span>$2",
  );
  // Internal nav retargets
  out = out.replace(
    /href="https:\/\/caegoh\.com\/homepage"/g,
    'href="__GHL_BASE__"',
  );
  out = out.replace(
    /href="https:\/\/caegoh\.com\/homepage#section-3vDFXLsKtI3"/g,
    'href="__GHL_BASE__#section-3vDFXLsKtI3"',
  );
  out = out.replace(
    /href="https:\/\/caegoh\.com\/media"/g,
    'href="__GHL_MEDIA__"',
  );
  out = out.replace(/\s+target(?:=["']{2})?(?=\s|>)/g, "");
  out = out.replace(/>\s+</g, "><");
  return out.trim();
}

/**
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
 * @param {string} css
 * @returns {string}
 */
function sanitizeCss(css) {
  let out = css;
  out = out.replace(
    /content:\s*'\\'\s*;?\s*\n\s*font-family:\s*'';\s*/g,
    "content:'';font-family:'';",
  );
  out = out.replace(/font-weight:\s*undefined/g, "font-weight:400");
  out = out.replace(/box-shadow:\s*undefined/g, "box-shadow:none");
  out = out.replace(/:\s*undefined/g, ":initial");
  out = out.replace(/width:\s*auto%/g, "width:auto");
  // Drop trailing widget-ish body rules if any (same pattern as homepage)
  const marker = "\n\n    body {\n      margin: 0;\n      background-color: #100022;";
  const idx = out.indexOf(marker);
  if (idx !== -1) {
    out = out.slice(0, idx);
  }
  return `${out.trimEnd()}\n`;
}

async function main() {
  fs.mkdirSync(fragDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  let raw = fs.readFileSync(captureHtml, "utf8");
  const previewOpen = raw.indexOf('id="preview-container"');
  if (previewOpen !== -1) {
    raw = raw.slice(raw.indexOf(">", previewOpen) + 1);
  }

  // Collect unique image URLs
  const imgUrls = [
    ...new Set(
      [...raw.matchAll(/src="(https:\/\/[^"]+)"/g)].map((m) => m[1] ?? ""),
    ),
  ].filter((u) => u.length > 0);

  /** @type {Map<string, string>} mediaId → local filename */
  const mediaMap = new Map();
  for (const url of imgUrls) {
    const idMatch = url.match(/\/media\/([^/?#]+)/);
    const mediaId = idMatch?.[1] ?? `img-${String(mediaMap.size)}`;
    const extMatch = mediaId.match(/\.(png|jpe?g|webp|svg)$/i);
    const ext = extMatch?.[1]?.toLowerCase() ?? "png";
    const safeName = mediaId.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = safeName.includes(".") ? safeName : `${safeName}.${ext}`;
    const dest = path.join(assetsDir, filename);
    if (!fs.existsSync(dest)) {
      console.log("downloading", mediaId);
      try {
        await download(url, dest);
      } catch (error) {
        console.warn("download failed", url, error);
        continue;
      }
    }
    mediaMap.set(mediaId, filename);
  }

  // Tokenize images in sections
  for (const { id, file } of SECTIONS) {
    let section = extractSection(raw, id);
    section = sanitize(section);
    for (const [mediaId, filename] of mediaMap) {
      const token = `__GHL_MEDIA_ASSET_${filename}__`;
      const re = new RegExp(
        `https://[^"'\\s)]+${mediaId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"'\\s)]*`,
        "g",
      );
      section = section.replace(re, token);
    }
    fs.writeFileSync(path.join(fragDir, file), `${section}\n`, "utf8");
    console.log("wrote", file);
  }

  // Asset key list for remapper
  fs.writeFileSync(
    path.join(fragDir, "asset-files.json"),
    `${JSON.stringify([...mediaMap.values()], null, 2)}\n`,
    "utf8",
  );

  // Sanitize + copy CSS
  const css = sanitizeCss(fs.readFileSync(captureCss, "utf8"));
  fs.writeFileSync(cssOut, css, "utf8");
  console.log("wrote media-page.css", css.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
