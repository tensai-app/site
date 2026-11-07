import { home } from "./pages/home";
import { download } from "./pages/download";
import { llamakt } from "./pages/llamakt";
import { changelog } from "./pages/changelog";
import { docs, routes, slugs, type Article } from "./pages/docs";
import { docsFit } from "../data/fit";
import { privacy } from "./pages/privacy";
import { contribute } from "./pages/contribute";
import { legal } from "./pages/legal";
import { releases } from "../data/changelog";
import { measuredRows } from "../data/measured";
import { localizePath, type Locale } from "./index";
import { absolute, pages, type Page } from "./seo";

const dicts = { home, download, changelog, "llama-kt": llamakt, contribute, privacy, legal };

/** UI strings that are not content: labels, alt texts, ids, buttons. */
const SKIP = /(^|[a-z])(Label|Alt|Note)$|^(label|alt|key|icon|tabs|langs|columns|status|ref|fit|fitLabels|updated|cta|how|engine|atom|latest|note|changelog|github|readme|docs|faster|legend|setup|more|selection|back)$/;

/** Patch status as the llama-kt page words it (English). */
const STATUS: Record<string, string> = { merged: "merged upstream", local: "local" };

function walk(value: unknown, level: number, out: string[]): void {
  if (typeof value === "string") {
    out.push(value, "");
  } else if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") out.push(`- ${item}`);
      else if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const head = [o.term, o.name, o.title, o.label].find((v) => typeof v === "string") as string | undefined;
        const body = [o.text, o.detail, o.value, o.caption].filter((v) => typeof v === "string" && v) as string[];
        const st = typeof o.status === "string" ? STATUS[o.status] : undefined;
        const tail = st ? ` [${st}${o.ref ? " " + o.ref : ""}]` : "";
        if (head) out.push(`- ${head}${body.length ? ": " + body.join(" ") : ""}${tail}`);
        else walk(item, level, out);
      }
    }
    out.push("");
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (SKIP.test(k) || (level === 0 && (k === "title" || k === "description" || k === "heading"))) continue;
      if (k === "heading" && typeof v === "string") out.push(`## ${v}`, "");
      else walk(v, level + 1, out);
    }
  }
}

/** An inline docs link as markdown with an absolute URL. */
const docsInline = (s: string, locale: Locale) =>
  s.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, label: string, href: string) => {
    const [path, hash] = href.split("#");
    return `[${label}](${absolute(localizePath(path!, locale))}${hash ? "#" + hash : ""})`;
  });

function docsArticle(page: Page, locale: Locale): Article {
  const slug = slugs.find((s) => routes[s] === page.path)!;
  return docs[locale].articles[slug];
}

function docsBody(page: Page, locale: Locale): string {
  const a = docsArticle(page, locale);
  const c = docs[locale].chrome;
  const md = (s: string) => docsInline(s, locale);
  const out: string[] = [md(a.lead), ""];
  for (const s of a.sections) {
    if (!s.blocks.some((b) => b.t === "faq")) out.push(`## ${s.h}`, "");
    for (const b of s.blocks) {
      if (b.t === "p") out.push(md(b.x), "");
      else if (b.t === "ul") out.push(...b.items.map((i) => `- ${md(i)}`), "");
      else if (b.t === "ol") out.push(...b.items.map((i, n) => `${n + 1}. ${md(i)}`), "");
      else if (b.t === "note") out.push(`> ${b.title}: ${md(b.x)}`, "");
      else if (b.t === "code") out.push("```", b.text, "```", "");
      else if (b.t === "dl") out.push(...b.items.map(([k, v]) => `- ${k}: ${md(v)}`), "");
      else if (b.t === "h3") out.push(`### ${b.x}`, "");
      else if (b.t === "faq") for (const i of b.items) out.push(`### ${i.q}`, "", md(i.a), "");
      else if (b.t === "fit") {
        out.push(`| ${c.fit.model} | ${c.fit.file} (${c.fit.unit}) | ${docsFit.rams.map((r) => `${r} ${c.fit.unit}`).join(" | ")} |`);
        out.push(`|---|---|${docsFit.rams.map(() => "---").join("|")}|`);
        for (const m of docsFit.models) out.push(`| ${m.cls ? c.fit.classModel.replace("{n}", m.cls) : m.label} | ${m.file} | ${m.verdicts.map((v) => c.fit.labels[v]).join(" | ")} |`);
        out.push("");
      } else if (b.t === "measured") {
        out.push(llamakt[locale].measured.setup, "");
        out.push("| model | quant | backend | pp | tg |", "|---|---|---|---|---|");
        for (const [model, quant, backends] of measuredRows) for (const [backend, pp, tg] of backends) out.push(`| ${model} | ${quant} | ${backend} | ${pp} | ${tg} |`);
        out.push("");
      } else if (b.t === "numbers") {
        out.push(home[locale].numbers.setup, "", ...home[locale].numbers.rows.map((r) => `- ${r.label}: ${r.value}`), "", home[locale].numbers.note, "");
      }
    }
  }
  return out.join("\n");
}

function body(page: Page, locale: Locale): string {
  if (page.kind === "docs") return docsBody(page, locale);
  const dict = (dicts[page.kind] as Record<Locale, Record<string, unknown>>)[locale];
  const out: string[] = [];
  walk(dict, 0, out);
  if (page.kind === "changelog") {
    for (const r of releases) {
      out.push(`## ${r.version}${r.title ? `: ${r.title}` : ""} (${r.date})`, "", r.intro, "");
      for (const g of r.groups) out.push(`**${g.label}**`, "", ...g.items.map((i) => `- ${i}`), "");
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const pageTitle = (page: Page, locale: Locale) =>
  page.kind === "docs" ? docsArticle(page, locale).title : ((dicts[page.kind] as Record<Locale, { title: string }>)[locale].title).replace(/ · tensai$/, "");
const pageDescription = (page: Page, locale: Locale) =>
  page.kind === "docs" ? docsArticle(page, locale).description : (dicts[page.kind] as Record<Locale, { description: string }>)[locale].description;

const SUMMARY =
  `tensai is an open-source Android app (Apache 2.0) that runs GGUF language models on the phone with llama.cpp (CPU, Vulkan). It offers chat with reasoning and an agent with on-phone tools and phone actions such as setting a timer or drafting a message, which open the right app and ask before sending. Anything that sends or deletes asks for confirmation, and Internet tools are off by default. Pre-1.0, expect changes (current version ${releases[0]!.version}, Android 10+, arm64, free). The app and the engine, llama.kt, are on GitHub.`;

/** llmstxt.org format: H1, blockquote summary, sections of links. English first, French as optional. */
export function llmsTxt(): string {
  const line = (p: Page, l: Locale) =>
    `- [${pageTitle(p, l)}](${absolute(localizePath(p.path, l))}): ${pageDescription(p, l)}`;
  const main = pages.filter((p) => p.kind !== "privacy" && p.kind !== "legal");
  const policy = pages.filter((p) => p.kind === "privacy" || p.kind === "legal");
  return [
    "# tensai",
    "",
    `> ${SUMMARY}`,
    "",
    "## Pages",
    "",
    ...main.map((p) => line(p, "en")),
    "",
    "## Policies",
    "",
    ...policy.map((p) => line(p, "en")),
    "",
    "## Source",
    "",
    "- [llama.kt on GitHub](https://github.com/tensai-app/llama.kt): the engine library, Apache 2.0, README with install and benchmarks",
    "- [tensai-app on GitHub](https://github.com/tensai-app): the organisation",
    "",
    "## Optional",
    "",
    `- [Full text of the pages in one file](${absolute("/llms-full.txt")}): English plain text, generated from the site content`,
    ...pages.map((p) => line(p, "fr").replace("- [", "- [FR, ")),
    "",
  ].join("\n");
}

/** Plain text of every page in English, from the same dictionaries the pages render. */
export function llmsFullTxt(): string {
  return [
    "# tensai",
    "",
    `> ${SUMMARY}`,
    "",
    ...pages.flatMap((p) => [
      "---",
      "",
      `# ${pageTitle(p, "en")}`,
      "",
      `Source: ${absolute(localizePath(p.path, "en"))}`,
      "",
      pageDescription(p, "en"),
      "",
      body(p, "en").replace(/^## /gm, "### "),
      "",
    ]),
  ].join("\n");
}
