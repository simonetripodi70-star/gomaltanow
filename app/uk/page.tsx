import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { CONTACT_EMAIL } from "@/lib/site";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "GoMaltaNow | Мальта просто: подорожі, переїзд і життя на Мальті",
  description:
    "Практичні посібники про подорожі на Мальту, переїзд і життя тут: пляжі, житло, робота, дозволи на проживання, медицина, банки та останні офіційні новини.",
  alternates: {
    canonical: "/uk",
    languages: {"en": "/", "it": "/it", "pl": "/pl", "fr": "/fr", "de": "/de", "es": "/es", "uk": "/uk", "x-default": "/"},
  },
};


export const dynamic = "force-dynamic";

type LatestArticle = {
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

async function getLatestArticles(): Promise<LatestArticle[]> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    console.error(
      "Public Supabase configuration is missing.",
    );

    return [];
  }

  const supabase = createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

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
    .limit(3)
    .returns<LatestArticle[]>();

  if (error) {
    console.error(
      "Could not load latest homepage articles",
      error,
    );

    return [];
  }

  return data ?? [];
}

export default async function Home() {
  const latestArticles =
    await localizeArticles(await getLatestArticles(), "uk");

  return (
    <main className="bg-[#F7F1EA] text-[#171717]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Валлетта і мальтійське узбережжя"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        {/* Navbar */}
        <nav className="absolute left-0 top-0 z-30 w-full border-b border-white/10 bg-[#0B0D0F]/90 text-white backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
            <Link
              href="/uk"
              className="font-serif text-3xl font-semibold tracking-tight md:text-4xl"
            >
              <span className="text-white">
                GoMalta
              </span>

              <span className="text-[#C94F32]">
                Now
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-base font-medium md:flex">
              <a
                className="transition hover:text-[#D96A4A]"
                href="/uk/visit-malta"
              >
                Відвідати Мальту
              </a>

              <Link
                className="transition hover:text-[#D96A4A]"
                href="/uk/move-to-malta"
              >
                Переїзд на Мальту
              </Link>

              <Link
                className="transition hover:text-[#D96A4A]"
                href="/uk/beaches"
              >
                Пляжі
              </Link>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#guides"
              >
                Посібники
              </a>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#latest-updates"
              >
                Новини
              </a>

              <a
                href="#guides"
                className="rounded-lg bg-[#B83F29] px-5 py-3 font-semibold text-white transition hover:bg-[#9F3422]"
              >
                Сплануйте наступний крок
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-16 pt-32 text-white md:px-8 md:pb-20 md:pt-40">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Мальта просто
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Усе, що потрібно, щоб відвідати Мальту або почати тут нове життя. Місцеві поради, практичні посібники та корисні інструменти на кожному етапі.
            </p>
          </div>

          <div className="mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-2">
            <Link
              id="visit-malta"
              href="/uk/visit-malta"
              className="group relative overflow-hidden rounded-3xl border border-[#D65C40] bg-gradient-to-br from-[#C7442D] to-[#A92F20] p-8 text-white shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-white/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#B83F29]">
                    🧳
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-2xl transition duration-300 group-hover:translate-x-2 group-hover:bg-white group-hover:text-[#B83F29]">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Відвідати Мальту
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                  Відкрийте чудові пляжі, місцеві ресторани, історичні місця, приховані куточки та незабутні враження на всіх островах.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Пляжі
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Ресторани
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Враження
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Маршрути
                  </span>
                </div>
              </div>
            </Link>

            <Link
              id="move-to-malta"
              href="/uk/move-to-malta"
              className="group relative overflow-hidden rounded-3xl border border-[#E6DED4] bg-[#FFFDF9] p-8 text-[#171717] shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-[#B83F29]/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111315] text-2xl text-white">
                    🏠
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B9B0A6] text-2xl transition duration-300 group-hover:translate-x-2 group-hover:border-[#B83F29] group-hover:bg-[#B83F29] group-hover:text-white">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Переїзд на Мальту
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-[#55514D] md:text-lg">
                  Зрозумійте процедури, знайдіть житло, відкрийте можливості роботи та впевнено почніть нове життя на Мальті.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Житло
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Робота
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Проживання
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Документи
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 z-20 h-12 w-full rounded-t-[50%] bg-[#F7F1EA] md:h-16" />
      </section>

      {/* Popular Guides */}
      <section
        id="guides"
        className="relative z-30 bg-[#F7F1EA] pb-20 pt-8 md:pb-24 md:pt-10"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Відкрийте Мальту
              </p>

              <h2 className="font-serif text-4xl font-medium md:text-5xl">
                Популярні посібники
              </h2>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#625D57] md:text-lg">
                Добірка посібників, щоб відкривати, планувати та облаштуватися на Мальті.
              </p>
            </div>

            <a
              href="#latest-updates"
              className="font-semibold text-[#B83F29] transition hover:tracking-wide"
            >
              Переглянути останні новини →
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/uk/beaches"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/golden-bay.jpg"
                  alt="Пляж Голден-Бей на Мальті"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Відвідати Мальту
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Найкращі пляжі
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Відкрийте найкрасивіші пляжі, затоки та місця для купання на Мальті.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Переглянути пляжі →
                </span>
              </div>
            </Link>

            <Link
              href="/uk/updates/housing"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/home-malta.jpg"
                  alt="Традиційний мальтійський будинок"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Переїзд на Мальту
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Знайти житло
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Порівняйте райони, інформацію про оренду та офіційні новини щодо житла.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Переглянути житло →
                </span>
              </div>
            </Link>

            <Link
              href="/uk/updates/work"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/jobs-malta.jpg"
                  alt="Робота на Мальті"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Робота на Мальті
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Знайти роботу
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Де шукати, які документи потрібні та які правила праці змінилися.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Переглянути роботу →
                </span>
              </div>
            </Link>

            <Link
              href="/uk/updates/transport"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/transport-malta.jpg"
                  alt="Громадський транспорт на Мальті"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Пересування
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Транспорт
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Автобуси, пороми, таксі, паркування та офіційні новини про транспорт.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Переглянути транспорт →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="home" />

      <SideRail contentWidth={1400} />

      {/* Latest Updates */}
      <section
        id="latest-updates"
        className="border-y border-black/5 bg-[#EFE5DA] py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Нещодавно опубліковано
              </p>

              <h2 className="font-serif text-4xl font-medium md:text-5xl">
                Останні новини Мальти
              </h2>

              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Схвалені статті на основі офіційних джерел, перевірені перед публікацією.
              </p>
            </div>

          </div>

          {latestArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C8B8A8] bg-[#FFFDF9] p-10 text-center">
              <h3 className="font-serif text-3xl">
                Поки немає опублікованих новин
              </h3>

              <p className="mt-3 text-[#625D57]">
                Нові схвалені статті з&apos;являтимуться тут автоматично.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/uk/articles/${article.slug}`}
                  aria-label={`Read ${article.title}`}
                  className="group flex h-full cursor-pointer flex-col rounded-3xl border border-black/5 bg-[#FFFDF9] p-7 shadow-sm outline-none transition duration-300 hover:-translate-y-2 hover:border-[#B83F29]/20 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#B83F29]/30"
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
                    <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#766F69]">
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

                    <span className="inline-flex rounded-2xl bg-[#B83F29] px-5 py-3 font-bold text-white transition group-hover:bg-[#9F3422]">
                      Читати статтю
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SectionLink
              href="/uk/updates/transport"
              title="Транспорт"
              description="Громадський транспорт і мобільність"
            />

            <SectionLink
              href="/uk/updates/housing"
              title="Житло"
              description="Оренда та житлові послуги"
            />

            <SectionLink
              href="/uk/updates/work"
              title="Робота"
              description="Працевлаштування та вимоги"
            />

            <SectionLink
              href="/uk/updates/residence"
              title="Проживання"
              description="Дозволи та процедури"
            />
          </div>
        </div>
      </section>

      {/* Why GoMaltaNow */}
      <AdSlot placement="homeMid" />

      <section className="bg-[#111315] py-20 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#D96A4A]">
                Чому GoMaltaNow
              </p>

              <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight md:text-6xl">
                Мальта зрозуміло, усе в одному місці.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Практична інформація про відпочинок, переїзд і повсякденне життя, щоб ухвалювати кращі рішення без втрати часу.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FeatureCard
                icon="✓"
                title="Місцеві знання"
                description="Корисні поради, засновані на реальному житті на Мальті, а не загальні туристичні рекомендації."
              />

              <FeatureCard
                icon="↻"
                title="Актуальні посібники"
                description="Ми стежимо за офіційними джерелами, щоб перевіряти й пояснювати важливі зміни."
              />

              <FeatureCard
                icon="◇"
                title="Проста навігація"
                description="Оберіть, чи ви приїжджаєте в гості, чи на постійно, і швидко знайдіть потрібну інформацію."
              />

              <FeatureCard
                icon="→"
                title="Один повний посібник"
                description="Пляжі, житло, робота, транспорт і документи в одному місці."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#C7442D] py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-white/70">
              Почніть свою подорож на Мальту
            </p>

            <h2 className="max-w-3xl font-serif text-4xl font-medium md:text-5xl">
              Приїжджаєте на тиждень чи будуєте нове життя?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/uk/visit-malta"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#A92F20] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Відвідати Мальту
            </a>

            <Link
              href="/uk/move-to-malta"
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#A92F20]"
            >
              Переїзд на Мальту
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-14 text-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link
                href="/uk"
                className="font-serif text-3xl font-semibold tracking-tight"
              >
                <span className="text-white">
                  GoMalta
                </span>

                <span className="text-[#C94F32]">
                  Now
                </span>
              </Link>

              <p className="mt-4 max-w-sm leading-relaxed text-white/60">
                Мальта просто. Практичні посібники про подорожі, переїзд і життя на Мальтійських островах.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                Відвідати Мальту
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <Link
                  className="transition hover:text-white"
                  href="/uk/beaches"
                >
                  Пляжі
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/uk/updates/transport"
                >
                  Транспорт
                </Link>

                <span className="text-white/35">
                  Ресторани
                </span>

                <span className="text-white/35">
                  Маршрути
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                Переїзд на Мальту
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <Link
                  className="transition hover:text-white"
                  href="/uk/updates/housing"
                >
                  Житло
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/uk/updates/work"
                >
                  Робота
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/uk/updates/residence"
                >
                  Проживання
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/uk/move-to-malta"
                >
                  Посібник з переїзду
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                GoMaltaNow
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <a
                  className="transition hover:text-white"
                  href="#guides"
                >
                  Посібники
                </a>

                <a
                  className="transition hover:text-white"
                  href="#latest-updates"
                >
                  Останні новини
                </a>

                <span className="text-white/35">
                  Про нас
                </span>

                <a
                  className="transition hover:text-white"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  Контакти
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 GoMaltaNow. Усі права захищено.
            </p>

            <p>Мальта просто.</p>
          </div>
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
    <span className="rounded-full bg-[#E9DED3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#655B53]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function SectionLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#FFFDF9] p-5 transition hover:-translate-y-1 hover:border-[#B83F29]/30 hover:shadow-lg"
    >
      <div>
        <h3 className="font-serif text-2xl">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#766F69]">
          {description}
        </p>
      </div>

      <span className="text-2xl text-[#B83F29] transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
        {icon}
      </div>

      <h3 className="mb-3 font-serif text-2xl">
        {title}
      </h3>

      <p className="leading-relaxed text-white/65">
        {description}
      </p>
    </div>
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