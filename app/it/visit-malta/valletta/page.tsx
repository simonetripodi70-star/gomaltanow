import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Guida de La Valletta: cosa vedere nella capitale di Malta | GoMaltaNow",
  description:
    "Esplora La Valletta: strade storiche, viste sul porto, musei, chiese e le attrazioni più importanti della capitale di Malta.",
  alternates: {
    canonical: "/it/visit-malta/valletta",
    languages: {"en": "/visit-malta/valletta", "it": "/it/visit-malta/valletta", "pl": "/pl/visit-malta/valletta", "fr": "/fr/visit-malta/valletta", "de": "/de/visit-malta/valletta", "es": "/es/visit-malta/valletta", "uk": "/uk/visit-malta/valletta", "x-default": "/visit-malta/valletta"},
  },
};


export const dynamic = "force-dynamic";

type VallettaArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  published_at: string | null;
  last_checked: string | null;
};

const vallettaArticleKeys = [
  "valletta",
  "capital",
  "upper-barrakka",
  "lower-barrakka",
  "waterfront",
  "museums",
  "museum",
  "three-cities",
  "grand-harbour",
  "sightseeing",
];

const highlights = [
  {
    number: "01",
    slug: "upper-barrakka-gardens",
    title: "Giardini Upper Barrakka",
    text: "Goditi uno dei punti panoramici più noti de La Valletta sul Grand Harbour e sulle Tre Città.",
  },
  {
    number: "02",
    slug: "st-johns-co-cathedral",
    title: "Concattedrale di San Giovanni",
    text: "Visita uno dei più importanti luoghi storici e artistici di Malta nel cuore della città.",
  },
  {
    number: "03",
    slug: "republic-street",
    title: "Republic Street",
    text: "Percorri la principale via pedonale de La Valletta, con negozi, caffè, edifici storici e strade secondarie da esplorare.",
  },
  {
    number: "04",
    slug: "valletta-waterfront",
    title: "Lungomare de La Valletta",
    text: "Scendi verso il porto per ristoranti, magazzini storici e una vista diversa della capitale.",
  },
  {
    number: "05",
    slug: "museums-in-valletta",
    title: "Musei e storia",
    text: "La Valletta ha diversi musei e siti storici che rendono facile organizzare un'intera giornata dedicata alla cultura e alla storia.",
  },
  {
    number: "06",
    slug: "three-cities-from-valletta",
    title: "Collegamento con le Tre Città",
    text: "Abbina La Valletta a una traversata del porto o a un viaggio in traghetto verso le Tre Città per un'esperienza più completa del Grand Harbour.",
  },
];

const planningTips = [
  {
    title: "Indossa scarpe comode",
    text: "La Valletta ha salite, gradini e molto da camminare, quindi calzature comode fanno una grande differenza.",
  },
  {
    title: "Inizia presto in estate",
    text: "Le visite al mattino possono essere più confortevoli nei mesi caldi e possono anche aiutarti a evitare i periodi più affollati.",
  },
  {
    title: "Abbina le attrazioni vicine",
    text: "Molte attrazioni principali sono vicine tra loro, quindi La Valletta è facile da esplorare a piedi in modo efficiente.",
  },
];

function getSupabasePublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    console.error(
      "Public Supabase configuration is missing.",
    );

    return null;
  }

  return createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

function normalizeValue(
  value: string | null | undefined,
) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function isVallettaArticle(
  article: VallettaArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return vallettaArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getVallettaArticles(): Promise<
  VallettaArticle[]
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      [
        "id",
        "title",
        "slug",
        "summary",
        "category",
        "audience",
        "section_slug",
        "published_at",
        "last_checked",
      ].join(","),
    )
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    })
    .limit(100)
    .returns<VallettaArticle[]>();

  if (error) {
    console.error(
      "Could not load Valletta articles",
      error,
    );

    return [];
  }

  return (data ?? [])
    .filter((article) => {
      const audience =
        normalizeValue(article.audience);

      return (
        audience === "tourist" ||
        audience === "general" ||
        audience === ""
      );
    })
    .filter(isVallettaArticle);
}

export default async function VallettaPage() {
  const vallettaArticles =
    await localizeArticles(await getVallettaArticles(), "it");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/it"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/it/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Torna a Visitare Malta
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                La Valletta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Esplora La Valletta, la capitale di Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Strade storiche, viste sul porto, musei, chiese e alcune delle attrazioni più importanti di Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#highlights"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Esplora La Valletta ↓
                </a>

                {vallettaArticles.length > 0 && (
                  <a
                    href="#valletta-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Leggi le guide su La Valletta
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="La Valletta, Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            La capitale di Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            La Valletta è compatta e facile da esplorare a piedi.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Puoi vedere molte delle principali attrazioni della città in un giorno, ma una visita più lenta ti dà più tempo per le strade secondarie, i musei e le viste sul porto.
          </p>
        </div>
      </section>

      <section
        id="highlights"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              I punti salienti de La Valletta
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Cosa vedere a La Valletta.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Inizia da questi luoghi e poi esplora le strade tra uno e l&apos;altro.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <Link
                key={item.number}
                href={`/it/visit-malta/valletta/${item.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {item.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Orari di apertura, biglietti e come arrivare →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Consigli pratici
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Rendi più semplice la tua visita a La Valletta.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {planningTips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {tip.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {tip.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {vallettaArticles.length > 0 && (
        <section
          id="valletta-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Guide pubblicate su La Valletta
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Altre guide su La Valletta.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli turistici approvati su La Valletta, i musei, il Grand Harbour e le attrazioni vicine vengono collegati qui automaticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {vallettaArticles.length}{" "}
                {vallettaArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {vallettaArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/it/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                    {article.summary}
                  </p>

                  <div className="mt-7 border-t border-black/10 pt-5">
                    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#766F69]">
                      {article.published_at && (
                        <span>
                          Published:{" "}
                          {formatDate(
                            article.published_at,
                          )}
                        </span>
                      )}

                      {article.last_checked && (
                        <span>
                          Checked:{" "}
                          {formatDate(
                            article.last_checked,
                          )}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex font-bold text-[#B83F29]">
                      Leggi l&apos;articolo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Continua a esplorare
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Scopri altre località storiche di Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/visit-malta/mdina-rabat"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Mdina e Rabat →
            </Link>

            <Link
              href="/it/visit-malta/things-to-do"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Cose da fare
            </Link>

            <Link
              href="/it/visit-malta/transport"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Trasporti
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/it"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta resa semplice.
          </p>
        </div>
      </footer>
    </main>
  );
}

function MetadataBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B83F29]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}