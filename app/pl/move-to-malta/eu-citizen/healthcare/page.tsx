import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Opieka zdrowotna na Malcie dla obywateli UE | GoMaltaNow",
  description:
    "Uporządkuj dokumenty, poznaj główne możliwości opieki zdrowotnej i zaplanuj, jak będziesz korzystać z codziennej opieki po przeprowadzce na Maltę.",
  alternates: {
    canonical: "/pl/move-to-malta/eu-citizen/healthcare",
    languages: {"en": "/move-to-malta/eu-citizen/healthcare", "it": "/it/move-to-malta/eu-citizen/healthcare", "pl": "/pl/move-to-malta/eu-citizen/healthcare", "fr": "/fr/move-to-malta/eu-citizen/healthcare", "de": "/de/move-to-malta/eu-citizen/healthcare", "es": "/es/move-to-malta/eu-citizen/healthcare", "uk": "/uk/move-to-malta/eu-citizen/healthcare", "x-default": "/move-to-malta/eu-citizen/healthcare"},
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

const essentials = [
  {
    title: "Poznaj swoje możliwości",
    text: "Dowiedz się, czym różni się publiczna i prywatna opieka zdrowotna, oraz zdecyduj, których usług możesz potrzebować najpierw.",
  },
  {
    title: "Przygotuj dokumenty",
    text: "Uporządkuj dokumenty tożsamości, dokumentację medyczną, informacje o ubezpieczeniu oraz wszelkie istotne dokumenty medyczne.",
  },
  {
    title: "Zaplanuj codzienną opiekę",
    text: "Dowiedz się, jak po przeprowadzce skorzystasz z lekarza, apteki, pilnej pomocy medycznej oraz wszelkiego regularnego leczenia.",
  },
];

const checklist = [
  "Valid passport or national identity card",
  "European Health Insurance Card for your first period",
  "Copies of prescriptions and medical records",
  "Details of any private health insurance",
  "A list of regular medicines and treatments",
  "Emergency contact information",
];

const healthTips = [
  "Keep digital copies of important records",
  "Bring enough regular medication for your first weeks",
  "Learn where your nearest pharmacy is",
  "Save local emergency contact details",
  "Check whether specialist care needs a referral",
  "Confirm current eligibility and coverage rules",
];

const healthcareArticleKeys = [
  "healthcare",
  "health",
  "medical",
  "medicine",
  "insurance",
  "ehic",
  "hospital",
  "pharmacy",
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

function normalizeValue(value: string) {
  return value
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
    const normalizedKey = normalizeValue(key);

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
  const supabase = getSupabasePublicClient();

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
      "Could not load healthcare articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isHealthcareArticle,
  );
}

export default async function HealthcarePage() {
  const healthcareArticles =
    await localizeArticles(await getHealthcareArticles(), "pl");

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/pl"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>

            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/pl/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Wróć do przewodników UE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#2E5963]">
                Opieka zdrowotna
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Przygotuj się na opiekę zdrowotną na Malcie.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Uporządkuj dokumenty, poznaj główne możliwości opieki zdrowotnej i zaplanuj, jak będziesz korzystać z codziennej opieki po przeprowadzce.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#2E5963] px-6 py-3 font-semibold text-white transition hover:bg-[#23464E]"
                >
                  Zobacz listę kontrolną ↓
                </a>

                {healthcareArticles.length >
                  0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#2E5963] px-6 py-3 font-semibold text-[#2E5963] transition hover:bg-[#2E5963] hover:text-white"
                  >
                    Przeczytaj artykuły o opiece zdrowotnej
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/healthcare-malta.jpg"
              alt="Opieka zdrowotna i wsparcie medyczne na Malcie"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/healthcare" lang="pl" />

      {/* Published healthcare articles */}
      {healthcareArticles.length > 0 && (
        <section
          id="healthcare-articles"
          className="border-y border-[#C9DCE1] bg-[#E3EDF0] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#2E5963]">
                  Opublikowane przewodniki dotyczące opieki zdrowotnej
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#294B53] md:text-5xl">
                  Szczegółowe artykuły o opiece zdrowotnej na Malcie.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#53656A]">
                  Nowe zatwierdzone artykuły o opiece zdrowotnej są automatycznie dodawane po opublikowaniu.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#2E5963]">
                {healthcareArticles.length}{" "}
                {healthcareArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {healthcareArticles.map(
                (article) => (
                  <Link
                    key={article.id}
                    href={`/pl/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#BDD1D6] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#2E5963]/40 hover:shadow-xl"
                  >
                    <div className="flex flex-wrap gap-2">
                      <MetadataBadge
                        value={article.category}
                      />

                      <MetadataBadge
                        value={article.audience}
                      />
                    </div>

                    <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#2E5963]">
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

                      <span className="inline-flex font-bold text-[#2E5963]">
                        Czytaj artykuł →
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Essentials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Zaplanuj opiekę zdrowotną, zanim jej potrzebujesz.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Wczesne przygotowanie może ułatwić skorzystanie z właściwej usługi, gdy potrzebujesz porady, leczenia lub stałej opieki.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {essentials.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#E7DDD3] bg-[#F9F5F0] p-7"
              >
                <h3 className="font-serif text-3xl">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-[#625D57]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section
        id="checklist"
        className="bg-[#2E5963] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Lista kontrolna opieki zdrowotnej
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Co zorganizować przed przeprowadzką.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Potraktuj to jako praktyczną listę przygotowań i osobno potwierdź aktualne wymogi dotyczące uprawnień, rejestracji lub ubezpieczenia.
            </p>

            {healthcareArticles.length >
              0 && (
              <a
                href="#healthcare-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#2E5963] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Przeczytaj szczegółowe przewodniki
              </a>
            )}
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#2E5963]">
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

      {/* Health tips */}
      <section className="bg-[#E3EDF0] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#2E5963]">
              Codzienne zdrowie
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Niewielkie przygotowania mogą mieć duże znaczenie.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {healthTips.map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-4 rounded-2xl border border-[#BDD1D6] bg-white/75 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E5963] text-sm font-bold text-white">
                  +
                </span>

                <p className="font-semibold text-[#294B53]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2E5963]">
            Ważne
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Korzystaj z oficjalnych i profesjonalnych porad medycznych.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Dostęp do opieki zdrowotnej, uprawnienia i koszty mogą różnić się w zależności od sytuacji osobistej. Ten przewodnik służy ogólnemu przygotowaniu i nie zastępuje porad lekarzy ani oficjalnych organów.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/pl"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>

            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta po prostu.
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
    <span className="rounded-full bg-[#DFECEF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#2E5963]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}