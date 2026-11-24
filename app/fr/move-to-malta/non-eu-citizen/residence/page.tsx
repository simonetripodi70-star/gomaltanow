import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Permis de séjour à Malte pour les citoyens hors UE | GoMaltaNow",
  description:
    "Suivez vos permis, documents d’identité, cartes de séjour, renouvellements et dossiers administratifs pendant votre vie à Malte.",
  alternates: {
    canonical: "/fr/move-to-malta/non-eu-citizen/residence",
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
    title: "Comprenez votre statut de séjour",
    text: "Votre situation de séjour dépend du permis ou de la voie d’immigration qui s’applique à vous. Gardez clairement à l’esprit les conditions de votre permis dès le départ.",
  },
  {
    number: "02",
    title: "Préparez les documents requis",
    text: "Gardez votre passeport, vos documents de permis, vos justificatifs d’emploi, les détails de votre logement et tout autre document justificatif bien organisés et à jour.",
  },
  {
    number: "03",
    title: "Effectuez les formalités d’identité",
    text: "Vous devrez peut-être accomplir des formalités biométriques, d’identité ou de carte de séjour dans le cadre de la procédure. Suivez les instructions fournies par l’autorité maltaise compétente.",
  },
  {
    number: "04",
    title: "Suivez les échéances",
    text: "Les documents et permis de séjour peuvent avoir des dates d’expiration. Notez les échéances afin de pouvoir préparer les renouvellements et les documents justificatifs à temps.",
  },
  {
    number: "05",
    title: "Signalez les changements lorsque nécessaire",
    text: "Les changements concernant votre emploi, votre adresse, les informations de votre passeport ou votre situation personnelle peuvent devoir être signalés. Vérifiez les conditions applicables à votre permis.",
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
    title: "Vérifiez la date d’expiration",
    text: "N’attendez pas le dernier moment pour vérifier la date d’expiration de votre permis ou de votre carte de séjour. Certaines procédures de renouvellement nécessitent une préparation à l’avance.",
  },
  {
    title: "Gardez les informations relatives à votre adresse à jour",
    text: "Les informations sur votre logement peuvent être pertinentes pour les démarches administratives ; conservez donc vos documents de location et vérifiez si les changements d’adresse doivent être signalés.",
  },
  {
    title: "Conservez des copies numériques",
    text: "Conservez des copies numériques claires de vos passeports, permis, contrats, reçus et courriers officiels afin de pouvoir y accéder lorsque nécessaire.",
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
    await localizeArticles(await getResidenceArticles(), "fr");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/fr"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/fr/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Retour aux guides pour les non-UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Résidence et documents
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Gérez vos documents de séjour à Malte.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Suivez vos permis, documents d’identité, cartes de séjour, renouvellements et les dossiers administratifs liés à votre vie à Malte.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#residence-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Voir la procédure ↓
                </a>

                {residenceArticles.length > 0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lire les guides sur le séjour
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Documents de séjour et d’identité à Malte"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/residence" lang="fr" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Restez organisé
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Les documents de séjour nécessitent une attention continue.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Vos responsabilités administratives ne prennent pas forcément fin une fois qu’un permis est délivré. Suivez les dates d’expiration, les changements de situation et les documents qui pourraient devoir être mis à jour.
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
              Administration du séjour
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Gardez le contrôle de votre statut de séjour.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Utilisez ces étapes comme cadre pratique pour organiser vos documents et vos responsabilités administratives.
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
              Bonnes habitudes
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Évitez les problèmes administratifs évitables.
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
                  Guides de résidence publiés
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articles sur le séjour et les documents pour les citoyens hors UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Les nouveaux articles approuvés relatifs au séjour, aux permis, aux documents d’identité et aux renouvellements sont automatiquement reliés ici.
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
                  href={`/fr/articles/${article.slug}`}
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
                      Lire l&apos;article →
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
              Liste de contrôle des documents
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Gardez vos documents essentiels réunis.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Il s’agit d’une liste de contrôle pratique pour vous organiser. Les documents exacts requis dépendent de votre voie de séjour et de votre situation personnelle.
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
            Poursuivez votre installation
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Continuez avec les prochains guides pratiques.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/fr/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Soins de santé →
            </Link>

            <Link
              href="/fr/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trouver un logement
            </Link>

            <Link
              href="/fr/move-to-malta/non-eu-citizen/single-permit"
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
            Les exigences en matière de séjour, d’immigration et d’identité peuvent changer. GoMaltaNow fournit des informations pratiques générales et ne remplace pas les conseils officiels ni les conseils professionnels en immigration.
          </p>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/fr"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malte en toute simplicité.
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

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}