import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Avant de s’installer à Malte : liste de contrôle pour les citoyens non-UE | GoMaltaNow",
  description:
    "Organisez vos documents, votre budget, votre logement et vos démarches d’immigration avant de voyager à Malte en tant que citoyen non-UE.",
  alternates: {
    canonical: "/fr/move-to-malta/non-eu-citizen/before-you-move",
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
    title: "Comprenez votre parcours d’immigration",
    text: "Avant de voyager, identifiez le parcours de résidence ou d’emploi qui s’applique à vous et les conditions que vous devez remplir.",
  },
  {
    number: "02",
    title: "Préparez vos documents",
    text: "Gardez votre passeport, vos justificatifs d’emploi, vos qualifications, les détails de votre logement et tout document justificatif organisés avant votre départ.",
  },
  {
    number: "03",
    title: "Planifiez votre premier logement",
    text: "Organisez un lieu de séjour fiable pendant que vous effectuez vos premières démarches administratives et recherchez un logement à plus long terme si nécessaire.",
  },
  {
    number: "04",
    title: "Établissez un budget réaliste pour votre installation",
    text: "Prévoyez le loyer, les dépôts de garantie, les transports, la nourriture, l’assurance, les frais administratifs et les dépenses imprévues durant vos premières semaines à Malte.",
  },
  {
    number: "05",
    title: "Conservez des copies de tout",
    text: "Sauvegardez des copies numériques et imprimées des documents importants, demandes, contrats, reçus et correspondances officielles.",
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
    title: "Ne voyagez pas sur la base de suppositions",
    text: "Confirmez les conditions d’immigration applicables à votre situation avant de prendre des décisions irréversibles concernant votre voyage ou votre emploi.",
  },
  {
    title: "Prévoyez soigneusement le budget du premier mois",
    text: "Vos frais initiaux peuvent être plus élevés qu’au cours d’un mois normal en raison des dépôts de garantie, du logement temporaire et des frais d’installation.",
  },
  {
    title: "Gardez les informations officielles à part",
    text: "Utilisez GoMaltaNow comme guide pratique, mais confirmez toujours les exigences définitives auprès des autorités maltaises compétentes.",
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
    await localizeArticles(await getMovingArticles(), "fr");

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
                Avant de partir
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Préparez votre installation à Malte en tant que citoyen non-UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Organisez vos documents, votre budget, votre logement et vos démarches d’immigration avant de voyager.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#preparation-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Commencer les préparatifs ↓
                </a>

                {movingArticles.length > 0 && (
                  <a
                    href="#moving-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lire les guides de déménagement
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Préparer votre installation à Malte"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/before-you-move" lang="fr" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Avant de voyager
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Une bonne préparation peut éviter des problèmes importants par la suite.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Les exigences en matière d’immigration, d’emploi et de résidence peuvent être étroitement liées. Assurez-vous de comprendre votre parcours avant d’organiser le reste de votre installation.
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
              Préparation étape par étape
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Organisez l’essentiel avant votre départ.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Ces étapes vous donnent un cadre pratique pour préparer votre installation.
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
              Avant le départ
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Trois points à vérifier deux fois.
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
                  Guides d’installation publiés
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articles sur la préparation et l’installation pour les citoyens non-UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Les nouveaux articles approuvés concernant la préparation, l’installation, l’arrivée et les premières démarches sont automatiquement associés ici.
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
              Checklist d’installation
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Préparez vos documents essentiels.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Il s’agit d’une liste générale de préparation. Les documents exacts dépendent de votre parcours d’immigration et de votre situation personnelle.
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
            Étape suivante
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Comprenez votre parcours d’emploi et de permis.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/fr/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Single Permit →
            </Link>

            <Link
              href="/fr/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trouver un emploi
            </Link>

            <Link
              href="/fr/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trouver un logement
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Les exigences relatives à l’immigration, à l’entrée, à l’emploi et à la résidence peuvent changer. GoMaltaNow fournit des informations pratiques générales et ne remplace pas les conseils officiels ni les conseils professionnels en matière d’immigration.
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