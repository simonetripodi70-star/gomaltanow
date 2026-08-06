import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type BankingArticle = {
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

const REVOLUT_URL =
  "https://revolut.com/referral/?referral-code=simone01td!AUG1-26-AR-L1&geo-redirect";

const essentials = [
  {
    title: "Start with Revolut",
    text: "For many newcomers, Revolut is a practical way to begin managing card payments, transfers and multiple currencies from one app.",
  },
  {
    title: "Prepare your documents",
    text: "Keep your identification, proof of address, employment details and supporting records ready before applying.",
  },
  {
    title: "Plan your payments",
    text: "Understand how rent, utilities, subscriptions and everyday purchases will be paid once you are settled.",
  },
];

const checklist = [
  "Valid passport or national identity card",
  "Proof of address in Malta",
  "Employment contract or proof of income",
  "Tax or identification details where requested",
  "A Maltese mobile number if required",
  "Copies of all forms and submitted documents",
];

const moneyTips = [
  "Compare monthly account fees",
  "Check cash withdrawal charges",
  "Review foreign exchange costs",
  "Confirm salary payment details",
  "Set alerts for important payments",
  "Keep an emergency reserve",
];

const bankingArticleKeys = [
  "banking-payments",
  "banking",
  "bank",
  "payments",
  "payment",
  "finance",
  "financial",
  "money",
  "account",
  "cards",
  "card",
  "revolut",
  "salary-payments",
  "transfers",
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

function isBankingArticle(
  article: BankingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return bankingArticleKeys.some((key) => {
    const normalizedKey = normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getBankingArticles(): Promise<
  BankingArticle[]
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
    .returns<BankingArticle[]>();

  if (error) {
    console.error(
      "Could not load banking articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isBankingArticle,
  );
}

export default async function BankingPaymentsPage() {
  const bankingArticles =
    await getBankingArticles();

  const featuredArticle =
    bankingArticles[0] ?? null;

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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
                Banking & Payments
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Manage your money in Malta with confidence.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Learn how Revolut, traditional Maltese banks and other payment
                providers can help you manage salary payments, rent, transfers
                and everyday expenses.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {featuredArticle && (
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex rounded-full bg-[#75601C] px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
                  >
                    Read the latest guide →
                  </Link>
                )}

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#75601C] px-6 py-3 font-semibold text-[#75601C] transition hover:-translate-y-1 hover:bg-[#75601C] hover:text-white"
                >
                  Join Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                The Revolut button contains a personal invitation link.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/banking-payments-malta.jpg"
              alt="Saving money and managing finances in Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {bankingArticles.length > 0 && (
        <section
          id="banking-articles"
          className="border-y border-[#D8C98F] bg-[#F2EACF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
                  Published banking guides
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#534617] md:text-5xl">
                  Articles about banking, payments and Revolut in Malta.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  New approved articles are connected automatically whenever
                  banking or payment content is published.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#75601C]">
                {bankingArticles.length}{" "}
                {bankingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {bankingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#D8C98F] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#75601C]/40 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#75601C]">
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

                    <span className="inline-flex font-bold text-[#75601C]">
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#111315] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <a
            href={REVOLUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 transition duration-300 hover:-translate-y-2 hover:border-[#D8B848]/40 hover:bg-white/10 hover:shadow-2xl md:grid-cols-[1fr_auto] md:items-center md:p-10"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D8B848]">
                A practical option for Malta
              </p>

              <h2 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-tight md:text-5xl">
                Start managing everyday payments with Revolut.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
                Use an app-based account for card payments, transfers,
                multiple currencies and day-to-day money management.
              </p>

              <span className="mt-7 inline-flex rounded-full bg-[#D8B848] px-6 py-3 font-bold text-[#171717] transition group-hover:bg-white">
                Join Revolut →
              </span>
            </div>

            <span className="hidden text-6xl text-[#D8B848] transition duration-300 group-hover:translate-x-2 md:block">
              →
            </span>
          </a>

          <p className="mt-4 text-center text-xs text-white/50">
            This page contains a personal Revolut invitation link.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Set up your finances with a clear plan.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              The best option depends on your income, payment habits and the
              services you expect to use most often.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {essentials.map((item, index) =>
              index === 0 ? (
                <a
                  key={item.title}
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border border-[#D8C98F] bg-[#F2EACF] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="font-serif text-3xl transition group-hover:text-[#75601C]">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-[#625D57]">
                    {item.text}
                  </p>

                  <span className="mt-6 inline-flex font-bold text-[#75601C]">
                    Join Revolut →
                  </span>
                </a>
              ) : (
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
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="checklist"
        className="bg-[#75601C] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Account checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              What to prepare before applying.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Requirements vary by provider, so use this as a preparation list
              and confirm the final documents directly with the bank or
              service.
            </p>

            {bankingArticles.length > 0 && (
              <a
                href="#banking-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#75601C] transition hover:-translate-y-1 hover:shadow-xl"
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#75601C]">
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

      <section className="bg-[#F2EACF] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
              Everyday money
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Small details can affect your monthly budget.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {moneyTips.map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-4 rounded-2xl border border-[#D8C98F] bg-white/75 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#75601C] text-sm font-bold text-white">
                  €
                </span>

                <p className="font-semibold text-[#534617]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7F2] py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#75601C]">
            Banking in Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Compare your options before choosing an account.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Fees, exchange rates, card charges and account conditions can
            change. Review the provider’s current terms before making a
            decision.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {featuredArticle && (
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
              >
                Read the latest article
              </Link>
            )}

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-[#75601C] px-6 py-3 font-bold text-[#75601C] transition hover:-translate-y-1 hover:bg-[#75601C] hover:text-white"
            >
              Join Revolut
            </a>
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
    <span className="rounded-full bg-[#F2EACF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#75601C]">
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