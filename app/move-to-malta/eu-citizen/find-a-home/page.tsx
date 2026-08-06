import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type HousingArticle = {
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
    title: "Choose the right area",
    text: "Think about work, transport, daily services, noise levels and the type of lifestyle you want before comparing properties.",
  },
  {
    title: "Understand the full cost",
    text: "Look beyond the monthly rent and consider deposits, utilities, agency fees and the cost of travelling from the property.",
  },
  {
    title: "Review the agreement",
    text: "Read the rental agreement carefully and make sure important details are written clearly before you sign.",
  },
];

const checklist = [
  "Set a realistic monthly housing budget",
  "Choose two or three areas to compare",
  "Check transport and nearby services",
  "Ask what is included in the monthly rent",
  "Inspect the property before signing",
  "Keep copies of the agreement and payments",
];

const questions = [
  "How long is the rental term?",
  "What is included in the rent?",
  "How are utilities paid?",
  "Is a security deposit required?",
  "Who is responsible for repairs?",
  "What notice period applies?",
];

const housingArticleKeys = [
  "housing",
  "home",
  "rent",
  "renting",
  "rental",
  "accommodation",
  "property",
  "landlord",
  "tenant",
  "lease",
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

function isHousingArticle(
  article: HousingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return housingArticleKeys.some((key) => {
    const normalizedKey = normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getHousingArticles(): Promise<
  HousingArticle[]
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
    .returns<HousingArticle[]>();

  if (error) {
    console.error(
      "Could not load housing articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isHousingArticle,
  );
}

export default async function FindAHomePage() {
  const housingArticles =
    await getHousingArticles();

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
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
            href="/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Back to EU guides
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
                Find a Home
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Find the right place to live in
                Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Compare areas, understand the
                real monthly cost and prepare the
                right questions before choosing a
                property.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#8A3B2B] px-6 py-3 font-semibold text-white transition hover:bg-[#6E2E22]"
                >
                  View the checklist ↓
                </a>

                {housingArticles.length > 0 && (
                  <a
                    href="#housing-articles"
                    className="inline-flex rounded-full border border-[#8A3B2B] px-6 py-3 font-semibold text-[#8A3B2B] transition hover:bg-[#8A3B2B] hover:text-white"
                  >
                    Read housing articles
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/find-home-malta.jpg"
              alt="Searching for a home in Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Published housing articles */}
      {housingArticles.length > 0 && (
        <section
          id="housing-articles"
          className="border-y border-[#D9C4B8] bg-[#F4E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
                  Published housing guides
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#4D3B34] md:text-5xl">
                  Detailed articles about renting
                  and housing in Malta.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  New approved housing, rental and
                  accommodation articles are
                  connected automatically whenever
                  they are published.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#8A3B2B]">
                {housingArticles.length}{" "}
                {housingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {housingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#D9C4B8] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#8A3B2B]/40 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#8A3B2B]">
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

                    <span className="inline-flex font-bold text-[#8A3B2B]">
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Essentials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Start with the decisions that
              matter most.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              A good property is not only about
              appearance. Location, total cost and
              the rental agreement all affect
              your everyday life.
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
        className="bg-[#8A3B2B] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Housing checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Before you agree to rent.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Use this checklist when comparing
              options and keep your notes for
              every property you visit.
            </p>

            {housingArticles.length > 0 && (
              <a
                href="#housing-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#8A3B2B] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Read the detailed guides
              </a>
            )}
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#8A3B2B]">
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

      {/* Questions */}
      <section className="bg-[#F4E6DF] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
              Ask before signing
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Important questions for the landlord
              or agent.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question) => (
              <div
                key={question}
                className="flex items-center justify-between gap-6 rounded-2xl border border-[#D9C4B8] bg-white/70 p-5"
              >
                <p className="font-semibold text-[#4D3B34]">
                  {question}
                </p>

                <span className="text-xl text-[#8A3B2B]">
                  ?
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8A3B2B]">
            Good practice
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Keep everything clear and documented.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Keep written records of agreements,
            payments and important communication.
            For legal or contractual questions,
            seek appropriate professional advice
            before committing.
          </p>
        </div>
      </section>

      {/* Footer */}
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
    <span className="rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#8A3B2B]">
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