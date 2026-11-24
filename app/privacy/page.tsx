import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy | GoMaltaNow",
  description:
    "How GoMaltaNow handles your data, cookies and advertising, and the rights you have under the GDPR.",
  alternates: alternatesFor("/privacy"),
};

const linkClass =
  "font-semibold text-[#B83F29] underline decoration-[#C94F32]/40 underline-offset-4 hover:text-[#8F2E1E]";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Privacy Policy
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Last updated: 20 November 2026
        </p>

        <Section title="Who we are">
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

        <Section title="What we collect">
          <p>
            You can read GoMaltaNow without an
            account, and we do not ask for your name,
            email address or other personal details.
            The site has no comments or sign-up
            forms. If you email us, we use your
            address and message only to reply to you.
          </p>
        </Section>

        <Section title="Hosting">
          <p>
            The website runs on Cloudflare. To
            deliver the pages and protect the site
            from attacks, Cloudflare processes
            technical data such as your IP address
            and browser type.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            GoMaltaNow itself does not set cookies.
            The cookies you may see come from our
            advertising partners, as explained
            below.
          </p>
        </Section>

        <Section title="Advertising">
          <p>
            GoMaltaNow shows advertising from Google
            AdSense and may show banners from
            sponsors.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Third-party vendors, including Google,
              use cookies to serve ads based on your
              previous visits to this website or
              other websites.
            </li>

            <li>
              Google&apos;s use of advertising
              cookies enables it and its partners to
              serve ads to you based on your visits
              to this and other sites on the
              internet. Other ad networks working
              with Google may also use cookies to
              show ads here.
            </li>

            <li>
              Where the law requires it, such as in
              the European Economic Area, the United
              Kingdom and Switzerland, you are asked
              for your consent through Google&apos;s
              consent message before cookies are used
              for advertising.
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
                Ads Settings
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
              Sponsor banners are images with a link.
              If you click one, you leave GoMaltaNow
              and the sponsor&apos;s own privacy
              policy applies.
            </li>
          </ul>
        </Section>

        <Section title="Links to other websites">
          <p>
            Our guides link to official sources and
            other useful websites. We are not
            responsible for their content or for how
            they handle your data.
          </p>
        </Section>

        <Section title="Your rights">
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
              Information and Data Protection
              Commissioner (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update this policy. The date at
            the top shows the latest version.
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
