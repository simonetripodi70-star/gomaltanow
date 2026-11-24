import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Ein Zuhause auf Malta finden für Nicht-EU-Bürger | GoMaltaNow",
  description:
    "So gehen Sie als Nicht-EU-Bürger bei einem Umzug nach Malta mit Mieten, Kautionen, Verträgen und Wohnungsunterlagen um.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen/find-a-home",
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
    title: "Wähle die passende Gegend",
    text: "Vergleichen Sie Pendelzeiten, öffentliche Verkehrsmittel, Geschäfte, Dienstleistungen und Mietpreise, bevor Sie entscheiden, wo Sie wohnen möchten.",
  },
  {
    number: "02",
    title: "Legen Sie ein realistisches Budget fest",
    text: "Berücksichtigen Sie die monatliche Miete, die Kaution, Nebenkosten und die anfänglichen Kosten, die beim Einzug in eine Immobilie anfallen können.",
  },
  {
    number: "03",
    title: "Besichtigen Sie die Immobilie sorgfältig",
    text: "Prüfen Sie vor der Zustimmung zur Anmietung den Zustand der Immobilie, der Möbel, Geräte und mögliche Mängel.",
  },
  {
    number: "04",
    title: "Prüfen Sie den Mietvertrag",
    text: "Lesen Sie den Mietvertrag sorgfältig und verstehen Sie Miete, Kaution, Laufzeit, Kündigungsregeln und Verantwortlichkeiten, bevor Sie unterschreiben.",
  },
  {
    number: "05",
    title: "Bewahren Sie Ihre Wohnungsunterlagen auf",
    text: "Speichern Sie Kopien des unterschriebenen Vertrags, Zahlungsnachweise, das Inventar sowie alle relevanten Registrierungen oder Korrespondenzen.",
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
    title: "Überweisen Sie eine Kaution niemals überstürzt",
    text: "Bevor Sie Geld überweisen, bestätigen Sie die Immobilie, die Person, mit der Sie zu tun haben, und die Bedingungen des Mietvertrags.",
  },
  {
    title: "Verstehen Sie, was inbegriffen ist",
    text: "Prüfen Sie, ob Nebenkosten, Internet, Gebühren für Gemeinschaftsbereiche oder andere Kosten in der angegebenen Miete enthalten sind.",
  },
  {
    title: "Halten Sie alles schriftlich fest",
    text: "Wichtige Vereinbarungen zu Miete, Reparaturen, Kautionen und Kündigungsfristen sollten dokumentiert werden, statt sich nur auf mündliche Zusagen zu verlassen.",
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
    await localizeArticles(await getHousingArticles(), "de");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/de"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/de/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Zurück zu den Nicht-EU-Ratgebern
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Wohnen auf Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Finden Sie als Nicht-EU-Bürger ein Zuhause auf Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Erfahren Sie, wie Sie bei einem Umzug nach Malta Mieten, Kautionen, Verträge und Wohnungsunterlagen angehen können.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#housing-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Beginnen Sie mit den Grundlagen ↓
                </a>

                {housingArticles.length > 0 && (
                  <a
                    href="#housing-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Wohnratgeber lesen
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Ein Zuhause auf Malta finden"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/find-a-home" lang="de" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Bevor Sie etwas unterschreiben
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Stellen Sie sicher, dass die Mietvereinbarung klar ist.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Ihre Wohnungsunterlagen können für den Alltag und Verwaltungsverfahren auf Malta wichtig sein. Bewahren Sie daher genaue Kopien Ihrer Vereinbarung und Zahlungen auf.
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
              Mieten Schritt für Schritt
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Gehen Sie bei der Wohnungssuche sorgfältig vor.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Einige Vorsichtsmaßnahmen vor der Unterschrift können später kostspielige Probleme verhindern.
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
              Praktische Tipps
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Schützen Sie sich während des Mietprozesses.
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
                  Veröffentlichte Wohnratgeber
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artikel zum Mieten und Wohnen für Nicht-EU-Bürger.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neue freigegebene Artikel zu Wohnen, Mieten, Mietverträgen und Unterkünften werden hier automatisch verknüpft.
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
                  href={`/de/articles/${article.slug}`}
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
                      Artikel lesen →
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
              Checkliste für die Anmietung
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Halten Sie Ihre Wohnungsunterlagen geordnet.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Bewahren Sie Ihren Vertrag, Zahlungsnachweise und relevante Korrespondenz ab Beginn des Mietverhältnisses auf.
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
            Setzen Sie Ihren Umzug fort
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Wohnen ist nur ein Teil des Ankommens auf Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/de/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Aufenthalt & Dokumente →
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Job finden
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Mietregeln, Registrierungsvorschriften und Verwaltungsverfahren können sich ändern. GoMaltaNow bietet allgemeine praktische Informationen und ersetzt keine offiziellen Hinweise oder Rechtsberatung.
          </p>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/de"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta einfach gemacht.
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

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}