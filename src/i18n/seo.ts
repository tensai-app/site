import { home } from "./pages/home";
import { download } from "./pages/download";
import { llamakt } from "./pages/llamakt";
import { changelog } from "./pages/changelog";
import { privacy } from "./pages/privacy";
import { contribute } from "./pages/contribute";
import { docs, routes, slugs } from "./pages/docs";
import { legal } from "./pages/legal";
import { useT, localizePath, type Locale } from "./index";
import { APACHE_LICENSE, APP_VERSION, GITHUB_ORG, LAUNCHED, LLAMA_KT_REPO, SITE_URL, TENSAI_RELEASES } from "./site";

/** Open Graph image size, fixed by the endpoint in src/pages/og. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

type Kind = "home" | "download" | "docs" | "changelog" | "llama-kt" | "contribute" | "privacy" | "legal";

export interface Page {
  kind: Kind;
  /** Locale-less path, trailing slash. */
  path: string;
  /** Image file stem under /og/. */
  slug: string;
  /** Text of the OG image, per locale. `label` is the small mono line above the title. */
  og: Record<Locale, { title: string; label?: string }>;
  /** Short name used in breadcrumbs and llms.txt. */
  name: Record<Locale, string>;
}

const both = <T>(f: (l: Locale) => T): Record<Locale, T> => ({ en: f("en"), fr: f("fr") });

/** Every indexed page. The 404 is not in here: no image, no structured data, not in the sitemap. */
export const pages: Page[] = [
  {
    kind: "home",
    path: "/",
    slug: "home",
    og: both((l) => ({ title: home[l].hero.heading })),
    name: both((l) => useT(l).siteName),
  },
  {
    kind: "download",
    path: "/download/",
    slug: "download",
    og: both((l) => ({ title: download[l].heading })),
    name: both((l) => download[l].heading),
  },
  ...slugs.map((s): Page => ({
    kind: "docs",
    path: routes[s],
    slug: s === "install" ? "docs" : `docs-${s}`,
    og: both((l) => ({ label: docs[l].chrome.docs, title: docs[l].articles[s].title })),
    name: both((l) => docs[l].articles[s].title),
  })),
  {
    kind: "changelog",
    path: "/changelog/",
    slug: "changelog",
    og: both((l) => ({ title: changelog[l].heading })),
    name: both((l) => changelog[l].heading),
  },
  {
    kind: "llama-kt",
    path: "/llama-kt/",
    slug: "llama-kt",
    og: both((l) => ({ label: "llama.kt", title: llamakt[l].hero.lead })),
    name: both(() => "llama.kt"),
  },
  {
    kind: "contribute",
    path: "/contribute/",
    slug: "contribute",
    og: both((l) => ({ title: contribute[l].heading })),
    name: both((l) => contribute[l].heading),
  },
  {
    kind: "privacy",
    path: "/privacy/",
    slug: "privacy",
    og: both((l) => ({ title: privacy[l].heading })),
    name: both((l) => privacy[l].heading),
  },
  {
    kind: "legal",
    path: "/legal/",
    slug: "legal",
    og: both((l) => ({ title: legal[l].heading })),
    name: both((l) => legal[l].heading),
  },
];

/** Inline docs markup (`code`, [label](path)) as plain text. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`/g, "");

export function pageFor(path: string): Page | undefined {
  return pages.find((p) => p.path === path);
}

export const ogPath = (page: Page, locale: Locale) => `/og/${page.slug}.${locale}.png`;

export const absolute = (path: string) => new URL(path, SITE_URL).href;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** One @graph per page: site-wide WebSite and Organization, plus what the page is about. Nothing here is invented. */
export function jsonLd(page: Page, locale: Locale, description: string) {
  const url = absolute(localizePath(page.path, locale));
  const t = useT(locale);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: "tensai",
      url: absolute("/"),
      inLanguage: ["en", "fr"],
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "tensai",
      url: absolute("/"),
      logo: absolute("/logo.png"),
      sameAs: [GITHUB_ORG],
    },
  ];

  if (page.kind === "home" || page.kind === "download") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "tensai",
      url: absolute("/"),
      description,
      operatingSystem: "Android 10+",
      applicationCategory: "MobileApplication",
      license: APACHE_LICENSE,
      isAccessibleForFree: true,
      image: absolute("/logo.png"),
      publisher: { "@id": ORG_ID },
      ...(LAUNCHED ? {
        softwareVersion: APP_VERSION,
        downloadUrl: `${TENSAI_RELEASES}/latest`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      } : {}),
    });
  }

  if (page.kind === "llama-kt") {
    graph.push({
      "@type": "SoftwareSourceCode",
      name: "llama.kt",
      url,
      description,
      inLanguage: locale,
      codeRepository: LLAMA_KT_REPO,
      programmingLanguage: ["Kotlin", "C++"],
      runtimePlatform: "Android",
      license: APACHE_LICENSE,
      publisher: { "@id": ORG_ID },
    });
  }

  if (page.kind !== "home") {
    // Docs: Home > Docs > article. The docs home is the install article, so it is just Home > Docs.
    const docsHome = page.kind === "docs" && page.path === routes.install;
    const crumbs = [
      { name: t.siteName, item: absolute(localizePath("/", locale)) },
      ...(page.kind === "docs" && !docsHome ? [{ name: docs[locale].chrome.docs, item: absolute(localizePath(routes.install, locale)) }] : []),
      { name: docsHome ? docs[locale].chrome.docs : page.name[locale], item: url },
    ];
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
    });
  }

  if (page.kind === "docs" && page.path === routes.faq) {
    const items = docs[locale].articles.faq.sections.flatMap((s) => s.blocks).flatMap((b) => (b.t === "faq" ? b.items : []));
    graph.push({
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: plain(i.a) } })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
