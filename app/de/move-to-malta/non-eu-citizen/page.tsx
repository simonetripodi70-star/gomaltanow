import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Als Nicht-EU-Bürger nach Malta ziehen | GoMaltaNow",
  description:
    "Praktische Ratgeber für Nicht-EU-Bürger, die nach Malta ziehen: Genehmigungen, Arbeit, Aufenthalt, Wohnen, Gesundheit und Alltag.",
  alternates: {
    canonical: "/de/move-to-malta/non-eu-citizen",
    languages: {"en": "/move-to-malta/non-eu-citizen", "it": "/it/move-to-malta/non-eu-citizen", "pl": "/pl/move-to-malta/non-eu-citizen", "fr": "/fr/move-to-malta/non-eu-citizen", "de": "/de/move-to-malta/non-eu-citizen", "es": "/es/move-to-malta/non-eu-citizen", "uk": "/uk/move-to-malta/non-eu-citizen", "x-default": "/move-to-malta/non-eu-citizen"},
  },
};


export const dynamic = "force-dynamic";

type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  published_at: string | null;
};

const guides = [
  {
    title: "Vor dem Umzug",
    description:
      "Bereite Dokumente, Finanzen und praktische Dinge vor, die du vor dem Umzug nach Malta brauchen könntest.",
    href: "/move-to-malta/non-eu-citizen/before-you-move",
    label: "Vorbereitung",
    number: "01",
    articleKeys: [
      "before-you-move",
      "preparation",
      "moving",
      "relocation",
    ],
  },
  {
    title: "Single Permit und Arbeitserlaubnis",
    description:
      "Verstehe das wichtigste Verfahren für Arbeits- und Aufenthaltsgenehmigungen von Drittstaatsangehörigen auf Malta.",
    href: "/move-to-malta/non-eu-citizen/single-permit",
    label: "Genehmigungen",
    number: "02",
    articleKeys: [
      "single-permit",
      "work-permit",
      "permit",
      "employment-permit",
    ],
  },
  {
    title: "Job finden",
    description:
      "Wo du Arbeit suchst, wie Einstellungen ablaufen und worauf du achten musst, wenn ein Arbeitgeber deine Genehmigung beantragt.",
    href: "/move-to-malta/non-eu-citizen/find-a-job",
    label: "Arbeit",
    number: "03",
    articleKeys: [
      "jobs",
      "job",
      "work",
      "employment",
      "career",
      "recruitment",
    ],
  },
  {
    title: "Wohnung finden",
    description:
      "Mieten, Kautionen, Verträge und die praktischen Schritte zur Wohnungssuche auf Malta.",
    href: "/move-to-malta/non-eu-citizen/find-a-home",
    label: "Wohnen",
    number: "04",
    articleKeys: [
      "housing",
      "home",
      "rent",
      "renting",
      "rental",
      "accommodation",
    ],
  },
  {
    title: "Aufenthalt und Dokumente",
    description:
      "Behalte Aufenthaltsdokumente, Identitätsnachweise und Behördengänge nach der Ankunft im Blick.",
    href: "/move-to-malta/non-eu-citizen/residence",
    label: "Aufenthalt",
    number: "05",
    articleKeys: [
      "residence",
      "residency",
      "documents",
      "identity",
      "identita",
    ],
  },
  {
    title: "Gesundheit",
    description:
      "Wie Zugang zur Gesundheitsversorgung, Versicherung und medizinische Dienste für Nicht-EU-Bürger auf Malta funktionieren.",
    href: "/move-to-malta/non-eu-citizen/healthcare",
    label: "Gesundheit",
    number: "06",
    articleKeys: [
      "healthcare",
      "health",
      "medical",
      "insurance",
      "hospital",
      "pharmacy",
    ],
  },
  {
    title: "Banken und Zahlungen",
    description:
      "Banken, Karten, Gehalt, Überweisungen und praktische Wege, dein Geld auf Malta zu verwalten.",
    href: "/move-to-malta/non-eu-citizen/banking-payments",
    label: "Finanzen",
    number: "07",
    articleKeys: [
      "banking-payments",
      "banking",
      "payments",
      "finance",
      "revolut",
    ],
  },
];

function getSupabasePublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
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

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function articleBelongsToGuide(
  article: Article,
  keys: string[],
) {
  const values = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalize);

  return keys.some((key) => {
    const normalizedKey = normalize(key);

    return values.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getArticles(): Promise<Article[]> {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id,title,slug,summary,category,audience,section_slug,published_at",
    )
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    })
    .limit(100)
    .returns<Article[]>();

  if (error) {
    console.error(
      "Could not load non-EU articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter((article) => {
    const audience = normalize(article.audience);

    return (
      audience === "non-eu-citizen" ||
      audience === "general" ||
      audience === ""
    );
  });
}

export default async function NonEuCitizenPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-[#F4EFE8] text-[#171717]">
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
            href="/de/move-to-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Zurück zu den Umzugsoptionen
          </Link>
        </div>
      </nav>

      <section className="bg-[#F7F1EA]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Drittstaatsangehörige
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Als Nicht-EU-Bürger nach Malta ziehen.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Praktische Ratgeber zu Genehmigungen, Arbeit, Aufenthalt, Wohnen, Gesundheit und Alltag auf Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#guides"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Ratgeber ansehen ↓
                </a>

                <Link
                  href="/de/move-to-malta/eu-citizen"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Ich bin EU-Bürger
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Traditionelle maltesische Architektur"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section
        id="guides"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Ratgeber für Nicht-EU-Bürger
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Starte mit dem Schritt, der auf dich zutrifft.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Die Anforderungen für Drittstaatsangehörige hängen von Arbeit, Nationalität, Art der Genehmigung und persönlicher Situation ab. Diese Ratgeber erklären das Verfahren Schritt für Schritt.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide) => {
              const relatedArticles =
                articles.filter((article) =>
                  articleBelongsToGuide(
                    article,
                    guide.articleKeys,
                  ),
                );

              return (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="group relative overflow-hidden rounded-3xl border border-[#D5DDD7] bg-[#F4F7F5] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#315846]/40 hover:shadow-xl md:p-8"
                >
                  <div className="absolute -bottom-7 -right-2 font-serif text-[110px] text-[#315846]/5">
                    {guide.number}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#315846]">
                        {guide.label}
                      </span>

                      <span className="text-3xl text-[#315846] transition group-hover:translate-x-2">
                        →
                      </span>
                    </div>

                    <h3 className="mt-6 font-serif text-3xl font-medium md:text-4xl">
                      {guide.title}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#625D57]">
                      {guide.description}
                    </p>

                    {relatedArticles.length > 0 && (
                      <p className="mt-6 text-sm font-bold text-[#315846]">
                        {relatedArticles.length}{" "}
                        {relatedArticles.length === 1
                          ? "published article"
                          : "published articles"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      {articles.length > 0 && (
        <section className="bg-[#E8F0EA] py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Aktuelle Informationen
              </p>

              <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                Neueste Artikel für Nicht-EU-Bürger.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles
                .slice(0, 6)
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#C9DCCF] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#E8F0EA] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#315846]">
                        {article.category.replaceAll(
                          "-",
                          " ",
                        )}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#315846]">
                      {article.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                      {article.summary}
                    </p>

                    <span className="mt-7 inline-flex font-bold text-[#315846]">
                      Artikel lesen →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Wichtig
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Einwanderungsregeln können sich ändern.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-white/75">
            GoMaltaNow bietet praktische Orientierung, aber die Anforderungen hängen von deiner Situation ab. Prüfe die endgültigen Anforderungen immer bei der zuständigen maltesischen Behörde, bevor du einen Antrag stellst.
          </p>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

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