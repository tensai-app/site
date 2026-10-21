// Prints the metric-matched fallback @font-face rules that live in src/styles/base.css, from the real font files.
// Run `pnpm fonts:fallbacks` after changing a font and paste the result there.
import { fromFile } from "@capsizecss/unpack/fs";
import arial from "@capsizecss/metrics/arial";
import courierNew from "@capsizecss/metrics/courierNew";
import roboto from "@capsizecss/metrics/roboto";

const root = new URL("../public/fonts/", import.meta.url).pathname;
const families = [
  { name: "Figtree", file: "figtree-latin.woff2", base: arial, local: ["Arial", "Liberation Sans", "Helvetica"] },
  // Android has none of the above: its system font is Roboto, with its own widths.
  { name: "Figtree", suffix: "Roboto", file: "figtree-latin.woff2", base: roboto, local: ["Roboto"] },
  { name: "JetBrains Mono", file: "jetbrains-mono-latin.woff2", base: courierNew, local: ["Courier New", "Liberation Mono", "DejaVu Sans Mono"] },
];
const pct = (n) => `${(n * 100).toFixed(2)}%`;

for (const f of families) {
  const m = await fromFile(root + f.file);
  const width = (x) => x.xWidthAvg / x.unitsPerEm;
  const size = width(m) / width(f.base);
  const k = m.unitsPerEm * size;
  console.log(`@font-face {
  font-family: "${f.name} Fallback${f.suffix ? " " + f.suffix : ""}";
  src: ${f.local.map((l) => `local("${l}")`).join(", ")};
  size-adjust: ${pct(size)};
  ascent-override: ${pct(m.ascent / k)};
  descent-override: ${pct(Math.abs(m.descent) / k)};
  line-gap-override: ${pct(m.lineGap / k)};
}
`);
}
