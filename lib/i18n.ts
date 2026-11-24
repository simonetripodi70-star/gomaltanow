// Lingue del sito. L'inglese è la lingua principale (URL senza prefisso).
export const LOCALES = ["en", "it", "pl", "fr", "de", "es", "uk"] as const;
export type Locale = (typeof LOCALES)[number];
export const TRANSLATED_LOCALES = ["it", "pl", "fr", "de", "es", "uk"] as const;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  pl: "Polski",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  uk: "Українська",
};

// Tutte le pagine pubbliche sono tradotte, tranne queste.
const NOT_TRANSLATED = [/^\/admin/, /^\/api/];

export function isTranslatedPath(path: string) {
  return !NOT_TRANSLATED.some((r) => r.test(path));
}

// Percorso nella lingua scelta: /visit-malta → /it/visit-malta
export function localePath(path: string, lang: Locale | string) {
  if (!lang || lang === "en" || !path.startsWith("/") || !isTranslatedPath(path)) return path;
  return `/${lang}${path === "/" ? "" : path}`;
}

// hreflang per i metadati di una pagina (percorso inglese)
export function languageAlternates(path: string) {
  const languages: Record<string, string> = { en: path, "x-default": path };
  for (const l of TRANSLATED_LOCALES) languages[l] = localePath(path, l);
  return languages;
}

export function alternatesFor(path: string, lang: Locale | string = "en") {
  return { canonical: localePath(path, lang), languages: languageAlternates(path) };
}
