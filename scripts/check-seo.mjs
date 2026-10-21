// SEO checks on dist/: titles, descriptions, canonical/hreflang, Open Graph and Twitter tags, OG image files,
// JSON-LD (parsed, required properties), one h1 per page, 404 noindex and out of the sitemap, llms.txt links, robots.txt.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { LAUNCHED } from "../src/i18n/site.ts";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");
const SITE = "https://tensai.page";
const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (extname(p) === ".html") out.push(p);
  }
  return out;
}

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? unescape(m[1]) : undefined;
};
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);
const meta = (html, key, val) =>
  tags(html, /<meta\b[^>]*>/g).find((t) => attr(t, key) === val && attr(t, "content") !== undefined);
const metaContent = (html, key, val) => {
  const t = meta(html, key, val);
  return t ? attr(t, "content") : undefined;
};

function pngSize(file) {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

const titles = new Map();
const descriptions = new Map();
let pageCount = 0;

for (const file of walk(dist)) {
  const rel = file.slice(dist.length + 1);
  const html = readFileSync(file, "utf8");
  const is404 = /(^|\/)404\.html$/.test(rel);
  const lang = rel.startsWith("fr/") ? "fr" : "en";
  const where = rel;
  pageCount++;

  if (!new RegExp(`<html lang="${lang}"`).test(html)) fail(where, `<html lang="${lang}"> expected`);
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1];
  const description = metaContent(html, "name", "description");
  if (!title) fail(where, "no <title>");
  else {
    const t = unescape(title);
    if ([...t].length > 60) fail(where, `title is ${[...t].length} chars (max 60): ${t}`);
    if (titles.has(t)) fail(where, `title duplicates ${titles.get(t)}: ${t}`);
    titles.set(t, where);
  }
  if (!description) fail(where, "no meta description");
  else {
    const n = [...description].length;
    if (!is404 && (n < 120 || n > 160)) fail(where, `description is ${n} chars (120 to 160)`);
    if (descriptions.has(description)) fail(where, `description duplicates ${descriptions.get(description)}`);
    descriptions.set(description, where);
  }

  const h1 = tags(html, /<h1[\s>]/g).length;
  if (h1 !== 1) fail(where, `${h1} h1 (expected 1)`);
  for (const [name, re] of [["main", /<main[\s>]/g], ["nav", /<nav[\s>]/g], ["footer", /<footer[\s>]/g]]) {
    if (!tags(html, re).length) fail(where, `no <${name}>`);
  }
  for (const img of tags(html, /<img\b[^>]*>/g)) {
    if (attr(img, "alt") === undefined) fail(where, `img without alt: ${img.slice(0, 80)}`);
  }

  if (is404) {
    if (!/<meta name="robots" content="noindex"/.test(html)) fail(where, "404 must be noindex");
    if (/rel="canonical"/.test(html)) fail(where, "404 must have no canonical");
    continue;
  }

  const path = "/" + rel.replace(/index\.html$/, "");
  const canonical = tags(html, /<link\b[^>]*>/g).find((t) => attr(t, "rel") === "canonical");
  if (!canonical || attr(canonical, "href") !== SITE + path) fail(where, `canonical should be ${SITE + path}`);
  const alts = Object.fromEntries(
    tags(html, /<link\b[^>]*>/g)
      .filter((t) => attr(t, "rel") === "alternate" && attr(t, "hreflang"))
      .map((t) => [attr(t, "hreflang"), attr(t, "href")]),
  );
  for (const k of ["en", "fr", "x-default"]) if (!alts[k]) fail(where, `no hreflang ${k}`);
  if (alts.en && alts["x-default"] !== alts.en) fail(where, "x-default should point to the English page");
  if (/robots" content="noindex/.test(html)) fail(where, "indexable page is noindex");

  const og = (p) => metaContent(html, "property", `og:${p}`);
  const tw = (n) => metaContent(html, "name", `twitter:${n}`);
  for (const p of ["type", "url", "title", "description", "image", "image:alt", "image:width", "image:height", "locale", "locale:alternate", "site_name"]) {
    if (!og(p)) fail(where, `no og:${p}`);
  }
  if (og("url") !== SITE + path) fail(where, `og:url should be ${SITE + path}`);
  if (og("title") !== unescape(title ?? "")) fail(where, "og:title differs from <title>");
  if (og("locale") !== (lang === "fr" ? "fr_FR" : "en_US")) fail(where, "og:locale does not match the page language");
  if (tw("card") !== "summary_large_image") fail(where, "twitter:card should be summary_large_image");
  for (const n of ["title", "description", "image", "image:alt"]) if (!tw(n)) fail(where, `no twitter:${n}`);
  const image = og("image");
  if (image) {
    if (!image.startsWith(SITE + "/")) fail(where, `og:image is not absolute on ${SITE}: ${image}`);
    const f = join(dist, image.slice(SITE.length));
    if (!existsSync(f)) fail(where, `og:image file missing: ${image}`);
    else {
      const s = pngSize(f);
      if (!s) fail(where, `og:image is not a PNG: ${image}`);
      else {
        if (s.width !== 1200 || s.height !== 630) fail(where, `og:image is ${s.width}x${s.height}, expected 1200x630`);
        if (s.bytes > 150 * 1024) fail(where, `og:image is ${Math.round(s.bytes / 1024)} KB (max 150)`);
      }
    }
  }

  // JSON-LD: exactly one block, parses, required properties per type.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) fail(where, `${blocks.length} JSON-LD blocks (expected 1)`);
  else {
    let data;
    try {
      data = JSON.parse(blocks[0][1]);
    } catch (e) {
      fail(where, `JSON-LD does not parse: ${e.message}`);
    }
    if (data) {
      if (data["@context"] !== "https://schema.org") fail(where, "JSON-LD @context");
      const nodes = data["@graph"] ?? [];
      const byType = (t) => nodes.filter((n) => n["@type"] === t);
      const need = (t, props, count = 1) => {
        const found = byType(t);
        if (found.length !== count) return fail(where, `JSON-LD: ${found.length} ${t} (expected ${count})`);
        for (const n of found) for (const p of props) if (n[p] === undefined || n[p] === "") fail(where, `JSON-LD ${t}: missing ${p}`);
      };
      need("WebSite", ["name", "url", "inLanguage", "publisher"]);
      need("Organization", ["name", "url", "logo", "sameAs"]);
      const kind = path === "/" || path === "/fr/" ? "home" : path.replace(/^\/fr/, "");
      if (kind === "home" || kind === "/download/") {
        need("SoftwareApplication", ["name", "operatingSystem", "applicationCategory", "license", "description", "image"]);
        const app = byType("SoftwareApplication")[0];
        if (app) {
          const forbidden = ["downloadUrl", "installUrl", "aggregateRating", "review", "offers", "softwareVersion"];
          if (LAUNCHED) {
            for (const need of ["offers", "softwareVersion"]) if (!(need in app)) fail(where, `JSON-LD SoftwareApplication: missing ${need} (LAUNCHED)`);
            if (app.offers?.price !== "0" || !app.offers?.priceCurrency) fail(where, "JSON-LD offers needs price 0 and a currency");
            for (const bad of ["aggregateRating", "review"]) if (bad in app) fail(where, `JSON-LD must not carry invented ${bad}`);
          } else {
            for (const bad of forbidden) if (bad in app) fail(where, `JSON-LD must not carry ${bad} before launch (LAUNCHED=false)`);
            if (!/1\.0/.test(app.description ?? "")) fail(where, "JSON-LD description must say the first public release is 1.0");
          }
        }
      } else if (byType("SoftwareApplication").length) fail(where, "JSON-LD SoftwareApplication outside home and download");
      if (kind === "/llama-kt/") need("SoftwareSourceCode", ["name", "codeRepository", "programmingLanguage", "license"]);
      if (kind === "home") need("BreadcrumbList", [], 0);
      else {
        need("BreadcrumbList", ["itemListElement"]);
        for (const [i, it] of (byType("BreadcrumbList")[0]?.itemListElement ?? []).entries()) {
          if (it.position !== i + 1 || !it.name || !it.item) fail(where, `JSON-LD breadcrumb item ${i + 1} incomplete`);
        }
      }
      for (const n of nodes) for (const k of ["url", "item", "logo", "codeRepository", "license"]) {
        for (const v of [n[k]].flat()) if (typeof v === "string" && !/^https:\/\//.test(v)) fail(where, `JSON-LD ${n["@type"]}.${k} is not an absolute URL`);
      }
    }
  }
}

// Sitemap: no 404, every indexable page with its alternates.
const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
if (!existsSync(join(dist, "sitemap-index.xml"))) fail("sitemap-index.xml", "missing");
else if (!readFileSync(join(dist, "sitemap-index.xml"), "utf8").includes(`${SITE}/sitemap-0.xml`)) fail("sitemap-index.xml", "does not list sitemap-0.xml");
const pending = readFileSync(join(root, "scripts/pending-routes.txt"), "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const entries = new Map();
for (const u of urls) {
  const loc = (u.match(/<loc>([^<]+)<\/loc>/) ?? [])[1];
  const links = Object.fromEntries([...u.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  entries.set(loc, links);
  if (/\/404(\/|\.html)?$/.test(loc)) fail("sitemap-0.xml", `lists a 404: ${loc}`);
  if (!existsSync(join(dist, loc.slice(SITE.length), "index.html"))) fail("sitemap-0.xml", `${loc} is not built`);
  if (pending.some((p) => loc === SITE + p)) fail("sitemap-0.xml", `lists a pending route: ${loc}`);
}
if (!entries.size) fail("sitemap-0.xml", "no <url>");
for (const [loc, links] of entries) {
  if (!links.en || !links.fr) fail("sitemap-0.xml", `${loc}: needs en and fr alternates`);
  for (const target of [links.en, links.fr]) {
    const back = entries.get(target);
    if (!back) fail("sitemap-0.xml", `${loc}: alternate ${target} has no <url> entry`);
    else if (back.en !== links.en || back.fr !== links.fr) fail("sitemap-0.xml", `${loc}: alternates of ${target} are not reciprocal`);
  }
}
// No pending route linked from any page.
for (const file of walk(dist)) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/\shref="([^"#?]+)/g)) {
    const h = m[1].replace(SITE, "");
    if (pending.includes(h)) fail(file.slice(dist.length + 1), `links to pending route ${h}`);
  }
}

// robots.txt
const robots = readFileSync(join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) fail("robots.txt", "no Sitemap line");
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt", "disallows everything");

// llms.txt: H1, blockquote, every link resolves to a built file or an allowed GitHub URL.
const llms = readFileSync(join(dist, "llms.txt"), "utf8");
if (!/^# .+\n\n> .+/.test(llms)) fail("llms.txt", "needs an H1 followed by a blockquote");
for (const m of llms.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
  const url = m[1];
  if (url.startsWith(SITE + "/")) {
    const p = url.slice(SITE.length);
    const ok = p.endsWith("/") ? existsSync(join(dist, p, "index.html")) : existsSync(join(dist, p));
    if (!ok) fail("llms.txt", `${url} does not resolve to a built file`);
  } else if (!/^https:\/\/github\.com\/tensai-app(\/|$)/.test(url)) fail("llms.txt", `unexpected link ${url}`);
}
const llmsFull = readFileSync(join(dist, "llms-full.txt"), "utf8");
if (llmsFull.length < 2000) fail("llms-full.txt", "suspiciously short");

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`seo ok (${pageCount} html files, ${titles.size} titles, sitemap, robots, llms)`);
