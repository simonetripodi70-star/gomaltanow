import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getPlace, getPlacesByArea } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const place = await getPlace("visit-malta", "gozo");
  if (!place) return { title: "Gozo | GoMaltaNow" };
  return {
    title: `Gozo Travel Guide: What to See and How to Get There | GoMaltaNow`,
    description: place.summary,
    alternates: { canonical: "/visit-malta/gozo" },
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

export default async function GozoPage() {
  const place = await getPlace("visit-malta", "gozo");
  if (!place) notFound();
  const areaPlaces = await getPlacesByArea("gozo");
  return (
    <PlaceDetail
      place={place}
      areaPlaces={areaPlaces}
      backHref="/visit-malta"
      backLabel="Back to Visit Malta"
    />
  );
}
