import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceDetail from "@/components/PlaceDetail";
import { getPlace } from "@/lib/places";

// Guide generali di Visit Malta: Transport, Where to stay, Food, Practical info…
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace("visit-malta", slug);
  if (!place) return { title: "Page not found | GoMaltaNow" };
  return {
    title: `${place.name}: Practical Guide | GoMaltaNow`,
    description: place.summary,
    alternates: { canonical: `/visit-malta/${place.slug}` },
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

export default async function VisitMaltaGuidePage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlace("visit-malta", slug);
  if (!place) notFound();
  return (
    <PlaceDetail place={place} backHref="/visit-malta" backLabel="Back to Visit Malta" />
  );
}
