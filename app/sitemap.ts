import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Mappa del sito per Google: /sitemap.xml
// Le pagine fisse sono elencate qui; articoli e sezioni "Updates" arrivano da Supabase.

export const dynamic = "force-dynamic";

const BASE = "https://gomaltanow.com";

const STATIC_PAGES = [
  "/",
  "/visit-malta",
  "/visit-malta/valletta",
  "/visit-malta/mdina-rabat",
  "/visit-malta/things-to-do",
  "/beaches",
  "/move-to-malta",
  "/move-to-malta/eu-citizen",
  "/move-to-malta/eu-citizen/before-you-move",
  "/move-to-malta/eu-citizen/residence",
  "/move-to-malta/eu-citizen/find-a-home",
  "/move-to-malta/eu-citizen/find-a-job",
  "/move-to-malta/eu-citizen/banking-payments",
  "/move-to-malta/eu-citizen/healthcare",
  "/move-to-malta/non-eu-citizen",
  "/move-to-malta/non-eu-citizen/before-you-move",
  "/move-to-malta/non-eu-citizen/single-permit",
  "/move-to-malta/non-eu-citizen/find-a-job",
  "/move-to-malta/non-eu-citizen/find-a-home",
  "/move-to-malta/non-eu-citizen/residence",
  "/move-to-malta/non-eu-citizen/healthcare",
  "/move-to-malta/non-eu-citizen/banking-payments",
  "/privacy",
];

type ArticleRow = {
  slug: string;
  section_slug: string | null;
  published_at: string | null;
  last_checked: string | null;
};

async function getPublishedArticles(): Promise<ArticleRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("articles")
      .select("slug,section_slug,published_at,last_checked")
      .eq("status", "published")
      .returns<ArticleRow[]>();
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map(
    (path): MetadataRoute.Sitemap[number] => ({
      url: `${BASE}${path}`,
      changeFrequency: path === "/" ? "daily" : "monthly",
      priority: path === "/" ? 1 : 0.7,
    }),
  );

  // Solo le sezioni "Updates" che hanno almeno un articolo
  const sections = [
    ...new Set(
      articles
        .map((a) => a.section_slug)
        .filter((s): s is string => Boolean(s)),
    ),
  ];
  for (const section of sections) {
    pages.push({
      url: `${BASE}/updates/${section}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const article of articles) {
    const date = article.last_checked || article.published_at;
    pages.push({
      url: `${BASE}/articles/${article.slug}`,
      lastModified: date ? new Date(date) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
