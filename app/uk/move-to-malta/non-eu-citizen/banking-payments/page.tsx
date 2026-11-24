import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Банківські послуги на Мальті для не-громадян ЄС | GoMaltaNow",
  description:
    "Як підготуватися до відкриття рахунку, отримання зарплати, користування картками та здійснення щоденних платежів на Мальті.",
  alternates: {
    canonical: "/uk/move-to-malta/non-eu-citizen/banking-payments",
    languages: {"en": "/move-to-malta/non-eu-citizen/banking-payments", "it": "/it/move-to-malta/non-eu-citizen/banking-payments", "pl": "/pl/move-to-malta/non-eu-citizen/banking-payments", "fr": "/fr/move-to-malta/non-eu-citizen/banking-payments", "de": "/de/move-to-malta/non-eu-citizen/banking-payments", "es": "/es/move-to-malta/non-eu-citizen/banking-payments", "uk": "/uk/move-to-malta/non-eu-citizen/banking-payments", "x-default": "/move-to-malta/non-eu-citizen/banking-payments"},
  },
};


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

const bankingArticleKeys = [
  "banking-payments",
  "banking",
  "payments",
  "finance",
  "financial",
  "money",
  "account",
  "salary-account",
  "cards",
  "card",
  "transfers",
  "revolut",
];

const bankingSteps = [
  {
    number: "01",
    title: "Оберіть відповідний рахунок",
    text: "Порівняйте традиційні мальтійські банки, провайдерів через застосунки та платіжні сервіси відповідно до ваших потреб щодо зарплати, переказів, користування карткою та щоденних витрат.",
  },
  {
    number: "02",
    title: "Підготуйте документи",
    text: "Банки та платіжні провайдери можуть запитувати посвідчення особи, підтвердження адреси, інформацію про працевлаштування та інші підтвердні документи.",
  },
  {
    number: "03",
    title: "Налаштуйте виплату зарплати",
    text: "Після відкриття рахунку підтвердьте правильний IBAN або реквізити рахунку у свого роботодавця, щоб можна було організувати виплату зарплати.",
  },
  {
    number: "04",
    title: "Сплануйте оренду та регулярні платежі",
    text: "Переконайтеся, що через обраний рахунок ви можете сплачувати оренду, комунальні послуги, підписки та інші регулярні витрати.",
  },
  {
    number: "05",
    title: "Перевірте комісії та ліміти",
    text: "Перш ніж покладатися на одного провайдера, перевірте комісії за рахунок, збори за зняття коштів у банкоматах, витрати на обмін валют, ліміти переказів та умови використання картки.",
  },
];

const bankingChecklist = [
  "Valid passport",
  "Residence or permit documents where requested",
  "Proof of address",
  "Employment contract or proof of income",
  "Tax or identification details where requested",
  "Mobile number and email address",
  "Copies of submitted documents",
  "Account and IBAN details once approved",
];

const bankingTips = [
  {
    title: "Порівнюйте не лише щомісячну комісію",
    text: "Збори в банкоматах, міжнародні перекази, обмінні курси та комісії за картку можуть бути не менш важливими, ніж базова вартість рахунку.",
  },
  {
    title: "Майте резервний спосіб оплати",
    text: "Друга картка або рахунок можуть стати в пригоді, якщо основну картку загублено, заблоковано або вона тимчасово недоступна.",
  },
  {
    title: "Захистіть свій рахунок",
    text: "Використовуйте надійні налаштування безпеки, сповіщення про платежі та двофакторну автентифікацію, де це доступно.",
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
    const normalizedKey =
      normalizeValue(key);

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
    .returns<BankingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU banking articles",
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
    .filter(isBankingArticle);
}

export default async function BankingPaymentsPage() {
  const bankingArticles =
    await localizeArticles(await getBankingArticles(), "uk");

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
                Банки та платежі
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Банківські послуги та платежі на Мальті для не-громадян ЄС.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Дізнайтеся, як підготуватися до відкриття рахунку, отримання зарплати, користування картками та здійснення щоденних платежів на Мальті.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#banking-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Ознайомтеся з основами ↓
                </a>

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Приєднатися до Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                Кнопка Revolut містить персональне запрошувальне посилання.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Банківські послуги та платежі на Мальті"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/banking-payments" lang="uk" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Повсякденні фінанси
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Налаштуйте свої фінанси заздалегідь.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Рахунок, який підходить для отримання зарплати, сплати оренди та щоденних витрат, може значно полегшити ваші перші тижні на Мальті.
          </p>
        </div>
      </section>

      <section
        id="banking-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Банківські послуги крок за кроком
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Організуйте свої платежі за чітким планом.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Вимоги різняться залежно від банку та платіжного провайдера, але ось основні сфери, до яких варто підготуватися.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {bankingSteps.map((step) => (
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

      <section className="bg-[#F2EACF] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
              Банківські послуги через застосунок
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-6xl">
              Revolut може бути практичним варіантом.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
              Revolut може бути корисним для оплат карткою, переказів, роботи з кількома валютами та керування щоденними витратами через застосунок.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-[#625D57]">
              Доступність, верифікація, функції рахунку та комісії залежать від клієнта й поточних умов провайдера.
            </p>

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
            >
              Відкрити Revolut →
            </a>

            <p className="mt-3 text-xs text-[#766F69]">
              Ця сторінка містить персональне запрошувальне посилання Revolut.
            </p>
          </div>

          <a
            href={REVOLUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-[#D8C98F] bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111315] text-2xl text-white">
                €
              </div>

              <span className="text-3xl text-[#75601C] transition group-hover:translate-x-2">
                →
              </span>
            </div>

            <h3 className="mt-8 font-serif text-4xl">
              Приєднатися до Revolut
            </h3>

            <p className="mt-4 leading-7 text-[#625D57]">
              Керуйте картками, переказами та щоденними платежами з одного рахунку в застосунку.
            </p>

            <span className="mt-7 inline-flex font-bold text-[#75601C]">
              Почати →
            </span>
          </a>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Практичні поради
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Уникайте поширених банківських проблем.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {bankingTips.map((tip) => (
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

      {bankingArticles.length > 0 && (
        <section
          id="banking-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Опубліковані путівники з банківських послуг
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Статті про банківські послуги та платежі для не-громадян ЄС.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Нові схвалені статті про банківські послуги, картки, перекази, виплату зарплати та Revolut автоматично додаються сюди.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
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
              Контрольний список для банківських послуг
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Підготуйте документи для відкриття рахунку.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Кожен провайдер може мати різні вимоги, тому використовуйте це як список для підготовки та підтверджуйте остаточний перелік документів безпосередньо у провайдера.
            </p>
          </div>

          <div className="space-y-4">
            {bankingChecklist.map((item) => (
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
            Ваше основне облаштування як не-громадянина ЄС набуває форми.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/uk/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Охорона здоров’я →
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Проживання та документи
            </Link>

            <Link
              href="/uk/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Знайти роботу
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Умови для відкриття банківського рахунку, комісії, вимоги до рахунків і умови провайдерів можуть змінюватися. GoMaltaNow надає загальну практичну інформацію. Завжди перевіряйте актуальні умови безпосередньо у відповідному банку або платіжного провайдера.
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