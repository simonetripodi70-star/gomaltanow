// Pubblicità di GoMaltaNow.
//
// 1. Google AdSense: dopo l'approvazione del sito crea le unità annuncio
//    (AdSense → Annunci → Per unità pubblicitaria → Annunci display) e incolla
//    qui sotto il numero "data-ad-slot" di ogni unità.
// 2. Sponsor diretti: aggiungi un banner in SPONSORS (ha la precedenza su AdSense).
//
// Finché uno spazio non ha né un ID né uno sponsor, sul sito non appare nulla.

export const ADSENSE_CLIENT = "ca-pub-9189189739994241";

export type AdPlacement =
  | "home" // Home page, tra "Popular Guides" e "Latest Malta Updates"
  | "guide" // Pagine guida (Visit Malta e Move to Malta), prima del footer
  | "article" // Articoli, dopo l'introduzione
  | "articleEnd" // Articoli, prima delle fonti ufficiali
  | "updates"; // Pagine "Updates" (Transport, Housing, Work, Residence), in fondo

export const AD_SLOTS: Record<AdPlacement, string> = {
  home: "",
  guide: "",
  article: "",
  articleEnd: "",
  updates: "",
};

export type Sponsor = {
  name: string; // nome dello sponsor (testo alternativo dell'immagine)
  image: string; // es. "/sponsors/nome.jpg" (file in public/sponsors) o un URL completo
  url: string; // sito dello sponsor
};

// Esempio:
// guide: { name: "Agenzia XYZ", image: "/sponsors/xyz.jpg", url: "https://www.xyz.com" },
export const SPONSORS: Partial<Record<AdPlacement, Sponsor>> = {};
