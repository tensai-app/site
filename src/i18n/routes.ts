import pendingRaw from "../../scripts/pending-routes.txt?raw";

const pending = new Set(
  pendingRaw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#")),
);

/**
 * Whether the page at `path` (locale-less, trailing slash) is built. Links to routes still listed in
 * scripts/pending-routes.txt are hidden, and come back when the line is removed.
 */
export function isLive(path: string): boolean {
  return !pending.has(path);
}
