import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
    }),
  ],
});
