import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Cose da fare a Malta: luoghi, spiagge e gite | GoMaltaNow",
  description:
    "Città storiche, spiagge, isole, cibo, gite in barca ed esperienze per organizzare un soggiorno indimenticabile a Malta.",
  alternates: {
    canonical: "/it/visit-malta/things-to-do",
    languages: {"en": "/visit-malta/things-to-do", "it": "/it/visit-malta/things-to-do", "pl": "/pl/visit-malta/things-to-do", "fr": "/fr/visit-malta/things-to-do", "de": "/de/visit-malta/things-to-do", "es": "/es/visit-malta/things-to-do", "uk": "/uk/visit-malta/things-to-do", "x-default": "/visit-malta/things-to-do"},
  },
};


export const dynamic = "force-dynamic";

type ActivityArticle = {
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

const activityArticleKeys = [
  "things-to-do",
  "things-to-do-in-malta",
  "attractions",
  "activities",
  "experiences",
  "sightseeing",
  "what-to-do",
  "day-trip",
  "day-trips",
  "adventure",
  "tour",
  "tours",
];

const activityIdeas = [
  {
    number: "01",
    href: "/visit-malta/valletta",
    title: "Scopri le città storiche",
    text: "Passeggia a La Valletta, Mdina e nelle Tre Città per scoprire l'architettura, le fortificazioni e la storia di Malta.",
  },
  {
    number: "02",
    href: "/beaches",
    title: "Goditi il mare",
    text: "Vai in spiaggia, nuota in acque limpide, scopri i belvedere sulla costa o fai un giro in barca attorno alle isole.",
  },
  {
    number: "03",
    href: "/visit-malta/gozo",
    title: "Visita Gozo",
    text: "Fai una gita in giornata o fermati di più per scoprire villaggi, spiagge, paesaggi costieri e il lato più tranquillo delle isole maltesi.",
  },
  {
    number: "04",
    href: "/visit-malta/comino",
    title: "Scopri Comino",
    text: "Visita la Laguna Blu e la costa vicina, organizzandoti bene su trasporti, folla e periodo dell'anno.",
  },
  {
    number: "05",
    href: "/visit-malta/food-restaurants",
    title: "Assaggia la cucina maltese",
    text: "Prova piatti tipici, panetterie, cibo di strada e ristoranti per conoscere un altro lato della cultura maltese.",
  },
  {
    number: "06",
    href: "/visit-malta/mdina-rabat/mdina-in-the-evening",
    title: "Malta di sera",
    text: "Goditi il lungomare, passeggiate serali, ristoranti, bar e vita notturna in base al tipo di viaggio che desideri.",
  },
];

const planningTips = [
  {
    title: "Raggruppa i luoghi per zona",
    text: "Malta è piccola, ma traffico e tempi di viaggio si sommano. Quando puoi, visita nello stesso giorno attrazioni vicine.",
  },
  {
    title: "Controlla il meteo",
    text: "Sole forte, vento e mare mosso possono influire su attività all'aperto, gite in barca e bagni.",
  },
  {
    title: "Prenota presto le esperienze più richieste",
    text: "Gite in barca, tour guidati e attrazioni famose possono essere molto affollati nei periodi di alta stagione.",
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

function isActivityArticle(
  article: ActivityArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return activityArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getActivityArticles(): Promise<
  ActivityArticle[]
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
    .returns<ActivityArticle[]>();

  if (error) {
    console.error(
      "Could not load things-to-do articles",
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
    .filter(isActivityArticle);
}

export default async function ThingsToDoPage() {
  const activityArticles =
    await getActivityArticles();

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
                Cose da fare
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Cose da fare a Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Città storiche, spiagge, isole, cibo, gite in barca ed esperienze per un soggiorno indimenticabile.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ideas"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Scopri le idee ↓
                </a>

                {activityArticles.length > 0 && (
                  <a
                    href="#activity-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Leggi le guide sulle attività
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Cose da fare durante un viaggio a Malta"
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
            Organizza le giornate
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Alterna visite e relax al mare.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Malta dà il meglio quando abbini zone storiche, soste sulla costa e gite sulle isole, invece di fare sempre lo stesso tipo di giornata.
          </p>
        </div>
      </section>

      <section
        id="ideas"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Esperienze a Malta
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Inizia da queste idee.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Usale come base per il tuo itinerario e combinale in base ai tuoi interessi e al tempo a disposizione.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {activityIdeas.map((idea) => (
              <Link
                key={idea.number}
                href={idea.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {idea.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {idea.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {idea.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Leggi la guida completa →
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
              Organizzare il viaggio
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Rendi più semplice il tuo itinerario.
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

      {activityArticles.length > 0 && (
        <section
          id="activity-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Guide sulle attività pubblicate
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Altre idee su cosa fare a Malta.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli turistici approvati su attività, attrazioni, visite ed esperienze vengono collegati qui automaticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {activityArticles.length}{" "}
                {activityArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activityArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
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
            Scopri Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Completa il resto del viaggio.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/beaches"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Spiagge →
            </Link>

            <Link
              href="/visit-malta/valletta"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              La Valletta
            </Link>

            <Link
              href="/visit-malta/gozo"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Gozo
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