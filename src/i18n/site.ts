/** Facts shared by several pages. Not translated. */
export const SITE_URL = "https://tensai.page";
export const APACHE_LICENSE = "https://www.apache.org/licenses/LICENSE-2.0";
/** Current app version, shown in structured data only once the app can be obtained. */
export const APP_VERSION = "0.3.3";
/**
 * Flip to true at the public release. While false, the structured data carries no offers, version or
 * download URL (an Offer tells Google the app can be obtained), and scripts/check-seo.mjs fails if they appear.
 */
export const LAUNCHED: boolean = false;
export const GITHUB_ORG = "https://github.com/tensai-app";
export const TENSAI_RELEASES = `${GITHUB_ORG}/tensai/releases`;
/**
 * Show "Edit on GitHub" under the docs. Off until the site repo is public (v1.0): the link would 404 for everyone else.
 * Flip it with LAUNCHED.
 */
export const DOCS_EDIT_LINK = false;
export const DOCS_SOURCE = `${GITHUB_ORG}/site/edit/main/src/i18n/pages/docs.ts`;
export const LLAMA_KT_REPO = `${GITHUB_ORG}/llama.kt`;
export const CONTACT_EMAIL = "contact@tensai.page";

/**
 * Legal notice (LCEN). The publisher decides which route applies, nothing here is a real value.
 * - "identified": name, director, address and phone are published (phone omitted when "").
 * - "anonymous": art. 6-III-2 LCEN, only the host is named and holds the identity.
 */
export const LEGAL = {
  mode: "anonymous" as "identified" | "anonymous",
  /** A pseudonym in anonymous mode: the real identity is held by the host. */
  publisherName: "Hokanosekai",
  publicationDirector: "Hokanosekai",
  /** Identified mode only. */
  publisherAddress: "",
  publisherPhone: "",
  hostPhone: "+1 650 319 8930",
  /** ISO date of the last edit of the privacy policy and the legal notice. */
  updated: "2026-10-21",
};
