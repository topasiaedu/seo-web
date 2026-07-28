/**
 * @fileoverview Download GHL CDN images from the vault capture into
 * `apps/dr-jasmine/src/assets/ghl/`. Prefer original filesafe URLs (not the
 * leadconnectorhq webp proxy) so local files match source bytes.
 *
 * Usage (from repo root):
 *   node apps/dr-jasmine/scripts/download-ghl-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "../src/assets/ghl");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Media id → local filename + canonical CDN source.
 * Keys match `__GHL_ASSET_*__` tokens produced by lift-ghl-sections.mjs.
 *
 * @type {ReadonlyArray<{ key: string; file: string; url: string; alt: string }>}
 */
const ASSETS = [
  {
    key: "danHenryPortrait",
    file: "dan-henry-portrait.jpg",
    // Stage cutout of Dan Henry (orange/cyan backdrop) — verified visually.
    url: "https://assets.cdn.filesafe.space/vApgjQvAYFiY3wNcOOg7/media/697376e3ef7d8ec82d869ab4.jpg",
    alt: "Dan Henry",
  },
  {
    key: "drJasminePortrait",
    file: "dr-jasmine-portrait.jpg",
    // Desk portrait of Dr Jasmine — verified visually against GHL originals.
    url: "https://assets.cdn.filesafe.space/GC8FZE6R9fWuTZschaXf/media/69a1b392524b714c4459dfa3.jpg",
    alt: "Dr. Jasmine",
  },
  {
    key: "disclaimerBg",
    file: "disclaimer-bg.jpeg",
    url: "https://assets.cdn.filesafe.space/c3cmUrbBhdgs54adfIYP/media/666136581848ae65069c5b9f.jpeg",
    alt: "",
  },
];

/**
 * @param {string} url
 * @param {string} dest
 * @returns {Promise<void>}
 */
async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "image/*,*/*" },
  });
  if (!res.ok) {
    throw new Error(`Download failed ${String(res.status)}: ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`wrote ${path.basename(dest)} (${String(buf.length)} bytes)`);
}

async function main() {
  fs.mkdirSync(assetsDir, { recursive: true });

  for (const asset of ASSETS) {
    const dest = path.join(assetsDir, asset.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`skip existing ${asset.file}`);
      continue;
    }
    await downloadFile(asset.url, dest);
  }

  const manifest = ASSETS.map(({ key, file, url, alt }) => ({
    key,
    file,
    url,
    alt,
    token: `__GHL_ASSET_${key}__`,
  }));
  fs.writeFileSync(
    path.join(assetsDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  console.log("wrote manifest.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
