import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Co robić na Malcie: zabytki, plaże i wycieczki | GoMaltaNow",
  description:
    "Zabytkowe miasta, plaże, wyspy, jedzenie, rejsy i przeżycia, które pomogą zaplanować niezapomniany pobyt na Malcie.",
  alternates: {
    canonical: "/pl/visit-malta/things-to-do",
    languages: {"en": "/visit-malta/things-to-do", "it": "/it/visit-malta/things-to-do", "pl": "/pl/visit-malta/things-to-do", "fr": "/fr/visit-malta/things-to-do", "de": "/de/visit-malta/things-to-do", "es": "/es/visit-malta/things-to-do", "uk": "/uk/visit-malta/things-to-do", "x-default": "/visit-malta/things-to-do"},
  },
};


export const dynamic = "force-dynamic";

type ActivityArticle = {
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

const activityArticleKeys = [
  "things-to-do",
  "things-to-do-in-malta",
  "attractions",
  "activities",
  "experiences",
  "sightseeing",
  "what-to-do",
  "day-trip",
  "day-trips",
  "adventure",
  "tour",
  "tours",
];

const activityIdeas = [
  {
    number: "01",
    href: "/pl/visit-malta/valletta",
    title: "Zwiedzaj zabytkowe miasta",
    text: "Spaceruj po Vallettcie, Mdinie i Trzech Miastach, odkrywając architekturę, fortyfikacje i historię Malty.",
  },
  {
    number: "02",
    href: "/pl/beaches",
    title: "Czas nad morzem",
    text: "Idź na plażę, pływaj w czystej wodzie, odkrywaj punkty widokowe na wybrzeżu lub wybierz się w rejs wokół wysp.",
  },
  {
    number: "03",
    href: "/pl/visit-malta/gozo",
    title: "Odwiedź Gozo",
    text: "Wybierz się na jednodniową wycieczkę lub zostań dłużej, by poznać wioski, plaże, krajobrazy i spokojniejszą stronę wysp.",
  },
  {
    number: "04",
    href: "/pl/visit-malta/comino",
    title: "Odkryj Comino",
    text: "Odwiedź Błękitną Lagunę i pobliskie wybrzeże, dobrze planując transport, tłumy i porę roku.",
  },
  {
    number: "05",
    href: "/pl/visit-malta/food-restaurants",
    title: "Spróbuj maltańskiej kuchni",
    text: "Spróbuj lokalnych dań, piekarni, street foodu i restauracji, by poznać inną stronę maltańskiej kultury.",
  },
  {
    number: "06",
    href: "/pl/visit-malta/mdina-rabat/mdina-in-the-evening",
    title: "Malta nocą",
    text: "Ciesz się nabrzeżem, wieczornymi spacerami, restauracjami, barami i życiem nocnym w zależności od rodzaju podróży.",
  },
];

const planningTips = [
  {
    title: "Grupuj miejsca według okolicy",
    text: "Malta jest niewielka, ale korki i czas dojazdu się sumują. Jeśli możesz, odwiedzaj pobliskie atrakcje tego samego dnia.",
  },
  {
    title: "Sprawdź pogodę",
    text: "Silne słońce, wiatr i wzburzone morze mogą wpłynąć na plany na zewnątrz, rejsy i kąpiele.",
  },
  {
    title: "Rezerwuj popularne atrakcje wcześniej",
    text: "Rejsy, wycieczki z przewodnikiem i popularne atrakcje są oblegane w szczycie sezonu.",
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

function isActivityArticle(
  article: ActivityArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return activityArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getActivityArticles(): Promise<
  ActivityArticle[]
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
    .returns<ActivityArticle[]>();

  if (error) {
    console.error(
      "Could not load things-to-do articles",
      error,
    );

    return [];
  }

  return (data ?? [])
    .filter((article) => {
      const audience =
        normalizeValue(article.audience);

      return (
        audience === "tourist" ||
        audience === "general" ||
        audience === ""
      );
    })
    .filter(isActivityArticle);
}

export default async function ThingsToDoPage() {
  const activityArticles =
    await localizeArticles(await getActivityArticles(), "pl");

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
            href="/pl/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Wróć do Zwiedzaj Maltę
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Atrakcje
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Co robić na Malcie.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Zabytkowe miasta, plaże, wyspy, jedzenie, rejsy i przeżycia na niezapomniany pobyt.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ideas"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Zobacz pomysły ↓
                </a>

                {activityArticles.length > 0 && (
                  <a
                    href="#activity-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Czytaj poradniki o atrakcjach
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Co robić podczas podróży na Maltę"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Zaplanuj dni
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Łącz zwiedzanie z czasem nad morzem.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Malta sprawdza się najlepiej, gdy łączysz zabytkowe miejsca, przystanki na wybrzeżu i wycieczki na wyspy, zamiast każdego dnia robić to samo.
          </p>
        </div>
      </section>

      <section
        id="ideas"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Atrakcje na Malcie
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Zacznij od tych pomysłów.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Traktuj je jako elementy planu podróży i łącz według zainteresowań i dostępnego czasu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {activityIdeas.map((idea) => (
              <Link
                key={idea.number}
                href={idea.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {idea.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {idea.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {idea.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Czytaj cały poradnik →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Planowanie podróży
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Ułatw sobie plan podróży.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {planningTips.map((tip) => (
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

      {activityArticles.length > 0 && (
        <section
          id="activity-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Opublikowane poradniki o atrakcjach
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Więcej pomysłów na Maltę.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Nowe zatwierdzone artykuły turystyczne o atrakcjach, zwiedzaniu i przeżyciach są tu automatycznie podłączane.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {activityArticles.length}{" "}
                {activityArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activityArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/pl/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
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

                    <span className="inline-flex font-bold text-[#B83F29]">
                      Czytaj artykuł →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Odkryj Maltę
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Zaplanuj resztę podróży.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pl/beaches"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Plaże →
            </Link>

            <Link
              href="/pl/visit-malta/valletta"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Valletta
            </Link>

            <Link
              href="/pl/visit-malta/gozo"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Gozo
            </Link>
          </div>
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

function MetadataBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B83F29]">
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