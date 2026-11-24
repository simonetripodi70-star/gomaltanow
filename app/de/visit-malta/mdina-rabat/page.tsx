import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Reiseführer für Mdina und Rabat: Sehenswürdigkeiten und Tipps | GoMaltaNow",
  description:
    "Entdecke Mdina und Rabat: befestigte Gassen, historische Sehenswürdigkeiten, Katakomben und eine der stimmungsvollsten Gegenden Maltas.",
  alternates: {
    canonical: "/de/visit-malta/mdina-rabat",
    languages: {"en": "/visit-malta/mdina-rabat", "it": "/it/visit-malta/mdina-rabat", "pl": "/pl/visit-malta/mdina-rabat", "fr": "/fr/visit-malta/mdina-rabat", "de": "/de/visit-malta/mdina-rabat", "es": "/es/visit-malta/mdina-rabat", "uk": "/uk/visit-malta/mdina-rabat", "x-default": "/visit-malta/mdina-rabat"},
  },
};


export const dynamic = "force-dynamic";

type MdinaRabatArticle = {
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

const articleKeys = [
  "mdina",
  "rabat",
  "mdina-rabat",
  "silent-city",
  "st-paul",
  "catacombs",
  "catacomb",
  "historic-malta",
  "history",
  "sightseeing",
];

const highlights = [
  {
    number: "01",
    slug: "mdina-gate",
    title: "Mdina-Tor",
    text: "Betritt Maltas historische Festungsstadt durch eines ihrer bekanntesten Wahrzeichen und beginne, die engen Gassen im Inneren zu erkunden.",
  },
  {
    number: "02",
    slug: "st-pauls-cathedral-mdina",
    title: "St. Paul’s Cathedral",
    text: "Besuche eines der wichtigsten religiösen und architektonischen Wahrzeichen Mdinas im Herzen der Altstadt.",
  },
  {
    number: "03",
    slug: "mdina-bastion-viewpoints",
    title: "Aussichtspunkte in Mdina",
    text: "Spaziere zu den Bastionen und genieße weite Ausblicke über Zentralmalta und die umliegende Landschaft.",
  },
  {
    number: "04",
    slug: "rabat-streets",
    title: "Gassen von Rabat",
    text: "Setze deinen Weg außerhalb von Mdina nach Rabat fort, mit Cafés, traditionellen Gassen und einer lebendigeren lokalen Atmosphäre.",
  },
  {
    number: "05",
    slug: "st-pauls-catacombs",
    title: "St. Paul’s Katakomben",
    text: "Erkunde eine der bekanntesten historischen Stätten Rabats und erfahre mehr über Maltas frühchristliche und römische Geschichte.",
  },
  {
    number: "06",
    slug: "mdina-in-the-evening",
    title: "Abend in Mdina",
    text: "Kehre später am Tag zurück, um ruhigere Gassen, warmes Licht und die Atmosphäre zu erleben, die Mdina den Beinamen Stille Stadt eingebracht hat.",
  },
];

const planningTips = [
  {
    title: "Mdina und Rabat kombinieren",
    text: "Sie liegen direkt nebeneinander, daher ist es meist am praktischsten, beide am selben Tag zu besuchen.",
  },
  {
    title: "Nimm dir Zeit zum Bummeln",
    text: "Zu den schönsten Seiten Mdinas gehören eher die kleineren Gassen, Innenhöfe und Aussichtspunkte als eine einzelne Sehenswürdigkeit.",
  },
  {
    title: "Ziehe den späten Nachmittag in Betracht",
    text: "Ein späterer Besuch kann in den wärmeren Monaten kühler sein und lässt dich Mdina erleben, wenn das Tageslicht langsam schwindet.",
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

function isMdinaRabatArticle(
  article: MdinaRabatArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return articleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getMdinaRabatArticles(): Promise<
  MdinaRabatArticle[]
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
    .returns<MdinaRabatArticle[]>();

  if (error) {
    console.error(
      "Could not load Mdina and Rabat articles",
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
    .filter(isMdinaRabatArticle);
}

export default async function MdinaRabatPage() {
  const articles =
    await localizeArticles(await getMdinaRabatArticles(), "de");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/de"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/de/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Zurück zu Malta besuchen
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Mdina und Rabat
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Entdecke Mdina und Rabat.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Befestigte Gassen, historische Sehenswürdigkeiten, Katakomben und eine der stimmungsvollsten Gegenden Maltas.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#highlights"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Entdecke die Gegend ↓
                </a>

                {articles.length > 0 && (
                  <a
                    href="#mdina-rabat-articles"
                    className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                  >
                    Lies lokale Reiseführer
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/hero.jpg"
              alt="Mdina und Rabat auf Malta"
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
            Historisches Malta
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Zwei benachbarte Orte, ein unkomplizierter Tagesausflug.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Mdina und Rabat liegen nah genug beieinander, um sie gemeinsam zu erkunden. Dich erwartet eine Mischung aus befestigter Architektur, lokalen Gassen, Museen und archäologischen Stätten.
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
              Sehenswürdigkeiten
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Highlights von Mdina und Rabat.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Beginne mit diesen Orten und nimm dir Zeit, ohne feste Route auf Entdeckungstour zu gehen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {highlights.map((item) => (
              <Link
                key={item.number}
                href={`/de/visit-malta/mdina-rabat/${item.slug}`}
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
                  Öffnungszeiten, Tickets und Anreise →
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
              Praktische Tipps
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Plane deinen Besuch einfacher.
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

      {articles.length > 0 && (
        <section
          id="mdina-rabat-articles"
          className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  Veröffentlichte lokale Reiseführer
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Weitere Reiseführer zu Mdina und Rabat.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Neue veröffentlichte Reiseartikel über Mdina, Rabat, die Stille Stadt und nahegelegene historische Sehenswürdigkeiten werden hier automatisch verknüpft.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#B83F29]">
                {articles.length}{" "}
                {articles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/de/articles/${article.slug}`}
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
                      Artikel lesen →
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
            Weiter entdecken
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Entdecke mehr von Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/de/visit-malta/valletta"
              className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220]"
            >
              Valletta →
            </Link>

            <Link
              href="/de/visit-malta/gozo"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Gozo
            </Link>

            <Link
              href="/de/visit-malta/things-to-do"
              className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
            >
              Aktivitäten
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/de"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta einfach gemacht.
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

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}