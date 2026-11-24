import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Permisos de residencia en Malta para ciudadanos no pertenecientes a la UE | GoMaltaNow",
  description:
    "Lleva un control de los permisos, documentos de identidad, tarjetas de residencia, renovaciones y registros administrativos mientras vives en Malta.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/residence",
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
    title: "Comprende tu situación de residencia",
    text: "Tu situación de residencia depende del permiso o la vía de inmigración que se te aplique. Ten claras las condiciones de tu permiso desde el principio.",
  },
  {
    number: "02",
    title: "Prepara la documentación necesaria",
    text: "Mantén organizados y actualizados tu pasaporte, los documentos del permiso, los registros de empleo, los datos de alojamiento y cualquier otro documento justificativo.",
  },
  {
    number: "03",
    title: "Completa los trámites de identidad",
    text: "Es posible que debas completar trámites biométricos, de identidad o de tarjeta de residencia como parte del proceso. Sigue las instrucciones proporcionadas por la autoridad maltesa correspondiente.",
  },
  {
    number: "04",
    title: "Controla los plazos",
    text: "Los documentos y permisos de residencia pueden tener fechas de vencimiento. Lleva un registro de los plazos para que las renovaciones y los documentos justificativos puedan prepararse con suficiente antelación.",
  },
  {
    number: "05",
    title: "Actualiza los cambios cuando sea necesario",
    text: "Es posible que deban comunicarse los cambios relacionados con el empleo, la dirección, los datos del pasaporte o las circunstancias personales. Comprueba las condiciones aplicables a tu permiso.",
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
    title: "Comprueba la fecha de vencimiento",
    text: "No esperes hasta el último momento para revisar la fecha de vencimiento de tu permiso o tarjeta de residencia. Algunos procesos de renovación requieren preparación previa.",
  },
  {
    title: "Mantén actualizada la información de tu dirección",
    text: "Los datos de tu alojamiento pueden ser relevantes para los procesos administrativos, así que conserva tus documentos de alquiler y comprueba si es necesario comunicar los cambios de dirección.",
  },
  {
    title: "Guarda copias digitales",
    text: "Guarda copias digitales claras de pasaportes, permisos, contratos, recibos y cartas oficiales para poder acceder a ellas cuando las necesites.",
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
    await localizeArticles(await getResidenceArticles(), "es");

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
                Residencia y documentos
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Gestiona tus documentos de residencia en Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Lleva un control de los permisos, documentos de identidad, tarjetas de residencia, renovaciones y los registros administrativos relacionados con vivir en Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#residence-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Ver el proceso ↓
                </a>

                {residenceArticles.length > 0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leer guías de residencia
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Documentos de residencia e identidad en Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/residence" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Mantente organizado
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Los documentos de residencia requieren atención continua.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Tus responsabilidades administrativas no terminan necesariamente una vez que se emite un permiso. Lleva un control de las fechas de vencimiento, los cambios en tus circunstancias y cualquier documento que pueda necesitar actualizarse.
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
              Gestión administrativa de residencia
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Mantén bajo control tu situación de residencia.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Utiliza estos pasos como marco práctico para organizar tus documentos y responsabilidades administrativas.
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
              Hábitos importantes
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Evita problemas administrativos que se pueden prevenir.
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
                  Guías de residencia publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre residencia y documentos para ciudadanos no pertenecientes a la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con la residencia, los permisos, los documentos de identidad y las renovaciones se enlazan aquí automáticamente.
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
              Lista de verificación de documentos
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Mantén juntos tus registros esenciales.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Esta es una lista de verificación práctica para organizarte. Los documentos exactos necesarios dependen de tu vía de residencia y de tus circunstancias personales.
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
            Continúa con tu mudanza
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Continúa con las siguientes guías prácticas.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Sanidad →
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Encontrar casa
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/single-permit"
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
            Los requisitos de residencia, inmigración e identidad pueden cambiar. GoMaltaNow ofrece información práctica general y no sustituye la orientación oficial ni el asesoramiento profesional en materia de inmigración.
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