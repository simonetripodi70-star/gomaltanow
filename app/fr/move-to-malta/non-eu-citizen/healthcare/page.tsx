import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Soins de santé à Malte pour les citoyens hors UE | GoMaltaNow",
  description:
    "Accès aux soins de santé, assurance, services médicaux et documents dont vous pourriez avoir besoin en vivant à Malte en tant que citoyen hors UE.",
  alternates: {
    canonical: "/fr/move-to-malta/non-eu-citizen/healthcare",
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
    title: "Comprenez vos droits aux soins de santé",
    text: "Votre accès aux soins de santé à Malte peut dépendre de votre statut de résidence, de votre emploi, de votre assurance et de votre situation personnelle. Vérifiez ce qui s’applique à vous avant de compter sur une forme de couverture spécifique.",
  },
  {
    number: "02",
    title: "Souscrivez l’assurance requise",
    text: "Certaines voies d’immigration ou de résidence peuvent exiger une preuve de couverture santé. Assurez-vous que votre police répond aux conditions applicables à votre cas.",
  },
  {
    number: "03",
    title: "Sachez où vous faire soigner",
    text: "Découvrez la différence entre les soins médicaux courants, les pharmacies, les centres de santé, les cliniques privées et les services d’urgence afin de savoir où aller lorsque vous avez besoin d’aide.",
  },
  {
    number: "04",
    title: "Conservez vos documents médicaux",
    text: "Gardez des copies de vos polices d’assurance, ordonnances, rapports médicaux, carnets de vaccination et autres documents de santé utiles.",
  },
  {
    number: "05",
    title: "Réexaminez votre situation lorsqu’elle change",
    text: "Un changement d’emploi, de statut de résidence ou d’assurance peut affecter vos dispositions en matière de soins de santé. Réexaminez donc votre couverture lorsque votre situation change.",
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
    title: "Gardez les informations d’assurance accessibles",
    text: "Enregistrez votre numéro de police, les coordonnées de votre assureur et vos documents de couverture dans un endroit rapidement accessible.",
  },
  {
    title: "Repérez les services les plus proches",
    text: "Identifiez les pharmacies, centres de santé, cliniques et hôpitaux à proximité avant d’en avoir besoin en urgence.",
  },
  {
    title: "Ne supposez pas que tous les services sont gratuits",
    text: "L’éligibilité et les frais peuvent dépendre de votre statut et du service utilisé ; vérifiez donc les conditions qui s’appliquent à vous.",
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
    await localizeArticles(await getHealthcareArticles(), "fr");

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
                Les soins de santé à Malte
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Les soins de santé à Malte pour les citoyens hors UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Comprenez l’accès aux soins de santé, l’assurance, les services médicaux et les documents dont vous pourriez avoir besoin pendant votre séjour à Malte.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#healthcare-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Comprendre les bases ↓
                </a>

                {healthcareArticles.length > 0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Lire les guides sur les soins de santé
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Soins de santé et services médicaux à Malte"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/healthcare" lang="fr" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Avant d’avoir besoin de soins médicaux
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Comprenez votre couverture à l’avance.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            L’accès aux soins de santé pour les ressortissants de pays tiers peut dépendre de l’emploi, du statut de résidence, de l’assurance et du type de service médical requis.
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
              Les soins de santé étape par étape
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Préparez vos dispositions en matière de soins de santé.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Suivez ces étapes pour organiser les aspects les plus importants des soins de santé avant et après votre déménagement.
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
              Conseils pratiques
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Facilitez la gestion de vos soins de santé.
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
                  Guides publiés sur les soins de santé
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articles sur les soins de santé et l’assurance pour les citoyens hors UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Les nouveaux articles approuvés liés aux soins de santé, à l’assurance, aux hôpitaux, aux pharmacies et aux services médicaux sont automatiquement associés ici.
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
              Liste de contrôle pour les soins de santé
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Gardez vos documents de santé réunis.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Les documents exacts dont vous avez besoin dépendent de votre situation, mais conserver ces dossiers bien organisés peut faciliter les soins de santé et les démarches administratives.
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
            Poursuivez votre installation
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Poursuivez votre installation pratique à Malte.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/fr/move-to-malta/non-eu-citizen/banking-payments"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Services bancaires et paiements →
            </Link>

            <Link
              href="/fr/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Résidence et documents
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
            Les critères d’éligibilité aux soins de santé, les exigences d’assurance et les conditions des services médicaux peuvent changer. GoMaltaNow fournit des informations pratiques générales et ne remplace pas les conseils officiels en matière de soins de santé ni les avis médicaux professionnels.
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