import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type VallettaArticle = {
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

const vallettaArticleKeys = [
  "valletta",
  "capital",
  "upper-barrakka",
  "lower-barrakka",
  "waterfront",
  "museums",
  "museum",
  "three-cities",
  "grand-harbour",
  "sightseeing",
];

const highlights = [
  {
    number: "01",
    title: "Upper Barrakka Gardens",
    text: "Enjoy one of Valletta's best-known viewpoints over the Grand Harbour and the Three Cities.",
  },
  {
    number: "02",
    title: "St John's Co-Cathedral",
    text: "Visit one of Malta's most important historic and artistic landmarks in the heart of the city.",
  },
  {
    number: "03",
    title: "Republic Street",
    text: "Walk through Valletta's main pedestrian route with shops, cafes, historic buildings and side streets to explore.",
  },
  {
    number: "04",
    title: "Valletta Waterfront",
    text: "Head down toward the harbour for restaurants, historic warehouses and a different view of the capital.",
  },
  {
    number: "05",
    title: "Museums and history",
    text: "Valletta has several museums and historic sites that make it easy to build a full day around culture and history.",
  },
  {
    number: "06",
    title: "Three Cities connection",
    text: "Combine Valletta with a harbour crossing or ferry trip to the Three Cities for a fuller Grand Harbour experience.",
  },
];

const planningTips = [
  {
    title: "Wear comfortable shoes",
    text: "Valletta has slopes, steps and plenty of walking, so comfortable footwear makes a big difference.",
  },
  {
    title: "Start early in summer",
    text: "Morning visits can be more comfortable during hot months and may also help you avoid the busiest periods.",
  },
  {
    title: "Combine nearby attractions",
    text: "Many major sights are close together, so Valletta is easy to explore efficiently on foot.",
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

function isVallettaArticle(
  article: VallettaArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return vallettaArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getVallettaArticles(): Promise<
  VallettaArticle[]
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
    .returns<VallettaArticle[]>();

  if (error) {
    console.error(
      "Could not load Valletta articles",
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
    .filter(isVallettaArticle);
}

export default async function VallettaPage() {
  const vallettaArticles =
    await getVallettaArticles();

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to Visit Malta
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Valletta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Explore Valletta, Malta&apos;s capital.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Historic streets, harbour views,
                museums, churches and some of the
                most important sights in Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#highlights"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Explore Valletta ↓
                </a>

                {vallettaArticles.length > 0 && (
                  <a
                    href="#valletta-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Read Valletta guides
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Valletta Malta"
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
            Malta&apos;s capital
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Valletta is compact and easy to explore on foot.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            You can see many of the city&apos;s
            main attractions in one day, but a
            slower visit gives you more time for
            side streets, museums and harbour views.
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
              Valletta highlights
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              What to see in Valletta.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Start with these places and then
              explore the streets between them.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <article
                key={item.number}
                className="relative overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Practical tips
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Make your Valletta visit easier.
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

      {vallettaArticles.length > 0 && (
        <section
          id="valletta-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Published Valletta guides
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  More guides to Valletta.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  New approved tourist articles
                  about Valletta, museums, the Grand
                  Harbour and nearby attractions are
                  connected here automatically.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {vallettaArticles.length}{" "}
                {vallettaArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {vallettaArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
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
                      Read article →
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
            Continue exploring
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Discover more historic Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/visit-malta/mdina-rabat"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Mdina & Rabat →
            </Link>

            <Link
              href="/visit-malta/things-to-do"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Things to Do
            </Link>

            <Link
              href="/visit-malta/transport"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Transport
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta Made Simple.
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

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}