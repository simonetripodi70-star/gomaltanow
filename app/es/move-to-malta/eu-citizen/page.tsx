import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Mudarse a Malta como ciudadano de la UE | GoMaltaNow",
  description:
    "Todo lo que los ciudadanos de la UE deben saber antes de mudarse a Malta: documentos, residencia, vivienda, trabajo, bancos y sanidad.",
  alternates: {
    canonical: "/es/move-to-malta/eu-citizen",
    languages: {"en": "/move-to-malta/eu-citizen", "it": "/it/move-to-malta/eu-citizen", "pl": "/pl/move-to-malta/eu-citizen", "fr": "/fr/move-to-malta/eu-citizen", "de": "/de/move-to-malta/eu-citizen", "es": "/es/move-to-malta/eu-citizen", "uk": "/uk/move-to-malta/eu-citizen", "x-default": "/move-to-malta/eu-citizen"},
  },
};


export const dynamic = "force-dynamic";

type PublishedArticle = {
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

type Guide = {
  label: string;
  title: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  articleKeys: string[];
};

const guides: Guide[] = [
  {
    label: "Prepárate",
    title: "Antes de mudarte",
    description:
      "Prepara tus documentos, tu presupuesto y los primeros pasos prácticos antes de llegar a Malta.",
    image: "/images/before-you-move.jpg",
    href: "/move-to-malta/eu-citizen/before-you-move",
    cta: "Abrir guía",
    articleKeys: [
      "before-you-move",
      "preparation",
      "moving",
      "relocation",
    ],
  },
  {
    label: "Tus documentos",
    title: "Residencia",
    description:
      "Entiende el proceso de residencia y los documentos principales que suelen necesitar los ciudadanos de la UE.",
    image: "/images/residence-malta.jpg",
    href: "/move-to-malta/eu-citizen/residence",
    cta: "Abrir guía",
    articleKeys: [
      "residence",
      "residency",
      "eresidence",
      "documents",
    ],
  },
  {
    label: "Dónde vivir",
    title: "Encontrar casa",
    description:
      "Compara zonas, precios de alquiler, contratos y los pasos principales para alquilar.",
    image: "/images/find-home-malta.jpg",
    href: "/move-to-malta/eu-citizen/find-a-home",
    cta: "Abrir guía",
    articleKeys: [
      "housing",
      "home",
      "renting",
      "rental",
      "accommodation",
    ],
  },
  {
    label: "Oportunidades de trabajo",
    title: "Encontrar trabajo",
    description:
      "Dónde buscar, cómo preparar tu candidatura y qué esperar del mercado laboral.",
    image: "/images/find-job-malta.jpg",
    href: "/move-to-malta/eu-citizen/find-a-job",
    cta: "Abrir guía",
    articleKeys: [
      "jobs",
      "job",
      "work",
      "employment",
      "career",
    ],
  },
  {
    label: "Dinero",
    title: "Bancos y pagos",
    description:
      "Qué puedes necesitar para abrir una cuenta, cobrar tu salario y gestionar pagos locales.",
    image: "/images/banking-payments-malta.jpg",
    href: "/move-to-malta/eu-citizen/banking-payments",
    cta: "Abrir guía",
    articleKeys: [
      "banking-payments",
      "banking",
      "payments",
      "finance",
      "revolut",
    ],
  },
  {
    label: "Vida diaria",
    title: "Sanidad",
    description:
      "Cómo funciona la sanidad en Malta y qué organizar después de mudarte.",
    image: "/images/healthcare-malta.jpg",
    href: "/move-to-malta/eu-citizen/healthcare",
    cta: "Abrir guía",
    articleKeys: [
      "healthcare",
      "health",
      "medical",
      "insurance",
    ],
  },
];

const journeySteps = [
  "Prepare your documents and budget before arrival",
  "Find the right area and organise your accommodation",
  "Complete residence and everyday registrations",
  "Set up work, banking, healthcare and local essentials",
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

async function getPublishedArticles(): Promise<
  PublishedArticle[]
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
    .returns<PublishedArticle[]>();

  if (error) {
    console.error(
      "Could not load EU citizen articles",
      error,
    );

    return [];
  }

  return data ?? [];
}

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function articleMatchesGuide(
  article: PublishedArticle,
  guide: Guide,
) {
  const values = [
    article.category,
    article.section_slug,
  ].map(normalizeValue);

  return guide.articleKeys.some((key) => {
    const normalizedKey = normalizeValue(key);

    return values.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey) ||
        normalizedKey.includes(value),
    );
  });
}

function getGuideArticles(
  articles: PublishedArticle[],
  guide: Guide,
) {
  return articles.filter((article) =>
    articleMatchesGuide(article, guide),
  );
}

export default async function EUCitizenPage() {
  const publishedArticles =
    await getPublishedArticles();

  const linkedArticleIds = new Set(
    guides.flatMap((guide) =>
      getGuideArticles(
        publishedArticles,
        guide,
      ).map((article) => article.id),
    ),
  );

  const otherArticles =
    publishedArticles.filter(
      (article) =>
        !linkedArticleIds.has(article.id),
    );

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/es"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/es/move-to-malta"
            className="text-sm font-medium text-white/85 transition hover:text-[#D96A4A]"
          >
            ← Cambiar ciudadanía
          </Link>
        </div>
      </nav>

      <section className="border-b border-[#E7DDD3] bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl overflow-hidden md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-20">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#2F5F8A]">
                Ciudadanos de la UE / EEE / Suiza
              </p>

              <h1 className="font-serif text-5xl font-medium leading-[1.02] md:text-6xl">
                Todo lo que necesitas saber antes de mudarte a Malta.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-[#625D57]">
                Esta página reúne la información esencial para organizar tu mudanza con más claridad: desde los documentos y la residencia hasta la vivienda, el trabajo y la vida diaria.
              </p>

              <a
                href="#guides"
                className="mt-8 inline-flex rounded-full bg-[#2F5F8A] px-6 py-3 font-semibold text-white transition hover:bg-[#23496C]"
              >
                Ver las guías
              </a>
            </div>
          </div>

          <div>
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Casa tradicional maltesa con balcón azul"
              width={1200}
              height={1200}
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section
        id="guides"
        className="py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Empieza por lo que necesitas ahora.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Elige un tema y abre su guía práctica. Los artículos publicados se conectan automáticamente a la sección adecuada.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => {
              const guideArticles =
                getGuideArticles(
                  publishedArticles,
                  guide,
                );

              return (
                <article
                  key={guide.title}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7DDD3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <Link
                    href={guide.href}
                    className="group block overflow-hidden"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B83F29]">
                          {guide.label}
                        </p>

                        {guideArticles.length >
                          0 && (
                          <span className="rounded-full bg-[#E8F0F7] px-3 py-1 text-xs font-bold text-[#2F5F8A]">
                            {
                              guideArticles.length
                            }{" "}
                            {guideArticles.length ===
                            1
                              ? "article"
                              : "articles"}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-serif text-3xl font-medium transition group-hover:text-[#2F5F8A]">
                        {guide.title}
                      </h3>

                      <p className="mt-3 leading-relaxed text-[#625D57]">
                        {guide.description}
                      </p>

                      <span className="mt-5 inline-flex font-semibold text-[#B83F29]">
                        {guide.cta} →
                      </span>
                    </div>
                  </Link>

                  {guideArticles.length > 0 && (
                    <div className="mt-auto border-t border-[#E7DDD3] bg-[#FBF7F2] p-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#766F69]">
                        Artículos publicados
                      </p>

                      <div className="grid gap-2">
                        {guideArticles.map(
                          (article) => (
                            <Link
                              key={article.id}
                              href={`/articles/${article.slug}`}
                              className="group flex items-start justify-between gap-3 rounded-xl border border-transparent bg-white px-4 py-3 transition hover:border-[#2F5F8A]/20 hover:shadow-sm"
                            >
                              <span className="font-semibold leading-6 text-[#292521] transition group-hover:text-[#2F5F8A]">
                                {article.title}
                              </span>

                              <span className="shrink-0 text-[#B83F29] transition group-hover:translate-x-1">
                                →
                              </span>
                            </Link>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      {publishedArticles.length > 0 && (
        <section className="border-y border-[#D8CFC6] bg-[#EFE5DA] py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Publicado recientemente
                </p>

                <h2 className="font-serif text-4xl font-medium md:text-5xl">
                  Últimos artículos para ciudadanos de la UE
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Lee las últimas guías aprobadas sobre residencia, vivienda, empleo, sanidad y pagos.
                </p>
              </div>

              <span className="text-sm font-semibold text-[#766F69]">
                {publishedArticles.length}{" "}
                published{" "}
                {publishedArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {publishedArticles.map(
                (article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-black/5 bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#2F5F8A]/20 hover:shadow-xl"
                  >
                    <div className="flex flex-wrap gap-2">
                      <MetadataBadge
                        value={
                          article.category
                        }
                      />

                      <MetadataBadge
                        value={
                          article.audience
                        }
                      />
                    </div>

                    <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#2F5F8A]">
                      {article.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                      {article.summary}
                    </p>

                    <div className="mt-7 border-t border-black/10 pt-5">
                      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#766F69]">
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
                        Leer artículo →
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>

            {otherArticles.length > 0 && (
              <p className="mt-8 text-sm leading-6 text-[#766F69]">
                Algunos artículos aún no tienen una categoría de guía, pero se muestran igualmente entre los últimos artículos.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="bg-[#173E63] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/65">
              Tu recorrido
            </p>

            <h2 className="max-w-md font-serif text-4xl font-medium md:text-5xl">
              Múdate con un plan más claro.
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-white/80">
              GoMaltaNow te ayuda a centrarte en lo importante en el momento adecuado.
            </p>
          </div>

          <div className="space-y-4">
            {journeySteps.map((step) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4"
              >
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#D96A4A]" />

                <p className="leading-relaxed text-white/90">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/es"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/60">
            © 2026 GoMaltaNow. Malta fácil.
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
    <span className="rounded-full bg-[#E9DED3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#655B53]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}