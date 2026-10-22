import data from "./changelog.json";

/** One release of the app, as synced from its changelog.json by scripts/sync-changelog.mjs (newest first). */
export interface ChangelogRelease {
  version: string;
  title: string | null;
  /** ISO date. */
  date: string;
  intro: string;
  groups: { label: string; items: string[] }[];
}

export const releases: ChangelogRelease[] = data;

/** Anchor id of a release on the changelog page. */
export const anchor = (version: string) => `v${version}`;
