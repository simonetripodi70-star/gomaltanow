import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import MoveGuideDetail from "@/components/MoveGuideDetail";
import { alternatesFor } from "@/lib/i18n";
import { localizeArticle, localizeArticles } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Bankowość na Malcie dla obywateli spoza UE | GoMaltaNow",
  description:
    "Jak przygotować się do otwarcia konta, otrzymywania wynagrodzenia, zarządzania kartami i codziennych płatności na Malcie.",
  alternates: {
    canonical: "/pl/move-to-malta/non-eu-citizen/banking-payments",
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
    title: "Wybierz odpowiednie konto",
    text: "Porównaj tradycyjne maltańskie banki, dostawców usług przez aplikację i usługi płatnicze pod kątem wynagrodzenia, przelewów, korzystania z karty i codziennych potrzeb.",
  },
  {
    number: "02",
    title: "Przygotuj dokumenty",
    text: "Banki i dostawcy usług płatniczych mogą poprosić o dokument tożsamości, potwierdzenie adresu, informacje o zatrudnieniu i inne dokumenty uzupełniające.",
  },
  {
    number: "03",
    title: "Skonfiguruj wypłatę wynagrodzenia",
    text: "Gdy masz już konto, potwierdź z pracodawcą właściwy IBAN lub dane konta, aby można było zorganizować wypłatę wynagrodzenia.",
  },
  {
    number: "04",
    title: "Zaplanuj czynsz i płatności cykliczne",
    text: "Upewnij się, że za pośrednictwem wybranego konta możesz opłacać czynsz, rachunki za media, subskrypcje i inne regularne wydatki.",
  },
  {
    number: "05",
    title: "Sprawdź opłaty i limity",
    text: "Zanim zaczniesz polegać na jednym dostawcy, sprawdź opłaty za konto, wypłaty z bankomatów, koszty wymiany walut, limity przelewów i warunki dotyczące karty.",
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
    title: "Porównaj więcej niż tylko miesięczną opłatę",
    text: "Opłaty za wypłaty z bankomatów, przelewy międzynarodowe, kursy wymiany i opłaty za kartę mogą być równie ważne jak podstawowy koszt konta.",
  },
  {
    title: "Zachowaj zapasową metodę płatności",
    text: "Druga karta lub konto mogą się przydać, jeśli Twoja główna karta zostanie zgubiona, zablokowana lub tymczasowo niedostępna.",
  },
  {
    title: "Chroń swoje konto",
    text: "Korzystaj z silnych ustawień bezpieczeństwa, powiadomień o płatnościach i uwierzytelniania dwuskładnikowego, jeśli są dostępne.",
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
    await localizeArticles(await getBankingArticles(), "pl");

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/pl"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/pl/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Powrót do przewodników dla osób spoza UE
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Banki i płatności
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Bankowość i płatności na Malcie dla obywateli spoza UE.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Dowiedz się, jak przygotować się do otwarcia konta, otrzymywania wynagrodzenia, zarządzania kartami i codziennych płatności na Malcie.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#banking-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Poznaj podstawy ↓
                </a>

                <a
                  href={REVOLUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Dołącz do Revolut
                </a>
              </div>

              <p className="mt-3 text-xs text-[#766F69]">
                Przycisk Revolut zawiera osobisty link z zaproszeniem.
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Bankowość i płatności na Malcie"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <MoveGuideDetail guide="non-eu/banking-payments" lang="pl" />

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Codzienne finanse
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Zadbaj o swoje finanse odpowiednio wcześnie.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            Konto, które sprawdzi się przy wypłacie wynagrodzenia, opłacaniu czynszu i codziennych wydatkach, może znacznie ułatwić Ci pierwsze tygodnie na Malcie.
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
              Bankowość krok po kroku
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Zorganizuj swoje płatności według jasnego planu.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              Wymagania różnią się w zależności od banku i dostawcy usług płatniczych, ale warto przygotować się w tych głównych obszarach.
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
              Bankowość przez aplikację
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-6xl">
              Revolut może być praktycznym rozwiązaniem.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
              Revolut może przydać się do płatności kartą, przelewów, obsługi wielu walut i zarządzania codziennymi wydatkami w aplikacji.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-[#625D57]">
              Dostępność, weryfikacja, funkcje konta i opłaty zależą od klienta oraz aktualnych warunków dostawcy.
            </p>

            <a
              href={REVOLUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#75601C] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#5D4C16] hover:shadow-lg"
            >
              Otwórz Revolut →
            </a>

            <p className="mt-3 text-xs text-[#766F69]">
              Ta strona zawiera osobisty link z zaproszeniem do Revolut.
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
              Dołącz do Revolut
            </h3>

            <p className="mt-4 leading-7 text-[#625D57]">
              Zarządzaj kartami, przelewami i codziennymi płatnościami z jednego konta w aplikacji.
            </p>

            <span className="mt-7 inline-flex font-bold text-[#75601C]">
              Zacznij →
            </span>
          </a>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Praktyczne porady
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Unikaj typowych problemów bankowych.
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
                  Opublikowane przewodniki bankowe
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Artykuły o bankowości i płatnościach dla obywateli spoza UE.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  Nowe zatwierdzone artykuły dotyczące bankowości, kart, przelewów, wypłat wynagrodzenia i Revolut są automatycznie dodawane tutaj.
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
                  href={`/pl/articles/${article.slug}`}
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
                      Czytaj artykuł →
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
              Lista kontrolna bankowości
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Przygotuj dokumenty do otwarcia konta.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Każdy dostawca może mieć inne wymagania, dlatego potraktuj tę listę jako przygotowanie i potwierdź ostatecznie wymagane dokumenty bezpośrednio u dostawcy.
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
            Kontynuuj przeprowadzkę
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Twoje podstawowe formalności dla osób spoza UE nabierają kształtu.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pl/move-to-malta/non-eu-citizen/healthcare"
              className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
            >
              Opieka zdrowotna →
            </Link>

            <Link
              href="/pl/move-to-malta/non-eu-citizen/residence"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Pobyt i dokumenty
            </Link>

            <Link
              href="/pl/move-to-malta/non-eu-citizen/find-a-job"
              className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
            >
              Znajdź pracę
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Kryteria kwalifikacji do usług bankowych, opłaty, wymagania dotyczące konta i warunki dostawców mogą się zmieniać. GoMaltaNow udostępnia ogólne praktyczne informacje. Zawsze sprawdzaj aktualne warunki bezpośrednio w odpowiednim banku lub u dostawcy usług płatniczych.
          </p>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/pl"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta po prostu.
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

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}