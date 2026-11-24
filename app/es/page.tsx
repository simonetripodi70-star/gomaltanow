import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { CONTACT_EMAIL } from "@/lib/site";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "GoMaltaNow | Malta fácil: visitar, mudarse y vivir en Malta",
  description:
    "Guías prácticas para visitar Malta, mudarse y vivir allí: playas, vivienda, trabajo, permisos de residencia, sanidad, bancos y las últimas novedades oficiales.",
  alternates: {
    canonical: "/es",
    languages: {"en": "/", "it": "/it", "pl": "/pl", "fr": "/fr", "de": "/de", "es": "/es", "uk": "/uk", "x-default": "/"},
  },
};


export const dynamic = "force-dynamic";

type LatestArticle = {
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

async function getLatestArticles(): Promise<LatestArticle[]> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    console.error(
      "Public Supabase configuration is missing.",
    );

    return [];
  }

  const supabase = createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

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
    .limit(3)
    .returns<LatestArticle[]>();

  if (error) {
    console.error(
      "Could not load latest homepage articles",
      error,
    );

    return [];
  }

  return data ?? [];
}

export default async function Home() {
  const latestArticles =
    await localizeArticles(await getLatestArticles(), "es");

  return (
    <main className="bg-[#F7F1EA] text-[#171717]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="La Valeta y la costa maltesa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        {/* Navbar */}
        <nav className="absolute left-0 top-0 z-30 w-full border-b border-white/10 bg-[#0B0D0F]/90 text-white backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
            <Link
              href="/es"
              className="font-serif text-3xl font-semibold tracking-tight md:text-4xl"
            >
              <span className="text-white">
                GoMalta
              </span>

              <span className="text-[#C94F32]">
                Now
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-base font-medium md:flex">
              <a
                className="transition hover:text-[#D96A4A]"
                href="/es/visit-malta"
              >
                Visitar Malta
              </a>

              <Link
                className="transition hover:text-[#D96A4A]"
                href="/es/move-to-malta"
              >
                Mudarse a Malta
              </Link>

              <Link
                className="transition hover:text-[#D96A4A]"
                href="/es/beaches"
              >
                Playas
              </Link>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#guides"
              >
                Guías
              </a>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#latest-updates"
              >
                Novedades
              </a>

              <a
                href="#guides"
                className="rounded-lg bg-[#B83F29] px-5 py-3 font-semibold text-white transition hover:bg-[#9F3422]"
              >
                Planifica tu próximo paso
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-16 pt-32 text-white md:px-8 md:pb-20 md:pt-40">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Malta fácil
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Todo lo que necesitas para visitar Malta o empezar una nueva vida aquí. Consejos locales, guías prácticas y herramientas útiles para cada paso de tu viaje.
            </p>
          </div>

          <div className="mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-2">
            <Link
              id="visit-malta"
              href="/es/visit-malta"
              className="group relative overflow-hidden rounded-3xl border border-[#D65C40] bg-gradient-to-br from-[#C7442D] to-[#A92F20] p-8 text-white shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-white/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#B83F29]">
                    🧳
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-2xl transition duration-300 group-hover:translate-x-2 group-hover:bg-white group-hover:text-[#B83F29]">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Visitar Malta
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                  Descubre playas preciosas, restaurantes locales, lugares históricos, rincones escondidos y experiencias inolvidables en todas las islas.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Playas
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Restaurantes
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Experiencias
                  </span>

                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Itinerarios
                  </span>
                </div>
              </div>
            </Link>

            <Link
              id="move-to-malta"
              href="/es/move-to-malta"
              className="group relative overflow-hidden rounded-3xl border border-[#E6DED4] bg-[#FFFDF9] p-8 text-[#171717] shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-[#B83F29]/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111315] text-2xl text-white">
                    🏠
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B9B0A6] text-2xl transition duration-300 group-hover:translate-x-2 group-hover:border-[#B83F29] group-hover:bg-[#B83F29] group-hover:text-white">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Mudarse a Malta
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-[#55514D] md:text-lg">
                  Entiende los trámites, encuentra casa, descubre oportunidades de trabajo y empieza tu nueva vida en Malta con confianza.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Vivienda
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Trabajo
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Residencia
                  </span>

                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Documentos
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 z-20 h-12 w-full rounded-t-[50%] bg-[#F7F1EA] md:h-16" />
      </section>

      {/* Popular Guides */}
      <section
        id="guides"
        className="relative z-30 bg-[#F7F1EA] pb-20 pt-8 md:pb-24 md:pt-10"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Descubre Malta
              </p>

              <h2 className="font-serif text-4xl font-medium md:text-5xl">
                Guías más populares
              </h2>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#625D57] md:text-lg">
                Guías seleccionadas para descubrir, planificar e instalarte en Malta.
              </p>
            </div>

            <a
              href="#latest-updates"
              className="font-semibold text-[#B83F29] transition hover:tracking-wide"
            >
              Ver las últimas novedades →
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/es/beaches"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/golden-bay.jpg"
                  alt="Playa de Golden Bay en Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Visitar Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Las mejores playas
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Descubre las playas, bahías y zonas de baño más bonitas de Malta.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Ver playas →
                </span>
              </div>
            </Link>

            <Link
              href="/es/updates/housing"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/home-malta.jpg"
                  alt="Casa tradicional maltesa"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Mudarse a Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Encontrar casa
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Compara barrios, información sobre alquileres y novedades oficiales de vivienda.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Ver vivienda →
                </span>
              </div>
            </Link>

            <Link
              href="/es/updates/work"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/jobs-malta.jpg"
                  alt="Trabajar en Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Trabajar en Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Encontrar trabajo
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Dónde buscar, qué documentos necesitas y qué normas laborales han cambiado.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Ver empleo →
                </span>
              </div>
            </Link>

            <Link
              href="/es/updates/transport"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/transport-malta.jpg"
                  alt="Transporte público en Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Moverse
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium">
                  Transporte
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Autobuses, ferris, taxis, aparcamiento y novedades oficiales de transporte.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Ver transporte →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="home" />

      <SideRail contentWidth={1400} />

      {/* Latest Updates */}
      <section
        id="latest-updates"
        className="border-y border-black/5 bg-[#EFE5DA] py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Publicado recientemente
              </p>

              <h2 className="font-serif text-4xl font-medium md:text-5xl">
                Últimas novedades de Malta
              </h2>

              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Artículos aprobados basados en fuentes oficiales y revisados antes de su publicación.
              </p>
            </div>

          </div>

          {latestArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C8B8A8] bg-[#FFFDF9] p-10 text-center">
              <h3 className="font-serif text-3xl">
                Todavía no hay novedades publicadas
              </h3>

              <p className="mt-3 text-[#625D57]">
                Los nuevos artículos aprobados aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/es/articles/${article.slug}`}
                  aria-label={`Read ${article.title}`}
                  className="group flex h-full cursor-pointer flex-col rounded-3xl border border-black/5 bg-[#FFFDF9] p-7 shadow-sm outline-none transition duration-300 hover:-translate-y-2 hover:border-[#B83F29]/20 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-[#B83F29]/30"
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
                    <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#766F69]">
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

                    <span className="inline-flex rounded-2xl bg-[#B83F29] px-5 py-3 font-bold text-white transition group-hover:bg-[#9F3422]">
                      Leer artículo
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SectionLink
              href="/es/updates/transport"
              title="Transporte"
              description="Transporte público y movilidad"
            />

            <SectionLink
              href="/es/updates/housing"
              title="Vivienda"
              description="Alquiler y servicios de vivienda"
            />

            <SectionLink
              href="/es/updates/work"
              title="Trabajo"
              description="Empleo y requisitos"
            />

            <SectionLink
              href="/es/updates/residence"
              title="Residencia"
              description="Permisos y trámites"
            />
          </div>
        </div>
      </section>

      {/* Why GoMaltaNow */}
      <AdSlot placement="homeMid" />

      <section className="bg-[#111315] py-20 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#D96A4A]">
                Por qué GoMaltaNow
              </p>

              <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight md:text-6xl">
                Malta explicada con claridad, todo en un solo lugar.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Información práctica para vacaciones, mudanzas y vida diaria, creada para ayudarte a decidir mejor sin perder tiempo.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FeatureCard
                icon="✓"
                title="Conocimiento local"
                description="Consejos útiles basados en la vida real en Malta, no en recomendaciones de viaje genéricas."
              />

              <FeatureCard
                icon="↻"
                title="Guías actualizadas"
                description="Seguimos las fuentes oficiales para revisar y explicar los cambios importantes."
              />

              <FeatureCard
                icon="◇"
                title="Navegación sencilla"
                description="Elige si vienes de visita o a vivir y llega rápido a la información que te importa."
              />

              <FeatureCard
                icon="→"
                title="Una guía completa"
                description="Playas, vivienda, trabajo, transporte y documentos reunidos en un solo lugar."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#C7442D] py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-white/70">
              Empieza tu viaje a Malta
            </p>

            <h2 className="max-w-3xl font-serif text-4xl font-medium md:text-5xl">
              ¿Vienes una semana o a empezar una nueva vida?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/es/visit-malta"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#A92F20] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Visitar Malta
            </a>

            <Link
              href="/es/move-to-malta"
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#A92F20]"
            >
              Mudarse a Malta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-14 text-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link
                href="/es"
                className="font-serif text-3xl font-semibold tracking-tight"
              >
                <span className="text-white">
                  GoMalta
                </span>

                <span className="text-[#C94F32]">
                  Now
                </span>
              </Link>

              <p className="mt-4 max-w-sm leading-relaxed text-white/60">
                Malta fácil. Guías prácticas para visitar, mudarse y vivir en las islas maltesas.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                Visitar Malta
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <Link
                  className="transition hover:text-white"
                  href="/es/beaches"
                >
                  Playas
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/es/updates/transport"
                >
                  Transporte
                </Link>

                <span className="text-white/35">
                  Restaurantes
                </span>

                <span className="text-white/35">
                  Itinerarios
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                Mudarse a Malta
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <Link
                  className="transition hover:text-white"
                  href="/es/updates/housing"
                >
                  Vivienda
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/es/updates/work"
                >
                  Trabajo
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/es/updates/residence"
                >
                  Residencia
                </Link>

                <Link
                  className="transition hover:text-white"
                  href="/es/move-to-malta"
                >
                  Guía de mudanza
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">
                GoMaltaNow
              </h3>

              <div className="flex flex-col gap-3 text-white/60">
                <a
                  className="transition hover:text-white"
                  href="#guides"
                >
                  Guías
                </a>

                <a
                  className="transition hover:text-white"
                  href="#latest-updates"
                >
                  Últimas novedades
                </a>

                <span className="text-white/35">
                  Quiénes somos
                </span>

                <a
                  className="transition hover:text-white"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  Contacto
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 GoMaltaNow. Todos los derechos reservados.
            </p>

            <p>Malta fácil.</p>
          </div>
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
    <span className="rounded-full bg-[#E9DED3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#655B53]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function SectionLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#FFFDF9] p-5 transition hover:-translate-y-1 hover:border-[#B83F29]/30 hover:shadow-lg"
    >
      <div>
        <h3 className="font-serif text-2xl">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#766F69]">
          {description}
        </p>
      </div>

      <span className="text-2xl text-[#B83F29] transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
        {icon}
      </div>

      <h3 className="mb-3 font-serif text-2xl">
        {title}
      </h3>

      <p className="leading-relaxed text-white/65">
        {description}
      </p>
    </div>
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