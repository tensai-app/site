// Subsets the OFL font sources into self-hosted woff2 under public/fonts.
// Needs fonttools + brotli (pip install fonttools brotli). Run: pnpm fonts <fontsDir>
// <fontsDir> holds Figtree/, JetBrains_Mono/ and Noto_Serif_JP/ (Google Fonts downloads,
// or google/fonts on GitHub).
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const src = process.argv[2];
if (!src) {
  console.error("usage: pnpm fonts <fontsDir>");
  process.exit(1);
}
const out = new URL("../public/fonts/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const jobs = [
  ["Figtree/Figtree-VariableFont_wght.ttf", "figtree-latin", LATIN],
  ["Figtree/Figtree-VariableFont_wght.ttf", "figtree-latin-ext", LATIN_EXT],
  ["JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf", "jetbrains-mono-latin", LATIN],
  ["JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf", "jetbrains-mono-latin-ext", LATIN_EXT],
  ["Noto_Serif_JP/static/NotoSerifJP-Light.ttf", "noto-serif-jp-ten", "U+5929"],
];

for (const [file, name, unicodes] of jobs) {
  execFileSync("pyftsubset", [
    join(src, file),
    `--unicodes=${unicodes}`,
    "--flavor=woff2",
    "--layout-features=*",
    "--no-hinting",
    `--output-file=${join(out, name + ".woff2")}`,
  ], { stdio: "inherit" });
}
