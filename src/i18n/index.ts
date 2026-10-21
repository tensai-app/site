import { en, type Dict } from "./en";
import { fr } from "./fr";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dicts: Record<Locale, Dict> = { en, fr };

export function useT(locale: Locale): Dict {
  return dicts[locale];
}

/** Locale from a pathname: `/fr/...` is French, everything else English. */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** Path without its locale prefix, always with leading and trailing slash. */
export function stripLocale(pathname: string): string {
  const rest = pathname.replace(/^\/fr(?=\/|$)/, "");
  return rest === "" ? "/" : rest;
}

/** Path of `path` (locale-less) in `locale`. */
export function localizePath(path: string, locale: Locale): string {
  return locale === defaultLocale ? path : `/${locale}${path === "/" ? "/" : path}`;
}
