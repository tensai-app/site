// Copies the releases of the app's changelog.json into src/data/changelog.json (the app repo is private, CI cannot read it).
// Usage: pnpm sync:changelog [path/to/changelog.json]
// Drops `_comment`, sorts by semver (newest first), fails on a missing field or on an internal ticket id in the text.
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const source = process.argv[2] ?? fileURLToPath(new URL("../tensai/app/src/main/assets/changelog.json", root));
const target = fileURLToPath(new URL("src/data/changelog.json", root));
// "TEN-193", "ten 193", "LKT-3": a ticket id with a hyphen or a space.
const TICKET = /\b(?:TEN|LKT|OPS|WEB)[- ]\d+\b/i;
const problems = [];
const bad = (where, msg) => {
  problems.push(`${where}: ${msg}`);
};
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (where, v, { nullable = false } = {}) => {
  if (v === null && nullable) return null;
  if (typeof v !== "string" || !v.trim()) return bad(where, "expected a non-empty string");
  if (TICKET.test(v)) bad(where, `internal ticket id in user-facing text: ${v.match(TICKET)[0]}`);
  return v.trim();
};
// A real calendar date: it must survive the round trip through Date.
const isDate = (v) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const t = Date.parse(`${v}T00:00:00Z`);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === v;
};

const raw = JSON.parse(readFileSync(source, "utf8"));
if (!Array.isArray(raw.releases) || !raw.releases.length) {
  console.error(`${source}: no "releases" array`);
  process.exit(1);
}

const releases = raw.releases.map((r, i) => {
  const at = `releases[${i}]`;
  if (!isObject(r)) return bad(at, "expected an object");
  const version = text(`${at}.version`, r.version);
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) bad(`${at}.version`, `not a semver: ${version}`);
  if (!isDate(r.date)) bad(`${at}.date`, `expected a real YYYY-MM-DD date, got ${JSON.stringify(r.date)}`);
  // The first release has no title.
  const title = text(`${at}.title`, r.title ?? null, { nullable: true });
  const intro = text(`${at}.intro`, r.intro);
  if (!Array.isArray(r.groups) || !r.groups.length) bad(`${at}.groups`, "expected a non-empty array");
  const groups = (Array.isArray(r.groups) ? r.groups : []).map((g, j) => {
    const gat = `${at}.groups[${j}]`;
    if (!isObject(g)) return bad(gat, "expected an object");
    const label = text(`${gat}.label`, g.label);
    if (!Array.isArray(g.items) || !g.items.length) bad(`${gat}.items`, "expected a non-empty array");
    return { label, items: (Array.isArray(g.items) ? g.items : []).map((it, k) => text(`${gat}.items[${k}]`, it)) };
  });
  return { version, title, date: r.date, intro, groups };
});

const seen = new Set();
for (const r of releases) {
  if (!r) continue;
  if (seen.has(r.version)) bad(r.version, "duplicate version");
  seen.add(r.version);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const key = (v) => v.split(".").map(Number);
releases.sort((a, b) => {
  const [x, y] = [key(a.version), key(b.version)];
  return y[0] - x[0] || y[1] - x[1] || y[2] - x[2];
});
writeFileSync(`${target}.tmp`, JSON.stringify(releases, null, 2) + "\n");
renameSync(`${target}.tmp`, target);
console.log(`changelog synced: ${releases.length} releases, latest ${releases[0].version}`);
