import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nach Malta ziehen: Ratgeber für EU- und Nicht-EU-Bürger | GoMaltaNow",
  description:
    "Wähle deinen Weg nach Malta: praktische Ratgeber für EU- und Nicht-EU-Bürger zu Dokumenten, Aufenthalt, Wohnen, Arbeit und Alltag.",
  alternates: {
    canonical: "/de/move-to-malta",
    languages: {"en": "/move-to-malta", "it": "/it/move-to-malta", "pl": "/pl/move-to-malta", "fr": "/fr/move-to-malta", "de": "/de/move-to-malta", "es": "/es/move-to-malta", "uk": "/uk/move-to-malta", "x-default": "/move-to-malta"},
  },
};


export default function MoveToMaltaPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE8] text-[#171717]">
      <section className="min-h-screen">
        {/* Navbar */}
        <nav className="border-b border-black/10 bg-[#0B0D0F] text-white">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-8">
            <a
              href="/de"
              className="font-serif text-3xl font-semibold tracking-tight md:text-4xl"
            >
              <span className="text-white">GoMalta</span>
              <span className="text-[#C94F32]">Now</span>
            </a>

            <a
              href="/de"
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              ← Zurück zur Startseite
            </a>
          </div>
        </nav>

        {/* Main layout */}
        <div className="mx-auto grid min-h-[calc(100vh-81px)] max-w-[1400px] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left content */}
          <div className="flex items-center px-6 py-14 md:px-8 lg:py-20 lg:pr-12">
            <div className="w-full">
              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.98] md:text-7xl">
                Wähle deinen Weg nach Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Wähle deine Staatsangehörigkeit, um die passenden Infos, Dokumente und Schritte zu sehen.
              </p>

              <div className="mt-10 grid gap-5">
                {/* EU Citizen */}
                <a
                  href="/de/move-to-malta/eu-citizen"
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#245B86] to-[#173A59] p-7 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8"
                >
                  <div className="absolute -bottom-10 -right-2 font-serif text-[150px] text-white/5">
                    EU
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#173A59]">
                        EU / EWR / Schweiz
                      </span>

                      <span className="text-3xl transition duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>

                    <h2 className="mt-6 font-serif text-3xl font-medium md:text-4xl">
                      EU-Bürger
                    </h2>

                    <p className="mt-3 max-w-xl leading-relaxed text-white/80">
                      Aufenthalt, Arbeit, Wohnen und wichtige Dienste für EU-Bürger, die nach Malta ziehen.
                    </p>
                  </div>
                </a>

                {/* Non-EU Citizen */}
                <a
                  href="/de/move-to-malta/non-eu-citizen"
                  className="group relative overflow-hidden rounded-3xl border border-[#BFD0C5] bg-gradient-to-br from-[#E8F0EA] to-[#C9DCCF] p-7 text-[#17221C] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8"
                >
                  <div className="absolute -bottom-10 -right-2 font-serif text-[135px] text-[#315846]/10">
                    Nicht-EU
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#315846]">
                        Drittstaatsangehörige
                      </span>

                      <span className="text-3xl transition duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>

                    <h2 className="mt-6 font-serif text-3xl font-medium md:text-4xl">
                      Nicht-EU-Bürger
                    </h2>

                    <p className="mt-3 max-w-xl leading-relaxed text-[#405148]">
                      Genehmigungen, Aufenthalt, Arbeit und nötige Dokumente für Nicht-EU-Bürger.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Traditionelles blaues maltesisches Haus"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
