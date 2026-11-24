import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";
import {
  getPlaceCards,
  placeHref,
  type Place,
  type PlaceCard,
} from "@/lib/places";

// Pagina dettagliata di un luogo, nello stesso stile delle guide Visit Malta.
export default async function PlaceDetail({
  place,
  backHref,
  backLabel,
  areaPlaces = [],
}: {
  place: Place;
  backHref: string;
  backLabel: string;
  // Per le pagine "hub" (es. Gozo): i luoghi dell'area da mostrare in griglia
  areaPlaces?: PlaceCard[];
}) {
  const nearby = await getPlaceCards(place.nearby ?? []);
  const mapQuery = place.map_query || `${place.name}, Malta`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="font-serif text-2xl font-semibold md:text-3xl">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>
          <Link
            href={backHref}
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← {backLabel}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-14 md:px-8 lg:py-20">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                {place.area_label}
                {place.kicker ? ` · ${place.kicker}` : ""}
              </p>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-6xl">
                {place.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                {place.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#plan"
                  className="inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#953220] hover:shadow-lg"
                >
                  Plan your visit ↓
                </a>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29] transition hover:bg-[#B83F29] hover:text-white"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-[560px]">
            {place.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={place.image_url}
                alt={place.image_alt || place.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* CONTENT + PRACTICAL BOX */}
      <section id="plan" className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="text-lg leading-8 text-[#3B3531]">{place.intro}</p>

            {place.sections.map((section) => (
              <div key={section.heading} className="mt-12">
                <h2 className="font-serif text-3xl font-medium md:text-4xl">
                  {section.heading}
                </h2>
                {section.content.split("\n\n").map((p, i) => (
                  <p key={i} className="mt-4 leading-8 text-[#625D57]">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Practical information
              </p>
              <dl className="mt-5 divide-y divide-black/10">
                {place.facts.map((f) => (
                  <div key={f.label} className="py-3">
                    <dt className="text-sm font-bold text-[#171717]">{f.label}</dt>
                    <dd className="mt-1 text-[#625D57]">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {place.last_checked && (
                <p className="mt-4 text-xs text-[#766F69]">
                  Information checked on {formatDate(place.last_checked)}. Times and prices can change: check the official website before you go.
                </p>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-[#E3D4CA]">
              <iframe
                title={`Map of ${place.name}`}
                src={mapsEmbed}
                loading="lazy"
                className="h-64 w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* PLACES IN THIS AREA (hub pages) */}
      {areaPlaces.length > 0 && (
        <section id="places" className="bg-[#F8F4EE] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Places to visit
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              What to see in {place.name}.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {areaPlaces.map((p) => (
                <Link
                  key={p.slug}
                  href={placeHref(p.area, p.slug)}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#E0D7CC] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url.replace("width=1600", "width=800")}
                      alt={p.image_alt || p.name}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {p.kicker && (
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                        {p.kicker}
                      </p>
                    )}
                    <h3 className="mt-2 font-serif text-3xl transition group-hover:text-[#B83F29]">
                      {p.name}
                    </h3>
                    <p className="mt-3 flex-1 leading-7 text-[#625D57]">{p.summary}</p>
                    <span className="mt-5 font-bold text-[#B83F29]">
                      Opening hours, tickets and how to get there →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GETTING THERE */}
      {place.getting_there.length > 0 && (
        <section className="bg-[#F8F4EE] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Getting there
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              How to get to {place.name}.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {place.getting_there.map((g) => (
                <article
                  key={g.mode}
                  className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
                >
                  <h3 className="font-serif text-2xl">{g.mode}</h3>
                  <p className="mt-3 leading-7 text-[#625D57]">{g.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <AdSlot placement="guideMid" />

      {/* TIPS */}
      {place.tips.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Local tips
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Make the most of your visit.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {place.tips.map((tip, i) => (
                <article
                  key={i}
                  className="relative overflow-hidden rounded-3xl border border-[#E3D4CA] bg-[#FBF7F2] p-7"
                >
                  <span className="font-serif text-4xl text-[#B83F29]/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 leading-7 text-[#3B3531]">{tip}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {place.faq.length > 0 && (
        <section className="border-y border-[#E3C8BE] bg-[#F3E6DF] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 space-y-5">
              {place.faq.map((item) => (
                <div key={item.question} className="rounded-3xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold">{item.question}</h3>
                  <p className="mt-2 leading-7 text-[#625D57]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEARBY */}
      {nearby.length > 0 && (
        <section className="bg-[#F8F4EE] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              Nearby
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Continue exploring.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {nearby.map((p) => (
                <Link
                  key={p.slug}
                  href={placeHref(p.area, p.slug)}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#E0D7CC] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url.replace("width=1600", "width=800")}
                      alt={p.image_alt || p.name}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-2xl transition group-hover:text-[#B83F29]">
                      {p.name}
                    </h3>
                    <p className="mt-3 flex-1 leading-7 text-[#625D57]">{p.summary}</p>
                    <span className="mt-5 font-bold text-[#B83F29]">Read the guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOURCES */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-sm text-[#766F69] md:px-8">
          {place.sources.length > 0 && (
            <>
              <h2 className="font-serif text-2xl text-[#171717]">Official sources</h2>
              <ul className="mt-4 space-y-2">
                {place.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#B83F29] underline decoration-[#C94F32]/40 underline-offset-4"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {place.image_credit && (
            <p className="mt-6">
              Photo:{" "}
              {place.image_source ? (
                <a href={place.image_source} target="_blank" rel="noopener noreferrer" className="underline">
                  {place.image_credit}
                </a>
              ) : (
                place.image_credit
              )}
            </p>
          )}
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link href="/" className="font-serif text-2xl font-semibold">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>
          <p className="text-sm text-white/55">© 2026 GoMaltaNow. Malta Made Simple.</p>
        </div>
      </footer>
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
