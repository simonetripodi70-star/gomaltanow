import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Visiter Malte : guide de voyage et choses à faire | GoMaltaNow",
  description:
    "Préparez votre voyage à Malte : plages, villes historiques, îles, transports, cuisine et infos pratiques au même endroit.",
  alternates: {
    canonical: "/fr/visit-malta",
    languages: {"en": "/visit-malta", "it": "/it/visit-malta", "pl": "/pl/visit-malta", "fr": "/fr/visit-malta", "de": "/de/visit-malta", "es": "/es/visit-malta", "uk": "/uk/visit-malta", "x-default": "/visit-malta"},
  },
};


export const dynamic = "force-dynamic";

type TravelArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  published_at: string | null;
};

const travelSections = [
  {
    title: "Plages",
    description:
      "Découvrez les plus belles plages, lieux de baignade et côtes de Malte.",
    href: "/beaches",
    label: "Mer et soleil",
    number: "01",
    articleKeys: [
      "beaches",
      "beach",
      "swimming",
      "coast",
      "sea",
    ],
  },
  {
    title: "Que faire",
    description:
      "Trouvez des attractions, expériences et activités pour votre séjour à Malte.",
    href: "/visit-malta/things-to-do",
    label: "Expériences",
    number: "02",
    articleKeys: [
      "things-to-do",
      "attractions",
      "activities",
      "experiences",
      "sightseeing",
    ],
  },
  {
    title: "La Valette",
    description:
      "Découvrez la capitale de Malte : rues historiques, musées, points de vue et front de mer.",
    href: "/visit-malta/valletta",
    label: "Capitale",
    number: "03",
    articleKeys: [
      "valletta",
      "capital",
    ],
  },
  {
    title: "Mdina et Rabat",
    description:
      "Promenez-vous dans la Cité du Silence, historique, et les rues voisines de Rabat.",
    href: "/visit-malta/mdina-rabat",
    label: "Histoire",
    number: "04",
    articleKeys: [
      "mdina",
      "rabat",
      "silent-city",
    ],
  },
  {
    title: "Gozo",
    description:
      "Prévoyez une excursion d'une journée ou un séjour plus long sur la paisible île sœur de Malte.",
    href: "/visit-malta/gozo",
    label: "Île",
    number: "05",
    articleKeys: [
      "gozo",
    ],
  },
  {
    title: "Comino",
    description:
      "Préparez votre visite à Comino, avec le Blue Lagoon et la côte environnante.",
    href: "/visit-malta/comino",
    label: "Blue Lagoon",
    number: "06",
    articleKeys: [
      "comino",
      "blue-lagoon",
    ],
  },
  {
    title: "Transports",
    description:
      "Bus, ferries, taxis, applis de VTC et comment se déplacer à Malte.",
    href: "/visit-malta/transport",
    label: "Se déplacer",
    number: "07",
    articleKeys: [
      "transport",
      "buses",
      "bus",
      "ferry",
      "taxi",
      "getting-around",
    ],
  },
  {
    title: "Où dormir",
    description:
      "Comparez les quartiers et les types d'hébergement selon votre voyage.",
    href: "/visit-malta/where-to-stay",
    label: "Hébergement",
    number: "08",
    articleKeys: [
      "where-to-stay",
      "hotel",
      "hotels",
      "accommodation",
      "stay",
    ],
  },
  {
    title: "Cuisine et restaurants",
    description:
      "Découvrez la cuisine maltaise, les plats typiques et des guides utiles pour bien manger.",
    href: "/visit-malta/food-restaurants",
    label: "Cuisine",
    number: "09",
    articleKeys: [
      "food",
      "restaurants",
      "restaurant",
      "dining",
      "maltese-food",
    ],
  },
  {
    title: "Infos pratiques",
    description:
      "Infos utiles sur l'argent, la météo, la sécurité, les données mobiles et le quotidien en voyage.",
    href: "/visit-malta/practical-info",
    label: "L'essentiel",
    number: "10",
    articleKeys: [
      "practical-info",
      "travel-info",
      "travel",
      "weather",
      "money",
      "safety",
    ],
  },
];

function getSupabasePublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
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

function normalize(
  value: string | null | undefined,
) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function articleBelongsToSection(
  article: TravelArticle,
  keys: string[],
) {
  const values = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalize);

  return keys.some((key) => {
    const normalizedKey = normalize(key);

    return values.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getTravelArticles(): Promise<
  TravelArticle[]
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id,title,slug,summary,category,audience,section_slug,published_at",
    )
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    })
    .limit(100)
    .returns<TravelArticle[]>();

  if (error) {
    console.error(
      "Could not load travel articles",
      error,
    );

    return [];
  }

  return (data ?? []).filter((article) => {
    const audience =
      normalize(article.audience);

    return (
      audience === "tourist" ||
      audience === "general" ||
      audience === ""
    );
  });
}

export default async function VisitMaltaPage() {
  const articles =
    await getTravelArticles();

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
            href="/fr"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Visiter Malte
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Profitez au maximum de votre voyage à Malte.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Plages, villes historiques, îles, transports, cuisine et infos pratiques de voyage au même endroit.
              </p>

              <a
                href="#travel-guides"
                className="mt-8 inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
              >
                Découvrir Malte ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Malte, destination de voyage"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section
        id="travel-guides"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Guides de voyage sur Malte
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Que recherchez-vous ?
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Choisissez une catégorie et commencez à préparer la partie de Malte qui compte le plus pour votre voyage.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {travelSections.map((section) => {
              const relatedArticles =
                articles.filter((article) =>
                  articleBelongsToSection(
                    article,
                    section.articleKeys,
                  ),
                );

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#B83F29]/40 hover:shadow-xl md:p-8"
                >
                  <div className="absolute -bottom-7 -right-2 font-serif text-[110px] text-[#B83F29]/5">
                    {section.number}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B83F29]">
                        {section.label}
                      </span>

                      <span className="text-3xl text-[#B83F29] transition group-hover:translate-x-2">
                        →
                      </span>
                    </div>

                    <h3 className="mt-6 font-serif text-3xl font-medium md:text-4xl">
                      {section.title}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#625D57]">
                      {section.description}
                    </p>

                    {relatedArticles.length > 0 && (
                      <p className="mt-6 text-sm font-bold text-[#B83F29]">
                        {relatedArticles.length}{" "}
                        {relatedArticles.length === 1
                          ? "published article"
                          : "published articles"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      {articles.length > 0 && (
        <section className="bg-[#F3E6DF] py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Derniers articles de voyage
              </p>

              <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                De nouvelles idées pour votre voyage à Malte.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles
                .slice(0, 6)
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <span className="w-fit rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B83F29]">
                      {article.category.replaceAll(
                        "-",
                        " ",
                      )}
                    </span>

                    <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
                      {article.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                      {article.summary}
                    </p>

                    <span className="mt-7 inline-flex font-bold text-[#B83F29]">
                      Lire l&apos;article →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Mieux s&apos;organiser
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Malte est petite, mais chaque zone est différente.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Un peu d&apos;organisation vous permet de passer moins de temps dans les trajets et plus de temps dans les lieux qui correspondent à vos vacances.
          </p>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

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