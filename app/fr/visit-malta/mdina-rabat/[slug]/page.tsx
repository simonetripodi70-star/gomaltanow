import type { Metadata } from "next";
import { PlaceRoute, placeMetadata } from "@/components/PlaceRoute";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const config = (slug: string) => ({ area: "mdina-rabat", slug: slug, path: `/visit-malta/mdina-rabat/${slug}`, title: "titlePlace", backHref: "/visit-malta/mdina-rabat", backLabel: "backMdina", lang: "fr" } as const);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return placeMetadata(config(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return PlaceRoute(config(slug));
}
