/** Filled at release time. With LAUNCHED true, an empty field fails the build (Download.astro) and `pnpm test:launch`. */
export interface Release {
  /** Without the leading "v", e.g. "1.0.0". */
  version: string;
  /** ISO date, e.g. "2026-11-01". */
  date: string;
  /** Absolute URL of the APK on the GitHub release. */
  url: string;
  /** Human readable, e.g. "92 MB". */
  size: string;
  /** Hex digest of the APK. */
  sha256: string;
  /** SHA-256 fingerprint of the signing certificate, as printed by apksigner. */
  certFingerprint: string;
}

export const RELEASE: Release = {
  version: "",
  date: "",
  url: "",
  size: "",
  sha256: "",
  certFingerprint: "",
};
