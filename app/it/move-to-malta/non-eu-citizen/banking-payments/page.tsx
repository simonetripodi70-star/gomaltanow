import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Servizi bancari a Malta per cittadini extra-UE | GoMaltaNow",
  description:
    "Come prepararti per aprire un conto, ricevere lo stipendio, gestire le carte e affrontare i pagamenti quotidiani a Malta.",
  alternates: {
    canonical: "/it/move-to-malta/non-eu-citizen/banking-payments",
    languages: {"en": "/move-to-malta/non-eu-citizen/banking-payments", "it": "/it/move-to-malta/non-eu-citizen/banking-payments", "pl": "/pl/move-to-malta/non-eu-citizen/banking-payments", "fr": "/fr/move-to-malta/non-eu-citizen/banking-payments", "de": "/de/move-to-malta/non-eu-citizen/banking-payments", "es": "/es/move-to-malta/non-eu-citizen/banking-payments", "uk": "/uk/move-to-malta/non-eu-citizen/banking-payments", "x-default": "/move-to-malta/non-eu-citizen/banking-payments"},
  },
};


export const dynamic = "force-dynamic";

type BankingArticle = {
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

const REVOLUT_URL =
  "https://revolut.com/referral/?referral-code=simone01td!AUG1-26-AR-L1&geo-redirect";

const bankingArticleKeys = [
  "banking-payments",
  "banking",
  "payments",
  "finance",
  "financial",
  "money",
  "account",
  "salary-account",
  "cards",
  "card",
  "transfers",
  "revolut",
];

const bankingSteps = [
  {
    number: "01",
    title: "Scegli il conto giusto",
    text: "Confronta le banche maltesi tradizionali, i fornitori tramite app e i servizi di pagamento in base al tuo stipendio, ai bonifici, all'uso della carta e alle esigenze quotidiane.",
  },
  {
    number: "02",
    title: "Prepara i tuoi documenti",
    text: "Le banche e i fornitori di servizi di pagamento possono richiedere un documento d'identità, una prova di indirizzo, informazioni sul lavoro e altri documenti di supporto.",
  },
  {
    number: "03",
    title: "Organizza l'accredito dello stipendio",
    text: "Una volta aperto un conto, conferma l'IBAN corretto o i dati del conto con il tuo datore di lavoro affinché possa organizzare l'accredito dello stipendio.",
  },
  {
    number: "04",
    title: "Pianifica l'affitto e i pagamenti ricorrenti",
    text: "Assicurati di poter gestire l'affitto, le utenze, gli abbonamenti e altre spese regolari tramite il conto scelto.",
  },
  {
    number: "05",
    title: "Verifica commissioni e limiti",
    text: "Controlla le commissioni del conto, i costi dei prelievi ATM, i costi di cambio valuta, i limiti dei bonifici e le condizioni della carta prima di fare affidamento su un unico fornitore.",
  },
];

const bankingChecklist = [
  "Valid passport",
  "Residence or permit documents where requested",
  "Proof of address",
  "Employment contract or proof of income",
  "Tax or identification details where requested",
  "Mobile number and email address",
  "Copies of submitted documents",
  "Account and IBAN details once approved",
];

const bankingTips = [
  {
    title: "Confronta più della commissione mensile",
    text: "I costi dei prelievi ATM, i bonifici internazionali, i tassi di cambio e le commissioni delle carte possono essere importanti quanto il costo base del conto.",
  },
  {
    title: "Mantieni un metodo di pagamento di riserva",
    text: "Avere una seconda carta o un secondo conto può essere utile se la tua carta principale viene smarrita, bloccata o temporaneamente non disponibile.",
  },
  {
    title: "Proteggi il tuo conto",
    text: "Usa impostazioni di sicurezza efficaci, notifiche di pagamento e l'autenticazione a due fattori, dove disponibile.",
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

function isBankingArticle(
  article: BankingArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return bankingArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getBankingArticles(): Promise<
  BankingArticle[]
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
    .returns<BankingArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU banking articles",
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
    .filter(isBankingArticle);
}

export default async function BankingPaymentsPage() {
  const bankingArticles =
    await localizeArticles(await getBankingArticles(), "it");

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
                Banche e pagamenti
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Servizi bancari e pagamenti a Malta per cittadini extra-UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Scopri come prepararti per aprire un conto, ricevere lo stipendio, gestire le carte e affrontare i pagamenti quotidiani a Malta.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#banking-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Scopri le basi ↓
                </a>

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Unisciti a Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                Il pulsante Revolut contiene un link di invito personale.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Servizi bancari e pagamenti a Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/banking-payments" lang="it" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Denaro quotidiano
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Organizza presto le tue finanze.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Un conto adatto per l&apos;accredito dello stipendio, l&apos;affitto e le spese quotidiane può rendere molto più semplici le tue prime settimane a Malta.
          </p>
        </div>
      </section>

      <section
        id="banking-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Servizi bancari passo dopo passo
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Organizza i tuoi pagamenti con un piano chiaro.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              I requisiti variano tra banche e fornitori di servizi di pagamento, ma queste sono le principali aree per cui prepararsi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {bankingSteps.map((step) => (
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

      <section className="bg-[#F2EACF] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#75601C]">
              Servizi bancari tramite app
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-6xl">
              Revolut può essere un&apos;opzione pratica.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
              Revolut può essere utile per pagamenti con carta, bonifici, più valute e gestione delle spese quotidiane tramite un&apos;app.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-[#625D57]">
              La disponibilità, la verifica, le funzionalità del conto e le commissioni dipendono dal cliente e dalle condizioni attuali del fornitore.
            </p>

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
            >
              Apri Revolut →
            </a>

            <p className="mt-3 text-xs text-[#766F69]">
              Questa pagina contiene un link di invito personale a Revolut.
            </p>
          </div>

          <a
            href={REVOLUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-[#D8C98F] bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111315] text-2xl text-white">
                €
              </div>

              <span className="text-3xl text-[#75601C] transition group-hover:translate-x-2">
                →
              </span>
            </div>

            <h3 className="mt-8 font-serif text-4xl">
              Unisciti a Revolut
            </h3>

            <p className="mt-4 leading-7 text-[#625D57]">
              Gestisci carte, bonifici e pagamenti quotidiani da un unico conto tramite app.
            </p>

            <span className="mt-7 inline-flex font-bold text-[#75601C]">
              Inizia →
            </span>
          </a>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Consigli pratici
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Evita i problemi bancari più comuni.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {bankingTips.map((tip) => (
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

      {bankingArticles.length > 0 && (
        <section
          id="banking-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Guide bancarie pubblicate
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Articoli bancari e sui pagamenti per cittadini extra-UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  I nuovi articoli approvati relativi a servizi bancari, carte, bonifici, accredito dello stipendio e Revolut vengono collegati qui automaticamente.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {bankingArticles.length}{" "}
                {bankingArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {bankingArticles.map((article) => (
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
              Checklist bancaria
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepara i documenti per il conto.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Ogni fornitore può avere requisiti diversi, quindi usa questa lista per prepararti e conferma i documenti finali direttamente con il fornitore.
            </p>
          </div>

          <div className="space-y-4">
            {bankingChecklist.map((item) => (
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
            La tua configurazione essenziale per cittadini extra-UE sta prendendo forma.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/it/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Assistenza sanitaria →
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Residenza e documenti
            </Link>

            <Link
              href="/it/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Trovare lavoro
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            L&apos;idoneità ai servizi bancari, le commissioni, i requisiti del conto e le condizioni dei fornitori possono cambiare. GoMaltaNow fornisce informazioni pratiche generali. Controlla sempre le condizioni aggiornate direttamente con la banca o il fornitore di servizi di pagamento interessato.
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