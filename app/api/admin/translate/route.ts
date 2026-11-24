import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { MOVE_GUIDES } from "@/lib/move-guides";
import UI_STRINGS from "@/lib/ui-strings.json";

// Traduzione automatica dei contenuti con OpenAI.
// Protetta da password (middleware). Usata da /admin/translate.

export const runtime = "nodejs";

const LANGS: Record<string, string> = {
  it: "Italian",
  pl: "Polish",
  fr: "French",
  de: "German",
  es: "Spanish (Spain)",
  uk: "Ukrainian",
};

// Chiavi che non vanno mai tradotte (vengono ripristinate dall'originale)
const KEEP_KEYS = new Set(["url", "href", "slug", "image_url", "image_source", "id"]);

type Job = { kind: string; ref: string; lang: string; source: unknown; hash: string };

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase admin is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function sha(value: unknown) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(JSON.stringify(value)));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function pick<T extends Record<string, unknown>>(row: T, keys: string[]) {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (row[k] !== null && row[k] !== undefined && row[k] !== "") out[k] = row[k];
  return out;
}

async function sources() {
  const db = admin();
  const items: { kind: string; ref: string; source: unknown }[] = [];

  const { data: places, error: e1 } = await db
    .from("places")
    .select("slug,area_label,name,kicker,summary,intro,image_alt,facts,getting_there,sections,tips,faq")
    .eq("status", "published");
  if (e1) throw e1;
  for (const p of places ?? [])
    items.push({
      kind: "place",
      ref: p.slug,
      source: pick(p, ["area_label", "name", "kicker", "summary", "intro", "image_alt", "facts", "getting_there", "sections", "tips", "faq"]),
    });

  const { data: articles, error: e2 } = await db
    .from("articles")
    .select("slug,title,summary,introduction,sections,faq")
    .eq("status", "published");
  if (e2) throw e2;
  for (const a of articles ?? [])
    items.push({ kind: "article", ref: a.slug, source: pick(a, ["title", "summary", "introduction", "sections", "faq"]) });

  for (const [key, g] of Object.entries(MOVE_GUIDES)) {
    const { sources: _omit, ...rest } = g;
    void _omit;
    items.push({ kind: "guide", ref: key, source: rest });
  }

  for (const [key, strings] of Object.entries(UI_STRINGS as Record<string, string[]>))
    items.push({ kind: "ui", ref: key, source: { strings } });

  return items;
}

async function pending(lang?: string) {
  const db = admin();
  const items = await sources();
  const { data: done, error } = await db.from("translations").select("kind,ref,lang,source_hash");
  if (error) throw error;
  const doneMap = new Map((done ?? []).map((d) => [`${d.kind}|${d.ref}|${d.lang}`, d.source_hash]));
  const jobs: Job[] = [];
  let total = 0;
  for (const it of items) {
    const hash = await sha(it.source);
    for (const l of Object.keys(LANGS)) {
      if (lang && l !== lang) continue;
      total++;
      if (doneMap.get(`${it.kind}|${it.ref}|${l}`) !== hash) jobs.push({ ...it, lang: l, hash });
    }
  }
  return { jobs, total };
}

// Ripristina dall'originale URL, slug e struttura degli array
function restore(src: unknown, tr: unknown): unknown {
  if (typeof src === "string") return typeof tr === "string" && tr.trim() ? tr : src;
  if (Array.isArray(src)) {
    if (!Array.isArray(tr) || tr.length !== src.length) throw new Error("Array length mismatch");
    return src.map((s, i) => restore(s, tr[i]));
  }
  if (src && typeof src === "object") {
    const out: Record<string, unknown> = {};
    const t = (tr && typeof tr === "object" ? tr : {}) as Record<string, unknown>;
    for (const [k, v] of Object.entries(src as Record<string, unknown>))
      out[k] = KEEP_KEYS.has(k) ? v : restore(v, t[k]);
    return out;
  }
  return src;
}

async function translate(job: Job) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const language = LANGS[job.lang];
  const response = await openai.responses.create({
    model: process.env.OPENAI_TRANSLATE_MODEL || "gpt-5.6-terra",
    reasoning: { effort: "low" },
    instructions: [
      `Translate the JSON values from English into ${language} for GoMaltaNow, a practical travel and relocation guide about Malta.`,
      "Return ONLY a JSON object with exactly the same structure, keys and array lengths. Translate every string value; never translate keys.",
      "Keep URLs, email addresses, numbers, prices, dates and units unchanged. Keep official names of Maltese institutions and documents (Identità, Jobsplus, Single Permit, Tallinja, ARMS, Housing Authority) as they are, adding a short translation in brackets only where it helps.",
      "Use the usual local spelling of place names when one exists (e.g. Valletta → La Valletta in Italian), otherwise keep the Maltese name.",
      "Keep a natural, friendly and clear tone, suitable for a website. Keep symbols such as → ↓ ← and line breaks (\\n) in the same places.",
    ].join(" "),
    input: JSON.stringify(job.source),
    text: { format: { type: "json_object" } },
  });
  if (!response.output_text) throw new Error("Empty response");
  return restore(job.source, JSON.parse(response.output_text));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { action?: string; lang?: string };
    const lang = body.lang && LANGS[body.lang] ? body.lang : undefined;
    const { jobs, total } = await pending(lang);

    if (body.action !== "next") {
      return Response.json({ total, remaining: jobs.length });
    }

    const job = jobs[0];
    if (!job) return Response.json({ total, remaining: 0, done: true });

    const data = await translate(job);
    const { error } = await admin()
      .from("translations")
      .upsert({ kind: job.kind, ref: job.ref, lang: job.lang, source_hash: job.hash, data, updated_at: new Date().toISOString() });
    if (error) throw error;

    return Response.json({ total, remaining: jobs.length - 1, translated: `${job.kind} ${job.ref} (${job.lang})` });
  } catch (error) {
    console.error("Translation failed", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
