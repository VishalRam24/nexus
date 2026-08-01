/**
 * Pulls the canonical guides back down from the package repositories into
 * `content/`, so the website cannot silently drift from what ships as WIKI.md.
 *
 *   npm run sync-guides          # fetch and rewrite content/*.md
 *   npm run sync-guides -- --check   # exit 1 if they differ, change nothing
 *
 * The build itself never reaches the network — it only reads the committed
 * copies in `content/`. This script is a maintainer tool.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const SOURCES = [
  ["nexus-energy.md", "https://raw.githubusercontent.com/VishalRam24/nexus-energy/main/WIKI.md"],
  ["nexus-opt.md", "https://raw.githubusercontent.com/VishalRam24/nexus-opt/main/WIKI.md"],
];

let drifted = 0;
for (const [file, url] of SOURCES) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`${file}: ${res.status} ${res.statusText} from ${url}`);
    process.exit(1);
  }
  const upstream = await res.text();
  const path = join(root, "content", file);
  const local = readFileSync(path, "utf8");

  if (upstream === local) {
    console.log(`${file}: in sync`);
    continue;
  }
  drifted++;
  if (check) {
    console.error(`${file}: DIFFERS from ${url}`);
  } else {
    writeFileSync(path, upstream);
    console.log(`${file}: updated from ${url}`);
  }
}

if (check && drifted) process.exit(1);
