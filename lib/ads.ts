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
  | "homeMid" // Home page, dopo "Latest Malta Updates"
  | "guide" // Pagine guida (Visit Malta, Valletta, Mdina, Things to do, EU, non-EU), prima del footer
  | "guideMid" // Pagine guida, dopo la prima sezione di contenuti
  | "article" // Articoli, dopo l'introduzione
  | "articleMid" // Articoli, a metà del testo (solo se l'articolo ha almeno 4 sezioni)
  | "articleEnd" // Articoli, prima delle fonti ufficiali
  | "articleSide" // Articoli, colonna laterale 300×600 che segue la lettura (schermi da 1280 px)
  | "updates" // Pagine "Updates" (Transport, Housing, Work, Residence), in fondo
  | "updatesMid" // Pagine "Updates", dentro l'elenco dopo 4 notizie
  | "rail"; // Laterale fisso 160×600 su Home, guide e Updates (solo schermi molto larghi)

export const AD_SLOTS: Record<AdPlacement, string> = {
  home: "",
  homeMid: "",
  guide: "",
  guideMid: "",
  article: "",
  articleMid: "",
  articleEnd: "",
  articleSide: "",
  updates: "",
  updatesMid: "",
  rail: "",
};

export type Sponsor = {
  name: string; // nome dello sponsor (testo alternativo dell'immagine)
  image: string; // es. "/sponsors/nome.jpg" (file in public/sponsors) o un URL completo
  url: string; // sito dello sponsor
};

// Misure immagini: 728×90 o 970×250 (banner), 300×600 (articleSide), 160×600 (rail)
// Esempio:
// guide: { name: "Agenzia XYZ", image: "/sponsors/xyz.jpg", url: "https://www.xyz.com" },
export const SPONSORS: Partial<Record<AdPlacement, Sponsor>> = {};

export function hasAd(placement: AdPlacement) {
  return Boolean(SPONSORS[placement] || AD_SLOTS[placement]);
}
