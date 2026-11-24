import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Zwiedzaj Maltę: przewodnik i atrakcje | GoMaltaNow",
  description:
    "Zaplanuj podróż na Maltę: plaże, zabytkowe miasta, wyspy, transport, jedzenie i praktyczne informacje w jednym miejscu.",
  alternates: {
    canonical: "/pl/visit-malta",
    languages: {"en": "/visit-malta", "it": "/it/visit-malta", "pl": "/pl/visit-malta", "fr": "/fr/visit-malta", "de": "/de/visit-malta", "es": "/es/visit-malta", "uk": "/uk/visit-malta", "x-default": "/visit-malta"},
  },
};


export const dynamic = "force-dynamic";

type TravelArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  published_at: string | null;
};

const travelSections = [
  {
    title: "Plaże",
    description:
      "Odkryj najlepsze plaże, kąpieliska i wybrzeża Malty.",
    href: "/pl/beaches",
    label: "Morze i słońce",
    number: "01",
    articleKeys: [
      "beaches",
      "beach",
      "swimming",
      "coast",
      "sea",
    ],
  },
  {
    title: "Atrakcje",
    description:
      "Znajdź atrakcje, przeżycia i zajęcia na pobyt na Malcie.",
    href: "/pl/visit-malta/things-to-do",
    label: "Atrakcje",
    number: "02",
    articleKeys: [
      "things-to-do",
      "attractions",
      "activities",
      "experiences",
      "sightseeing",
    ],
  },
  {
    title: "Valletta",
    description:
      "Odkryj stolicę Malty: zabytkowe ulice, muzea, punkty widokowe i nabrzeże.",
    href: "/pl/visit-malta/valletta",
    label: "Stolica",
    number: "03",
    articleKeys: [
      "valletta",
      "capital",
    ],
  },
  {
    title: "Mdina i Rabat",
    description:
      "Spaceruj po zabytkowym Cichym Mieście i sąsiednich uliczkach Rabatu.",
    href: "/pl/visit-malta/mdina-rabat",
    label: "Historia",
    number: "04",
    articleKeys: [
      "mdina",
      "rabat",
      "silent-city",
    ],
  },
  {
    title: "Gozo",
    description:
      "Zaplanuj jednodniową wycieczkę lub dłuższy pobyt na spokojnej siostrzanej wyspie Malty.",
    href: "/pl/visit-malta/gozo",
    label: "Wyspa",
    number: "05",
    articleKeys: [
      "gozo",
    ],
  },
  {
    title: "Comino",
    description:
      "Zaplanuj wizytę na Comino, z Błękitną Laguną i okolicznym wybrzeżem.",
    href: "/pl/visit-malta/comino",
    label: "Błękitna Laguna",
    number: "06",
    articleKeys: [
      "comino",
      "blue-lagoon",
    ],
  },
  {
    title: "Transport",
    description:
      "Autobusy, promy, taksówki, aplikacje przewozowe i jak poruszać się po Malcie.",
    href: "/pl/visit-malta/transport",
    label: "Poruszanie się",
    number: "07",
    articleKeys: [
      "transport",
      "buses",
      "bus",
      "ferry",
      "taxi",
      "getting-around",
    ],
  },
  {
    title: "Gdzie spać",
    description:
      "Porównaj okolice i rodzaje noclegów w zależności od rodzaju podróży.",
    href: "/pl/visit-malta/where-to-stay",
    label: "Noclegi",
    number: "08",
    articleKeys: [
      "where-to-stay",
      "hotel",
      "hotels",
      "accommodation",
      "stay",
    ],
  },
  {
    title: "Jedzenie i restauracje",
    description:
      "Odkryj maltańską kuchnię, lokalne dania i przydatne poradniki kulinarne.",
    href: "/pl/visit-malta/food-restaurants",
    label: "Jedzenie",
    number: "09",
    articleKeys: [
      "food",
      "restaurants",
      "restaurant",
      "dining",
      "maltese-food",
    ],
  },
  {
    title: "Praktyczne informacje",
    description:
      "Przydatne informacje o pieniądzach, pogodzie, bezpieczeństwie, internecie mobilnym i codziennej podróży.",
    href: "/pl/visit-malta/practical-info",
    label: "Podstawy",
    number: "10",
    articleKeys: [
      "practical-info",
      "travel-info",
      "travel",
      "weather",
      "money",
      "safety",
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

function normalize(
  value: string | null | undefined,
) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function articleBelongsToSection(
  article: TravelArticle,
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

async function getTravelArticles(): Promise<
  TravelArticle[]
> {
  const supabase =
    getSupabasePublicClient();

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
    .returns<TravelArticle[]>();

  if (error) {
    console.error(
      "Could not load travel articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter((article) => {
    const audience =
      normalize(article.audience);

    return (
      audience === "tourist" ||
      audience === "general" ||
      audience === ""
    );
  });
}

export default async function VisitMaltaPage() {
  const articles =
    await localizeArticles(await getTravelArticles(), "pl");

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
            href="/pl"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Zwiedzaj Maltę
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Wykorzystaj w pełni swoją podróż na Maltę.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Plaże, zabytkowe miasta, wyspy, transport, jedzenie i praktyczne informacje w jednym miejscu.
              </p>

              <a
                href="#travel-guides"
                className="mt-8 inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
              >
                Odkryj Maltę ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Malta – cel podróży"
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
        id="travel-guides"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Przewodniki po Malcie
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Czego szukasz?
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Wybierz kategorię i zacznij planować tę część Malty, która jest dla ciebie najważniejsza.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {travelSections.map((section) => {
              const relatedArticles =
                articles.filter((article) =>
                  articleBelongsToSection(
                    article,
                    section.articleKeys,
                  ),
                );

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#B83F29]/40 hover:shadow-xl md:p-8"
                >
                  <div className="absolute -bottom-7 -right-2 font-serif text-[110px] text-[#B83F29]/5">
                    {section.number}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B83F29]">
                        {section.label}
                      </span>

                      <span className="text-3xl text-[#B83F29] transition group-hover:translate-x-2">
                        →
                      </span>
                    </div>

                    <h3 className="mt-6 font-serif text-3xl font-medium md:text-4xl">
                      {section.title}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#625D57]">
                      {section.description}
                    </p>

                    {relatedArticles.length > 0 && (
                      <p className="mt-6 text-sm font-bold text-[#B83F29]">
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
        <section className="bg-[#F3E6DF] py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Najnowsze artykuły podróżnicze
              </p>

              <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                Nowe pomysły na podróż na Maltę.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles
                .slice(0, 6)
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/pl/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <span className="w-fit rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B83F29]">
                      {article.category.replaceAll(
                        "-",
                        " ",
                      )}
                    </span>

                    <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
                      {article.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                      {article.summary}
                    </p>

                    <span className="mt-7 inline-flex font-bold text-[#B83F29]">
                      Czytaj artykuł →
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
            Planuj mądrzej
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Malta jest mała, ale każda okolica jest inna.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Odrobina planowania pozwala mniej czasu spędzać w drodze, a więcej w miejscach pasujących do twojego wypoczynku.
          </p>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

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