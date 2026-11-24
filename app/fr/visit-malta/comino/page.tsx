import type { Metadata } from "next";
import { PlaceRoute, placeMetadata } from "@/components/PlaceRoute";

export const dynamic = "force-dynamic";

const config = { area: "visit-malta", slug: "comino", path: "/visit-malta/comino", title: "titleHub", backHref: "/visit-malta", backLabel: "backVisitMalta", hubArea: "comino", lang: "fr" } as const;

export async function generateMetadata(): Promise<Metadata> {
  return placeMetadata(config);
}

export default async function Page() {
  return PlaceRoute(config);
}
