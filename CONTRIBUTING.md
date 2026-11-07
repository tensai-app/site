# Contributing to the site

Source of [tensai.page](https://tensai.page): landing page, docs, changelog. Astro 7, TypeScript strict, no UI framework, no third-party request. English at `/`, French at `/fr/`. Org-wide entry point and security policy: [tensai-app/.github](https://github.com/tensai-app/.github).

## No code needed

- A wrong or unclear sentence in the docs: every docs page has an "Edit on GitHub" link that opens the file in the GitHub editor and proposes a PR.
- Run the app on your phone and report numbers: see the [org contributing guide](https://github.com/tensai-app/.github/blob/main/CONTRIBUTING.md). The docs' Performance page is written from measurements of one phone, a Device report from another one is how it widens.

## Run it

Node 24 (`.nvmrc`, the package accepts `>=24 <25`), pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm check          # astro check (types)
pnpm build          # -> dist/
```

## Where the content is

| What | Where |
|---|---|
| Docs, EN and FR | `src/i18n/pages/docs.ts`: one article per page, routes, nav and reading order in the same file |
| Other pages' text | `src/i18n/pages/*.ts` (home, download, llama.kt, privacy, legal, changelog) |
| Page registry (OG text, JSON-LD, llms.txt) | `src/i18n/seo.ts`: a new page goes into `pages` there |
| Changelog data | `src/data/changelog.json`, synced from the app with `pnpm sync:changelog` |

Rules that bite:

- Both languages move together: a change to an English article gets its French counterpart in the same PR.
- The docs are written from the app's code and strings. Check a claim against the app before you write it; if you can't, say so in the PR.
- Titles are "Page · tensai", 60 characters max. Descriptions are 120 to 160 characters. The SEO check enforces both.
- No em-dash character in `src/` or the built output. The content check fails on it.
- No third-party URL or inline script without a hash (CSP). If `src/scripts/theme-init.js` changes, update its hash in `public/_headers`: `pnpm test:content` prints the expected one.

## Checks before a PR

CI runs these on every PR; run them locally first:

```bash
pnpm check
pnpm build
pnpm test:links     # internal links, offline
pnpm test:content   # em-dash, CSP-safe HTML, third-party URLs
pnpm test:seo       # titles, descriptions, canonical/hreflang, OG, JSON-LD, sitemap, llms.txt
pnpm test:lhci      # Lighthouse CI, needs Chrome (CHROME_PATH)
```

Merging to `main` deploys the site to Cloudflare. Pull requests never deploy.

## Commits and PRs

- Conventional Commits: `type(scope): subject`. Types: feat, fix, perf, refactor, docs, test, build, ci, chore, revert, style.
- No issue or ticket id in the subject or body. Link the issue in the PR description.
- Fork, branch from `main`, PR against `main`.
- Apache-2.0, see [LICENSE](LICENSE). Fonts are SIL OFL 1.1.
