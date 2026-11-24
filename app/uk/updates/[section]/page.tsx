import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Fragment } from "react";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const dynamic = "force-dynamic";

type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  last_checked: string | null;
  published_at: string | null;
};

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

const sectionInformation: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  transport: {
    title: "Транспорт на Мальті",
    description:
      "Офіційні оновлення, практичні посібники та важливі зміни щодо громадського транспорту й мобільності на Мальті.",
  },

  housing: {
    title: "Житло на Мальті",
    description:
      "Оновлення та практична інформація про житло, оренду й офіційні житлові послуги на Мальті.",
  },

  work: {
    title: "Робота на Мальті",
    description:
      "Оновлення щодо працевлаштування, вимоги до роботи та практична інформація для людей, які працюють або переїжджають на Мальту.",
  },

  residence: {
    title: "Проживання на Мальті",
    description:
      "Офіційні оновлення щодо процедур проживання, дозволів і вимог на Мальті.",
  },

  banking: {
    title: "Банківські послуги та платежі",
    description:
      "Практична інформація та офіційні оновлення про банківські послуги, платежі й фінансові послуги на Мальті.",
  },

  healthcare: {
    title: "Охорона здоров’я на Мальті",
    description:
      "Важлива інформація та оновлення щодо охорони здоров’я для відвідувачів, мешканців і людей, які переїжджають на Мальту.",
  },

  tax: {
    title: "Податки на Мальті",
    description:
      "Офіційні оновлення та практичні пояснення щодо оподаткування на Мальті.",
  },

  education: {
    title: "Освіта на Мальті",
    description:
      "Оновлення та посібники про школи, університети й освітні послуги на Мальті.",
  },

  travel: {
    title: "Подорожі на Мальті",
    description:
      "Інформація для подорожей, офіційні оголошення та практичні путівники Мальтою.",
  },

  "government-updates": {
    title: "Оновлення від уряду",
    description:
      "Важливі оголошення та зміни, опубліковані офіційними установами Мальти.",
  },
};

function getSupabasePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Public Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getPublishedArticles(
  section: string,
): Promise<Article[]> {
  const supabase = getSupabasePublicClient();

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
        "last_checked",
        "published_at",
      ].join(","),
    )
    .eq("status", "published")
    .eq("section_slug", section)
    .order("published_at", { ascending: false })
    .returns<Article[]>();

  if (error) {
    console.error("Could not load section articles", error);
    throw new Error("The articles could not be loaded.");
  }

  return data ?? [];
}

export async function generateMetadata({
  params,
}: SectionPageProps) {
  const { section } = await params;
  const information = sectionInformation[section];
  const articles = await localizeArticles(await getPublishedArticles(section).catch(() => []), "uk");

  return {
    alternates: alternatesFor(`/updates/${section}`, "uk"),
    // Le sezioni senza articoli non vengono indicizzate da Google (pagine vuote)
    robots: articles.length === 0 ? { index: false, follow: true } : undefined,
    title: information
      ? `${information.title} | GoMaltaNow`
      : "Malta Updates | GoMaltaNow",

    description:
      information?.description ??
      "Official updates and practical information about Malta.",
  };
}

export default async function SectionPage({
  params,
}: SectionPageProps) {
  const { section } = await params;

  const information = sectionInformation[section] ?? {
    title: formatSectionName(section),
    description:
      "Official updates and practical information about Malta.",
  };

  const articles = await localizeArticles(await getPublishedArticles(section), "uk");

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/uk"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <Link
            href="/uk"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Повернутися на головну
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-20">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#B83F29]">
            Оновлення GoMaltaNow
          </p>

          <h1 className="mt-4 font-serif text-5xl font-medium leading-tight tracking-tight md:text-7xl">
            {information.title}
          </h1>

          <p className="mt-6 text-xl leading-relaxed text-[#625D57]">
            {information.description}
          </p>
        </div>

        <div className="mt-12">
          {articles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#CFC3B7] bg-[#FFFDF9] p-10 text-center">
              <h2 className="font-serif text-3xl">
                Поки немає опублікованих новин
              </h2>

              <p className="mt-3 text-[#625D57]">
                Нові схвалені статті для цього розділу з’являтимуться тут автоматично.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article, index) => (
                <Fragment key={article.id}>
                {index === 4 && (
                  <AdSlot
                    placement="updatesMid"
                    className="md:col-span-2"
                  />
                )}
                <article
                  className="flex flex-col rounded-3xl border border-black/5 bg-[#FFFDF9] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge value={article.category} />
                    <MetadataBadge value={article.audience} />
                  </div>

                  <h2 className="mt-5 font-serif text-3xl leading-tight">
                    {article.title}
                  </h2>

                  <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                    {article.summary}
                  </p>

                  <div className="mt-6 border-t border-black/10 pt-5">
                    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#766F69]">
                      {article.published_at && (
                        <span>
                          Published: {formatDate(article.published_at)}
                        </span>
                      )}

                      {article.last_checked && (
                        <span>
                          Checked: {formatDate(article.last_checked)}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/uk/articles/${article.slug}`}
                      className="inline-flex rounded-2xl bg-[#B83F29] px-5 py-3 font-bold text-white transition hover:bg-[#9F3422]"
                    >
                      Читати статтю
                    </Link>
                  </div>
                </article>
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </section>

      <AdSlot placement="updates" />

      <SideRail contentWidth={1152} />
    </main>
  );
}

function MetadataBadge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#E9DED3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#655B53]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatSectionName(value: string) {
  return value
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}