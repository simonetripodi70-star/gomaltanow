import type { Metadata } from "next";
import Link from "next/link";
import { getPlaceCards, getPlacesByArea, placeHref, type PlaceCard } from "@/lib/places";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import { localizeList } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Najpiękniejsze plaże Malty i Gozo | GoMaltaNow",
  description:
    "Najpiękniejsze plaże Malty i Gozo: gdzie są, jakie są, najlepsze miesiące na wizytę i czy jest parking.",
  alternates: {
    canonical: "/pl/beaches",
    languages: {"en": "/beaches", "it": "/it/beaches", "pl": "/pl/beaches", "fr": "/fr/beaches", "de": "/de/beaches", "es": "/es/beaches", "uk": "/uk/beaches", "x-default": "/beaches"},
  },
};

export const dynamic = "force-dynamic";

// Spiagge con scheda dedicata (area "beaches") + Ramla Bay e Blue Lagoon,
// che hanno già la loro scheda in Gozo e Comino.
const GOZO_BEACHES = ["hondoq-ir-rummien", "san-blas-bay", "wied-il-ghasri", "mgarr-ix-xini"];

function region(p: PlaceCard) {
  if (p.area === "comino") return "Comino";
  if (p.area === "gozo" || GOZO_BEACHES.includes(p.slug)) return "Gozo";
  return "Malta";
}

export default async function BeachesPage() {
  const [beaches, extra] = await Promise.all([
    getPlacesByArea("beaches").then((x) => localizeList("place", x, "pl")),
    getPlaceCards(["ramla-bay", "blue-lagoon"]).then((x) => localizeList("place", x, "pl")),
  ]);
  const all = [...beaches, ...extra];
  const groups = ["Malta", "Gozo", "Comino"]
    .map((name) => ({ name, items: all.filter((p) => region(p) === name) }))
    .filter((g) => g.items.length > 0);

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/pl"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <Link
            href="/pl/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Wróć do Zwiedzaj Maltę
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Plaże
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
            Najpiękniejsze plaże Malty i Gozo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
            Piaszczyste zatoki, skaliste zatoczki i czysta woda. Otwórz plażę, aby sprawdzić dojazd, parking, udogodnienia i wskazówki dotyczące kąpieli.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          {groups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#CFC3B7] bg-[#FFFDF9] p-10 text-center">
              <h2 className="font-serif text-3xl">
                Plaże wkrótce się pojawią
              </h2>
              <p className="mt-3 text-[#625D57]">
                Nie udało się teraz załadować listy plaż. Spróbuj ponownie za kilka minut.
              </p>
            </div>
          ) : (
            groups.map((g, gi) => (
              <div key={g.name} className={gi > 0 ? "mt-16" : ""}>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                  {g.name}
                </p>
                <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
                  Beaches in {g.name}.
                </h2>
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((p) => (
                    <Link
                      key={p.slug}
                      href={"/pl" + placeHref(p.area, p.slug)}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-[#FFFDF9] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      {p.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url.replace("width=1600", "width=800")}
                          alt={p.image_alt || p.name}
                          loading="lazy"
                          className="h-56 w-full object-cover"
                        />
                      )}
                      <div className="flex flex-1 flex-col p-7">
                        {p.kicker && (
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                            {p.kicker}
                          </p>
                        )}
                        <h3 className="mt-3 font-serif text-3xl leading-tight transition group-hover:text-[#B83F29]">
                          {p.name}
                        </h3>
                        <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                          {p.summary}
                        </p>
                        <span className="mt-6 border-t border-black/10 pt-5 text-sm font-bold text-[#B83F29]">
                          Dojazd, parking i wskazówki →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {gi === 0 && (
                  <div className="mt-12">
                    <AdSlot placement="guideMid" />
                  </div>
                )}
              </div>
            ))
          )}

          <div className="mt-14 rounded-3xl bg-[#173E63] p-8 text-white md:p-10">
            <h2 className="font-serif text-3xl md:text-4xl">
              Planujesz resztę podróży?
            </h2>
            <p className="mt-3 max-w-2xl text-white/75">
              Połącz plaże z Vallettą, Mdiną i najlepszymi atrakcjami na wyspach.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pl/visit-malta/things-to-do"
                className="rounded-full bg-white px-6 py-3 font-bold text-[#173E63] transition hover:-translate-y-1"
              >
                Atrakcje →
              </Link>
              <Link
                href="/pl/visit-malta/valletta"
                className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Przewodnik po Vallettcie
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link href="/pl" className="font-serif text-2xl font-semibold">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta po prostu.
          </p>
        </div>
      </footer>
    </main>
  );
}
