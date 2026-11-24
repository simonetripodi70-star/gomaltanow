import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Assistenza sanitaria a Malta per cittadini non UE | GoMaltaNow",
  description:
    "Accesso all'assistenza sanitaria, assicurazioni, servizi medici e documenti di cui potresti aver bisogno vivendo a Malta come cittadino non UE.",
  alternates: {
    canonical: "/it/move-to-malta/non-eu-citizen/healthcare",
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
    title: "Comprendi il tuo diritto all'assistenza sanitaria",
    text: "Il tuo accesso all'assistenza sanitaria a Malta può dipendere dallo status di residenza, dall'occupazione, dall'assicurazione e dalle circostanze personali. Verifica cosa si applica al tuo caso prima di fare affidamento su una specifica forma di copertura.",
  },
  {
    number: "02",
    title: "Stipula l'assicurazione richiesta",
    text: "Alcuni percorsi di immigrazione o residenza possono richiedere una prova della copertura sanitaria. Assicurati che la tua polizza soddisfi le condizioni applicabili al tuo caso.",
  },
  {
    number: "03",
    title: "Sapere dove cercare assistenza",
    text: "Scopri la differenza tra cure mediche di routine, farmacie, centri sanitari, cliniche private e servizi di emergenza, così saprai dove andare quando avrai bisogno di aiuto.",
  },
  {
    number: "04",
    title: "Conserva i tuoi documenti medici",
    text: "Conserva copie delle polizze assicurative, delle prescrizioni, dei referti medici, dei certificati vaccinali e di altri documenti sanitari utili.",
  },
  {
    number: "05",
    title: "Rivedi la tua situazione quando cambia",
    text: "Un cambiamento nell'occupazione, nello status di residenza o nell'assicurazione può influire sulle tue disposizioni sanitarie, quindi rivedi la tua copertura quando le tue circostanze cambiano.",
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
    title: "Tieni accessibili i dettagli dell'assicurazione",
    text: "Conserva il numero della polizza, le informazioni di contatto dell'assicuratore e i documenti di copertura in un luogo a cui puoi accedere rapidamente.",
  },
  {
    title: "Conosci i servizi più vicini",
    text: "Individua farmacie, centri sanitari, cliniche e ospedali nelle vicinanze prima di averne urgente bisogno.",
  },
  {
    title: "Non presumere che ogni servizio sia gratuito",
    text: "L'idoneità e i costi possono dipendere dal tuo status e dal servizio utilizzato, quindi verifica le condizioni applicabili al tuo caso.",
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
    await localizeArticles(await getHealthcareArticles(), "it");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/it"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/it/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Torna alle guide per cittadini extra-UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Assistenza sanitaria a Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Assistenza sanitaria a Malta per cittadini non UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Scopri l&apos;accesso all&apos;assistenza sanitaria, le assicurazioni, i servizi medici e i documenti di cui potresti aver bisogno mentre vivi a Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#healthcare-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Scopri le basi ↓
                </a>

                {healthcareArticles.length > 0 && (
                  <a
                    href="#healthcare-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leggi le guide sull&apos;assistenza sanitaria
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Assistenza sanitaria e servizi medici a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/healthcare" lang="it" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Prima di aver bisogno di cure mediche
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Comprendi in anticipo la tua copertura.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            L&apos;accesso all&apos;assistenza sanitaria per i cittadini di Paesi terzi può dipendere dall&apos;occupazione, dallo status di residenza, dall&apos;assicurazione e dal tipo di servizio medico richiesto.
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
              Assistenza sanitaria passo dopo passo
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepara le tue disposizioni sanitarie.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Segui questi passaggi per organizzare gli aspetti più importanti dell&apos;assistenza sanitaria prima e dopo il trasferimento.
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
              Consigli pratici
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Rendi l&apos;assistenza sanitaria più facile da gestire.
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
                  Guide sanitarie pubblicate
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articoli su assistenza sanitaria e assicurazioni per cittadini non UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli approvati relativi a assistenza sanitaria, assicurazioni, ospedali, farmacie e servizi medici vengono collegati qui automaticamente.
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
                  href={`/it/articles/${article.slug}`}
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
                      Leggi l&apos;articolo →
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
              Checklist sanitaria
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Tieni insieme i tuoi documenti sanitari.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              I documenti esatti di cui hai bisogno dipendono dalla tua situazione, ma tenere questi documenti in ordine può rendere più semplici l&apos;assistenza sanitaria e le procedure amministrative.
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
            Continua il tuo trasferimento
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Prosegui con la tua organizzazione pratica a Malta.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/move-to-malta/non-eu-citizen/banking-payments"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Servizi bancari e pagamenti →
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Residenza e documenti
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trovare casa
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            I requisiti di idoneità all&apos;assistenza sanitaria, le condizioni assicurative e le condizioni dei servizi medici possono cambiare. GoMaltaNow fornisce informazioni pratiche generali e non sostituisce le indicazioni sanitarie ufficiali o la consulenza medica professionale.
          </p>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/it"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta resa semplice.
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

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}