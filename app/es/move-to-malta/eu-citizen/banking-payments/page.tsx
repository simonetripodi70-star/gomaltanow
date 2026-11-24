import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Banca en Malta para ciudadanos de la UE: bancos y Revolut | GoMaltaNow",
  description:
    "Cómo Revolut, los bancos malteses tradicionales y otros proveedores pueden ayudarte a gestionar la nómina, el alquiler, las transferencias y los gastos cotidianos.",
  alternates: {
    canonical: "/es/move-to-malta/eu-citizen/banking-payments",
    languages: {"en": "/move-to-malta/eu-citizen/banking-payments", "it": "/it/move-to-malta/eu-citizen/banking-payments", "pl": "/pl/move-to-malta/eu-citizen/banking-payments", "fr": "/fr/move-to-malta/eu-citizen/banking-payments", "de": "/de/move-to-malta/eu-citizen/banking-payments", "es": "/es/move-to-malta/eu-citizen/banking-payments", "uk": "/uk/move-to-malta/eu-citizen/banking-payments", "x-default": "/move-to-malta/eu-citizen/banking-payments"},
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

const essentials = [
  {
    title: "Empieza con Revolut",
    text: "Para muchos recién llegados, Revolut es una forma práctica de empezar a gestionar pagos con tarjeta, transferencias y varias divisas desde una sola aplicación.",
  },
  {
    title: "Prepara tus documentos",
    text: "Ten preparados tu identificación, justificante de domicilio, datos de empleo y documentos de apoyo antes de solicitarla.",
  },
  {
    title: "Planifica tus pagos",
    text: "Entiende cómo se pagarán el alquiler, los suministros, las suscripciones y las compras cotidianas una vez que te hayas instalado.",
  },
];

const checklist = [
  "Valid passport or national identity card",
  "Proof of address in Malta",
  "Employment contract or proof of income",
  "Tax or identification details where requested",
  "A Maltese mobile number if required",
  "Copies of all forms and submitted documents",
];

const moneyTips = [
  "Compare monthly account fees",
  "Check cash withdrawal charges",
  "Review foreign exchange costs",
  "Confirm salary payment details",
  "Set alerts for important payments",
  "Keep an emergency reserve",
];

const bankingArticleKeys = [
  "banking-payments",
  "banking",
  "bank",
  "payments",
  "payment",
  "finance",
  "financial",
  "money",
  "account",
  "cards",
  "card",
  "revolut",
  "salary-payments",
  "transfers",
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
    const normalizedKey = normalizeValue(key);

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
    .returns<BankingArticle[]>();

  if (error) {
    console.error(
      "Could not load banking articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isBankingArticle,
  );
}

export default async function BankingPaymentsPage() {
  const bankingArticles =
    await localizeArticles(await getBankingArticles(), "es");

  const featuredArticle =
    bankingArticles[0] ?? null;

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
            href="/es/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Volver a las guías de la UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
                Bancos y pagos
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Gestiona tu dinero en Malta con confianza.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Descubre cómo Revolut, los bancos malteses tradicionales y otros proveedores de pago pueden ayudarte a gestionar los pagos de nómina, el alquiler, las transferencias y los gastos cotidianos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {featuredArticle && (
                  <Link
                    href={`/es/articles/${featuredArticle.slug}`}
                    className="inline-flex rounded-full bg-[#75601C] px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
                  >
                    Lee la guía más reciente →
                  </Link>
                )}

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#75601C] px-6 py-3 font-semibold text-[#75601C] transition hover:-translate-y-1 hover:bg-[#75601C] hover:text-white"
                >
                  Únete a Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                El botón de Revolut contiene un enlace de invitación personal.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/banking-payments-malta.jpg"
              alt="Ahorrar dinero y gestionar las finanzas en Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/banking-payments" lang="es" />

      {bankingArticles.length > 0 && (
        <section
          id="banking-articles"
          className="border-y border-[#D8C98F] bg-[#F2EACF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
                  Guías bancarias publicadas
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#534617] md:text-5xl">
                  Artículos sobre banca, pagos y Revolut en Malta.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos aprobados se conectan automáticamente cada vez que se publica contenido sobre banca o pagos.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#75601C]">
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
                  className="group flex h-full flex-col rounded-3xl border border-[#D8C98F] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#75601C]/40 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#75601C]">
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

                    <span className="inline-flex font-bold text-[#75601C]">
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#111315] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <a
            href={REVOLUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 transition duration-300 hover:-translate-y-2 hover:border-[#D8B848]/40 hover:bg-white/10 hover:shadow-2xl md:grid-cols-[1fr_auto] md:items-center md:p-10"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D8B848]">
                Una opción práctica para Malta
              </p>

              <h2 className="mt-4 max-w-4xl font-serif text-4xl font-medium leading-tight md:text-5xl">
                Empieza a gestionar los pagos cotidianos con Revolut.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
                Utiliza una cuenta basada en una aplicación para pagos con tarjeta, transferencias, varias divisas y la gestión diaria de tu dinero.
              </p>

              <span className="mt-7 inline-flex rounded-full bg-[#D8B848] px-6 py-3 font-bold text-[#171717] transition group-hover:bg-white">
                Únete a Revolut →
              </span>
            </div>

            <span className="hidden text-6xl text-[#D8B848] transition duration-300 group-hover:translate-x-2 md:block">
              →
            </span>
          </a>

          <p className="mt-4 text-center text-xs text-white/50">
            Esta página contiene un enlace de invitación personal de Revolut.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Organiza tus finanzas con un plan claro.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              La mejor opción depende de tus ingresos, tus hábitos de pago y los servicios que esperas utilizar con más frecuencia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {essentials.map((item, index) =>
              index === 0 ? (
                <a
                  key={item.title}
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border border-[#D8C98F] bg-[#F2EACF] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="font-serif text-3xl transition group-hover:text-[#75601C]">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-[#625D57]">
                    {item.text}
                  </p>

                  <span className="mt-6 inline-flex font-bold text-[#75601C]">
                    Únete a Revolut →
                  </span>
                </a>
              ) : (
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
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="checklist"
        className="bg-[#75601C] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Lista de verificación para la cuenta
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Qué preparar antes de solicitarla.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Los requisitos varían según el proveedor, así que utiliza esta lista como preparación y confirma los documentos definitivos directamente con el banco o servicio.
            </p>

            {bankingArticles.length > 0 && (
              <a
                href="#banking-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#75601C] transition hover:-translate-y-1 hover:shadow-xl"
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#75601C]">
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

      <section className="bg-[#F2EACF] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
              Dinero del día a día
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Los pequeños detalles pueden afectar a tu presupuesto mensual.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {moneyTips.map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-4 rounded-2xl border border-[#D8C98F] bg-white/75 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#75601C] text-sm font-bold text-white">
                  €
                </span>

                <p className="font-semibold text-[#534617]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7F2] py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#75601C]">
            Banca en Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Compara tus opciones antes de elegir una cuenta.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Las comisiones, los tipos de cambio, los cargos de tarjeta y las condiciones de la cuenta pueden cambiar. Revisa las condiciones actuales del proveedor antes de tomar una decisión.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {featuredArticle && (
              <Link
                href={`/es/articles/${featuredArticle.slug}`}
                className="inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
              >
                Lee el artículo más reciente
              </Link>
            )}

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-[#75601C] px-6 py-3 font-bold text-[#75601C] transition hover:-translate-y-1 hover:bg-[#75601C] hover:text-white"
            >
              Únete a Revolut
            </a>
          </div>
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
    <span className="rounded-full bg-[#F2EACF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#75601C]">
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