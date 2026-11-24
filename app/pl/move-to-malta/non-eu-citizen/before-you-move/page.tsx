import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Przed przeprowadzką na Maltę: lista kontrolna dla obywateli spoza UE | GoMaltaNow",
  description:
    "Zorganizuj dokumenty, budżet, zakwaterowanie i planowanie imigracyjne przed podróżą na Maltę jako obywatel kraju spoza UE.",
  alternates: {
    canonical: "/pl/move-to-malta/non-eu-citizen/before-you-move",
    languages: {"en": "/move-to-malta/non-eu-citizen/before-you-move", "it": "/it/move-to-malta/non-eu-citizen/before-you-move", "pl": "/pl/move-to-malta/non-eu-citizen/before-you-move", "fr": "/fr/move-to-malta/non-eu-citizen/before-you-move", "de": "/de/move-to-malta/non-eu-citizen/before-you-move", "es": "/es/move-to-malta/non-eu-citizen/before-you-move", "uk": "/uk/move-to-malta/non-eu-citizen/before-you-move", "x-default": "/move-to-malta/non-eu-citizen/before-you-move"},
  },
};


export const dynamic = "force-dynamic";

type MovingArticle = {
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

const movingArticleKeys = [
  "before-you-move",
  "moving",
  "move",
  "relocation",
  "relocating",
  "preparation",
  "prepare",
  "arrival",
  "documents",
  "first-steps",
  "checklist",
  "budget",
];

const preparationSteps = [
  {
    number: "01",
    title: "Poznaj swoją ścieżkę imigracyjną",
    text: "Przed podróżą ustal, która ścieżka pobytu lub zatrudnienia ma zastosowanie w Twoim przypadku oraz jakie warunki musisz spełnić.",
  },
  {
    number: "02",
    title: "Przygotuj dokumenty",
    text: "Przed wyjazdem uporządkuj paszport, dokumentację zatrudnienia, kwalifikacje, informacje o zakwaterowaniu oraz wszelkie dokumenty uzupełniające.",
  },
  {
    number: "03",
    title: "Zaplanuj pierwsze zakwaterowanie",
    text: "Zorganizuj pewne miejsce pobytu na czas załatwiania pierwszych formalności administracyjnych oraz poszukiwania długoterminowego mieszkania, jeśli będzie to potrzebne.",
  },
  {
    number: "04",
    title: "Stwórz realistyczny budżet przeprowadzki",
    text: "Zaplanuj wydatki na czynsz, kaucje, transport, jedzenie, ubezpieczenie, koszty administracyjne i nieprzewidziane wydatki w pierwszych tygodniach na Malcie.",
  },
  {
    number: "05",
    title: "Zachowaj kopie wszystkiego",
    text: "Zapisz cyfrowe i papierowe kopie ważnych dokumentów, wniosków, umów, rachunków i oficjalnej korespondencji.",
  },
];

const checklist = [
  "Valid passport",
  "Employment offer or supporting work documents where relevant",
  "Qualifications and certificates",
  "Temporary accommodation details",
  "Proof of funds where required",
  "Insurance or healthcare documentation",
  "Digital copies of important documents",
  "Emergency contact details",
];

const preparationTips = [
  {
    title: "Nie podróżuj, opierając się na założeniach",
    text: "Potwierdź warunki imigracyjne mające zastosowanie w Twojej sytuacji, zanim podejmiesz nieodwracalne decyzje dotyczące podróży lub zatrudnienia.",
  },
  {
    title: "Starannie zaplanuj budżet na pierwszy miesiąc",
    text: "Początkowe koszty mogą być wyższe niż w zwykłym miesiącu ze względu na kaucje, tymczasowe zakwaterowanie i wydatki związane z organizacją życia.",
  },
  {
    title: "Oddziel oficjalne informacje",
    text: "Korzystaj z GoMaltaNow jako praktycznego przewodnika, ale zawsze potwierdzaj ostateczne wymogi u właściwych maltańskich organów.",
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

function isMovingArticle(
  article: MovingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return movingArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getMovingArticles(): Promise<
  MovingArticle[]
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
    .returns<MovingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU before-you-move articles",
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
    .filter(isMovingArticle);
}

export default async function BeforeYouMovePage() {
  const movingArticles =
    await localizeArticles(await getMovingArticles(), "pl");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
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
            href="/pl/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Powrót do przewodników dla osób spoza UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Przed przeprowadzką
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Przygotuj przeprowadzkę na Maltę jako obywatel kraju spoza UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Zorganizuj dokumenty, budżet, zakwaterowanie i planowanie imigracyjne przed podróżą.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#preparation-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Zacznij przygotowania ↓
                </a>

                {movingArticles.length > 0 && (
                  <a
                    href="#moving-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Przeczytaj przewodniki dotyczące przeprowadzki
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Przygotowanie do przeprowadzki na Maltę"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/before-you-move" lang="pl" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Przed podróżą
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Przygotowanie może zapobiec poważnym problemom w przyszłości.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Wymogi dotyczące imigracji, zatrudnienia i pobytu mogą być ze sobą ściśle powiązane. Upewnij się, że rozumiesz swoją ścieżkę, zanim zorganizujesz resztę przeprowadzki.
          </p>
        </div>
      </section>

      <section
        id="preparation-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Przygotowanie krok po kroku
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Zorganizuj najważniejsze sprawy przed wyjazdem.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Te kroki zapewnią Ci praktyczne ramy do przygotowania przeprowadzki.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {preparationSteps.map((step) => (
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
              Przed wyjazdem
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Trzy kwestie, które warto sprawdzić dwa razy.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {preparationTips.map((tip) => (
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

      {movingArticles.length > 0 && (
        <section
          id="moving-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Opublikowane poradniki dotyczące przeprowadzki
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artykuły o przygotowaniach i przeprowadzce dla obywateli krajów spoza UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Nowe zatwierdzone artykuły dotyczące przygotowań, przeprowadzki, przyjazdu i pierwszych kroków są automatycznie łączone tutaj.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {movingArticles.length}{" "}
                {movingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {movingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/pl/articles/${article.slug}`}
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
                      Czytaj artykuł →
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
              Lista kontrolna przeprowadzki
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Przygotuj najważniejsze dokumenty.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              To ogólna lista przygotowań. Dokładnie wymagane dokumenty zależą od Twojej ścieżki imigracyjnej i osobistej sytuacji.
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
            Następny krok
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Poznaj swoją ścieżkę zatrudnienia i uzyskania zezwolenia.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pl/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Single Permit →
            </Link>

            <Link
              href="/pl/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Znajdź pracę
            </Link>

            <Link
              href="/pl/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Znajdź mieszkanie
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Wymogi dotyczące imigracji, wjazdu, zatrudnienia i pobytu mogą się zmieniać. GoMaltaNow udostępnia ogólne praktyczne informacje i nie zastępuje oficjalnych wytycznych ani profesjonalnej porady imigracyjnej.
          </p>
        </div>
      </section>

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

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}