import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Aufenthaltsgenehmigungen in Malta für Nicht-EU-Bürger | GoMaltaNow",
  description:
    "Behalten Sie während Ihres Lebens in Malta Genehmigungen, Ausweisdokumente, Aufenthaltskarten, Verlängerungen und Verwaltungsunterlagen im Blick.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen/residence",
    languages: {"en": "/move-to-malta/non-eu-citizen/residence", "it": "/it/move-to-malta/non-eu-citizen/residence", "pl": "/pl/move-to-malta/non-eu-citizen/residence", "fr": "/fr/move-to-malta/non-eu-citizen/residence", "de": "/de/move-to-malta/non-eu-citizen/residence", "es": "/es/move-to-malta/non-eu-citizen/residence", "uk": "/uk/move-to-malta/non-eu-citizen/residence", "x-default": "/move-to-malta/non-eu-citizen/residence"},
  },
};


export const dynamic = "force-dynamic";

type ResidenceArticle = {
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

const residenceArticleKeys = [
  "residence",
  "residency",
  "residence-permit",
  "permit-renewal",
  "renewal",
  "documents",
  "identity",
  "identita",
  "card",
  "residence-card",
  "biometrics",
];

const residenceSteps = [
  {
    number: "01",
    title: "Verstehen Sie Ihren Aufenthaltsstatus",
    text: "Ihre Aufenthaltssituation hängt von der Genehmigung oder dem Einwanderungsweg ab, der für Sie gilt. Machen Sie sich von Anfang an mit den Bedingungen Ihrer Genehmigung vertraut.",
  },
  {
    number: "02",
    title: "Bereiten Sie die erforderlichen Unterlagen vor",
    text: "Halten Sie Ihren Reisepass, Genehmigungsunterlagen, Beschäftigungsnachweise, Angaben zur Unterkunft und alle weiteren Nachweise geordnet und aktuell.",
  },
  {
    number: "03",
    title: "Erledigen Sie die Identitätsformalitäten",
    text: "Möglicherweise müssen Sie im Rahmen des Verfahrens biometrische Formalitäten, Identitätsformalitäten oder Formalitäten für die Aufenthaltskarte erledigen. Folgen Sie den Anweisungen der zuständigen maltesischen Behörde.",
  },
  {
    number: "04",
    title: "Behalten Sie Fristen im Blick",
    text: "Aufenthaltsdokumente und Genehmigungen können Ablaufdaten haben. Notieren Sie Fristen, damit Verlängerungen und Nachweise rechtzeitig vorbereitet werden können.",
  },
  {
    number: "05",
    title: "Melden Sie Änderungen, wenn erforderlich",
    text: "Änderungen bei Beschäftigung, Adresse, Passdaten oder persönlichen Umständen müssen möglicherweise gemeldet werden. Prüfen Sie die Bedingungen, die für Ihre Genehmigung gelten.",
  },
];

const checklist = [
  "Valid passport",
  "Current residence or permit documents",
  "Employment documentation where relevant",
  "Proof of accommodation",
  "Copies of rental or housing documents",
  "Insurance or healthcare documents where required",
  "Application receipts and reference numbers",
  "Copies of official correspondence",
];

const importantPoints = [
  {
    title: "Prüfen Sie das Ablaufdatum",
    text: "Warten Sie nicht bis zum letzten Moment, um das Ablaufdatum Ihrer Genehmigung oder Aufenthaltskarte zu prüfen. Einige Verlängerungsverfahren erfordern eine frühzeitige Vorbereitung.",
  },
  {
    title: "Halten Sie Ihre Adressdaten aktuell",
    text: "Ihre Angaben zur Unterkunft können für administrative Verfahren relevant sein. Bewahren Sie daher Ihre Mietunterlagen auf und prüfen Sie, ob Adressänderungen gemeldet werden müssen.",
  },
  {
    title: "Bewahren Sie digitale Kopien auf",
    text: "Speichern Sie gut lesbare digitale Kopien von Reisepässen, Genehmigungen, Verträgen, Belegen und offiziellen Schreiben, damit Sie bei Bedarf darauf zugreifen können.",
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

function isResidenceArticle(
  article: ResidenceArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return residenceArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getResidenceArticles(): Promise<
  ResidenceArticle[]
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
    .returns<ResidenceArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU residence articles",
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
    .filter(isResidenceArticle);
}

export default async function ResidencePage() {
  const residenceArticles =
    await localizeArticles(await getResidenceArticles(), "de");

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
                Aufenthalt und Dokumente
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Verwalten Sie Ihre Aufenthaltsdokumente in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Behalten Sie Genehmigungen, Ausweisdokumente, Aufenthaltskarten, Verlängerungen und die Verwaltungsunterlagen im Blick, die mit dem Leben in Malta verbunden sind.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#residence-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Prozess ansehen ↓
                </a>

                {residenceArticles.length > 0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Aufenthaltsratgeber lesen
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Aufenthalts- und Ausweisdokumente in Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/residence" lang="de" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Bleiben Sie organisiert
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Aufenthaltsdokumente erfordern fortlaufende Aufmerksamkeit.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Ihre administrativen Pflichten enden nicht unbedingt, sobald eine Genehmigung erteilt wurde. Behalten Sie Ablaufdaten, Änderungen Ihrer Situation und Dokumente im Blick, die möglicherweise aktualisiert werden müssen.
          </p>
        </div>
      </section>

      <section
        id="residence-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Aufenthaltsverwaltung
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Behalten Sie Ihren Aufenthaltsstatus unter Kontrolle.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Nutzen Sie diese Schritte als praktischen Rahmen, um Ihre Dokumente und administrativen Pflichten zu organisieren.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {residenceSteps.map((step) => (
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
              Wichtige Gewohnheiten
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Vermeiden Sie vermeidbare administrative Probleme.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {importantPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {point.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {point.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {residenceArticles.length > 0 && (
        <section
          id="residence-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Veröffentlichte Leitfäden zum Aufenthalt
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artikel zu Aufenthalt und Dokumenten für Nicht-EU-Bürger.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neue veröffentlichte Artikel zu Aufenthalt, Genehmigungen, Ausweisdokumenten und Verlängerungen werden hier automatisch verknüpft.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {residenceArticles.length}{" "}
                {residenceArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {residenceArticles.map((article) => (
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
              Dokumenten-Checkliste
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Bewahren Sie Ihre wichtigsten Unterlagen zusammen auf.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Dies ist eine praktische Organisations-Checkliste. Welche Dokumente genau erforderlich sind, hängt von Ihrem Aufenthaltsweg und Ihrer persönlichen Situation ab.
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
            Weiter zu den nächsten praktischen Ratgebern.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/de/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Gesundheitsversorgung →
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Wohnung finden
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Single Permit
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Anforderungen an Aufenthalt, Einwanderung und Identität können sich ändern. GoMaltaNow bietet allgemeine praktische Informationen und ersetzt keine offiziellen Hinweise oder professionelle Einwanderungsberatung.
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