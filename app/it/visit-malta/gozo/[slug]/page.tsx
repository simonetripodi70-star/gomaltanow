import type { Metadata } from "next";
import { PlaceRoute, placeMetadata } from "@/components/PlaceRoute";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const config = (slug: string) => ({ area: "gozo", slug: slug, path: `/visit-malta/gozo/${slug}`, title: "titlePlace", backHref: "/visit-malta/gozo", backLabel: "backGozo", lang: "it" } as const);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return placeMetadata(config(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return PlaceRoute(config(slug));
}
