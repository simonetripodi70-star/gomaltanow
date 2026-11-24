import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Banca en Malta para ciudadanos no pertenecientes a la UE | GoMaltaNow",
  description:
    "Cómo prepararte para abrir una cuenta, recibir tu salario, gestionar tarjetas y realizar pagos cotidianos en Malta.",
  alternates: {
    canonical: "/es/move-to-malta/non-eu-citizen/banking-payments",
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
    title: "Elige la cuenta adecuada",
    text: "Compara bancos malteses tradicionales, proveedores mediante aplicación y servicios de pago según tu salario, transferencias, uso de tarjetas y necesidades diarias.",
  },
  {
    number: "02",
    title: "Prepara tus documentos",
    text: "Los bancos y proveedores de pago pueden solicitar identificación, justificante de domicilio, información laboral y otros documentos de respaldo.",
  },
  {
    number: "03",
    title: "Configura los pagos de salario",
    text: "Una vez tengas una cuenta, confirma el IBAN correcto o los datos de la cuenta con tu empleador para poder organizar los pagos de salario.",
  },
  {
    number: "04",
    title: "Planifica el alquiler y los pagos recurrentes",
    text: "Asegúrate de poder gestionar el alquiler, los suministros, las suscripciones y otros gastos periódicos mediante la cuenta que hayas elegido.",
  },
  {
    number: "05",
    title: "Revisa las comisiones y los límites",
    text: "Comprueba las comisiones de la cuenta, los cargos de los cajeros, los costes de cambio de divisa, los límites de transferencia y las condiciones de la tarjeta antes de depender de un solo proveedor.",
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
    title: "Compara más que la comisión mensual",
    text: "Los cargos de los cajeros, las transferencias internacionales, los tipos de cambio y las comisiones de las tarjetas pueden ser tan importantes como el coste básico de la cuenta.",
  },
  {
    title: "Mantén un método de pago de respaldo",
    text: "Tener una segunda tarjeta o cuenta puede resultar útil si tu tarjeta principal se pierde, se bloquea o no está disponible temporalmente.",
  },
  {
    title: "Protege tu cuenta",
    text: "Utiliza ajustes de seguridad sólidos, notificaciones de pagos y autenticación en dos factores cuando estén disponibles.",
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
    await localizeArticles(await getBankingArticles(), "es");

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
                Bancos y pagos
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Banca y pagos en Malta para ciudadanos no pertenecientes a la UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Descubre cómo prepararte para abrir una cuenta, recibir tu salario, gestionar tarjetas y realizar pagos cotidianos en Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#banking-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Entiende lo básico ↓
                </a>

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Únete a Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                El botón de Revolut contiene un enlace de invitación personal.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Banca y pagos en Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/banking-payments" lang="es" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Dinero del día a día
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Organiza tus finanzas cuanto antes.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Una cuenta que funcione para recibir el salario, pagar el alquiler y cubrir los gastos diarios puede facilitar mucho tus primeras semanas en Malta.
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
              Banca paso a paso
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Organiza tus pagos con un plan claro.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Los requisitos varían entre bancos y proveedores de pago, pero estas son las principales áreas que debes preparar.
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
              Banca mediante aplicación
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-6xl">
              Revolut puede ser una opción práctica.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
              Revolut puede resultar útil para pagos con tarjeta, transferencias, varias divisas y la gestión de gastos cotidianos desde una aplicación.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-[#625D57]">
              La disponibilidad, la verificación, las funciones de la cuenta y las comisiones dependen del cliente y de las condiciones vigentes del proveedor.
            </p>

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
            >
              Abrir Revolut →
            </a>

            <p className="mt-3 text-xs text-[#766F69]">
              Esta página contiene un enlace de invitación personal de Revolut.
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
              Únete a Revolut
            </h3>

            <p className="mt-4 leading-7 text-[#625D57]">
              Gestiona tarjetas, transferencias y pagos cotidianos desde una cuenta mediante aplicación.
            </p>

            <span className="mt-7 inline-flex font-bold text-[#75601C]">
              Empezar →
            </span>
          </a>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Consejos prácticos
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Evita los problemas bancarios habituales.
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
                  Guías bancarias publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artículos sobre banca y pagos para ciudadanos no pertenecientes a la UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados relacionados con banca, tarjetas, transferencias, pagos de salario y Revolut se enlazan aquí automáticamente.
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
              Lista de comprobación bancaria
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepara los documentos para tu cuenta.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Cada proveedor puede tener requisitos diferentes, así que considera esto una lista de preparación y confirma los documentos definitivos directamente con el proveedor.
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
            Continúa con tu mudanza
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Tu configuración esencial para personas no pertenecientes a la UE va tomando forma.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Sanidad →
            </Link>

            <Link
              href="/es/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Residencia y documentos
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
            La elegibilidad bancaria, las comisiones, los requisitos de las cuentas y las condiciones de los proveedores pueden cambiar. GoMaltaNow ofrece información práctica general. Consulta siempre las condiciones vigentes directamente con el banco o proveedor de pagos correspondiente.
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