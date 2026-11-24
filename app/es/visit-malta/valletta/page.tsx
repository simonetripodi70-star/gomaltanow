import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Guía de La Valeta: qué ver en la capital de Malta | GoMaltaNow",
  description:
    "Explora La Valeta: calles históricas, vistas del puerto, museos, iglesias y los lugares de interés más importantes de la capital de Malta.",
  alternates: {
    canonical: "/es/visit-malta/valletta",
    languages: {"en": "/visit-malta/valletta", "it": "/it/visit-malta/valletta", "pl": "/pl/visit-malta/valletta", "fr": "/fr/visit-malta/valletta", "de": "/de/visit-malta/valletta", "es": "/es/visit-malta/valletta", "uk": "/uk/visit-malta/valletta", "x-default": "/visit-malta/valletta"},
  },
};


export const dynamic = "force-dynamic";

type VallettaArticle = {
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

const vallettaArticleKeys = [
  "valletta",
  "capital",
  "upper-barrakka",
  "lower-barrakka",
  "waterfront",
  "museums",
  "museum",
  "three-cities",
  "grand-harbour",
  "sightseeing",
];

const highlights = [
  {
    number: "01",
    slug: "upper-barrakka-gardens",
    title: "Jardines de Upper Barrakka",
    text: "Disfruta de uno de los miradores más conocidos de La Valeta sobre el Grand Harbour.",
  },
  {
    number: "02",
    slug: "st-johns-co-cathedral",
    title: "Concatedral de San Juan",
    text: "Visita uno de los monumentos históricos y artísticos más importantes de Malta, en el corazón de la ciudad.",
  },
  {
    number: "03",
    slug: "republic-street",
    title: "Republic Street",
    text: "Recorre la principal calle peatonal de La Valeta, con tiendas, cafeterías, edificios históricos y calles secundarias por explorar.",
  },
  {
    number: "04",
    slug: "valletta-waterfront",
    title: "Paseo marítimo de La Valeta",
    text: "Baja hacia el puerto para encontrar restaurantes, almacenes históricos y una perspectiva diferente de la capital.",
  },
  {
    number: "05",
    slug: "museums-in-valletta",
    title: "Museos e historia",
    text: "La Valeta cuenta con varios museos y lugares históricos que facilitan planificar un día completo dedicado a la cultura y la historia.",
  },
  {
    number: "06",
    slug: "three-cities-from-valletta",
    title: "Conexión con las Tres Ciudades",
    text: "Combina La Valeta con un cruce del puerto o un trayecto en ferry a las Tres Ciudades para disfrutar de una experiencia más completa del Grand Harbour.",
  },
];

const planningTips = [
  {
    title: "Lleva calzado cómodo",
    text: "La Valeta tiene cuestas, escaleras y mucho que recorrer a pie, por lo que un calzado cómodo marca una gran diferencia.",
  },
  {
    title: "Empieza temprano en verano",
    text: "Las visitas por la mañana pueden ser más cómodas durante los meses calurosos y también ayudarte a evitar las horas de mayor afluencia.",
  },
  {
    title: "Combina atracciones cercanas",
    text: "Muchos de los principales lugares de interés están cerca unos de otros, por lo que es fácil explorar La Valeta a pie de forma eficiente.",
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

function isVallettaArticle(
  article: VallettaArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return vallettaArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getVallettaArticles(): Promise<
  VallettaArticle[]
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
    .returns<VallettaArticle[]>();

  if (error) {
    console.error(
      "Could not load Valletta articles",
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
    .filter(isVallettaArticle);
}

export default async function VallettaPage() {
  const vallettaArticles =
    await localizeArticles(await getVallettaArticles(), "es");

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
                La Valeta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Explora La Valeta, la capital de Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Calles históricas, vistas del puerto, museos, iglesias y algunos de los lugares de interés más importantes de Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#highlights"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Explora La Valeta ↓
                </a>

                {vallettaArticles.length > 0 && (
                  <a
                    href="#valletta-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Lee guías de La Valeta
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="La Valeta, Malta"
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
            La capital de Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            La Valeta es compacta y fácil de explorar a pie.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Puedes ver muchas de las principales atracciones de la ciudad en un día, pero una visita más tranquila te da más tiempo para recorrer calles secundarias, museos y disfrutar de las vistas del puerto.
          </p>
        </div>
      </section>

      <section
        id="highlights"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Lo más destacado de La Valeta
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Qué ver en La Valeta.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Empieza por estos lugares y después explora las calles que los conectan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <Link
                key={item.number}
                href={`/es/visit-malta/valletta/${item.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
              >
                <span className="font-serif text-5xl text-[#B83F29]/20">
                  {item.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium transition group-hover:text-[#B83F29]">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                  {item.text}
                </p>

                <span className="mt-6 font-bold text-[#B83F29]">
                  Horarios, entradas y cómo llegar →
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
              Consejos prácticos
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Haz que tu visita a La Valeta sea más fácil.
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

      {vallettaArticles.length > 0 && (
        <section
          id="valletta-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Guías publicadas sobre La Valeta
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Más guías sobre La Valeta.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Los nuevos artículos turísticos aprobados sobre La Valeta, los museos, el Grand Harbour y las atracciones cercanas se enlazan aquí automáticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {vallettaArticles.length}{" "}
                {vallettaArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {vallettaArticles.map((article) => (
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
            Sigue explorando
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Descubre más sobre la Malta histórica.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/es/visit-malta/mdina-rabat"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Mdina y Rabat →
            </Link>

            <Link
              href="/es/visit-malta/things-to-do"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Qué hacer
            </Link>

            <Link
              href="/es/visit-malta/transport"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Transporte
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