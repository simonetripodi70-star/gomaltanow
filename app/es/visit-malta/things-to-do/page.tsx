import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Qué hacer en Malta: lugares, playas y excursiones | GoMaltaNow",
  description:
    "Ciudades históricas, playas, islas, comida, excursiones en barco y experiencias para planificar una estancia inolvidable en Malta.",
  alternates: {
    canonical: "/es/visit-malta/things-to-do",
    languages: {"en": "/visit-malta/things-to-do", "it": "/it/visit-malta/things-to-do", "pl": "/pl/visit-malta/things-to-do", "fr": "/fr/visit-malta/things-to-do", "de": "/de/visit-malta/things-to-do", "es": "/es/visit-malta/things-to-do", "uk": "/uk/visit-malta/things-to-do", "x-default": "/visit-malta/things-to-do"},
  },
};


export const dynamic = "force-dynamic";

type ActivityArticle = {
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

const activityArticleKeys = [
  "things-to-do",
  "things-to-do-in-malta",
  "attractions",
  "activities",
  "experiences",
  "sightseeing",
  "what-to-do",
  "day-trip",
  "day-trips",
  "adventure",
  "tour",
  "tours",
];

const activityIdeas = [
  {
    number: "01",
    href: "/es/visit-malta/valletta",
    title: "Descubre las ciudades históricas",
    text: "Pasea por La Valeta, Mdina y las Tres Ciudades para descubrir la arquitectura, las fortificaciones y la historia de Malta.",
  },
  {
    number: "02",
    href: "/es/beaches",
    title: "Disfruta del mar",
    text: "Ve a la playa, nada en aguas cristalinas, descubre miradores en la costa o haz una excursión en barco por las islas.",
  },
  {
    number: "03",
    href: "/es/visit-malta/gozo",
    title: "Visita Gozo",
    text: "Haz una excursión de un día o quédate más tiempo para descubrir pueblos, playas, paisajes costeros y el lado más tranquilo de las islas maltesas.",
  },
  {
    number: "04",
    href: "/es/visit-malta/comino",
    title: "Descubre Comino",
    text: "Visita la Laguna Azul y la costa cercana, planificando bien el transporte, la afluencia y la época del año.",
  },
  {
    number: "05",
    href: "/es/visit-malta/food-restaurants",
    title: "Prueba la comida maltesa",
    text: "Prueba platos típicos, panaderías, comida callejera y restaurantes para conocer otro lado de la cultura maltesa.",
  },
  {
    number: "06",
    href: "/es/visit-malta/mdina-rabat/mdina-in-the-evening",
    title: "Malta de noche",
    text: "Disfruta del paseo marítimo, paseos nocturnos, restaurantes, bares y vida nocturna según el tipo de viaje que quieras.",
  },
];

const planningTips = [
  {
    title: "Agrupa los lugares por zona",
    text: "Malta es pequeña, pero el tráfico y los tiempos de viaje se suman. Cuando puedas, visita en el mismo día atracciones cercanas.",
  },
  {
    title: "Consulta el tiempo",
    text: "El sol fuerte, el viento y el mar agitado pueden afectar a los planes al aire libre, las excursiones en barco y el baño.",
  },
  {
    title: "Reserva pronto las experiencias más populares",
    text: "Las excursiones en barco, las visitas guiadas y las atracciones populares se llenan en temporada alta.",
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

function isActivityArticle(
  article: ActivityArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return activityArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getActivityArticles(): Promise<
  ActivityArticle[]
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
    .returns<ActivityArticle[]>();

  if (error) {
    console.error(
      "Could not load things-to-do articles",
      error,
    );

    return [];
  }

  return (data ?? [])
    .filter((article) => {
      const audience =
        normalizeValue(article.audience);

      return (
        audience === "tourist" ||
        audience === "general" ||
        audience === ""
      );
    })
    .filter(isActivityArticle);
}

export default async function ThingsToDoPage() {
  const activityArticles =
    await localizeArticles(await getActivityArticles(), "es");

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
            href="/es/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Volver a Visitar Malta
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Qué hacer
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Qué hacer en Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Ciudades históricas, playas, islas, comida, excursiones en barco y experiencias para una estancia inolvidable.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ideas"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Ver ideas ↓
                </a>

                {activityArticles.length > 0 && (
                  <a
                    href="#activity-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Leer guías de actividades
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Qué hacer durante un viaje a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Planifica tus días
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Combina visitas con tiempo junto al mar.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Malta funciona especialmente bien cuando combinas zonas históricas, paradas en la costa y excursiones a las islas, en lugar de hacer siempre el mismo tipo de día.
          </p>
        </div>
      </section>

      <section
        id="ideas"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Experiencias en Malta
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Empieza con estas ideas.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Úsalas como base para tu itinerario y combínalas según tus intereses y el tiempo disponible.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {activityIdeas.map((idea) => (
              <Link
                key={idea.number}
                href={idea.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {idea.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {idea.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {idea.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Leer la guía completa →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="guideMid" />

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Planificar el viaje
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Haz tu itinerario más fácil.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {planningTips.map((tip) => (
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

      {activityArticles.length > 0 && (
        <section
          id="activity-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Guías de actividades publicadas
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Más ideas de qué hacer en Malta.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos turísticos aprobados sobre actividades, atracciones, visitas y experiencias se conectan aquí automáticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {activityArticles.length}{" "}
                {activityArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activityArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/es/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#E3C8BE] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
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

                    <span className="inline-flex font-bold text-[#B83F29]">
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Descubre Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Completa el resto de tu viaje.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/beaches"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Playas →
            </Link>

            <Link
              href="/es/visit-malta/valletta"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              La Valeta
            </Link>

            <Link
              href="/es/visit-malta/gozo"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Gozo
            </Link>
          </div>
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

function MetadataBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-[#F3E6DF] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B83F29]">
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