import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Politique de confidentialité | GoMaltaNow",
  description:
    "Comment GoMaltaNow traite vos données, les cookies et la publicité, ainsi que les droits dont vous disposez en vertu du RGPD.",
  alternates: {
    canonical: "/fr/privacy",
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
            href="/fr"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/fr"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Retour à l’accueil
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Politique de confidentialité
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Dernière mise à jour : 20 novembre 2026
        </p>

        <Section title="Qui sommes-nous ?">
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

        <Section title="Ce que nous collectons">
          <p>
            Vous pouvez consulter GoMaltaNow sans créer de compte, et nous ne vous demandons ni votre nom, ni votre adresse e-mail, ni d’autres informations personnelles. Le site ne comporte ni commentaires ni formulaires d’inscription. Si vous nous envoyez un e-mail, nous utilisons votre adresse et votre message uniquement pour vous répondre.
          </p>
        </Section>

        <Section title="Hébergement">
          <p>
            Le site fonctionne avec Cloudflare. Afin d’afficher les pages et de protéger le site contre les attaques, Cloudflare traite des données techniques telles que votre adresse IP et le type de votre navigateur.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            GoMaltaNow ne dépose pas lui-même de cookies. Les cookies que vous pourriez voir proviennent de nos partenaires publicitaires, comme expliqué ci-dessous.
          </p>
        </Section>

        <Section title="Publicité">
          <p>
            GoMaltaNow affiche des publicités de Google AdSense et peut afficher des bannières de sponsors.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site ou sur d’autres sites web.
            </li>

            <li>
              L’utilisation par Google de cookies publicitaires permet à Google et à ses partenaires de vous diffuser des annonces en fonction de vos visites sur ce site et sur d’autres sites internet. D’autres réseaux publicitaires travaillant avec Google peuvent également utiliser des cookies pour afficher des annonces ici.
            </li>

            <li>
              Lorsque la loi l’exige, notamment dans l’Espace économique européen, au Royaume-Uni et en Suisse, votre consentement vous est demandé via le message de consentement de Google avant que des cookies ne soient utilisés à des fins publicitaires.
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
                Paramètres des annonces
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
              Les bannières de sponsors sont des images contenant un lien. Si vous cliquez sur l’une d’elles, vous quittez GoMaltaNow et la politique de confidentialité propre au sponsor s’applique.
            </li>
          </ul>
        </Section>

        <Section title="Liens vers d’autres sites web">
          <p>
            Nos guides comportent des liens vers des sources officielles et d’autres sites web utiles. Nous ne sommes pas responsables de leur contenu ni de la manière dont ils traitent vos données.
          </p>
        </Section>

        <Section title="Vos droits">
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
              Commissaire à l’information et à la protection des données (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Modifications">
          <p>
            Nous pouvons mettre à jour cette politique. La date en haut de page indique la version la plus récente.
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
