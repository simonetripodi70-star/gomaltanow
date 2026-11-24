import { createClient } from "@supabase/supabase-js";

// Schede dettagliate dei luoghi (tabella "places" su Supabase).
// Ogni luogo appartiene a un'area (es. "valletta") e ha una pagina
// /visit-malta/<area>/<slug>.

export type PlaceFact = { label: string; value: string };
export type PlaceGetting = { mode: string; text: string };
export type PlaceSection = { heading: string; content: string };
export type PlaceFaq = { question: string; answer: string };
export type PlaceSource = { name: string; url: string };

export type Place = {
  slug: string;
  area: string;
  area_label: string;
  sort: number;
  name: string;
  kicker: string | null;
  summary: string;
  intro: string;
  image_url: string | null;
  image_alt: string | null;
  image_credit: string | null;
  image_source: string | null;
  facts: PlaceFact[];
  getting_there: PlaceGetting[];
  sections: PlaceSection[];
  tips: string[];
  faq: PlaceFaq[];
  sources: PlaceSource[];
  nearby: string[];
  map_query: string | null;
  last_checked: string | null;
};

export type PlaceCard = Pick<
  Place,
  "slug" | "area" | "name" | "kicker" | "summary" | "image_url" | "image_alt"
>;

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPlace(area: string, slug: string) {
  const supabase = client();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("area", area)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<Place>();
  if (error) {
    console.error("Could not load place", error);
    return null;
  }
  return data;
}

export async function getPlaceCards(slugs: string[]) {
  const supabase = client();
  if (!supabase || slugs.length === 0) return [];
  const { data, error } = await supabase
    .from("places")
    .select("slug,area,name,kicker,summary,image_url,image_alt")
    .in("slug", slugs)
    .eq("status", "published")
    .returns<PlaceCard[]>();
  if (error) {
    console.error("Could not load nearby places", error);
    return [];
  }
  // stesso ordine dell'elenco richiesto
  return slugs
    .map((s) => (data ?? []).find((p) => p.slug === s))
    .filter((p): p is PlaceCard => Boolean(p));
}

export async function getAllPlaceLinks() {
  const supabase = client();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("places")
    .select("slug,area,last_checked")
    .eq("status", "published")
    .returns<{ slug: string; area: string; last_checked: string | null }[]>();
  if (error) return [];
  return data ?? [];
}

export function placeHref(area: string, slug: string) {
  return `/visit-malta/${area}/${slug}`;
}
