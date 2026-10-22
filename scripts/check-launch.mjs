// Fails while the built site still shows an unfilled {{PLACEHOLDER}}, and, with LAUNCHED true,
// while the RELEASE object (src/data/release.ts) has an empty field.
// Not part of CI: run it before putting the site live.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { LAUNCHED } from "../src/i18n/site.ts";
import { RELEASE } from "../src/data/release.ts";

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const found = [];
for await (const file of htmlFiles("dist")) {
  for (const match of (await readFile(file, "utf8")).matchAll(/\{\{[A-Z_]+\}\}/g)) {
    found.push(`${file}: ${match[0]}`);
  }
}

if (LAUNCHED) {
  for (const [key, value] of Object.entries(RELEASE)) {
    if (!value) found.push(`src/data/release.ts: RELEASE.${key} is empty`);
  }
}

if (found.length) {
  console.error(`Not ready to go live:\n${[...new Set(found)].join("\n")}`);
  process.exit(1);
}
console.log("No placeholder left" + (LAUNCHED ? ", RELEASE complete." : "."));
