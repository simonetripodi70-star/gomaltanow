import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Permessi di soggiorno a Malta per cittadini non UE | GoMaltaNow",
  description:
    "Tieni traccia di permessi, documenti d'identità, carte di soggiorno, rinnovi e pratiche amministrative mentre vivi a Malta.",
  alternates: {
    canonical: "/it/move-to-malta/non-eu-citizen/residence",
    languages: {"en": "/move-to-malta/non-eu-citizen/residence", "it": "/it/move-to-malta/non-eu-citizen/residence", "pl": "/pl/move-to-malta/non-eu-citizen/residence", "fr": "/fr/move-to-malta/non-eu-citizen/residence", "de": "/de/move-to-malta/non-eu-citizen/residence", "es": "/es/move-to-malta/non-eu-citizen/residence", "uk": "/uk/move-to-malta/non-eu-citizen/residence", "x-default": "/move-to-malta/non-eu-citizen/residence"},
  },
};


export const dynamic = "force-dynamic";

type ResidenceArticle = {
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

const residenceArticleKeys = [
  "residence",
  "residency",
  "residence-permit",
  "permit-renewal",
  "renewal",
  "documents",
  "identity",
  "identita",
  "card",
  "residence-card",
  "biometrics",
];

const residenceSteps = [
  {
    number: "01",
    title: "Comprendi il tuo status di soggiorno",
    text: "La tua posizione di soggiorno dipende dal permesso o dal percorso di immigrazione applicabile al tuo caso. Chiarisci fin dall'inizio le condizioni del tuo permesso.",
  },
  {
    number: "02",
    title: "Prepara la documentazione richiesta",
    text: "Tieni organizzati e aggiornati il passaporto, i documenti del permesso, i documenti di lavoro, i dettagli dell'alloggio e qualsiasi altro documento di supporto.",
  },
  {
    number: "03",
    title: "Completa le formalità di identificazione",
    text: "Potrebbe essere necessario completare formalità biometriche, di identificazione o relative alla carta di soggiorno come parte della procedura. Segui le istruzioni fornite dalla relativa autorità maltese.",
  },
  {
    number: "04",
    title: "Tieni traccia delle scadenze",
    text: "I documenti e i permessi di soggiorno possono avere date di scadenza. Tieni un registro delle scadenze affinché rinnovi e documenti di supporto possano essere preparati per tempo.",
  },
  {
    number: "05",
    title: "Aggiorna le modifiche quando richiesto",
    text: "Le modifiche relative a lavoro, indirizzo, dati del passaporto o circostanze personali potrebbero dover essere comunicate. Verifica le condizioni applicabili al tuo permesso.",
  },
];

const checklist = [
  "Valid passport",
  "Current residence or permit documents",
  "Employment documentation where relevant",
  "Proof of accommodation",
  "Copies of rental or housing documents",
  "Insurance or healthcare documents where required",
  "Application receipts and reference numbers",
  "Copies of official correspondence",
];

const importantPoints = [
  {
    title: "Controlla la data di scadenza",
    text: "Non aspettare l'ultimo momento per controllare la data di scadenza del tuo permesso o della carta di soggiorno. Alcune procedure di rinnovo richiedono una preparazione anticipata.",
  },
  {
    title: "Mantieni aggiornate le informazioni sul tuo indirizzo",
    text: "I dettagli del tuo alloggio possono essere rilevanti per le procedure amministrative, quindi conserva i documenti di affitto e verifica se i cambiamenti di indirizzo devono essere comunicati.",
  },
  {
    title: "Conserva copie digitali",
    text: "Conserva copie digitali chiare di passaporti, permessi, contratti, ricevute e lettere ufficiali, così da potervi accedere quando necessario.",
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

function isResidenceArticle(
  article: ResidenceArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return residenceArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getResidenceArticles(): Promise<
  ResidenceArticle[]
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
    .returns<ResidenceArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU residence articles",
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
    .filter(isResidenceArticle);
}

export default async function ResidencePage() {
  const residenceArticles =
    await localizeArticles(await getResidenceArticles(), "it");

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
                Residenza e documenti
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Gestisci i tuoi documenti di soggiorno a Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Tieni traccia di permessi, documenti d&apos;identità, carte di soggiorno, rinnovi e pratiche amministrative legate alla vita a Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#residence-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Scopri il processo ↓
                </a>

                {residenceArticles.length > 0 && (
                  <a
                    href="#residence-articles"
                    className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                  >
                    Leggi le guide sul soggiorno
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Documenti di soggiorno e identità a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/residence" lang="it" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Resta organizzato
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            I documenti di soggiorno richiedono attenzione continua.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Le tue responsabilità amministrative non finiscono necessariamente una volta rilasciato un permesso. Tieni traccia delle date di scadenza, dei cambiamenti nelle circostanze e di eventuali documenti che potrebbero dover essere aggiornati.
          </p>
        </div>
      </section>

      <section
        id="residence-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Gestione amministrativa del soggiorno
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Tieni sotto controllo il tuo status di soggiorno.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Usa questi passaggi come guida pratica per organizzare i tuoi documenti e le tue responsabilità amministrative.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {residenceSteps.map((step) => (
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
              Abitudini importanti
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Evita problemi amministrativi evitabili.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {importantPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {point.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {point.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {residenceArticles.length > 0 && (
        <section
          id="residence-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guide sulla residenza pubblicate
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articoli su soggiorno e documenti per cittadini non UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli approvati relativi a soggiorno, permessi, documenti d&apos;identità e rinnovi vengono collegati automaticamente qui.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {residenceArticles.length}{" "}
                {residenceArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {residenceArticles.map((article) => (
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
              Checklist dei documenti
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Tieni insieme i tuoi documenti essenziali.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Questa è una checklist pratica per l&apos;organizzazione. I documenti esatti richiesti dipendono dal tuo percorso di soggiorno e dalle tue circostanze personali.
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
            Continua il tuo trasferimento
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Continua con le prossime guide pratiche.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Assistenza sanitaria →
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/find-a-home"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trovare casa
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/single-permit"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Single Permit
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            I requisiti relativi a soggiorno, immigrazione e identità possono cambiare. GoMaltaNow fornisce informazioni pratiche generali e non sostituisce le indicazioni ufficiali o la consulenza professionale in materia di immigrazione.
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