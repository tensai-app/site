# tensai.page

Static site for [tensai](https://github.com/tensai-app/tensai): marketing + docs. Astro, TypeScript strict, no UI framework, no third-party request. EN at `/`, FR at `/fr/`.

## Dev

Node >= 22.23.4 (`.nvmrc`: 24), pnpm 10.

```sh
pnpm install
pnpm dev            # http://localhost:4321
pnpm check          # astro check (types)
pnpm build          # -> dist/
pnpm preview
```

Checks run in CI on `dist/`:

```sh
pnpm test:links     # offline internal link check (scripts/pending-routes.txt = routes not built yet)
pnpm test:content   # no em-dash in src/ and dist, CSP-safe HTML, no third-party URL
pnpm test:seo       # titles, descriptions, canonical/hreflang, OG tags and images, JSON-LD, sitemap, llms.txt
pnpm test:lhci      # Lighthouse CI, budgets in lighthouserc.json (needs Chrome, CHROME_PATH)
```

## Layout

| Path | What |
|---|---|
| `src/styles/tokens.css` | Calm Night tokens, dark default, `[data-theme]` + `prefers-color-scheme` |
| `src/layouts/BaseLayout.astro` | head (meta, hreflang, OG), inline theme script, header/footer |
| `src/i18n/` | dictionary per locale (`en.ts` is the type source), path helpers |
| `src/scripts/theme-init.js` | inline in `<head>`, no flash of wrong theme. Its sha256 is in `public/_headers` |
| `public/fonts/` | self-hosted woff2 (Figtree, JetBrains Mono, 天 only from Noto Serif JP), OFL texts |
| `scripts/build-fonts.mjs` | regenerates the fonts: `pnpm fonts <dir>` (needs `pip install fonttools brotli`) |

If `theme-init.js` changes, update the hash in `public/_headers`: `pnpm test:content` prints the expected one.

## SEO and AI readability

- One source: titles and descriptions live in `src/i18n/pages/*.ts`, the page registry (OG text, JSON-LD, llms.txt) in `src/i18n/seo.ts`, the tags in `BaseLayout.astro`. A new page goes into `pages` in `seo.ts`.
- Titles are "Page · tensai" (60 chars max), descriptions 120 to 160 chars. `pnpm test:seo` enforces both.
- OG images: `src/pages/og/[...slug].png.ts` renders one PNG per page and locale at build (satori, then resvg-js), 1200x630, under 150 KB. Fonts are the `@fontsource` woff of Figtree and JetBrains Mono (satori reads no woff2), the mark comes from `Mark.astro`.
- JSON-LD: one `@graph` script per page (WebSite, Organization, SoftwareApplication on home and download, SoftwareSourceCode on llama-kt, BreadcrumbList on inner pages). It is not hashed in the CSP: `script-src` applies to executed scripts, and `application/ld+json` is a data block that never runs. `test:content` skips it, every other inline script still needs its hash.
- `/llms.txt` and `/llms-full.txt` are generated from the same dictionaries (`src/i18n/llms.ts`), English text, French pages listed under Optional.
- `robots.txt` allows every crawler, AI crawlers included (GPTBot, ClaudeBot, PerplexityBot, Google-Extended): the content is public and meant to be read, so no per-bot rule.
- Sitemap: `@astrojs/sitemap`, hreflang alternates, `lastmod` = build date, 404 and routes in `scripts/pending-routes.txt` excluded.

## Deploy (Cloudflare Pages)

- Build command `pnpm build`, output `dist`, `NODE_VERSION=24`.
- Headers and CSP come from `public/_headers`.
- `public/.well-known/security.txt` expires 2027-10-01: renew it (new `Expires`, under a year ahead) before then.
- www -> apex (`www.tensai.page` -> `tensai.page`) is a Cloudflare redirect rule, nothing in this repo.

## Design

Claude Design project "Tensai Android App Design System", files `tensai.page *.dc.html`. Palette and type are the same as the app.

## Licence

Apache-2.0, see `LICENSE`. Fonts: SIL OFL 1.1 (`public/fonts/OFL-*.txt`).
