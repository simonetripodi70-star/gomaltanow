import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Einen Job in Malta für Nicht-EU-Bürger finden | GoMaltaNow",
  description:
    "Wie Sie Ihre Jobsuche angehen, Ihre Bewerbungen vorbereiten und den Beschäftigungsprozess in Malta als Nicht-EU-Bürger verstehen.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen/find-a-job",
    languages: {"en": "/move-to-malta/non-eu-citizen/find-a-job", "it": "/it/move-to-malta/non-eu-citizen/find-a-job", "pl": "/pl/move-to-malta/non-eu-citizen/find-a-job", "fr": "/fr/move-to-malta/non-eu-citizen/find-a-job", "de": "/de/move-to-malta/non-eu-citizen/find-a-job", "es": "/es/move-to-malta/non-eu-citizen/find-a-job", "uk": "/uk/move-to-malta/non-eu-citizen/find-a-job", "x-default": "/move-to-malta/non-eu-citizen/find-a-job"},
  },
};


export const dynamic = "force-dynamic";

type JobArticle = {
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

const jobArticleKeys = [
  "jobs",
  "job",
  "work",
  "employment",
  "career",
  "recruitment",
  "jobsplus",
  "eures",
  "sponsorship",
  "employer",
  "hiring",
];

const jobSteps = [
  {
    number: "01",
    title: "Geeignete Arbeitgeber gezielt ansprechen",
    text: "Konzentrieren Sie sich auf Arbeitgeber und Stellen, die für Drittstaatsangehörige realistisch offen sind, und klären Sie, ob ein Sponsoring für die Genehmigung erforderlich sein könnte.",
  },
  {
    number: "02",
    title: "Einen überzeugenden Lebenslauf vorbereiten",
    text: "Halten Sie Ihren Lebenslauf klar und prägnant, heben Sie relevante Erfahrungen und Qualifikationen hervor und passen Sie ihn an die Stelle an, auf die Sie sich bewerben.",
  },
  {
    number: "03",
    title: "Über zuverlässige Kanäle suchen",
    text: "Nutzen Sie seriöse Jobportale, Personalvermittlungen, Karriereseiten von Unternehmen und offizielle Beschäftigungsangebote, wenn Sie in Malta nach offenen Stellen suchen.",
  },
  {
    number: "04",
    title: "Zuständigkeiten für die Genehmigung klären",
    text: "Stellen Sie vor der Annahme einer Stelle sicher, dass Sie wissen, wer den Beschäftigungs- und Genehmigungsprozess übernimmt und welche Unterlagen Sie vorlegen müssen.",
  },
  {
    number: "05",
    title: "Das Stellenangebot prüfen",
    text: "Prüfen Sie Gehalt, Arbeitszeiten, Probezeit, Aufgaben, Standort und alle weiteren wichtigen Arbeitsbedingungen, bevor Sie sich verpflichten.",
  },
];

const checklist = [
  "Updated CV in English",
  "Valid passport",
  "Copies of qualifications and certificates",
  "Employment references where available",
  "Clear understanding of your permit situation",
  "Professional email address and Maltese contact number when possible",
  "Copies of job offers and employment correspondence",
  "Information about the employer before accepting a position",
];

const searchChannels = [
  {
    title: "Karriereseiten von Unternehmen",
    text: "Bewerben Sie sich direkt bei Arbeitgebern, die aktiv Stellen besetzen, die zu Ihrer Erfahrung passen.",
  },
  {
    title: "Personalvermittlungen",
    text: "Personalvermittler können dabei helfen, Bewerber mit Arbeitgebern zusammenzubringen, insbesondere in Branchen, in denen regelmäßig international eingestellt wird.",
  },
  {
    title: "Jobplattformen",
    text: "Nutzen Sie etablierte Jobwebsites und halten Sie Benachrichtigungen für neue Stellenangebote aktiv, die zu Ihren Fähigkeiten passen.",
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

function isJobArticle(
  article: JobArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return jobArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getJobArticles(): Promise<
  JobArticle[]
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
    .returns<JobArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU job articles",
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
    .filter(isJobArticle);
}

export default async function FindAJobPage() {
  const jobArticles =
    await localizeArticles(await getJobArticles(), "de");

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
                Beschäftigung in Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Finden Sie als Nicht-EU-Bürger einen Job in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Erfahren Sie, wie Sie Ihre Jobsuche angehen, Ihre Bewerbungen vorbereiten und den Beschäftigungsprozess verstehen, bevor Sie eine Stelle annehmen.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#job-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Starten Sie Ihre Jobsuche ↓
                </a>

                <Link
                  href="/de/move-to-malta/non-eu-citizen/single-permit"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Leitfaden zur Single Permit
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Arbeit in Malta finden"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/find-a-job" lang="de" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Wichtig für Drittstaatsangehörige
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Beschäftigung und Einwanderung sind oft miteinander verbunden.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Für viele Nicht-EU-Bürger sind das Stellenangebot und der Einwanderungsprozess eng miteinander verknüpft. Klären Sie Ihren rechtlichen Weg, bevor Sie wichtige Entscheidungen für Ihren Umzug treffen.
          </p>
        </div>
      </section>

      <section
        id="job-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Ablauf der Jobsuche
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Gehen Sie Ihre Jobsuche Schritt für Schritt an.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Eine gezielte Suche ist effektiver, als überall dieselbe Bewerbung zu versenden.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {jobSteps.map((step) => (
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
              Wo Sie suchen können
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Nutzen Sie mehr als einen Kanal für die Jobsuche.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {searchChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {channel.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {channel.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {jobArticles.length > 0 && (
        <section
          id="job-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Veröffentlichte Beschäftigungsleitfäden
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artikel zu Jobs und Beschäftigung für Nicht-EU-Bürger.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neue freigegebene Artikel zu Jobs, Beschäftigung, Personalbeschaffung und Sponsoring werden hier automatisch verknüpft.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {jobArticles.length}{" "}
                {jobArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobArticles.map((article) => (
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
              Checkliste für Bewerbungen
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Bereiten Sie sich vor, bevor Sie mit Bewerbungen beginnen.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Eine gute Vorbereitung erleichtert es Ihnen, schnell zu reagieren, wenn ein Arbeitgeber Unterlagen oder zusätzliche Informationen anfordert.
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
            Nächster Schritt
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Job gefunden? Verstehen Sie den Genehmigungsprozess.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-[#625D57]">
            Stellen Sie vor dem Umzug sicher, dass Sie den mit Ihrer Beschäftigung verbundenen Einwanderungsweg verstehen.
          </p>

          <Link
            href="/de/move-to-malta/non-eu-citizen/single-permit"
            className="mt-8 inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
          >
            Zur Single Permit →
          </Link>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Verfahren für Beschäftigung und Einwanderung können sich ändern. GoMaltaNow bietet allgemeine praktische Informationen und ersetzt keine offiziellen Hinweise oder professionelle Einwanderungsberatung.
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