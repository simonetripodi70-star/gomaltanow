import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Trouver un logement à Malte pour les citoyens de l’UE | GoMaltaNow",
  description:
    "Comparez les quartiers, comprenez le coût mensuel réel et préparez les bonnes questions avant de louer un bien à Malte.",
  alternates: {
    canonical: "/fr/move-to-malta/eu-citizen/find-a-home",
    languages: {"en": "/move-to-malta/eu-citizen/find-a-home", "it": "/it/move-to-malta/eu-citizen/find-a-home", "pl": "/pl/move-to-malta/eu-citizen/find-a-home", "fr": "/fr/move-to-malta/eu-citizen/find-a-home", "de": "/de/move-to-malta/eu-citizen/find-a-home", "es": "/es/move-to-malta/eu-citizen/find-a-home", "uk": "/uk/move-to-malta/eu-citizen/find-a-home", "x-default": "/move-to-malta/eu-citizen/find-a-home"},
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

const essentials = [
  {
    title: "Choisissez le bon quartier",
    text: "Réfléchissez au travail, aux transports, aux services du quotidien, au niveau de bruit et au mode de vie que vous souhaitez avant de comparer des biens.",
  },
  {
    title: "Comprenez le coût total",
    text: "Ne vous limitez pas au loyer mensuel : prenez en compte les dépôts de garantie, les charges, les frais d’agence et le coût des trajets depuis le bien.",
  },
  {
    title: "Examinez le contrat",
    text: "Lisez attentivement le contrat de location et assurez-vous que les détails importants sont clairement indiqués par écrit avant de signer.",
  },
];

const checklist = [
  "Set a realistic monthly housing budget",
  "Choose two or three areas to compare",
  "Check transport and nearby services",
  "Ask what is included in the monthly rent",
  "Inspect the property before signing",
  "Keep copies of the agreement and payments",
];

const questions = [
  "How long is the rental term?",
  "What is included in the rent?",
  "How are utilities paid?",
  "Is a security deposit required?",
  "Who is responsible for repairs?",
  "What notice period applies?",
];

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
    const normalizedKey = normalizeValue(key);

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
    .returns<HousingArticle[]>();

  if (error) {
    console.error(
      "Could not load housing articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter(
    isHousingArticle,
  );
}

export default async function FindAHomePage() {
  const housingArticles =
    await localizeArticles(await getHousingArticles(), "fr");

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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
                Trouver un logement
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Trouvez le bon logement à Malte.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Comparez les quartiers, comprenez le coût mensuel réel et préparez les bonnes questions avant de choisir un bien.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#checklist"
                  className="inline-flex rounded-full bg-[#8A3B2B] px-6 py-3 font-semibold text-white transition hover:bg-[#6E2E22]"
                >
                  Voir la checklist ↓
                </a>

                {housingArticles.length > 0 && (
                  <a
                    href="#housing-articles"
                    className="inline-flex rounded-full border border-[#8A3B2B] px-6 py-3 font-semibold text-[#8A3B2B] transition hover:bg-[#8A3B2B] hover:text-white"
                  >
                    Lire les articles sur le logement
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/find-home-malta.jpg"
              alt="Chercher un logement à Malte"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="eu/find-a-home" lang="fr" />

      {/* Published housing articles */}
      {housingArticles.length > 0 && (
        <section
          id="housing-articles"
          className="border-y border-[#D9C4B8] bg-[#F4E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
                  Guides publiés sur le logement
                </p>

                <h2 className="max-w-3xl font-serif text-4xl font-medium text-[#4D3B34] md:text-5xl">
                  Articles détaillés sur la location et le logement à Malte.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Les nouveaux articles approuvés sur le logement, la location et l’hébergement sont ajoutés automatiquement dès leur publication.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#8A3B2B]">
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
                  href={`/fr/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#D9C4B8] bg-[#FFFDF9] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#8A3B2B]/40 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#8A3B2B]">
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

                    <span className="inline-flex font-bold text-[#8A3B2B]">
                      Lire l&apos;article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Essentials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Commencez par les décisions les plus importantes.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Un bon logement ne se résume pas à son apparence. L’emplacement, le coût total et le contrat de location ont tous une incidence sur votre quotidien.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {essentials.map((item) => (
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
        className="bg-[#8A3B2B] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Liste de contrôle pour le logement
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Avant d’accepter de louer.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Utilisez cette liste de contrôle pour comparer les options et conservez vos notes pour chaque bien que vous visitez.
            </p>

            {housingArticles.length > 0 && (
              <a
                href="#housing-articles"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#8A3B2B] transition hover:-translate-y-1 hover:shadow-xl"
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#8A3B2B]">
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

      {/* Questions */}
      <section className="bg-[#F4E6DF] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
              Questions à poser avant de signer
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Questions importantes à poser au propriétaire ou à l’agent.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question) => (
              <div
                key={question}
                className="flex items-center justify-between gap-6 rounded-2xl border border-[#D9C4B8] bg-white/70 p-5"
              >
                <p className="font-semibold text-[#4D3B34]">
                  {question}
                </p>

                <span className="text-xl text-[#8A3B2B]">
                  ?
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8A3B2B]">
            Bonnes pratiques
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Gardez tout clair et documenté.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Conservez une trace écrite des accords, des paiements et des communications importantes. Pour les questions juridiques ou contractuelles, demandez conseil à un professionnel compétent avant de vous engager.
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
    <span className="rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#8A3B2B]">
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