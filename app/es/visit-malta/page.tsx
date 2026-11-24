import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Visitar Malta: guía de viaje y qué hacer | GoMaltaNow",
  description:
    "Planifica tu viaje a Malta: playas, ciudades históricas, islas, transporte, comida e información práctica en un solo lugar.",
  alternates: {
    canonical: "/es/visit-malta",
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
    title: "Playas",
    description:
      "Descubre las mejores playas, zonas de baño y costas de Malta.",
    href: "/beaches",
    label: "Mar y sol",
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
    title: "Qué hacer",
    description:
      "Encuentra atracciones, experiencias y actividades para tu estancia en Malta.",
    href: "/visit-malta/things-to-do",
    label: "Experiencias",
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
    title: "La Valeta",
    description:
      "Descubre la capital de Malta: calles históricas, museos, miradores y paseo marítimo.",
    href: "/visit-malta/valletta",
    label: "Capital",
    number: "03",
    articleKeys: [
      "valletta",
      "capital",
    ],
  },
  {
    title: "Mdina y Rabat",
    description:
      "Pasea por la histórica Ciudad del Silencio de Malta y las calles vecinas de Rabat.",
    href: "/visit-malta/mdina-rabat",
    label: "Historia",
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
      "Planifica una excursión de un día o una estancia más larga en la tranquila isla hermana de Malta.",
    href: "/visit-malta/gozo",
    label: "Isla",
    number: "05",
    articleKeys: [
      "gozo",
    ],
  },
  {
    title: "Comino",
    description:
      "Planifica tu visita a Comino, con la Laguna Azul y la costa de alrededor.",
    href: "/visit-malta/comino",
    label: "Laguna Azul",
    number: "06",
    articleKeys: [
      "comino",
      "blue-lagoon",
    ],
  },
  {
    title: "Transporte",
    description:
      "Autobuses, ferris, taxis, apps de transporte y cómo moverse por Malta.",
    href: "/visit-malta/transport",
    label: "Moverse",
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
    title: "Dónde alojarse",
    description:
      "Compara zonas y tipos de alojamiento según el viaje que quieras hacer.",
    href: "/visit-malta/where-to-stay",
    label: "Alojamiento",
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
    title: "Comida y restaurantes",
    description:
      "Descubre la cocina maltesa, los platos típicos y guías útiles para comer bien.",
    href: "/visit-malta/food-restaurants",
    label: "Comida",
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
    title: "Información práctica",
    description:
      "Información útil sobre dinero, clima, seguridad, datos móviles y el día a día del viaje.",
    href: "/visit-malta/practical-info",
    label: "Lo básico",
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
            href="/es"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/es"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Visitar Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Aprovecha al máximo tu viaje a Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Playas, ciudades históricas, islas, transporte, comida e información práctica de viaje en un solo lugar.
              </p>

              <a
                href="#travel-guides"
                className="mt-8 inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
              >
                Descubre Malta ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Malta, destino de viaje"
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
              Guías de viaje de Malta
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              ¿Qué estás buscando?
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Elige una categoría y empieza a planificar la parte de Malta que más te importa.
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
                Últimos artículos de viaje
              </p>

              <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                Nuevas ideas para tu viaje a Malta.
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
                      Leer artículo →
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
            Planifica mejor
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Malta es pequeña, pero cada zona es diferente.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Un poco de planificación te ayuda a pasar menos tiempo en desplazamientos y más tiempo en los lugares que encajan con tu tipo de vacaciones.
          </p>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

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