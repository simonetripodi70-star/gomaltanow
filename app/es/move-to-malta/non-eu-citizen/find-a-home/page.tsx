import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Encontrar un hogar en Malta para ciudadanos de fuera de la UE | GoMaltaNow",
  description:
    "Cómo abordar el alquiler, las fianzas, los contratos y los documentos de vivienda al mudarte a Malta como ciudadano de fuera de la UE.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/find-a-home",
    languages: {"en": "/move-to-malta/non-eu-citizen/find-a-home", "it": "/it/move-to-malta/non-eu-citizen/find-a-home", "pl": "/pl/move-to-malta/non-eu-citizen/find-a-home", "fr": "/fr/move-to-malta/non-eu-citizen/find-a-home", "de": "/de/move-to-malta/non-eu-citizen/find-a-home", "es": "/es/move-to-malta/non-eu-citizen/find-a-home", "uk": "/uk/move-to-malta/non-eu-citizen/find-a-home", "x-default": "/move-to-malta/non-eu-citizen/find-a-home"},
  },
};


export const dynamic = "force-dynamic";

type HousingArticle = {
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

const housingArticleKeys = [
  "housing",
  "home",
  "rent",
  "renting",
  "rental",
  "accommodation",
  "property",
  "landlord",
  "tenant",
  "lease",
  "housing-authority",
];

const housingSteps = [
  {
    number: "01",
    title: "Elige la zona adecuada",
    text: "Compara los tiempos de desplazamiento, el transporte público, las tiendas, los servicios y los niveles de alquiler antes de decidir dónde vivir.",
  },
  {
    number: "02",
    title: "Establece un presupuesto realista",
    text: "Ten en cuenta el alquiler mensual, la fianza, los suministros y los costes iniciales que puedan ser necesarios al mudarte a una vivienda.",
  },
  {
    number: "03",
    title: "Examina la vivienda con atención",
    text: "Comprueba el estado de la vivienda, los muebles, los electrodomésticos y cualquier problema antes de aceptar alquilarla.",
  },
  {
    number: "04",
    title: "Revisa el contrato de alquiler",
    text: "Lee atentamente el contrato de arrendamiento y comprende el alquiler, la fianza, la duración, las normas de preaviso y las responsabilidades antes de firmar.",
  },
  {
    number: "05",
    title: "Guarda los documentos de tu vivienda",
    text: "Conserva copias del contrato firmado, los justificantes de pago, el inventario y cualquier registro o correspondencia relevante.",
  },
];

const checklist = [
  "Valid passport or identification",
  "Proof of income or employment where requested",
  "Money available for rent and deposit",
  "Written rental agreement",
  "Inventory or condition report where available",
  "Copies of rent and deposit payments",
  "Landlord or agent contact details",
  "Copies of housing registration documents where applicable",
];

const housingTips = [
  {
    title: "Nunca te precipites con una fianza",
    text: "Antes de transferir dinero, confirma la vivienda, la persona con la que tratas y las condiciones del contrato de alquiler.",
  },
  {
    title: "Comprende qué está incluido",
    text: "Comprueba si los suministros, internet, las cuotas de zonas comunes u otros cargos están incluidos en el alquiler anunciado.",
  },
  {
    title: "Deja todo por escrito",
    text: "Los acuerdos importantes sobre el alquiler, las reparaciones, las fianzas y los plazos de preaviso deben documentarse en lugar de basarse únicamente en promesas verbales.",
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

function isHousingArticle(
  article: HousingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return housingArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getHousingArticles(): Promise<
  HousingArticle[]
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
    .returns<HousingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU housing articles",
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
    .filter(isHousingArticle);
}

export default async function FindAHomePage() {
  const housingArticles =
    await localizeArticles(await getHousingArticles(), "es");

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
                Vivienda en Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Encuentra un hogar en Malta como ciudadano de fuera de la UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Descubre cómo abordar el alquiler, las fianzas, los contratos y los documentos de vivienda al mudarte a Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#housing-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Empieza por lo básico ↓
                </a>

                {housingArticles.length > 0 && (
                  <a
                    href="#housing-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lee las guías de vivienda
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Encontrar un hogar en Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/find-a-home" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Antes de firmar nada
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Asegúrate de que el acuerdo de alquiler esté claro.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Tus documentos de vivienda pueden ser importantes para la vida diaria y los trámites administrativos en Malta, así que guarda copias precisas de tu contrato y tus pagos.
          </p>
        </div>
      </section>

      <section
        id="housing-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Alquilar paso a paso
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Aborda tu búsqueda de vivienda con cuidado.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Tomar algunas precauciones antes de firmar puede ayudarte a evitar problemas costosos más adelante.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {housingSteps.map((step) => (
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
              Protégete durante el proceso de alquiler.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {housingTips.map((tip) => (
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

      {housingArticles.length > 0 && (
        <section
          id="housing-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guías de vivienda publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre alquiler y vivienda para ciudadanos de fuera de la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con vivienda, alquileres, contratos de arrendamiento y alojamiento se enlazan aquí automáticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {housingArticles.length}{" "}
                {housingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {housingArticles.map((article) => (
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
              Lista de comprobación para el alquiler
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Mantén organizada la documentación de tu vivienda.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Guarda tu contrato, los justificantes de pago y la correspondencia relevante desde el inicio del arrendamiento.
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
            La vivienda es solo una parte de establecerte en Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Residencia y documentos →
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Encontrar trabajo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Las normas de alquiler, los requisitos de registro y los procedimientos administrativos pueden cambiar. GoMaltaNow ofrece información práctica general y no sustituye la orientación oficial ni el asesoramiento jurídico.
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