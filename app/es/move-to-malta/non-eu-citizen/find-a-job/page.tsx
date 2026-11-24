import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Encontrar trabajo en Malta para ciudadanos no pertenecientes a la UE | GoMaltaNow",
  description:
    "Cómo enfocar tu búsqueda de empleo, preparar tus candidaturas y entender el proceso de contratación en Malta como ciudadano no perteneciente a la UE.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/find-a-job",
    languages: {"en": "/move-to-malta/non-eu-citizen/find-a-job", "it": "/it/move-to-malta/non-eu-citizen/find-a-job", "pl": "/pl/move-to-malta/non-eu-citizen/find-a-job", "fr": "/fr/move-to-malta/non-eu-citizen/find-a-job", "de": "/de/move-to-malta/non-eu-citizen/find-a-job", "es": "/es/move-to-malta/non-eu-citizen/find-a-job", "uk": "/uk/move-to-malta/non-eu-citizen/find-a-job", "x-default": "/move-to-malta/non-eu-citizen/find-a-job"},
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

const jobArticleKeys = [
  "jobs",
  "job",
  "work",
  "employment",
  "career",
  "recruitment",
  "jobsplus",
  "eures",
  "sponsorship",
  "employer",
  "hiring",
];

const jobSteps = [
  {
    number: "01",
    title: "Dirígete a empleadores adecuados",
    text: "Céntrate en empleadores y puestos que sean realmente accesibles para nacionales de terceros países y averigua si შეიძლება ser necesario el patrocinio del permiso.",
  },
  {
    number: "02",
    title: "Prepara un CV sólido",
    text: "Mantén tu CV claro y conciso, destaca la experiencia y las cualificaciones relevantes, y adáptalo al puesto al que te presentas.",
  },
  {
    number: "03",
    title: "Busca a través de canales fiables",
    text: "Utiliza portales de empleo de confianza, agencias de selección, páginas de empleo de empresas y recursos oficiales de empleo al buscar vacantes en Malta.",
  },
  {
    number: "04",
    title: "Aclara las responsabilidades relativas al permiso",
    text: "Antes de aceptar un puesto, asegúrate de entender quién gestionará el proceso de empleo y permiso, y qué documentos tendrás que aportar.",
  },
  {
    number: "05",
    title: "Revisa la oferta de empleo",
    text: "Comprueba el salario, el horario laboral, el periodo de prueba, las funciones, la ubicación y cualquier otra condición laboral importante antes de comprometerte.",
  },
];

const checklist = [
  "Updated CV in English",
  "Valid passport",
  "Copies of qualifications and certificates",
  "Employment references where available",
  "Clear understanding of your permit situation",
  "Professional email address and Maltese contact number when possible",
  "Copies of job offers and employment correspondence",
  "Information about the employer before accepting a position",
];

const searchChannels = [
  {
    title: "Páginas de empleo de empresas",
    text: "Preséntate directamente a empleadores que estén contratando activamente para puestos que se ajusten a tu experiencia.",
  },
  {
    title: "Agencias de selección",
    text: "Los reclutadores pueden ayudar a conectar a candidatos con empleadores, especialmente en sectores con contratación internacional habitual.",
  },
  {
    title: "Plataformas de empleo",
    text: "Utiliza sitios web de empleo consolidados y mantén activas las alertas para nuevas vacantes que se ajusten a tus competencias.",
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

function isJobArticle(
  article: JobArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return jobArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

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
    .returns<JobArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU job articles",
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
    .filter(isJobArticle);
}

export default async function FindAJobPage() {
  const jobArticles =
    await localizeArticles(await getJobArticles(), "es");

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
                Empleo en Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Encuentra trabajo en Malta como ciudadano no perteneciente a la UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Descubre cómo enfocar tu búsqueda de empleo, preparar tus candidaturas y entender el proceso de contratación antes de aceptar un puesto.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#job-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Empieza tu búsqueda de empleo ↓
                </a>

                <Link
                  href="/es/move-to-malta/non-eu-citizen/single-permit"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Guía del Single Permit
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Encontrar empleo en Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/find-a-job" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Importante para nacionales de terceros países
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            El empleo y la inmigración suelen estar relacionados.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Para muchos ciudadanos no pertenecientes a la UE, la oferta de trabajo y el proceso de inmigración están estrechamente vinculados. Confirma tu vía legal antes de tomar decisiones importantes de reubicación.
          </p>
        </div>
      </section>

      <section
        id="job-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Proceso de búsqueda de empleo
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Enfoca tu búsqueda de empleo paso a paso.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Una búsqueda centrada es más eficaz que enviar la misma candidatura a todas partes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {jobSteps.map((step) => (
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
              Dónde buscar
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Utiliza más de un canal de búsqueda de empleo.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {searchChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {channel.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {channel.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {jobArticles.length > 0 && (
        <section
          id="job-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guías de empleo publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre trabajo y empleo para ciudadanos no pertenecientes a la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con trabajo, empleo, contratación y patrocinio se enlazan aquí automáticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
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
              Lista de verificación para solicitar empleo
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepárate antes de empezar a presentar candidaturas.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Una buena preparación facilita responder rápidamente cuando un empleador solicita documentos o información adicional.
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
            ¿Has encontrado trabajo? Entiende el proceso de permiso.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-[#625D57]">
            Antes de reubicarte, asegúrate de entender la vía de inmigración vinculada a tu empleo.
          </p>

          <Link
            href="/es/move-to-malta/non-eu-citizen/single-permit"
            className="mt-8 inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
          >
            Ir al Single Permit →
          </Link>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Los procedimientos de empleo e inmigración pueden cambiar. GoMaltaNow ofrece información práctica general y no sustituye la orientación oficial ni el asesoramiento profesional en materia de inmigración.
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