import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getPlace } from "@/lib/places";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace("gozo", slug);
  if (!place) return { title: "Place not found | GoMaltaNow" };
  return {
    title: `${place.name}: Opening Hours, Tickets and How to Get There | GoMaltaNow`,
    description: place.summary,
    alternates: { canonical: `/visit-malta/gozo/${place.slug}` },
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

export default async function GozoPlacePage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlace("gozo", slug);
  if (!place) notFound();
  return (
    <PlaceDetail
      place={place}
      backHref="/visit-malta/gozo"
      backLabel="Back to Gozo"
    />
  );
}
