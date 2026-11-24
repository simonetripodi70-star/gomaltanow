import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getPlace, getPlacesByArea } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const place = await getPlace("visit-malta", "comino");
  if (!place) return { title: "Comino | GoMaltaNow" };
  return {
    title: `Comino Travel Guide: What to See and How to Get There | GoMaltaNow`,
    description: place.summary,
    alternates: { canonical: "/visit-malta/comino" },
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

export default async function CominoPage() {
  const place = await getPlace("visit-malta", "comino");
  if (!place) notFound();
  const areaPlaces = await getPlacesByArea("comino");
  return (
    <PlaceDetail
      place={place}
      areaPlaces={areaPlaces}
      backHref="/visit-malta"
      backLabel="Back to Visit Malta"
    />
  );
}
