import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Przewodnik po Mdinie i Rabacie: atrakcje i wskazówki | GoMaltaNow",
  description:
    "Odkryj Mdinę i Rabat: ufortyfikowane uliczki, zabytkowe miejsca, katakumby i jeden z najbardziej klimatycznych obszarów Malty.",
  alternates: {
    canonical: "/pl/visit-malta/mdina-rabat",
    languages: {"en": "/visit-malta/mdina-rabat", "it": "/it/visit-malta/mdina-rabat", "pl": "/pl/visit-malta/mdina-rabat", "fr": "/fr/visit-malta/mdina-rabat", "de": "/de/visit-malta/mdina-rabat", "es": "/es/visit-malta/mdina-rabat", "uk": "/uk/visit-malta/mdina-rabat", "x-default": "/visit-malta/mdina-rabat"},
  },
};


export const dynamic = "force-dynamic";

type MdinaRabatArticle = {
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

const articleKeys = [
  "mdina",
  "rabat",
  "mdina-rabat",
  "silent-city",
  "st-paul",
  "catacombs",
  "catacomb",
  "historic-malta",
  "history",
  "sightseeing",
];

const highlights = [
  {
    number: "01",
    slug: "mdina-gate",
    title: "Brama Mdiny",
    text: "Wejdź do historycznego ufortyfikowanego miasta Malty przez jeden z jego najbardziej rozpoznawalnych symboli i rozpocznij zwiedzanie wąskich uliczek w środku.",
  },
  {
    number: "02",
    slug: "st-pauls-cathedral-mdina",
    title: "Katedra św. Pawła",
    text: "Odwiedź jeden z najważniejszych religijnych i architektonicznych zabytków Mdiny, położony w sercu starego miasta.",
  },
  {
    number: "03",
    slug: "mdina-bastion-viewpoints",
    title: "Punkty widokowe Mdiny",
    text: "Przejdź w stronę bastionów, aby podziwiać rozległe widoki na środkową Maltę i otaczające ją tereny wiejskie.",
  },
  {
    number: "04",
    slug: "rabat-streets",
    title: "Uliczki Rabatu",
    text: "Wyjdź poza Mdinę do Rabatu, gdzie znajdziesz kawiarnie, tradycyjne uliczki i bardziej codzienną, lokalną atmosferę.",
  },
  {
    number: "05",
    slug: "st-pauls-catacombs",
    title: "Katakumby św. Pawła",
    text: "Odkryj jedno z najsłynniejszych historycznych miejsc Rabatu i dowiedz się więcej o wczesnochrześcijańskiej i rzymskiej historii Malty.",
  },
  {
    number: "06",
    slug: "mdina-in-the-evening",
    title: "Wieczór w Mdinie",
    text: "Wróć później w ciągu dnia, aby doświadczyć spokojniejszych uliczek, ciepłego światła i atmosfery, dzięki której Mdina zyskała przydomek Cichego Miasta.",
  },
];

const planningTips = [
  {
    title: "Połącz zwiedzanie Mdiny i Rabatu",
    text: "Leżą obok siebie, dlatego odwiedzenie obu miejsc tego samego dnia jest zazwyczaj najpraktyczniejszym rozwiązaniem.",
  },
  {
    title: "Zostaw czas na spacer bez celu",
    text: "Najlepsze części Mdiny to często jej mniejsze uliczki, dziedzińce i punkty widokowe, a nie jedna konkretna atrakcja.",
  },
  {
    title: "Rozważ późne popołudnie",
    text: "Późniejsza wizyta może być przyjemniejsza w cieplejszych miesiącach i pozwoli Ci zobaczyć Mdinę, gdy światło dzienne zaczyna zanikać.",
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

function isMdinaRabatArticle(
  article: MdinaRabatArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return articleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getMdinaRabatArticles(): Promise<
  MdinaRabatArticle[]
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
    .returns<MdinaRabatArticle[]>();

  if (error) {
    console.error(
      "Could not load Mdina and Rabat articles",
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
    .filter(isMdinaRabatArticle);
}

export default async function MdinaRabatPage() {
  const articles =
    await localizeArticles(await getMdinaRabatArticles(), "pl");

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
                Mdina i Rabat
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Odkryj Mdinę i Rabat.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Ufortyfikowane uliczki, zabytkowe miejsca, katakumby i jeden z najbardziej klimatycznych obszarów Malty.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#highlights"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Odkryj okolicę ↓
                </a>

                {articles.length > 0 && (
                  <a
                    href="#mdina-rabat-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Przeczytaj lokalne przewodniki
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Mdina i Rabat na Malcie"
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
            Historyczna Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Dwa sąsiadujące miejsca, jedna łatwa wycieczka na dzień.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Mdina i Rabat leżą na tyle blisko siebie, że można je zwiedzić razem, łącząc ufortyfikowaną architekturę, lokalne uliczki, muzea i stanowiska archeologiczne.
          </p>
        </div>
      </section>

      <section
        id="highlights"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Co zobaczyć
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Najważniejsze atrakcje Mdiny i Rabatu.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Zacznij od tych miejsc i zostaw sobie czas na zwiedzanie bez ustalonej trasy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <Link
                key={item.number}
                href={`/pl/visit-malta/mdina-rabat/${item.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {item.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Godziny otwarcia, bilety i jak tam dotrzeć →
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
              Praktyczne wskazówki
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Zaplanuj wizytę łatwiej.
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

      {articles.length > 0 && (
        <section
          id="mdina-rabat-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Opublikowane lokalne przewodniki
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Więcej przewodników po Mdinie i Rabacie.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Nowe zatwierdzone artykuły turystyczne o Mdinie, Rabacie, Cichym Mieście i pobliskich historycznych atrakcjach są automatycznie dodawane tutaj.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {articles.length}{" "}
                {articles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
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
            Odkrywaj dalej
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Odkryj więcej Malty.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pl/visit-malta/valletta"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Valletta →
            </Link>

            <Link
              href="/pl/visit-malta/gozo"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Gozo
            </Link>

            <Link
              href="/pl/visit-malta/things-to-do"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Atrakcje
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