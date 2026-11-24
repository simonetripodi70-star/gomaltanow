import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Single Permit und Arbeitserlaubnis in Malta | GoMaltaNow",
  description:
    "Die wichtigsten Schritte, Dokumente und praktischen Punkte für den Umzug nach Malta zur Arbeitsaufnahme als Drittstaatsangehöriger.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen/single-permit",
    languages: {"en": "/move-to-malta/non-eu-citizen/single-permit", "it": "/it/move-to-malta/non-eu-citizen/single-permit", "pl": "/pl/move-to-malta/non-eu-citizen/single-permit", "fr": "/fr/move-to-malta/non-eu-citizen/single-permit", "de": "/de/move-to-malta/non-eu-citizen/single-permit", "es": "/es/move-to-malta/non-eu-citizen/single-permit", "uk": "/uk/move-to-malta/non-eu-citizen/single-permit", "x-default": "/move-to-malta/non-eu-citizen/single-permit"},
  },
};


export const dynamic = "force-dynamic";

type PermitArticle = {
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

const permitArticleKeys = [
  "single-permit",
  "work-permit",
  "employment-permit",
  "permit",
  "work-authorisation",
  "work-authorization",
  "employment",
  "identita",
];

const processSteps = [
  {
    number: "01",
    title: "Eine berechtigte Beschäftigung sichern",
    text: "Für viele Drittstaatsangehörige ist das Beschäftigungsverhältnis ein wesentlicher Bestandteil des Genehmigungsverfahrens. Klären Sie die für Ihre Stelle und Ihren Arbeitgeber geltenden Bedingungen, bevor Sie Umzugspläne machen.",
  },
  {
    number: "02",
    title: "Bereite deine Dokumente vor",
    text: "Halten Sie Ihren Reisepass, Beschäftigungsunterlagen, Qualifikationen und weitere Nachweise gut organisiert. Welche Dokumente genau erforderlich sind, hängt vom Antrag und Ihren Umständen ab.",
  },
  {
    number: "03",
    title: "Den entsprechenden Antrag einreichen",
    text: "Der passende Antrag muss über das offizielle Verfahren eingereicht werden. Befolgen Sie die Anweisungen der zuständigen maltesischen Behörden und Ihres Arbeitgebers.",
  },
  {
    number: "04",
    title: "Den Antrag verfolgen",
    text: "Reagieren Sie umgehend, wenn zusätzliche Dokumente oder Informationen angefordert werden. Bewahren Sie Kopien aller eingereichten Unterlagen und jeder offiziellen Korrespondenz auf, die Sie erhalten.",
  },
  {
    number: "05",
    title: "Die weiteren Formalitäten erledigen",
    text: "Nach der Genehmigung können vor oder nach Beginn Ihres Aufenthalts in Malta weitere Schritte erforderlich sein. Beachten Sie die in Ihren offiziellen Dokumenten genannten Bedingungen und Fristen.",
  },
];

const preparationChecklist = [
  "Valid passport",
  "Employment offer or employment documentation",
  "Qualifications or certificates where relevant",
  "Proof of accommodation where required",
  "Insurance or healthcare documentation where applicable",
  "Passport photographs or biometric requirements where requested",
  "Copies of all submitted forms and supporting documents",
  "Employer contact details and application references",
];

const importantPoints = [
  {
    title: "Ihre Genehmigung ist auf Ihre Situation zugeschnitten",
    text: "Der richtige Weg hängt von Faktoren wie Ihrer Staatsangehörigkeit, Beschäftigung, Art der Arbeit und persönlichen Umständen ab.",
  },
  {
    title: "Verlassen Sie sich nicht auf veraltete Checklisten",
    text: "Formulare, Nachweise, Gebühren und Verfahren können sich ändern. Vergleichen Sie Hinweise stets mit den neuesten offiziellen Anweisungen.",
  },
  {
    title: "Unterlagen aufbewahren",
    text: "Speichern Sie Kopien von Anträgen, Quittungen, E-Mails, Verträgen und offizieller Korrespondenz. Sie können später im Verfahren wichtig sein.",
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

function isPermitArticle(
  article: PermitArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return permitArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getPermitArticles(): Promise<
  PermitArticle[]
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
    .returns<PermitArticle[]>();

  if (error) {
    console.error(
      "Could not load Single Permit articles",
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
    .filter(isPermitArticle);
}

export default async function SinglePermitPage() {
  const permitArticles =
    await localizeArticles(await getPermitArticles(), "de");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      {/* Navbar */}
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

      {/* Hero */}
      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Beschäftigung & Einwanderung
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Single Permit & Arbeitserlaubnis in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Verstehen Sie die wichtigsten Schritte, Dokumente und praktischen Punkte, die beim Umzug nach Malta zur Arbeitsaufnahme als Drittstaatsangehöriger relevant sind.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Prozess ansehen ↓
                </a>

                {permitArticles.length > 0 && (
                  <a
                    href="#permit-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leitfäden zu Genehmigungen lesen
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Für die Arbeit nach Malta ziehen"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/single-permit" lang="de" />

      {/* Intro */}
      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Bevor Sie beginnen
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Gehen Sie von Ihrer Beschäftigungssituation aus.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Einwanderungs- und Beschäftigungsverfahren für Drittstaatsangehörige hängen vom jeweiligen Einzelfall ab. Nutzen Sie diese Seite als praktischen Leitfaden und prüfen Sie die endgültigen Anforderungen stets bei den zuständigen maltesischen Behörden.
          </p>
        </div>
      </section>

      {/* Process */}
      <section
        id="process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Schritt für Schritt
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Ein praktischer Überblick über den Ablauf.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Die genaue Reihenfolge und die Anforderungen können variieren, aber dies sind die wichtigsten Bereiche, mit denen Sie voraussichtlich zu tun haben werden.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {processSteps.map((step) => (
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

      {/* Articles */}
      {permitArticles.length > 0 && (
        <section
          id="permit-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Veröffentlichte Leitfäden
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artikel zum Single Permit und zur Arbeitserlaubnis.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neu genehmigte Artikel zu Genehmigungen und Beschäftigung werden automatisch mit dieser Seite verknüpft.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {permitArticles.length}{" "}
                {permitArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {permitArticles.map(
                (article) => (
                  <Link
                    key={article.id}
                    href={`/de/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#C9DCCF] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="flex flex-wrap gap-2">
                      <MetadataBadge
                        value={
                          article.category
                        }
                      />

                      <MetadataBadge
                        value={
                          article.audience
                        }
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
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Checklist */}
      <section className="bg-[#315846] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Checkliste zur Vorbereitung
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Halten Sie Ihre Unterlagen gut organisiert.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Dies ist eine Vorbereitungsliste und keine endgültige Checkliste für den Antrag. Bestätigen Sie die aktuellen Anforderungen, bevor Sie etwas einreichen.
            </p>
          </div>

          <div className="space-y-4">
            {preparationChecklist.map(
              (item) => (
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
              ),
            )}
          </div>
        </div>
      </section>

      {/* Important points */}
      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Wichtige Punkte
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Vermeiden Sie vermeidbare Probleme.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {importantPoints.map(
              (item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
                >
                  <h3 className="font-serif text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#625D57]">
                    {item.text}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
            Setzen Sie Ihren Umzug fort
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Fahren Sie mit den weiteren Leitfäden für Nicht-EU-Bürger fort.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/de/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Einen Job finden →
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Wohnung finden
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Aufenthalt und Dokumente
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Einwanderungsbestimmungen, Antragsverfahren und erforderliche Dokumente können sich ändern. GoMaltaNow bietet allgemeine praktische Informationen und ersetzt weder offizielle Hinweise noch professionelle Einwanderungsberatung.
          </p>
        </div>
      </section>

      {/* Footer */}
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