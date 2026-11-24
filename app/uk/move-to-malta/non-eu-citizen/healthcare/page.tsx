import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Охорона здоров’я на Мальті для громадян країн поза ЄС | GoMaltaNow",
  description:
    "Доступ до медичних послуг, страхування, медичні послуги та документи, які можуть знадобитися вам під час проживання на Мальті як громадянину країни поза ЄС.",
  alternates: {
    canonical: "/uk/move-to-malta/non-eu-citizen/healthcare",
    languages: {"en": "/move-to-malta/non-eu-citizen/healthcare", "it": "/it/move-to-malta/non-eu-citizen/healthcare", "pl": "/pl/move-to-malta/non-eu-citizen/healthcare", "fr": "/fr/move-to-malta/non-eu-citizen/healthcare", "de": "/de/move-to-malta/non-eu-citizen/healthcare", "es": "/es/move-to-malta/non-eu-citizen/healthcare", "uk": "/uk/move-to-malta/non-eu-citizen/healthcare", "x-default": "/move-to-malta/non-eu-citizen/healthcare"},
  },
};


export const dynamic = "force-dynamic";

type HealthcareArticle = {
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

const healthcareArticleKeys = [
  "healthcare",
  "health",
  "medical",
  "medicine",
  "insurance",
  "health-insurance",
  "hospital",
  "pharmacy",
  "doctor",
  "clinic",
  "emergency",
];

const healthcareSteps = [
  {
    number: "01",
    title: "З’ясуйте своє право на медичне обслуговування",
    text: "Ваш доступ до медичного обслуговування на Мальті може залежати від статусу проживання, працевлаштування, страхування та особистих обставин. Перш ніж покладатися на певний вид покриття, підтвердьте, що саме застосовується у вашому випадку.",
  },
  {
    number: "02",
    title: "Оформіть необхідне страхування",
    text: "Деякі шляхи імміграції або отримання дозволу на проживання можуть вимагати підтвердження медичного страхування. Переконайтеся, що ваш поліс відповідає умовам, які застосовуються у вашому випадку.",
  },
  {
    number: "03",
    title: "Знайте, куди звертатися по допомогу",
    text: "Дізнайтеся різницю між плановою медичною допомогою, аптеками, медичними центрами, приватними клініками та екстреними службами, щоб знати, куди звертатися, коли вам потрібна допомога.",
  },
  {
    number: "04",
    title: "Зберігайте медичні документи",
    text: "Зберігайте копії страхових полісів, рецептів, медичних висновків, записів про вакцинацію та інших корисних медичних документів.",
  },
  {
    number: "05",
    title: "Переглядайте свою ситуацію, коли вона змінюється",
    text: "Зміна працевлаштування, статусу проживання або страхування може вплинути на організацію вашого медичного обслуговування, тому переглядайте своє покриття, коли змінюються ваші обставини.",
  },
];

const healthcareChecklist = [
  "Passport or identity document",
  "Residence or permit documents where relevant",
  "Health insurance policy or proof of coverage",
  "Employment details where relevant",
  "Important medical records",
  "Current prescriptions",
  "Emergency contact information",
  "Copies of healthcare receipts and correspondence",
];

const healthcareTips = [
  {
    title: "Тримайте дані страхування під рукою",
    text: "Збережіть номер поліса, контактну інформацію страховика та документи про покриття там, де зможете швидко їх знайти.",
  },
  {
    title: "Знайте найближчі медичні служби",
    text: "Заздалегідь визначте найближчі аптеки, медичні центри, клініки та лікарні, перш ніж вони вам терміново знадобляться.",
  },
  {
    title: "Не вважайте, що кожна послуга безкоштовна",
    text: "Право на отримання послуг і їхня вартість можуть залежати від вашого статусу та обраної послуги, тому перевірте умови, які застосовуються у вашому випадку.",
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

function isHealthcareArticle(
  article: HealthcareArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return healthcareArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getHealthcareArticles(): Promise<
  HealthcareArticle[]
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
    .returns<HealthcareArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU healthcare articles",
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
    .filter(isHealthcareArticle);
}

export default async function HealthcarePage() {
  const healthcareArticles =
    await localizeArticles(await getHealthcareArticles(), "uk");

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
                Охорона здоров’я на Мальті
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Охорона здоров’я на Мальті для громадян країн поза ЄС.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Дізнайтеся про доступ до медичних послуг, страхування, медичні послуги та документи, які можуть знадобитися вам під час проживання на Мальті.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#healthcare-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Ознайомтеся з основами ↓
                </a>

                {healthcareArticles.length > 0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Читайте посібники з охорони здоров’я
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Охорона здоров’я та медичні послуги на Мальті"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/healthcare" lang="uk" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Перш ніж вам знадобиться медична допомога
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Заздалегідь дізнайтеся про своє покриття.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Доступ до медичних послуг для громадян третіх країн може залежати від працевлаштування, статусу проживання, страхування та типу необхідної медичної послуги.
          </p>
        </div>
      </section>

      <section
        id="healthcare-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Охорона здоров’я крок за кроком
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Підготуйтеся до організації медичного обслуговування.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Скористайтеся цими кроками, щоб організувати найважливіші аспекти охорони здоров’я до та після переїзду.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {healthcareSteps.map((step) => (
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
              Практичні поради
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Спростіть керування питаннями охорони здоров’я.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {healthcareTips.map((tip) => (
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

      {healthcareArticles.length > 0 && (
        <section
          id="healthcare-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Опубліковані посібники з медичного обслуговування
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Статті про охорону здоров’я та страхування для громадян країн поза ЄС.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Нові схвалені статті про охорону здоров’я, страхування, лікарні, аптеки та медичні послуги автоматично додаються сюди.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {healthcareArticles.length}{" "}
                {healthcareArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {healthcareArticles.map((article) => (
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
              Контрольний список щодо медичного обслуговування
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Зберігайте медичні документи разом.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Точний перелік потрібних документів залежить від вашої ситуації, але впорядковане зберігання цих записів може спростити отримання медичних послуг і проходження адміністративних процедур.
            </p>
          </div>

          <div className="space-y-4">
            {healthcareChecklist.map((item) => (
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
            Продовжуйте практичне облаштування на Мальті.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/uk/move-to-malta/non-eu-citizen/banking-payments"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Банківські послуги та платежі →
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Проживання та документи
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Знайти житло
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Право на медичне обслуговування, вимоги до страхування та умови надання медичних послуг можуть змінюватися. GoMaltaNow надає загальну практичну інформацію і не замінює офіційні рекомендації щодо охорони здоров’я чи професійні медичні поради.
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