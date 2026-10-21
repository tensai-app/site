// Regenerates public/apple-touch-icon.png (180x180, mark on the Night background) and public/favicon-32.png
// (32x32, transparent) from the brand mark path in src/components/Mark.astro. Run: pnpm icons
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const root = new URL("..", import.meta.url).pathname;
const path = readFileSync(`${root}src/components/Mark.astro`, "utf8").match(/ d="([^"]+)"/)[1];
const mark = (fill) => `<g transform="translate(0 720) scale(1 -1)"><path fill="${fill}" d="${path}"/></g>`;

const render = (svg, size) => new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();

// Mark viewBox is 41 -79 923 879; a 1110-unit square centred on it leaves ~20% padding.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-52.5 -239.5 1110 1110"><rect x="-52.5" y="-239.5" width="1110" height="1110" fill="#0F0E17"/>${mark("#A78BFA")}</svg>`;
writeFileSync(`${root}public/apple-touch-icon.png`, render(touch, 180));

const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="11 -109 983 939"><g transform="translate(0 720) scale(1 -1)"><path fill="#A78BFA" stroke="#A78BFA" stroke-width="60" stroke-linejoin="miter" stroke-miterlimit="2" d="${path}"/></g></svg>`;
writeFileSync(`${root}public/favicon-32.png`, render(fav, 32));
