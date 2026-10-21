// Offline link check on dist/: internal href/src/hreflang targets must exist.
// External links are not fetched. Routes listed in scripts/pending-routes.txt
// are not built yet: any link to one fails (the layout hides them via src/i18n/routes.ts).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");
const pending = new Set(
  readFileSync(join(root, "scripts/pending-routes.txt"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#")),
);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (extname(p) === ".html") out.push(p);
  }
  return out;
}

function exists(path) {
  const clean = path.split(/[?#]/)[0];
  const target = join(dist, clean);
  if (clean.endsWith("/")) return existsSync(join(target, "index.html"));
  return existsSync(target) || existsSync(target + ".html") || existsSync(join(target, "index.html"));
}

const problems = [];
let checked = 0;
for (const file of walk(dist)) {
  const html = readFileSync(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*?\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) {
      if (url.startsWith("https://tensai.page")) {
        const path = new URL(url).pathname;
        if (!exists(path) || pending.has(path)) problems.push(`${file.slice(dist.length)}: ${url}`);
      }
      continue;
    }
    checked++;
    if (url.startsWith("#")) {
      if (url.length > 1 && !ids.has(url.slice(1))) problems.push(`${file.slice(dist.length)}: missing anchor ${url}`);
      continue;
    }
    const path = url.split(/[?#]/)[0];
    if (!path.startsWith("/")) {
      problems.push(`${file.slice(dist.length)}: relative URL ${url}`);
    } else if (!exists(path) || pending.has(path)) {
      problems.push(`${file.slice(dist.length)}: broken link ${url}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`links ok (${checked} internal URLs, ${pending.size} pending routes unlinked)`);
