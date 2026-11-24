import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Trovare casa a Malta per cittadini non UE | GoMaltaNow",
  description:
    "Come affrontare affitti, depositi, contratti e documenti relativi all'alloggio quando ti trasferisci a Malta come cittadino non UE.",
  alternates: {
    canonical: "/it/move-to-malta/non-eu-citizen/find-a-home",
    languages: {"en": "/move-to-malta/non-eu-citizen/find-a-home", "it": "/it/move-to-malta/non-eu-citizen/find-a-home", "pl": "/pl/move-to-malta/non-eu-citizen/find-a-home", "fr": "/fr/move-to-malta/non-eu-citizen/find-a-home", "de": "/de/move-to-malta/non-eu-citizen/find-a-home", "es": "/es/move-to-malta/non-eu-citizen/find-a-home", "uk": "/uk/move-to-malta/non-eu-citizen/find-a-home", "x-default": "/move-to-malta/non-eu-citizen/find-a-home"},
  },
};


export const dynamic = "force-dynamic";

type HousingArticle = {
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

const housingArticleKeys = [
  "housing",
  "home",
  "rent",
  "renting",
  "rental",
  "accommodation",
  "property",
  "landlord",
  "tenant",
  "lease",
  "housing-authority",
];

const housingSteps = [
  {
    number: "01",
    title: "Scegli la zona giusta",
    text: "Confronta i tempi di spostamento, i trasporti pubblici, i negozi, i servizi e i livelli degli affitti prima di decidere dove vivere.",
  },
  {
    number: "02",
    title: "Stabilisci un budget realistico",
    text: "Considera l'affitto mensile, il deposito, le utenze e i costi iniziali che potrebbero essere richiesti quando ti trasferisci in un immobile.",
  },
  {
    number: "03",
    title: "Esamina attentamente l'immobile",
    text: "Controlla le condizioni dell'immobile, dei mobili, degli elettrodomestici e qualsiasi problema prima di accettare di affittarlo.",
  },
  {
    number: "04",
    title: "Esamina il contratto di locazione",
    text: "Leggi attentamente il contratto di locazione e comprendi l'affitto, il deposito, la durata, le regole di preavviso e le responsabilità prima di firmare.",
  },
  {
    number: "05",
    title: "Conserva i documenti relativi al tuo alloggio",
    text: "Salva copie del contratto firmato, delle registrazioni dei pagamenti, dell'inventario e di qualsiasi registrazione o corrispondenza pertinente.",
  },
];

const checklist = [
  "Valid passport or identification",
  "Proof of income or employment where requested",
  "Money available for rent and deposit",
  "Written rental agreement",
  "Inventory or condition report where available",
  "Copies of rent and deposit payments",
  "Landlord or agent contact details",
  "Copies of housing registration documents where applicable",
];

const housingTips = [
  {
    title: "Non affrettarti mai a versare un deposito",
    text: "Prima di trasferire denaro, verifica l'immobile, la persona con cui hai a che fare e i termini del contratto di locazione.",
  },
  {
    title: "Comprendi cosa è incluso",
    text: "Verifica se utenze, internet, spese delle aree comuni o altri oneri sono inclusi nell'affitto pubblicizzato.",
  },
  {
    title: "Metti tutto per iscritto",
    text: "Gli accordi importanti su affitto, riparazioni, depositi e periodi di preavviso dovrebbero essere documentati, anziché basarsi solo su promesse verbali.",
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

function isHousingArticle(
  article: HousingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return housingArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getHousingArticles(): Promise<
  HousingArticle[]
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
    .returns<HousingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU housing articles",
      error,
    );

    return [];
  }

  return (data ?? [])
    .filter((article) => {
      const audience =
        normalizeValue(article.audience);

      return (
        audience === "non-eu-citizen" ||
        audience === "general" ||
        audience === ""
      );
    })
    .filter(isHousingArticle);
}

export default async function FindAHomePage() {
  const housingArticles =
    await localizeArticles(await getHousingArticles(), "it");

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
            href="/it/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Torna alle guide per cittadini extra-UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Alloggio a Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Trova casa a Malta come cittadino non UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Scopri come affrontare affitti, depositi, contratti e documenti relativi all&apos;alloggio quando ti trasferisci a Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#housing-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Inizia dalle basi ↓
                </a>

                {housingArticles.length > 0 && (
                  <a
                    href="#housing-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leggi le guide sull&apos;alloggio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Trovare casa a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/find-a-home" lang="it" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Prima di firmare qualsiasi cosa
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Assicurati che l&apos;accordo di locazione sia chiaro.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            I tuoi documenti relativi all&apos;alloggio possono essere importanti per la vita quotidiana e le procedure amministrative a Malta, quindi conserva copie accurate del contratto e dei pagamenti.
          </p>
        </div>
      </section>

      <section
        id="housing-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Affittare passo dopo passo
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Affronta con attenzione la ricerca di un alloggio.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Prendere alcune precauzioni prima di firmare può aiutare a prevenire problemi costosi in seguito.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {housingSteps.map((step) => (
              <article
                key={step.number}
                className="relative overflow-hidden rounded-3xl border border-[#D5DDD7] bg-[#F4F7F5] p-7 md:p-8"
              >
                <span className="font-serif text-5xl text-[#315846]/20">
                  {step.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Consigli pratici
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Proteggiti durante il processo di affitto.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {housingTips.map((tip) => (
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

      {housingArticles.length > 0 && (
        <section
          id="housing-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guide sull&apos;alloggio pubblicate
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articoli su affitti e alloggi per cittadini non UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli approvati relativi a alloggio, affitti, locazioni e sistemazioni vengono collegati qui automaticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {housingArticles.length}{" "}
                {housingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {housingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/it/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#C9DCCF] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#315846]">
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

                    <span className="inline-flex font-bold text-[#315846]">
                      Leggi l&apos;articolo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#315846] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Checklist per l&apos;affitto
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Tieni in ordine i documenti relativi al tuo alloggio.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Conserva il contratto, le registrazioni dei pagamenti e la corrispondenza pertinente fin dall&apos;inizio della locazione.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#315846]">
                  ✓
                </span>

                <p className="leading-relaxed text-white/90">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
            Continua il tuo trasferimento
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            L&apos;alloggio è solo una parte dell&apos;insediamento a Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Residenza e documenti →
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trovare lavoro
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Le regole sugli affitti, i requisiti di registrazione e le procedure amministrative possono cambiare. GoMaltaNow fornisce informazioni pratiche generali e non sostituisce le indicazioni ufficiali o la consulenza legale.
          </p>
        </div>
      </section>

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
    <span className="rounded-full bg-[#E8F0EA] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#315846]">
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