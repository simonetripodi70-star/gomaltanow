import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | GoMaltaNow",
  description:
    "Wie GoMaltaNow mit Ihren Daten, Cookies und Werbung umgeht und welche Rechte Sie gemäß der DSGVO haben.",
  alternates: {
    canonical: "/de/privacy",
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
            href="/de"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/de"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Datenschutzerklärung
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Zuletzt aktualisiert: 20 November 2026
        </p>

        <Section title="Wer wir sind">
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

        <Section title="Was wir erfassen">
          <p>
            Sie können GoMaltaNow ohne Konto lesen, und wir fragen nicht nach Ihrem Namen, Ihrer E-Mail-Adresse oder anderen persönlichen Daten. Die Website hat keine Kommentare oder Anmeldeformulare. Wenn Sie uns eine E-Mail schreiben, verwenden wir Ihre Adresse und Nachricht nur, um Ihnen zu antworten.
          </p>
        </Section>

        <Section title="Hosting">
          <p>
            Die Website läuft über Cloudflare. Um die Seiten bereitzustellen und die Website vor Angriffen zu schützen, verarbeitet Cloudflare technische Daten wie Ihre IP-Adresse und Ihren Browsertyp.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            GoMaltaNow selbst setzt keine Cookies. Die Cookies, die Sie möglicherweise sehen, stammen von unseren Werbepartnern, wie unten erläutert.
          </p>
        </Section>

        <Section title="Werbung">
          <p>
            GoMaltaNow zeigt Werbung von Google AdSense und kann Banner von Sponsoren anzeigen.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Drittanbieter, einschließlich Google, verwenden Cookies, um Werbung basierend auf Ihren früheren Besuchen dieser oder anderer Websites anzuzeigen.
            </li>

            <li>
              Die Verwendung von Werbe-Cookies durch Google ermöglicht es Google und seinen Partnern, Ihnen Werbung basierend auf Ihren Besuchen dieser und anderer Websites im Internet anzuzeigen. Andere mit Google zusammenarbeitende Werbenetzwerke können hier ebenfalls Cookies verwenden, um Werbung anzuzeigen.
            </li>

            <li>
              Wo dies gesetzlich vorgeschrieben ist, etwa im Europäischen Wirtschaftsraum, im Vereinigten Königreich und in der Schweiz, werden Sie über die Einwilligungsmitteilung von Google um Ihre Zustimmung gebeten, bevor Cookies für Werbung verwendet werden.
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
                Anzeigeneinstellungen
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
              Sponsor-Banner sind Bilder mit einem Link. Wenn Sie darauf klicken, verlassen Sie GoMaltaNow, und die eigene Datenschutzerklärung des Sponsors gilt.
            </li>
          </ul>
        </Section>

        <Section title="Links zu anderen Websites">
          <p>
            Unsere Ratgeber verlinken auf offizielle Quellen und andere nützliche Websites. Wir sind nicht für deren Inhalte oder den Umgang mit Ihren Daten verantwortlich.
          </p>
        </Section>

        <Section title="Ihre Rechte">
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
              Kommissar für Information und Datenschutz (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Änderungen">
          <p>
            Wir können diese Richtlinie aktualisieren. Das Datum oben zeigt die neueste Version.
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
