import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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

const checklist = [
  "Valid passport or national identity card",
  "European Health Insurance Card for your first period",
  "Copies of qualifications and employment documents",
  "Temporary accommodation for your arrival",
  "A realistic budget for rent, deposits and everyday costs",
  "Digital and printed copies of important documents",
];

const sections = [
  {
    title: "Documents",
    text: "Keep your identity documents, employment papers, qualifications and useful certificates together before travelling.",
  },
  {
    title: "Accommodation",
    text: "Arrange somewhere safe to stay while you visit properties and learn which Maltese area suits your daily routine.",
  },
  {
    title: "Budget",
    text: "Prepare for rent, a security deposit, transport, food and the initial costs involved in setting up your new life.",
  },
];

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
  "checklist",
  "budget",
  "first-steps",
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
    const normalizedKey = normalizeValue(key);

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
    .returns<MovingArticle[]>();

  if (error) {
    console.error(
      "Could not load before-you-move articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isMovingArticle,
  );
}

export default async function BeforeYouMovePage() {
  const movingArticles =
    await getMovingArticles();

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
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

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Before You Move
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Prepare your move before you arrive.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                A clear plan before travelling can
                save you time, money and
                unnecessary stress during your
                first weeks in Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-semibold text-white transition hover:bg-[#953220]"
                >
                  View the checklist ↓
                </a>

                {movingArticles.length > 0 && (
                  <a
                    href="#moving-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-semibold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Read moving articles
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/before-you-move.jpg"
              alt="Planning a move to Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {movingArticles.length > 0 && (
        <section
          id="moving-articles"
          className="border-y border-[#E3C8BE] bg-[#F4E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Published moving guides
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#4D3B34] md:text-5xl">
                  Practical articles to prepare your move to Malta.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  New approved articles about
                  preparation, relocation,
                  documents and first steps are
                  connected automatically whenever
                  they are published.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
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
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#B83F29]/40 hover:shadow-xl"
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Organise the essentials first.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Focus on the practical things that
              will make your first days in Malta
              easier.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-[#E7DDD3] bg-[#F9F5F0] p-7"
              >
                <h3 className="font-serif text-3xl">
                  {section.title}
                </h3>

                <p className="mt-4 leading-relaxed text-[#625D57]">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="checklist"
        className="bg-[#173E63] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Moving checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              What to prepare.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Use this as a starting checklist
              and adapt it to your work, family
              and accommodation situation.
            </p>

            {movingArticles.length > 0 && (
              <a
                href="#moving-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#173E63] transition hover:-translate-y-1 hover:shadow-xl"
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#173E63]">
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