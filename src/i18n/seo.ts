import { home } from "./pages/home";
import { download } from "./pages/download";
import { llamakt } from "./pages/llamakt";
import { privacy } from "./pages/privacy";
import { legal } from "./pages/legal";
import { useT, localizePath, type Locale } from "./index";
import { APACHE_LICENSE, APP_VERSION, GITHUB_ORG, LAUNCHED, LLAMA_KT_REPO, SITE_URL } from "./site";

/** Open Graph image size, fixed by the endpoint in src/pages/og. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

type Kind = "home" | "download" | "llama-kt" | "privacy" | "legal";

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
  {
    kind: "llama-kt",
    path: "/llama-kt/",
    slug: "llama-kt",
    og: both((l) => ({ label: "llama.kt", title: llamakt[l].hero.lead })),
    name: both(() => "llama.kt"),
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
      // The page descriptions say the first public release is 1.0: that is the availability statement.
      description,
      operatingSystem: "Android 10+",
      applicationCategory: "MobileApplication",
      license: APACHE_LICENSE,
      isAccessibleForFree: true,
      image: absolute("/logo.png"),
      publisher: { "@id": ORG_ID },
      ...(LAUNCHED ? {
        softwareVersion: APP_VERSION,
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
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.siteName, item: absolute(localizePath("/", locale)) },
        { "@type": "ListItem", position: 2, name: page.name[locale], item: url },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
