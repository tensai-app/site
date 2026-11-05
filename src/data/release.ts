/** Update at each release (version, date, url, size, hashes). With LAUNCHED true, an empty field fails the build (Download.astro) and `pnpm test:launch`. */
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
  version: "0.3.6",
  date: "2026-11-05",
  url: "https://github.com/tensai-app/tensai/releases/download/v0.3.6/tensai-0.3.6.apk",
  size: "50 MB",
  sha256: "f86576e97270f21b4e11471f6397d0ad1f2d838e4b191e2414350d13d242f8f5",
  certFingerprint: "57a8c2d1903475e8f907e28e6c309b92b0a90947c332b056d2f6422dd9960c7d",
};
