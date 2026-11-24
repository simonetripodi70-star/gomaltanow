import { createClient } from "@supabase/supabase-js";

// Traduzioni dei contenuti salvate su Supabase (tabella "translations").
// Se una traduzione manca, si mostra il testo inglese.

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getTranslations<T = Record<string, unknown>>(
  kind: string,
  refs: string[],
  lang: string,
): Promise<Map<string, T>> {
  const out = new Map<string, T>();
  if (!lang || lang === "en" || refs.length === 0) return out;
  const supabase = client();
  if (!supabase) return out;
  const { data, error } = await supabase
    .from("translations")
    .select("ref,data")
    .eq("kind", kind)
    .eq("lang", lang)
    .in("ref", refs);
  if (error) {
    console.error("Could not load translations", error);
    return out;
  }
  for (const row of data ?? []) out.set(row.ref as string, row.data as T);
  return out;
}

export async function getTranslation<T = Record<string, unknown>>(kind: string, ref: string, lang: string) {
  return (await getTranslations<T>(kind, [ref], lang)).get(ref) ?? null;
}

// Sovrappone i campi tradotti a quelli originali
export function overlay<T extends object>(item: T, tr: Partial<T> | null | undefined): T {
  if (!tr) return item;
  const out = { ...item } as Record<string, unknown>;
  for (const [k, v] of Object.entries(tr)) {
    if (v === null || v === undefined || v === "") continue;
    out[k] = v;
  }
  return out as T;
}

export async function localizeList<T extends { slug: string }>(
  kind: string,
  items: T[],
  lang: string,
): Promise<T[]> {
  if (!lang || lang === "en" || items.length === 0) return items;
  const map = await getTranslations<Partial<T>>(kind, items.map((i) => i.slug), lang);
  return items.map((i) => overlay(i, map.get(i.slug)));
}

// Articoli (liste e pagine): titolo, sommario, testo
export async function localizeArticles<T extends { slug: string }>(items: T[], lang: string) {
  return localizeList("article", items, lang);
}

export async function localizeArticle<T extends { slug: string }>(item: T | null, lang: string) {
  if (!item) return item;
  return (await localizeList("article", [item], lang))[0];
}

// Testi delle pagine tradotti (kind "ui"): mappa inglese → traduzione
export async function getUiDictionary(lang: string, pageKeys: string[]) {
  const map = await getTranslations<{ strings: string[] }>("ui", pageKeys, lang);
  return map;
}
