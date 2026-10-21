import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";

// Routes not built yet and error pages stay out of the sitemap.
const pending = readFileSync(new URL("./scripts/pending-routes.txt", import.meta.url), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
const excluded = (url) => {
  const path = new URL(url).pathname;
  return /^(\/fr)?\/404(\/|\.html)?$/.test(path) || pending.includes(path);
};

export default defineConfig({
  site: "https://tensai.page",
  output: "static",
  trailingSlash: "always",
  build: {
    // The CSP has style-src 'self': no inline <style>.
    inlineStylesheets: "never",
    // fr/404.astro -> fr/404.html, which Cloudflare Pages serves for /fr/* misses.
    format: "preserve",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    build: {
      // Keep bundled scripts external: the CSP has script-src 'self'.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
      filter: (page) => !excluded(page),
    }),
  ],
});
