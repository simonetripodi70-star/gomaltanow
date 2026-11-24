import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Informativa sulla privacy | GoMaltaNow",
  description:
    "Come GoMaltaNow gestisce i tuoi dati, i cookie e la pubblicità, e i diritti che hai ai sensi del GDPR.",
  alternates: {
    canonical: "/it/privacy",
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
            href="/it"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/it"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Torna alla home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Informativa sulla privacy
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Ultimo aggiornamento: 20 novembre 2026
        </p>

        <Section title="Chi siamo">
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

        <Section title="Cosa raccogliamo">
          <p>
            Puoi leggere GoMaltaNow senza un account e non ti chiediamo il tuo nome, indirizzo email o altri dati personali. Il sito non dispone di commenti né moduli di registrazione. Se ci invii un&apos;email, utilizziamo il tuo indirizzo e il tuo messaggio solo per risponderti.
          </p>
        </Section>

        <Section title="Hosting">
          <p>
            Il sito web utilizza Cloudflare. Per fornire le pagine e proteggere il sito dagli attacchi, Cloudflare tratta dati tecnici quali il tuo indirizzo IP e il tipo di browser.
          </p>
        </Section>

        <Section title="Cookie">
          <p>
            GoMaltaNow non imposta direttamente cookie. I cookie che potresti vedere provengono dai nostri partner pubblicitari, come spiegato di seguito.
          </p>
        </Section>

        <Section title="Pubblicità">
          <p>
            GoMaltaNow mostra pubblicità di Google AdSense e può mostrare banner di sponsor.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Fornitori terzi, incluso Google, utilizzano cookie per mostrare annunci in base alle tue precedenti visite a questo sito web o ad altri siti web.
            </li>

            <li>
              L&apos;uso dei cookie pubblicitari da parte di Google consente a Google e ai suoi partner di mostrarti annunci in base alle tue visite a questo e ad altri siti su internet. Anche altre reti pubblicitarie che collaborano con Google possono utilizzare cookie per mostrare annunci qui.
            </li>

            <li>
              Dove richiesto dalla legge, ad esempio nello Spazio economico europeo, nel Regno Unito e in Svizzera, ti viene chiesto il consenso tramite il messaggio di consenso di Google prima che i cookie vengano utilizzati per la pubblicità.
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
                Impostazioni annunci
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
              I banner degli sponsor sono immagini con un link. Se ne clicchi uno, lasci GoMaltaNow e si applica l&apos;informativa sulla privacy dello sponsor.
            </li>
          </ul>
        </Section>

        <Section title="Link ad altri siti web">
          <p>
            Le nostre guide rimandano a fonti ufficiali e ad altri siti web utili. Non siamo responsabili dei loro contenuti né del modo in cui gestiscono i tuoi dati.
          </p>
        </Section>

        <Section title="I tuoi diritti">
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
              Commissario per l&apos;informazione e la protezione dei dati (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Modifiche">
          <p>
            Potremmo aggiornare questa informativa. La data in alto indica la versione più recente.
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
