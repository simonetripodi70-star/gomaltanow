import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Residencia en Malta para ciudadanos de la UE | GoMaltaNow",
  description:
    "Comprende tu vía de residencia en Malta como ciudadano de la UE: los principales documentos, preguntas y pasos antes de presentar la solicitud.",
  alternates: {
    canonical: "/es/move-to-malta/eu-citizen/residence",
    languages: {"en": "/move-to-malta/eu-citizen/residence", "it": "/it/move-to-malta/eu-citizen/residence", "pl": "/pl/move-to-malta/eu-citizen/residence", "fr": "/fr/move-to-malta/eu-citizen/residence", "de": "/de/move-to-malta/eu-citizen/residence", "es": "/es/move-to-malta/eu-citizen/residence", "uk": "/uk/move-to-malta/eu-citizen/residence", "x-default": "/move-to-malta/eu-citizen/residence"},
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

const overview = [
  {
    title: "Para quién es esta guía",
    text: "Ciudadanos de la UE, del EEE y de Suiza que planean vivir en Malta durante un período prolongado.",
  },
  {
    title: "Qué preparar",
    text: "Documentos de identidad, pruebas de tu situación en Malta y documentos justificativos relevantes para tu solicitud.",
  },
  {
    title: "Qué ocurre después",
    text: "Revisa los requisitos actuales, prepara tus documentos y sigue el proceso oficial de solicitud.",
  },
];

const checklist = [
  "Valid passport or national identity card",
  "Proof of your reason for living in Malta",
  "Proof of address or accommodation",
  "Supporting financial or employment documents where required",
  "Healthcare or insurance documents where applicable",
  "Copies of every document submitted",
];

const residenceArticleKeys = [
  "residence",
  "residency",
  "eresidence",
  "e-residence",
  "registration-certificate",
  "documents",
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
    const normalizedKey = normalizeValue(key);

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
    .returns<ResidenceArticle[]>();

  if (error) {
    console.error(
      "Could not load residence articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isResidenceArticle,
  );
}

export default async function ResidencePage() {
  const residenceArticles =
    await localizeArticles(await getResidenceArticles(), "es");

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
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
            href="/es/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Volver a las guías de la UE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Residencia
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Comprende tu vía de residencia en Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Utiliza esta guía para organizar los principales documentos, preguntas y pasos necesarios antes de iniciar tu solicitud de residencia.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-semibold text-white transition hover:bg-[#243F33]"
                >
                  Ver la lista de comprobación ↓
                </a>

                {residenceArticles.length >
                  0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-semibold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leer artículos sobre residencia
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/residence-malta.jpg"
              alt="Documentos de residencia para mudarse a Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/residence" lang="es" />

      {/* Published articles */}
      {residenceArticles.length > 0 && (
        <section
          id="residence-articles"
          className="border-y border-[#D9E3DD] bg-[#E8EFEA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guías de residencia publicadas
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#243F33] md:text-5xl">
                  Artículos detallados sobre la residencia en Malta.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#536159]">
                  Estos artículos aprobados se conectan automáticamente a esta página cada vez que se publica nuevo contenido sobre residencia.
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
              {residenceArticles.map(
                (article) => (
                  <Link
                    key={article.id}
                    href={`/es/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#C9D8CF] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#315846]/40 hover:shadow-xl"
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
                        Leer artículo →
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Empieza con la información adecuada.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Los requisitos de residencia pueden depender de tu situación personal, así que empieza por identificar qué categoría se aplica a tu caso.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {overview.map((item) => (
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
        className="bg-[#315846] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Lista de preparación
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Documentos que organizar.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Esta es una lista de planificación, no una lista legal definitiva. Confirma siempre los requisitos oficiales vigentes antes de solicitarla.
            </p>

            {residenceArticles.length >
              0 && (
              <a
                href="#residence-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#315846] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Lee las guías detalladas
              </a>
            )}
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

      {/* Important note */}
      <section className="bg-[#E8EFEA] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#315846]">
            Importante
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#243F33] md:text-4xl">
            Consulta los últimos requisitos oficiales antes de solicitarla.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#536159]">
            Los procedimientos, formularios y documentos justificativos pueden cambiar. Esta página está diseñada para ayudar a los usuarios a prepararse y comprender el proceso, mientras que las autoridades maltesas oficiales siguen siendo la fuente definitiva.
          </p>
        </div>
      </section>

      {/* Footer */}
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

          <p className="text-sm text-white/55">
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
    <span className="rounded-full bg-[#E4ECE7] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#315846]">
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