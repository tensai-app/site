// Fails on the em-dash character (U+2014) in every text file of the repo and in the built HTML,
// on inline scripts the CSP does not allow, and on third-party URLs in dist.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const EM_DASH = String.fromCharCode(0x2014);
const problems = [];

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.includes(extname(p))) out.push(p);
  }
  return out;
}

// Tracked + untracked-not-ignored files, minus licence texts and the lockfile.
const SKIP = /(^|\/)(OFL-[^/]*\.txt|pnpm-lock\.yaml)$/;
const srcFiles = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], { cwd: root, encoding: "utf8" })
  .split("\0")
  .filter((f) => f && !SKIP.test(f))
  .map((f) => join(root, f))
  .filter((f) => {
    const buf = readFileSync(f);
    return !buf.subarray(0, 8000).includes(0);
  });
const dist = join(root, "dist");
const htmlFiles = walk(dist, [".html"]);

for (const f of [...srcFiles, ...htmlFiles]) {
  const text = readFileSync(f, "utf8");
  text.split("\n").forEach((line, i) => {
    if (line.includes(EM_DASH)) problems.push(`${f.slice(root.length)}:${i + 1}: em-dash`);
  });
}

// CSP: every inline <script> must carry a hash listed in dist/_headers.
const headers = readFileSync(join(dist, "_headers"), "utf8");
for (const f of htmlFiles) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const hash = "sha256-" + createHash("sha256").update(m[1]).digest("base64");
    if (!headers.includes(`'${hash}'`)) problems.push(`${f.slice(root.length)}: inline script hash ${hash} not in _headers`);
  }
  if (/<style[\s>]/.test(html)) problems.push(`${f.slice(root.length)}: inline <style>`);
  if (/\sstyle="/.test(html)) problems.push(`${f.slice(root.length)}: style attribute`);
  if (/\son[a-z]+="/.test(html)) problems.push(`${f.slice(root.length)}: inline event handler`);
}

// No third-party URL in the built output.
const ALLOWED = [
  /^https?:\/\/tensai\.page(?=[/"'?#)\s<]|$)/,
  /^https:\/\/github\.com\/tensai-app(?=[/"'?#)\s<]|$)/,
  /^http:\/\/www\.w3\.org\//,
];
for (const f of walk(dist, [".html", ".css", ".js", ".webmanifest"])) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/https?:\/\/[^\s"'<>)]+/g)) {
    if (!ALLOWED.some((re) => re.test(m[0]))) problems.push(`${f.slice(root.length)}: external URL ${m[0]}`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`content ok (${srcFiles.length} text files, ${htmlFiles.length} html files)`);
