import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Polityka prywatności | GoMaltaNow",
  description:
    "Jak GoMaltaNow przetwarza Twoje dane, pliki cookie i reklamy oraz jakie prawa przysługują Ci na mocy RODO.",
  alternates: {
    canonical: "/pl/privacy",
    languages: {"en": "/privacy", "it": "/it/privacy", "pl": "/pl/privacy", "fr": "/fr/privacy", "de": "/de/privacy", "es": "/es/privacy", "uk": "/uk/privacy", "x-default": "/privacy"},
  },
};

const linkClass =
  "font-semibold text-[#B83F29] underline decoration-[#C94F32]/40 underline-offset-4 hover:text-[#8F2E1E]";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/pl"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/pl"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Powrót na stronę główną
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Polityka prywatności
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Ostatnia aktualizacja: 20 November 2026
        </p>

        <Section title="Kim jesteśmy">
          <p>
            GoMaltaNow (gomaltanow.com) is an
            independent guide to visiting, moving to
            and living in Malta. For any question
            about this policy or your data, write to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={linkClass}
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="Co zbieramy">
          <p>
            Możesz korzystać z GoMaltaNow bez konta, a my nie prosimy o Twoje imię, adres e-mail ani inne dane osobowe. Na stronie nie ma komentarzy ani formularzy rejestracyjnych. Jeśli napiszesz do nas e-mail, użyjemy Twojego adresu i wiadomości wyłącznie po to, aby Ci odpowiedzieć.
          </p>
        </Section>

        <Section title="Hosting">
          <p>
            Strona korzysta z Cloudflare. Aby dostarczać strony i chronić witrynę przed atakami, Cloudflare przetwarza dane techniczne, takie jak Twój adres IP i typ przeglądarki.
          </p>
        </Section>

        <Section title="Pliki cookie">
          <p>
            Samo GoMaltaNow nie ustawia plików cookie. Pliki cookie, które możesz zobaczyć, pochodzą od naszych partnerów reklamowych, jak wyjaśniono poniżej.
          </p>
        </Section>

        <Section title="Reklamy">
          <p>
            GoMaltaNow wyświetla reklamy Google AdSense i może wyświetlać banery sponsorów.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Zewnętrzni dostawcy, w tym Google, używają plików cookie do wyświetlania reklam na podstawie Twoich wcześniejszych wizyt na tej lub innych stronach internetowych.
            </li>

            <li>
              Wykorzystanie przez Google plików cookie do celów reklamowych umożliwia tej firmie i jej partnerom wyświetlanie Ci reklam na podstawie Twoich wizyt na tej i innych stronach w internecie. Inne sieci reklamowe współpracujące z Google mogą również używać plików cookie do wyświetlania tutaj reklam.
            </li>

            <li>
              Jeśli wymaga tego prawo, na przykład w Europejskim Obszarze Gospodarczym, Wielkiej Brytanii i Szwajcarii, przed użyciem plików cookie do celów reklamowych zostaniesz poproszony o zgodę za pośrednictwem komunikatu Google dotyczącego zgody.
            </li>

            <li>
              You can turn off personalised
              advertising at any time in Google&apos;s{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Ustawienia reklam
              </a>
              , and opt out of other vendors&apos;
              cookies at{" "}
              <a
                href="https://www.youronlinechoices.eu"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                youronlinechoices.eu
              </a>{" "}
              or{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                aboutads.info
              </a>
              .
            </li>

            <li>
              You can read how Google uses data from
              sites that show its ads at{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                policies.google.com
              </a>
              .
            </li>

            <li>
              Banery sponsorów to obrazy z linkiem. Jeśli klikniesz jeden z nich, opuścisz GoMaltaNow i będzie obowiązywać własna polityka prywatności sponsora.
            </li>
          </ul>
        </Section>

        <Section title="Linki do innych stron internetowych">
          <p>
            Nasze przewodniki zawierają linki do oficjalnych źródeł i innych przydatnych stron internetowych. Nie ponosimy odpowiedzialności za ich treść ani za sposób, w jaki przetwarzają Twoje dane.
          </p>
        </Section>

        <Section title="Twoje prawa">
          <p>
            Under the GDPR you can ask to access,
            correct or delete personal data about
            you, and you can object to how it is
            used. You can also complain to
            Malta&apos;s data protection authority,
            the{" "}
            <a
              href="https://idpc.org.mt"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Komisarz ds. Informacji i Ochrony Danych (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Zmiany">
          <p>
            Możemy aktualizować tę politykę. Data u góry wskazuje najnowszą wersję.
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-black/10 pt-8">
      <h2 className="font-serif text-3xl font-medium">
        {title}
      </h2>

      <div className="mt-4 text-lg leading-8 text-[#625D57]">
        {children}
      </div>
    </section>
  );
}
