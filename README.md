# tensai.page

Source of [tensai.page](https://tensai.page), the site of [tensai](https://github.com/tensai-app/tensai): landing page, docs, changelog. Public repo, live, deployed to Cloudflare by the `Deploy` workflow on every push to `main`. Astro, TypeScript strict, no UI framework, no third-party request. EN at `/`, FR at `/fr/`.

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
| `src/i18n/pages/docs.ts` | the docs (EN and FR): one article per page, written from the app's code and strings. Routes, nav and reading order are in the same file. `DOCS_EDIT_LINK` in `src/i18n/site.ts` shows "Edit on GitHub" under the docs (the site repo is public) |
| `public/fonts/` | self-hosted woff2 (Figtree, JetBrains Mono, 天 only from Noto Serif JP), OFL texts |
| `scripts/build-fonts.mjs` | regenerates the fonts: `pnpm fonts <dir>` (needs `pip install fonttools brotli`) |

If `theme-init.js` changes, update the hash in `public/_headers`: `pnpm test:content` prints the expected one.

Changelog: when the app ships a release, run `pnpm sync:changelog` (copies the app's `changelog.json` into `src/data/changelog.json`) and commit the result.

## SEO and AI readability

- One source: titles and descriptions live in `src/i18n/pages/*.ts`, the page registry (OG text, JSON-LD, llms.txt) in `src/i18n/seo.ts`, the tags in `BaseLayout.astro`. A new page goes into `pages` in `seo.ts`.
- Titles are "Page · tensai" (60 chars max), descriptions 120 to 160 chars. `pnpm test:seo` enforces both.
- OG images: `src/pages/og/[...slug].png.ts` renders one PNG per page and locale at build (satori, then resvg-js), 1200x630, under 150 KB. Fonts are the `@fontsource` woff of Figtree and JetBrains Mono (satori reads no woff2), the mark comes from `Mark.astro`.
- JSON-LD: one `@graph` script per page (WebSite, Organization, SoftwareApplication on home and download, SoftwareSourceCode on llama-kt, BreadcrumbList on inner pages). It is not hashed in the CSP: `script-src` applies to executed scripts, and `application/ld+json` is a data block that never runs. `test:content` skips it, every other inline script still needs its hash.
- `/llms.txt` and `/llms-full.txt` are generated from the same dictionaries (`src/i18n/llms.ts`), English text, French pages listed under Optional.
- `robots.txt` allows every crawler, AI crawlers included (GPTBot, ClaudeBot, PerplexityBot, Google-Extended): the content is public and meant to be read, so no per-bot rule.
- Sitemap: `@astrojs/sitemap`, hreflang alternates, `lastmod` = build date, 404 and routes in `scripts/pending-routes.txt` excluded.

## Deploy (Cloudflare Worker, static assets)

Worker `tensai-site` serves `dist` (assets only, no script), config in `wrangler.jsonc`.

- `.github/workflows/deploy.yml`: on push to `main` and `workflow_dispatch`, runs the CI (`ci.yml` via `workflow_call`), then `pnpm build` and `wrangler deploy` through `cloudflare/wrangler-action` (pinned by SHA, wrangler 4.158.0). Environment `production`, one deploy at a time, never on pull requests.
- Local check, no auth: `pnpm build && npx wrangler@4.158.0 deploy --dry-run`. Local serve: `npx wrangler@4.158.0 dev`.
- Headers and CSP come from `public/_headers` (copied into `dist`, supported natively by Workers static assets: 100 rules max, 2000 chars per line). No `_redirects` file.
- `not_found_handling: "404-page"` serves `dist/404.html` with a 404 status.
- Custom domains `tensai.page` and `www.tensai.page` are declared in `routes` (`custom_domain: true`): the first deploy creates the DNS records and certificates. The zone `tensai.page` must be on the Cloudflare account, and no existing DNS record may sit on those two names (delete the old Pages custom domains / records first).
- www -> apex is a Cloudflare redirect rule (Rules > Redirect Rules, host equals `www.tensai.page` => `https://tensai.page${uri}`, 301, keep query string). `_redirects` cannot match on host, so nothing in this repo. Redirect rules run before the Worker.
- `public/.well-known/security.txt` expires 2027-10-01: renew it (new `Expires`, under a year ahead) before then.

### One-time setup

1. Cloudflare > My Profile > API Tokens > Create Token (custom), name `tensai-site-deploy`, permissions:
   - Account > Workers Scripts > Edit
   - Zone > Workers Routes > Edit (zone resource: `tensai.page` only)
   - Zone > DNS > Edit (same zone, needed to create the custom domain records)
   - Account resources: the one account only.
2. GitHub repo > Settings > Environments > `production` (add required reviewers if wanted), then add as environment secrets (or repo secrets):
   - `CLOUDFLARE_API_TOKEN`: the token above
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare dashboard > Workers & Pages > Account ID
3. Add the www redirect rule (above), then run the `Deploy` workflow once by hand.

## Design

Palette and type are the same as the app. The design source lives in the private brand repo.

## Licence

Apache-2.0, see `LICENSE`. Fonts: SIL OFL 1.1 (`public/fonts/OFL-*.txt`).
