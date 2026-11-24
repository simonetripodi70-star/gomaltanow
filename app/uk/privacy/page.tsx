import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Політика конфіденційності | GoMaltaNow",
  description:
    "Як GoMaltaNow обробляє ваші дані, файли cookie та рекламу, а також ваші права відповідно до GDPR.",
  alternates: {
    canonical: "/uk/privacy",
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
            href="/uk"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/uk"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Повернутися на головну
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-20">
        <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          Політика конфіденційності
        </h1>

        <p className="mt-5 text-sm text-[#766F69]">
          Останнє оновлення: 20 November 2026
        </p>

        <Section title="Хто ми">
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

        <Section title="Що ми збираємо">
          <p>
            Ви можете читати GoMaltaNow без облікового запису, і ми не просимо вас вказувати ім’я, адресу електронної пошти чи інші персональні дані. На сайті немає коментарів або форм реєстрації. Якщо ви напишете нам електронного листа, ми використовуємо вашу адресу та повідомлення лише для відповіді вам.
          </p>
        </Section>

        <Section title="Хостинг">
          <p>
            Вебсайт працює на Cloudflare. Щоб надавати сторінки та захищати сайт від атак, Cloudflare обробляє технічні дані, такі як ваша IP-адреса та тип браузера.
          </p>
        </Section>

        <Section title="Файли cookie">
          <p>
            GoMaltaNow сам не встановлює файли cookie. Файли cookie, які ви можете бачити, надходять від наших рекламних партнерів, як пояснено нижче.
          </p>
        </Section>

        <Section title="Реклама">
          <p>
            GoMaltaNow показує рекламу від Google AdSense і може показувати банери від спонсорів.
          </p>

          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              Сторонні постачальники, зокрема Google, використовують файли cookie для показу реклами на основі ваших попередніх відвідувань цього або інших вебсайтів.
            </li>

            <li>
              Використання Google рекламних файлів cookie дає змогу Google та його партнерам показувати вам рекламу на основі ваших відвідувань цього й інших сайтів в інтернеті. Інші рекламні мережі, що співпрацюють із Google, також можуть використовувати файли cookie для показу реклами тут.
            </li>

            <li>
              Якщо цього вимагає законодавство, зокрема в Європейській економічній зоні, Сполученому Королівстві та Швейцарії, перед використанням файлів cookie для реклами вас попросять надати згоду через повідомлення Google про згоду.
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
                Налаштування реклами
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
              Банери спонсорів — це зображення з посиланням. Якщо ви натиснете на одне з них, ви залишите GoMaltaNow, і застосовуватиметься власна політика конфіденційності спонсора.
            </li>
          </ul>
        </Section>

        <Section title="Посилання на інші вебсайти">
          <p>
            У наших путівниках є посилання на офіційні джерела та інші корисні вебсайти. Ми не несемо відповідальності за їхній вміст або за те, як вони обробляють ваші дані.
          </p>
        </Section>

        <Section title="Ваші права">
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
              Комісар з питань інформації та захисту даних (IDPC)
            </a>
            .
          </p>
        </Section>

        <Section title="Зміни">
          <p>
            Ми можемо оновлювати цю політику. Дата вгорі вказує на останню версію.
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
