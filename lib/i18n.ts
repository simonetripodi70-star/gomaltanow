// Lingue del sito. L'inglese è la lingua principale (URL senza prefisso).
export const LOCALES = ["en", "it", "pl", "fr", "de", "es", "uk"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  pl: "Polski",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  uk: "Українська",
};

// Pagine già tradotte per ogni lingua (percorso inglese, senza prefisso).
// Aggiornato da tools/i18n_gen quando si traducono nuove pagine.
export const TRANSLATED: Record<Exclude<Locale, "en">, string[]> = {
  it: ["/"],
  pl: [],
  fr: [],
  de: [],
  es: [],
  uk: [],
};
