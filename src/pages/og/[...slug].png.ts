// Open Graph images, 1200x630, rendered at build time (satori -> SVG -> resvg -> PNG), one per page and locale.
// Layouts follow the Claude Design "OG Images" mockup: 1a for the home, 1b for every other page.
// Fonts are the same files as the site's (Figtree, JetBrains Mono), taken as woff from @fontsource because satori reads no woff2.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute, GetStaticPaths } from "astro";
import { locales, type Locale } from "../../i18n";
import { pages, OG_SIZE } from "../../i18n/seo";

const font = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

const fonts = [
  { name: "Figtree", data: font("figtree", "figtree-latin-500-normal.woff"), weight: 500 as const },
  { name: "Figtree", data: font("figtree", "figtree-latin-600-normal.woff"), weight: 600 as const },
  { name: "Figtree", data: font("figtree", "figtree-latin-700-normal.woff"), weight: 700 as const },
  { name: "JetBrains Mono", data: font("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"), weight: 500 as const },
];

const C = { bg: "#0F0E17", text: "#E8E6F0", violet: "#A78BFA", muted: "#9B97AD" };

// Brand mark (tight crop, violet), same path as src/components/Mark.astro.
const markPath = readFileSync(join(process.cwd(), "src/components/Mark.astro"), "utf8").match(/ d="([^"]+)"/)![1];
const MARK = { w: 923, h: 879 };
const markUri =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="41 -79 ${MARK.w} ${MARK.h}"><g transform="translate(0 720) scale(1 -1)"><path fill="${C.violet}" d="${markPath}"/></g></svg>`,
  ).toString("base64");

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children, ...extra },
});
const mark = (height: number) =>
  el("img", { height, width: Math.round((height * MARK.w) / MARK.h) }, undefined, { src: markUri });

function home(tagline: string): Node {
  return el(
    "div",
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      padding: "88px 96px",
      boxSizing: "border-box",
      alignItems: "center",
      gap: 96,
      backgroundColor: C.bg,
      backgroundImage: "radial-gradient(circle at 300px 315px, rgba(167,139,250,0.13), rgba(167,139,250,0) 290px)",
      fontFamily: "Figtree",
    },
    [
      mark(340),
      el("div", { flexDirection: "column", gap: 28 }, [
        el("div", { fontSize: 104, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1, color: C.text }, "tensai"),
        el("div", { fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.2, color: C.muted }, tagline),
        el("div", { fontFamily: "JetBrains Mono", fontSize: 20, color: C.muted, marginTop: 12 }, "tensai.page"),
      ]),
    ],
  );
}

function inner(title: string, label?: string): Node {
  return el(
    "div",
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      padding: "88px 96px",
      boxSizing: "border-box",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: C.bg,
      fontFamily: "Figtree",
    },
    [
      el("div", { fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: "0.12em", color: C.muted, height: 28 }, label ?? ""),
      el(
        "div",
        { maxWidth: 960, fontSize: 84, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, color: C.text, textWrap: "balance" },
        title,
      ),
      el("div", { alignItems: "center", gap: 14 }, [
        mark(40),
        el("div", { fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 500, color: C.text }, "tensai.page"),
      ]),
    ],
  );
}

export const getStaticPaths = (() =>
  pages.flatMap((p) => locales.map((l) => ({ params: { slug: `${p.slug}.${l}` } })))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const [slug, locale] = params.slug!.split(".") as [string, Locale];
  const page = pages.find((p) => p.slug === slug)!;
  const { title, label } = page.og[locale];
  const tree = page.kind === "home" ? home(title) : inner(title, label);
  const svg = await satori(tree as never, { ...OG_SIZE, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: OG_SIZE.width } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
