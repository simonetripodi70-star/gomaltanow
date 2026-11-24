import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Дозволи на проживання на Мальті для громадян не з ЄС | GoMaltaNow",
  description:
    "Відстежуйте дозволи, документи, що посвідчують особу, картки проживання, продовження та адміністративні записи під час життя на Мальті.",
  alternates: {
    canonical: "/uk/move-to-malta/non-eu-citizen/residence",
    languages: {"en": "/move-to-malta/non-eu-citizen/residence", "it": "/it/move-to-malta/non-eu-citizen/residence", "pl": "/pl/move-to-malta/non-eu-citizen/residence", "fr": "/fr/move-to-malta/non-eu-citizen/residence", "de": "/de/move-to-malta/non-eu-citizen/residence", "es": "/es/move-to-malta/non-eu-citizen/residence", "uk": "/uk/move-to-malta/non-eu-citizen/residence", "x-default": "/move-to-malta/non-eu-citizen/residence"},
  },
};


export const dynamic = "force-dynamic";

type ResidenceArticle = {
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

const residenceArticleKeys = [
  "residence",
  "residency",
  "residence-permit",
  "permit-renewal",
  "renewal",
  "documents",
  "identity",
  "identita",
  "card",
  "residence-card",
  "biometrics",
];

const residenceSteps = [
  {
    number: "01",
    title: "Зрозумійте свій статус проживання",
    text: "Ваш статус проживання залежить від дозволу або імміграційного шляху, що застосовується до вас. Від самого початку чітко розумійте умови свого дозволу.",
  },
  {
    number: "02",
    title: "Підготуйте необхідну документацію",
    text: "Зберігайте паспорт, документи щодо дозволу, трудові записи, дані про проживання та інші підтвердні документи впорядкованими й актуальними.",
  },
  {
    number: "03",
    title: "Виконайте формальності щодо посвідчення особи",
    text: "У межах процесу вам може знадобитися пройти біометричні процедури, формальності щодо посвідчення особи або картки проживання. Дотримуйтесь інструкцій відповідного мальтійського органу влади.",
  },
  {
    number: "04",
    title: "Відстежуйте строки",
    text: "Документи та дозволи на проживання можуть мати дати закінчення строку дії. Ведіть облік строків, щоб завчасно підготувати продовження та підтвердні документи.",
  },
  {
    number: "05",
    title: "Оновлюйте інформацію про зміни за потреби",
    text: "Про зміни, пов’язані з працевлаштуванням, адресою, даними паспорта або особистими обставинами, може бути потрібно повідомити. Перевірте умови, що застосовуються до вашого дозволу.",
  },
];

const checklist = [
  "Valid passport",
  "Current residence or permit documents",
  "Employment documentation where relevant",
  "Proof of accommodation",
  "Copies of rental or housing documents",
  "Insurance or healthcare documents where required",
  "Application receipts and reference numbers",
  "Copies of official correspondence",
];

const importantPoints = [
  {
    title: "Перевірте дату закінчення строку дії",
    text: "Не чекайте останнього моменту, щоб перевірити дату закінчення строку дії вашого дозволу або картки проживання. Деякі процеси продовження потребують завчасної підготовки.",
  },
  {
    title: "Підтримуйте актуальність інформації про адресу",
    text: "Дані про ваше житло можуть бути важливими для адміністративних процедур, тому зберігайте документи про оренду та перевіряйте, чи потрібно повідомляти про зміну адреси.",
  },
  {
    title: "Зберігайте цифрові копії",
    text: "Зберігайте чіткі цифрові копії паспортів, дозволів, договорів, квитанцій та офіційних листів, щоб мати доступ до них за потреби.",
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

function isResidenceArticle(
  article: ResidenceArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return residenceArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getResidenceArticles(): Promise<
  ResidenceArticle[]
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
    .returns<ResidenceArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU residence articles",
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
    .filter(isResidenceArticle);
}

export default async function ResidencePage() {
  const residenceArticles =
    await localizeArticles(await getResidenceArticles(), "uk");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
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
            href="/uk/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Назад до путівників для не-громадян ЄС
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Проживання та документи
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Керуйте своїми документами на проживання на Мальті.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Відстежуйте дозволи, документи, що посвідчують особу, картки проживання, продовження та адміністративні записи, пов’язані з життям на Мальті.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#residence-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Переглянути процес ↓
                </a>

                {residenceArticles.length > 0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Читайте посібники щодо проживання
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Документи на проживання та посвідчення особи на Мальті"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/residence" lang="uk" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Залишайтеся організованими
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Документи на проживання потребують постійної уваги.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Ваші адміністративні обов’язки не обов’язково завершуються після видачі дозволу. Відстежуйте дати закінчення строку дії, зміни обставин і документи, які можуть потребувати оновлення.
          </p>
        </div>
      </section>

      <section
        id="residence-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Адміністрування питань проживання
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Тримайте свій статус проживання під контролем.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Використовуйте ці кроки як практичну основу для організації своїх документів та адміністративних обов’язків.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {residenceSteps.map((step) => (
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
              Важливі звички
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Уникайте адміністративних проблем, яким можна запобігти.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {importantPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {point.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {point.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {residenceArticles.length > 0 && (
        <section
          id="residence-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Опубліковані посібники щодо проживання
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Статті про проживання та документи для громадян не з ЄС.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Нові схвалені статті, пов’язані з проживанням, дозволами, документами, що посвідчують особу, та продовженнями, автоматично додаються сюди.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {residenceArticles.length}{" "}
                {residenceArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {residenceArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/uk/articles/${article.slug}`}
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
                      Читати статтю →
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
              Контрольний список документів
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Зберігайте всі необхідні документи разом.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Це практичний контрольний список для організації. Точний перелік необхідних документів залежить від вашого шляху отримання права на проживання та особистих обставин.
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
            Продовжуйте переїзд
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Продовжуйте з наступними практичними посібниками.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/uk/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Охорона здоров’я →
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Знайти житло
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Single Permit
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Вимоги щодо проживання, імміграції та документів, що посвідчують особу, можуть змінюватися. GoMaltaNow надає загальну практичну інформацію й не замінює офіційні рекомендації або професійні імміграційні консультації.
          </p>
        </div>
      </section>

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

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}