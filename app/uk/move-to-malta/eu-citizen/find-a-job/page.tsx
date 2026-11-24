import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Пошук роботи на Мальті для громадян ЄС | GoMaltaNow",
  description:
    "Створіть сильну заявку, шукайте за чіткою стратегією та зрозумійте ключові деталі перед тим, як прийняти пропозицію роботи на Мальті.",
  alternates: {
    canonical: "/uk/move-to-malta/eu-citizen/find-a-job",
    languages: {"en": "/move-to-malta/eu-citizen/find-a-job", "it": "/it/move-to-malta/eu-citizen/find-a-job", "pl": "/pl/move-to-malta/eu-citizen/find-a-job", "fr": "/fr/move-to-malta/eu-citizen/find-a-job", "de": "/de/move-to-malta/eu-citizen/find-a-job", "es": "/es/move-to-malta/eu-citizen/find-a-job", "uk": "/uk/move-to-malta/eu-citizen/find-a-job", "x-default": "/move-to-malta/eu-citizen/find-a-job"},
  },
};


export const dynamic = "force-dynamic";

type JobArticle = {
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
    title: "Підготуйте свою заявку",
    text: "Оновіть своє CV, упорядкуйте документи про кваліфікацію та підготуйте чітке представлення для роботодавців.",
  },
  {
    title: "Шукайте у правильних місцях",
    text: "Користуйтеся надійними платформами пошуку роботи, сайтами компаній, кадровими агентствами та професійними мережами.",
  },
  {
    title: "Зрозумійте умови пропозиції",
    text: "Перед прийняттям пропозиції перевірте посаду, зарплату, робочі години, випробувальний термін та умови контракту.",
  },
];

const checklist = [
  "Create an updated CV in English",
  "Prepare copies of qualifications and references",
  "Set up a professional email address",
  "Research companies before applying",
  "Prepare for online and in-person interviews",
  "Keep a record of every application",
];

const interviewTips = [
  "Explain clearly why you are moving to Malta",
  "Research the company before the interview",
  "Prepare examples of your experience",
  "Ask about working hours and responsibilities",
  "Confirm the contract type and start date",
  "Send a short follow-up message afterwards",
];

const jobArticleKeys = [
  "jobs",
  "job",
  "work",
  "employment",
  "career",
  "recruitment",
  "salary",
  "jobsplus",
  "eures",
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

function isJobArticle(article: JobArticle) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return jobArticleKeys.some((key) => {
    const normalizedKey = normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getJobArticles(): Promise<
  JobArticle[]
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
    .returns<JobArticle[]>();

  if (error) {
    console.error(
      "Could not load job articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isJobArticle,
  );
}

export default async function FindAJobPage() {
  const jobArticles =
    await localizeArticles(await getJobArticles(), "uk");

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/uk"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>

            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/uk/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Назад до путівників для ЄС
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#5C477A]">
                Знайти роботу
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Підготуйтеся до пошуку роботи на Мальті.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Створіть сильну заявку, шукайте за чіткою стратегією та зрозумійте важливі деталі перед тим, як прийняти пропозицію.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#5C477A] px-6 py-3 font-semibold text-white transition hover:bg-[#493762]"
                >
                  Переглянути чекліст ↓
                </a>

                {jobArticles.length > 0 && (
                  <a
                    href="#job-articles"
                    className="inline-flex rounded-full border border-[#5C477A] px-6 py-3 font-semibold text-[#5C477A] transition hover:bg-[#5C477A] hover:text-white"
                  >
                    Читайте статті про роботу
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/find-job-malta.jpg"
              alt="Співбесіда на Мальті"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/find-a-job" lang="uk" />

      {/* Published job articles */}
      {jobArticles.length > 0 && (
        <section
          id="job-articles"
          className="border-y border-[#D1C3E1] bg-[#E9E3F2] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#5C477A]">
                  Опубліковані посібники з працевлаштування
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#443653] md:text-5xl">
                  Детальні статті про пошук роботи на Мальті.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Нові схвалені статті про працевлаштування та пошук роботи автоматично додаються після публікації.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5C477A]">
                {jobArticles.length}{" "}
                {jobArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/uk/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#D1C3E1] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#5C477A]/40 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#5C477A]">
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

                    <span className="inline-flex font-bold text-[#5C477A]">
                      Читати статтю →
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
              Складіть чіткий план пошуку роботи.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Зосереджений підхід допомагає ефективніше подавати заявки та впевненіше порівнювати можливості.
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
        className="bg-[#5C477A] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Контрольний список для подання заявки
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Підготуйтеся перед поданням заявки.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Підготуйте все необхідне перед надсиланням заявок, щоб швидко реагувати, коли з’явиться можливість.
            </p>

            {jobArticles.length > 0 && (
              <a
                href="#job-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#5C477A] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Читайте докладні путівники
              </a>
            )}
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#5C477A]">
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

      {/* Interview tips */}
      <section className="bg-[#E9E3F2] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#5C477A]">
              Підготовка до співбесіди
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Справте сильніше перше враження.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {interviewTips.map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-4 rounded-2xl border border-[#D1C3E1] bg-white/75 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5C477A] text-sm font-bold text-white">
                  ✓
                </span>

                <p className="font-semibold text-[#443653]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#5C477A]">
            Перед тим, як прийняти пропозицію
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Уважно прочитайте повну пропозицію.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Підтвердьте основні умови письмово та поставте запитання щодо будь-яких незрозумілих деталей, перш ніж погоджуватися на посаду.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/uk"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>

            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Мальта просто.
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
    <span className="rounded-full bg-[#EEE8F5] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#5C477A]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}