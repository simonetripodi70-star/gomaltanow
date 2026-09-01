import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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
    title: "Before You Move",
    description:
      "Prepare the documents, finances and practical arrangements you may need before relocating to Malta.",
    href: "/move-to-malta/non-eu-citizen/before-you-move",
    label: "Preparation",
    number: "01",
    articleKeys: [
      "before-you-move",
      "preparation",
      "moving",
      "relocation",
    ],
  },
  {
    title: "Single Permit & Work Permit",
    description:
      "Understand the main employment and residence permit process for third-country nationals working in Malta.",
    href: "/move-to-malta/non-eu-citizen/single-permit",
    label: "Permits",
    number: "02",
    articleKeys: [
      "single-permit",
      "work-permit",
      "permit",
      "employment-permit",
    ],
  },
  {
    title: "Find a Job",
    description:
      "Learn where to search for work, how recruitment works and what to consider when an employer sponsors your permit.",
    href: "/move-to-malta/non-eu-citizen/find-a-job",
    label: "Employment",
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
    title: "Find a Home",
    description:
      "Understand renting, deposits, contracts and the practical steps involved in finding accommodation in Malta.",
    href: "/move-to-malta/non-eu-citizen/find-a-home",
    label: "Housing",
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
    title: "Residence & Documents",
    description:
      "Keep track of residence documentation, identity requirements and the administrative steps that apply after arrival.",
    href: "/move-to-malta/non-eu-citizen/residence",
    label: "Residence",
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
    title: "Healthcare",
    description:
      "Learn how healthcare access, insurance and medical services can work for non-EU residents in Malta.",
    href: "/move-to-malta/non-eu-citizen/healthcare",
    label: "Health",
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
    title: "Banking & Payments",
    description:
      "Explore banking, cards, salary payments, transfers and practical ways to manage your money in Malta.",
    href: "/move-to-malta/non-eu-citizen/banking-payments",
    label: "Money",
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
            href="/"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/move-to-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to moving options
          </Link>
        </div>
      </nav>

      <section className="bg-[#F7F1EA]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Third-Country Nationals
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Moving to Malta as a non-EU citizen.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Practical guides for permits, employment,
                residence, housing, healthcare and everyday
                life in Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#guides"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Explore the guides ↓
                </a>

                <Link
                  href="/move-to-malta/eu-citizen"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  I am an EU citizen
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Traditional Maltese architecture"
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
              Non-EU moving guides
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Start with the step that applies to you.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Requirements for third-country nationals can
              depend on employment, nationality, permit type
              and personal circumstances. These guides will
              help you understand the process step by step.
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

      {articles.length > 0 && (
        <section className="bg-[#E8F0EA] py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Latest information
              </p>

              <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                Latest non-EU moving articles.
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
                      Read article →
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
            Important
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Immigration requirements can change.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-white/75">
            GoMaltaNow provides practical guidance, but
            permit requirements depend on your individual
            situation. Always verify final requirements with
            the relevant Maltese authority before submitting
            an application.
          </p>
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