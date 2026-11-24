import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getPlace, getPlacesByArea, type Place } from "@/lib/places";
import { alternatesFor, localePath, type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";
import { t, type LabelKey } from "@/lib/ui-labels";

// Pagine dei luoghi (tutte le lingue): metadati e contenuto.
export type PlaceRouteConfig = {
  area: string; // area della scheda su Supabase
  slug: string;
  path: string; // percorso inglese della pagina
  title: LabelKey; // modello del titolo
  backHref: string; // percorso inglese
  backLabel: LabelKey;
  hubArea?: string; // per le pagine hub (Gozo, Comino)
  lang?: Locale;
};

export async function placeMetadata(cfg: PlaceRouteConfig): Promise<Metadata> {
  const lang = cfg.lang ?? "en";
  const place = await getPlace(cfg.area, cfg.slug);
  if (!place) return { title: `${t(lang, "notFound")} | GoMaltaNow` };
  const tr = await getTranslation<Partial<Place>>("place", place.slug, lang);
  const name = tr?.name || place.name;
  return {
    title: `${t(lang, cfg.title, { name })} | GoMaltaNow`,
    description: tr?.summary || place.summary,
    alternates: alternatesFor(cfg.path, lang),
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

export async function PlaceRoute(cfg: PlaceRouteConfig) {
  const lang = cfg.lang ?? "en";
  const place = await getPlace(cfg.area, cfg.slug);
  if (!place) notFound();
  const areaPlaces = cfg.hubArea ? await getPlacesByArea(cfg.hubArea) : [];
  return (
    <PlaceDetail
      place={place}
      areaPlaces={areaPlaces}
      backHref={localePath(cfg.backHref, lang)}
      backLabel={t(lang, cfg.backLabel)}
      lang={lang}
    />
  );
}
