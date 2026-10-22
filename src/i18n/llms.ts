import { home } from "./pages/home";
import { download } from "./pages/download";
import { llamakt } from "./pages/llamakt";
import { privacy } from "./pages/privacy";
import { legal } from "./pages/legal";
import { localizePath, type Locale } from "./index";
import { absolute, pages, type Page } from "./seo";

const dicts = { home, download, "llama-kt": llamakt, privacy, legal };

/** UI strings that are not content: labels, alt texts, ids, buttons. */
const SKIP = /(^|[a-z])(Label|Alt|Note)$|^(label|alt|key|icon|tabs|langs|columns|status|ref|fit|fitLabels|updated|cta|how|engine|changelog|github|readme|docs|faster|legend|setup|more|selection|back)$/;

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

function body(page: Page, locale: Locale): string {
  const dict = (dicts[page.kind] as Record<Locale, Record<string, unknown>>)[locale];
  const out: string[] = [];
  walk(dict, 0, out);
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const pageTitle = (page: Page, locale: Locale) =>
  ((dicts[page.kind] as Record<Locale, { title: string }>)[locale].title).replace(/ · tensai$/, "");
const pageDescription = (page: Page, locale: Locale) =>
  (dicts[page.kind] as Record<Locale, { description: string }>)[locale].description;

const SUMMARY =
  "tensai is an open-source Android app (Apache 2.0) that runs GGUF language models on the phone with llama.cpp (CPU, Vulkan). It offers chat with reasoning and an agent with on-phone tools and phone actions such as setting a timer or drafting a message, which open the right app and ask before sending. Anything that sends or deletes asks for confirmation, and Internet tools are off by default. Not public yet: the first public release is 1.0 (current version 0.3.3, Android 10+, arm64, free). The engine, llama.kt, is already public.";

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
