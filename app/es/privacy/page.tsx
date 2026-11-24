import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Política de privacidad | GoMaltaNow",
  description:
    "Cómo gestiona GoMaltaNow tus datos, las cookies y la publicidad, y los derechos que tienes conforme al RGPD.",
  alternates: {
    canonical: "/es/privacy",
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
            href="/es"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/es"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Política de privacidad
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Última actualización: 20 de noviembre de 2026
        </p>

        <Section title="Quiénes somos">
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

        <Section title="Qué recopilamos">
          <p>
            Puedes leer GoMaltaNow sin tener una cuenta, y no te pedimos tu nombre, dirección de correo electrónico ni otros datos personales. El sitio no tiene comentarios ni formularios de registro. Si nos envías un correo electrónico, usamos tu dirección y tu mensaje únicamente para responderte.
          </p>
        </Section>

        <Section title="Alojamiento">
          <p>
            El sitio web funciona con Cloudflare. Para mostrar las páginas y proteger el sitio frente a ataques, Cloudflare procesa datos técnicos como tu dirección IP y el tipo de navegador.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            GoMaltaNow no instala cookies por sí mismo. Las cookies que puedas ver proceden de nuestros socios publicitarios, como se explica a continuación.
          </p>
        </Section>

        <Section title="Publicidad">
          <p>
            GoMaltaNow muestra publicidad de Google AdSense y puede mostrar banners de patrocinadores.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Proveedores externos, incluido Google, usan cookies para mostrar anuncios basados en tus visitas anteriores a este sitio web u otros sitios web.
            </li>

            <li>
              El uso que Google hace de las cookies publicitarias permite a Google y a sus socios mostrarte anuncios basados en tus visitas a este y otros sitios de internet. Otras redes publicitarias que trabajan con Google también pueden usar cookies para mostrar anuncios aquí.
            </li>

            <li>
              Cuando la ley lo exige, como en el Espacio Económico Europeo, el Reino Unido y Suiza, se te solicita tu consentimiento mediante el mensaje de consentimiento de Google antes de que se usen cookies para publicidad.
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
                Configuración de anuncios
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
              Los banners de patrocinadores son imágenes con un enlace. Si haces clic en uno, sales de GoMaltaNow y se aplica la política de privacidad del patrocinador.
            </li>
          </ul>
        </Section>

        <Section title="Enlaces a otros sitios web">
          <p>
            Nuestras guías enlazan a fuentes oficiales y otros sitios web útiles. No nos responsabilizamos de su contenido ni de cómo gestionan tus datos.
          </p>
        </Section>

        <Section title="Tus derechos">
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
              Comisionado de Información y Protección de Datos (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Cambios">
          <p>
            Podemos actualizar esta política. La fecha de la parte superior muestra la versión más reciente.
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
