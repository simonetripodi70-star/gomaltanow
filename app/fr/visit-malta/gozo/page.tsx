import type { Metadata } from "next";
import { PlaceRoute, placeMetadata } from "@/components/PlaceRoute";

export const dynamic = "force-dynamic";

const config = { area: "visit-malta", slug: "gozo", path: "/visit-malta/gozo", title: "titleHub", backHref: "/visit-malta", backLabel: "backVisitMalta", hubArea: "gozo", lang: "fr" } as const;

export async function generateMetadata(): Promise<Metadata> {
  return placeMetadata(config);
}

export default async function Page() {
  return PlaceRoute(config);
}
