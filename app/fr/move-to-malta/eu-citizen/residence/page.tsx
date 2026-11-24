import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Résidence à Malte pour les citoyens de l’UE | GoMaltaNow",
  description:
    "Comprenez votre parcours de résidence à Malte en tant que citoyen de l’UE : les principaux documents, questions et étapes avant de déposer votre demande.",
  alternates: {
    canonical: "/fr/move-to-malta/eu-citizen/residence",
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
    title: "À qui s’adresse ce guide",
    text: "Citoyens de l’UE, de l’EEE et de Suisse qui prévoient de vivre à Malte pendant une période prolongée.",
  },
  {
    title: "Ce qu’il faut préparer",
    text: "Documents d’identité, preuves de votre situation à Malte et justificatifs pertinents pour votre demande.",
  },
  {
    title: "Ce qui se passe ensuite",
    text: "Consultez les exigences en vigueur, préparez vos documents et suivez la procédure officielle de demande.",
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
    await localizeArticles(await getResidenceArticles(), "fr");

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
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
            href="/fr/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Retour aux guides de l’UE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Résidence
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Comprenez votre parcours de résidence à Malte.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Utilisez ce guide pour organiser les principaux documents, questions et étapes à prévoir avant de commencer votre demande de résidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-semibold text-white transition hover:bg-[#243F33]"
                >
                  Voir la checklist ↓
                </a>

                {residenceArticles.length >
                  0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-semibold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lire les articles sur la résidence
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/residence-malta.jpg"
              alt="Documents de résidence pour s’installer à Malte"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/residence" lang="fr" />

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
                  Guides de résidence publiés
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#243F33] md:text-5xl">
                  Articles détaillés sur la résidence à Malte.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#536159]">
                  Ces articles approuvés sont automatiquement associés à cette page chaque fois qu’un nouveau contenu sur la résidence est publié.
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
                    href={`/fr/articles/${article.slug}`}
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
                        Lire l&apos;article →
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
              Commencez avec les bonnes informations.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Les exigences de résidence peuvent dépendre de votre situation personnelle ; commencez donc par identifier la catégorie qui s’applique à vous.
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
              Liste de préparation
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Documents à organiser.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Il s’agit d’une liste de planification, et non d’une liste juridique définitive. Confirmez toujours les exigences officielles en vigueur avant de déposer votre demande.
            </p>

            {residenceArticles.length >
              0 && (
              <a
                href="#residence-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#315846] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Lire les guides détaillés
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
            Important
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#243F33] md:text-4xl">
            Vérifiez les dernières exigences officielles avant de déposer votre demande.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#536159]">
            Les procédures, formulaires et pièces justificatives peuvent changer. Cette page est conçue pour aider les utilisateurs à se préparer et à comprendre le processus, tandis que les autorités maltaises officielles restent la source de référence finale.
          </p>
        </div>
      </section>

      {/* Footer */}
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

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}