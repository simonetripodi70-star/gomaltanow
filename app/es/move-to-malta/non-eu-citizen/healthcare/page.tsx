import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Sanidad en Malta para ciudadanos no pertenecientes a la UE | GoMaltaNow",
  description:
    "Acceso a la sanidad, seguros, servicios médicos y los documentos que puedes necesitar mientras vives en Malta como ciudadano no perteneciente a la UE.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/healthcare",
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
    title: "Comprende tu derecho a la asistencia sanitaria",
    text: "Tu acceso a la sanidad en Malta puede depender de tu estatus de residencia, empleo, seguro y circunstancias personales. Confirma qué se aplica en tu caso antes de confiar en una forma específica de cobertura.",
  },
  {
    number: "02",
    title: "Contrata el seguro necesario",
    text: "Algunas vías de inmigración o residencia pueden requerir pruebas de cobertura sanitaria. Asegúrate de que tu póliza cumple las condiciones aplicables a tu caso.",
  },
  {
    number: "03",
    title: "Sabe dónde buscar atención",
    text: "Conoce la diferencia entre la atención médica habitual, las farmacias, los centros de salud, las clínicas privadas y los servicios de urgencias para saber adónde acudir cuando necesites ayuda.",
  },
  {
    number: "04",
    title: "Guarda tus documentos médicos",
    text: "Conserva copias de las pólizas de seguro, recetas, informes médicos, registros de vacunación y otros documentos sanitarios útiles.",
  },
  {
    number: "05",
    title: "Revisa tu situación cuando cambie",
    text: "Un cambio en el empleo, el estatus de residencia o el seguro puede afectar a tus gestiones sanitarias, así que revisa tu cobertura cuando cambien tus circunstancias.",
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
    title: "Mantén accesibles los datos del seguro",
    text: "Guarda tu número de póliza, la información de contacto de la aseguradora y los documentos de cobertura en un lugar al que puedas acceder rápidamente.",
  },
  {
    title: "Conoce los servicios más cercanos",
    text: "Identifica las farmacias, centros de salud, clínicas y hospitales cercanos antes de necesitarlos con urgencia.",
  },
  {
    title: "No des por hecho que todos los servicios son gratuitos",
    text: "La elegibilidad y los costes pueden depender de tu estatus y del servicio utilizado, así que comprueba las condiciones aplicables a tu caso.",
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
    await localizeArticles(await getHealthcareArticles(), "es");

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
                Sanidad en Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Sanidad en Malta para ciudadanos no pertenecientes a la UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Comprende el acceso a la sanidad, los seguros, los servicios médicos y los documentos que puedes necesitar mientras vives en Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#healthcare-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Entiende lo básico ↓
                </a>

                {healthcareArticles.length > 0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leer guías sobre sanidad
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Sanidad y servicios médicos en Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/healthcare" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Antes de necesitar atención médica
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Comprende tu cobertura con antelación.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            El acceso a la sanidad para nacionales de terceros países puede depender del empleo, el estatus de residencia, el seguro y el tipo de servicio médico necesario.
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
              Sanidad paso a paso
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepara tus gestiones sanitarias.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Sigue estos pasos para organizar los aspectos más importantes de la sanidad antes y después de tu mudanza.
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
              Consejos prácticos
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Haz que la sanidad sea más fácil de gestionar.
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
                  Guías publicadas sobre atención sanitaria
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre sanidad y seguros para ciudadanos no pertenecientes a la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con la sanidad, los seguros, los hospitales, las farmacias y los servicios médicos se enlazan aquí automáticamente.
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
              Lista de verificación sanitaria
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Guarda juntos tus documentos sanitarios.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Los documentos exactos que necesitas dependen de tu situación, pero mantener estos registros organizados puede facilitar la atención sanitaria y los trámites administrativos.
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
            Continúa con tu mudanza
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Continúa con tu preparación práctica en Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/move-to-malta/non-eu-citizen/banking-payments"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Banca y pagos →
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Residencia y documentos
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
            Los requisitos de acceso a la sanidad, seguros y condiciones de los servicios médicos pueden cambiar. GoMaltaNow ofrece información práctica general y no sustituye la orientación sanitaria oficial ni el asesoramiento médico profesional.
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