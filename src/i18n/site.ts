/** Facts shared by several pages. Not translated. */
export const GITHUB_ORG = "https://github.com/tensai-app";
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
