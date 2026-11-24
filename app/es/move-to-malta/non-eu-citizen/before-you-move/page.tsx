import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Antes de mudarte a Malta: lista de comprobación para ciudadanos no pertenecientes a la UE | GoMaltaNow",
  description:
    "Organiza tus documentos, presupuesto, alojamiento y planificación de inmigración antes de viajar a Malta como ciudadano no perteneciente a la UE.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/before-you-move",
    languages: {"en": "/move-to-malta/non-eu-citizen/before-you-move", "it": "/it/move-to-malta/non-eu-citizen/before-you-move", "pl": "/pl/move-to-malta/non-eu-citizen/before-you-move", "fr": "/fr/move-to-malta/non-eu-citizen/before-you-move", "de": "/de/move-to-malta/non-eu-citizen/before-you-move", "es": "/es/move-to-malta/non-eu-citizen/before-you-move", "uk": "/uk/move-to-malta/non-eu-citizen/before-you-move", "x-default": "/move-to-malta/non-eu-citizen/before-you-move"},
  },
};


export const dynamic = "force-dynamic";

type MovingArticle = {
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

const movingArticleKeys = [
  "before-you-move",
  "moving",
  "move",
  "relocation",
  "relocating",
  "preparation",
  "prepare",
  "arrival",
  "documents",
  "first-steps",
  "checklist",
  "budget",
];

const preparationSteps = [
  {
    number: "01",
    title: "Entiende tu vía de inmigración",
    text: "Antes de viajar, identifica qué vía de residencia o empleo se aplica a tu caso y qué condiciones debes cumplir.",
  },
  {
    number: "02",
    title: "Prepara tus documentos",
    text: "Mantén organizados tu pasaporte, historial laboral, titulaciones, datos de alojamiento y cualquier documento justificativo antes de partir.",
  },
  {
    number: "03",
    title: "Planifica tu primer alojamiento",
    text: "Organiza un lugar fiable donde alojarte mientras completas tus primeros trámites administrativos y buscas vivienda a largo plazo si la necesitas.",
  },
  {
    number: "04",
    title: "Crea un presupuesto realista para el traslado",
    text: "Planifica el alquiler, las fianzas, el transporte, la comida, el seguro, los costes administrativos y los gastos imprevistos durante tus primeras semanas en Malta.",
  },
  {
    number: "05",
    title: "Guarda copias de todo",
    text: "Conserva copias digitales e impresas de los documentos importantes, solicitudes, contratos, recibos y comunicaciones oficiales.",
  },
];

const checklist = [
  "Valid passport",
  "Employment offer or supporting work documents where relevant",
  "Qualifications and certificates",
  "Temporary accommodation details",
  "Proof of funds where required",
  "Insurance or healthcare documentation",
  "Digital copies of important documents",
  "Emergency contact details",
];

const preparationTips = [
  {
    title: "No viajes basándote en suposiciones",
    text: "Confirma las condiciones de inmigración aplicables a tu situación antes de tomar decisiones irreversibles relacionadas con el viaje o el empleo.",
  },
  {
    title: "Presupuesta cuidadosamente el primer mes",
    text: "Tus costes iniciales pueden ser más altos que los de un mes normal debido a las fianzas, el alojamiento temporal y los gastos de instalación.",
  },
  {
    title: "Mantén separada la información oficial",
    text: "Utiliza GoMaltaNow como guía práctica, pero confirma siempre los requisitos finales con las autoridades maltesas competentes.",
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

function isMovingArticle(
  article: MovingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return movingArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getMovingArticles(): Promise<
  MovingArticle[]
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
    .returns<MovingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU before-you-move articles",
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
    .filter(isMovingArticle);
}

export default async function BeforeYouMovePage() {
  const movingArticles =
    await localizeArticles(await getMovingArticles(), "es");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
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
            href="/es/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Volver a las guías para personas no pertenecientes a la UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Antes de mudarte
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Prepara tu traslado a Malta como ciudadano no perteneciente a la UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Organiza tus documentos, presupuesto, alojamiento y planificación de inmigración antes de viajar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#preparation-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Empieza a prepararte ↓
                </a>

                {movingArticles.length > 0 && (
                  <a
                    href="#moving-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lee las guías para mudarte
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Prepararse para mudarse a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/before-you-move" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Antes de viajar
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            La preparación puede evitar problemas importantes más adelante.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Los requisitos de inmigración, empleo y residencia pueden estar estrechamente relacionados. Asegúrate de entender cuál es tu vía antes de organizar el resto de tu traslado.
          </p>
        </div>
      </section>

      <section
        id="preparation-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Preparación paso a paso
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Organiza lo esencial antes de partir.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Estos pasos te ofrecen un marco práctico para preparar tu traslado.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {preparationSteps.map((step) => (
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
              Antes de partir
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Tres cosas que merece la pena comprobar dos veces.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {preparationTips.map((tip) => (
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

      {movingArticles.length > 0 && (
        <section
          id="moving-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guías de mudanza publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre preparación y traslado para ciudadanos no pertenecientes a la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con la preparación, el traslado, la llegada y los primeros pasos se vinculan aquí automáticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {movingArticles.length}{" "}
                {movingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {movingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/es/articles/${article.slug}`}
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
                      Leer artículo →
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
              Lista de comprobación para la mudanza
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepara tus documentos esenciales.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Esta es una lista general de preparación. Los documentos exactos dependen de tu vía de inmigración y de tus circunstancias personales.
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
            Siguiente paso
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Entiende tu vía de empleo y permiso.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Single Permit →
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Encontrar trabajo
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Encontrar casa
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Los requisitos de inmigración, entrada, empleo y residencia pueden cambiar. GoMaltaNow ofrece información práctica general y no sustituye la orientación oficial ni el asesoramiento profesional en materia de inmigración.
          </p>
        </div>
      </section>

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

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}