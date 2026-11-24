import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Gesundheitsversorgung in Malta für Nicht-EU-Bürger | GoMaltaNow",
  description:
    "Zugang zur Gesundheitsversorgung, Versicherungen, medizinische Leistungen und die Dokumente, die Sie als Nicht-EU-Bürger während Ihres Lebens in Malta benötigen könnten.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen/healthcare",
    languages: {"en": "/move-to-malta/non-eu-citizen/healthcare", "it": "/it/move-to-malta/non-eu-citizen/healthcare", "pl": "/pl/move-to-malta/non-eu-citizen/healthcare", "fr": "/fr/move-to-malta/non-eu-citizen/healthcare", "de": "/de/move-to-malta/non-eu-citizen/healthcare", "es": "/es/move-to-malta/non-eu-citizen/healthcare", "uk": "/uk/move-to-malta/non-eu-citizen/healthcare", "x-default": "/move-to-malta/non-eu-citizen/healthcare"},
  },
};


export const dynamic = "force-dynamic";

type HealthcareArticle = {
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

const healthcareArticleKeys = [
  "healthcare",
  "health",
  "medical",
  "medicine",
  "insurance",
  "health-insurance",
  "hospital",
  "pharmacy",
  "doctor",
  "clinic",
  "emergency",
];

const healthcareSteps = [
  {
    number: "01",
    title: "Informieren Sie sich über Ihren Anspruch auf Gesundheitsversorgung",
    text: "Ihr Zugang zur Gesundheitsversorgung in Malta kann von Ihrem Aufenthaltsstatus, Ihrer Beschäftigung, Ihrer Versicherung und Ihren persönlichen Umständen abhängen. Klären Sie, was auf Sie zutrifft, bevor Sie sich auf eine bestimmte Form des Versicherungsschutzes verlassen.",
  },
  {
    number: "02",
    title: "Schließen Sie die erforderliche Versicherung ab",
    text: "Für einige Einwanderungs- oder Aufenthaltswege kann ein Nachweis über Krankenversicherungsschutz erforderlich sein. Stellen Sie sicher, dass Ihre Police die für Ihren Fall geltenden Bedingungen erfüllt.",
  },
  {
    number: "03",
    title: "Wissen Sie, wo Sie Hilfe erhalten",
    text: "Informieren Sie sich über den Unterschied zwischen gewöhnlicher medizinischer Versorgung, Apotheken, Gesundheitszentren, Privatkliniken und Notdiensten, damit Sie wissen, wohin Sie gehen können, wenn Sie Hilfe benötigen.",
  },
  {
    number: "04",
    title: "Bewahren Sie Ihre medizinischen Dokumente auf",
    text: "Bewahren Sie Kopien von Versicherungspolicen, Rezepten, medizinischen Berichten, Impfnachweisen und anderen nützlichen Gesundheitsdokumenten auf.",
  },
  {
    number: "05",
    title: "Überprüfen Sie Ihre Situation bei Änderungen",
    text: "Eine Änderung Ihrer Beschäftigung, Ihres Aufenthaltsstatus oder Ihrer Versicherung kann Ihre Gesundheitsversorgung beeinflussen. Überprüfen Sie daher Ihren Versicherungsschutz, wenn sich Ihre Umstände ändern.",
  },
];

const healthcareChecklist = [
  "Passport or identity document",
  "Residence or permit documents where relevant",
  "Health insurance policy or proof of coverage",
  "Employment details where relevant",
  "Important medical records",
  "Current prescriptions",
  "Emergency contact information",
  "Copies of healthcare receipts and correspondence",
];

const healthcareTips = [
  {
    title: "Halten Sie Versicherungsdetails griffbereit",
    text: "Speichern Sie Ihre Policennummer, die Kontaktdaten Ihres Versicherers und Versicherungsunterlagen an einem Ort, auf den Sie schnell zugreifen können.",
  },
  {
    title: "Kennen Sie die nächstgelegenen Angebote",
    text: "Ermitteln Sie Apotheken, Gesundheitszentren, Kliniken und Krankenhäuser in Ihrer Nähe, bevor Sie sie dringend benötigen.",
  },
  {
    title: "Gehen Sie nicht davon aus, dass jede Leistung kostenlos ist",
    text: "Anspruch und Kosten können von Ihrem Status und der in Anspruch genommenen Leistung abhängen. Prüfen Sie daher die für Sie geltenden Bedingungen.",
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

function isHealthcareArticle(
  article: HealthcareArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return healthcareArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getHealthcareArticles(): Promise<
  HealthcareArticle[]
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
    .returns<HealthcareArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU healthcare articles",
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
    .filter(isHealthcareArticle);
}

export default async function HealthcarePage() {
  const healthcareArticles =
    await localizeArticles(await getHealthcareArticles(), "de");

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
                Gesundheitsversorgung in Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Gesundheitsversorgung in Malta für Nicht-EU-Bürger.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Informieren Sie sich über den Zugang zur Gesundheitsversorgung, Versicherungen, medizinische Leistungen und die Dokumente, die Sie während Ihres Lebens in Malta benötigen könnten.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#healthcare-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Die Grundlagen verstehen ↓
                </a>

                {healthcareArticles.length > 0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Gesundheitsratgeber lesen
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Gesundheitsversorgung und medizinische Leistungen in Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/healthcare" lang="de" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Bevor Sie medizinische Versorgung benötigen
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Informieren Sie sich frühzeitig über Ihren Versicherungsschutz.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Der Zugang zur Gesundheitsversorgung für Drittstaatsangehörige kann von der Beschäftigung, dem Aufenthaltsstatus, der Versicherung und der Art der benötigten medizinischen Leistung abhängen.
          </p>
        </div>
      </section>

      <section
        id="healthcare-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Gesundheitsversorgung Schritt für Schritt
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Bereiten Sie Ihre Gesundheitsversorgung vor.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Nutzen Sie diese Schritte, um die wichtigsten Aspekte der Gesundheitsversorgung vor und nach Ihrem Umzug zu organisieren.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {healthcareSteps.map((step) => (
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
              Machen Sie die Gesundheitsversorgung leichter überschaubar.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {healthcareTips.map((tip) => (
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

      {healthcareArticles.length > 0 && (
        <section
          id="healthcare-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Veröffentlichte Gesundheitsratgeber
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artikel zur Gesundheitsversorgung und Versicherung für Nicht-EU-Bürger.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neue freigegebene Artikel zu Gesundheitsversorgung, Versicherungen, Krankenhäusern, Apotheken und medizinischen Leistungen werden hier automatisch verknüpft.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {healthcareArticles.length}{" "}
                {healthcareArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {healthcareArticles.map((article) => (
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
              Checkliste zur Gesundheitsversorgung
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Bewahren Sie Ihre Gesundheitsdokumente zusammen auf.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Welche Dokumente Sie genau benötigen, hängt von Ihrer Situation ab. Wenn Sie diese Unterlagen geordnet aufbewahren, können Gesundheits- und Verwaltungsverfahren jedoch einfacher werden.
            </p>
          </div>

          <div className="space-y-4">
            {healthcareChecklist.map((item) => (
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
            Fahren Sie mit Ihrer praktischen Einrichtung in Malta fort.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/de/move-to-malta/non-eu-citizen/banking-payments"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Bankwesen & Zahlungen →
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Aufenthalt und Dokumente
            </Link>

            <Link
              href="/de/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Wohnung finden
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Anspruch auf Gesundheitsversorgung, Versicherungsanforderungen und Bedingungen für medizinische Leistungen können sich ändern. GoMaltaNow bietet allgemeine praktische Informationen und ersetzt keine offiziellen Hinweise zur Gesundheitsversorgung oder professionelle medizinische Beratung.
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