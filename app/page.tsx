import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#F7F1EA] text-[#171717]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Valletta and the Maltese coastline"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        {/* Navbar */}
        <nav className="absolute left-0 top-0 z-30 w-full border-b border-white/10 bg-[#0B0D0F]/90 text-white backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
            <a
              href="/"
              className="font-serif text-3xl font-semibold tracking-tight md:text-4xl"
            >
              <span className="text-white">GoMalta</span>
              <span className="text-[#C94F32]">Now</span>
            </a>

            <div className="hidden items-center gap-8 text-base font-medium md:flex">
              <a
                className="transition hover:text-[#D96A4A]"
                href="#visit-malta"
              >
                Visit Malta
              </a>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#move-to-malta"
              >
                Move to Malta
              </a>

              <a
                className="transition hover:text-[#D96A4A]"
                href="/beaches"
              >
                Beaches
              </a>

              <a
                className="transition hover:text-[#D96A4A]"
                href="#guides"
              >
                Guides
              </a>

              <a className="transition hover:text-[#D96A4A]" href="#">
                Blog
              </a>

              <a
                href="#guides"
                className="rounded-lg bg-[#B83F29] px-5 py-3 font-semibold text-white transition hover:bg-[#9F3422]"
              >
                Plan Your Next Step
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-16 pt-32 text-white md:px-8 md:pb-20 md:pt-40">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Malta Made Simple
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Everything you need to visit Malta or start a new life here.
              Local insights, practical guidance and useful tools for every step
              of your journey.
            </p>
          </div>

          {/* Choice Cards */}
          <div className="mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-2">
            <a
              id="visit-malta"
              href="/beaches"
              className="group relative overflow-hidden rounded-3xl border border-[#D65C40] bg-gradient-to-br from-[#C7442D] to-[#A92F20] p-8 text-white shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-white/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#B83F29]">
                    🧳
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-2xl transition duration-300 group-hover:translate-x-2 group-hover:bg-white group-hover:text-[#B83F29]">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Visit Malta
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                  Discover beautiful beaches, local restaurants, historic
                  places, hidden gems and unforgettable experiences across the
                  islands.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Beaches
                  </span>
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Restaurants
                  </span>
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Experiences
                  </span>
                  <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#7C291E]">
                    Itineraries
                  </span>
                </div>
              </div>
            </a>

            <a
              id="move-to-malta"
              href="#guides"
              className="group relative overflow-hidden rounded-3xl border border-[#E6DED4] bg-[#FFFDF9] p-8 text-[#171717] shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] md:p-10"
            >
              <div className="absolute bottom-[-45px] right-[-35px] text-[190px] font-serif text-[#B83F29]/5">
                M
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111315] text-2xl text-white">
                    🏠
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B9B0A6] text-2xl transition duration-300 group-hover:translate-x-2 group-hover:border-[#B83F29] group-hover:bg-[#B83F29] group-hover:text-white">
                    →
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-4xl font-medium md:text-5xl">
                  Move to Malta
                </h2>

                <p className="mb-7 max-w-lg text-base leading-relaxed text-[#55514D] md:text-lg">
                  Understand the process, find a home, explore work
                  opportunities and begin your new life in Malta with
                  confidence.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Housing
                  </span>
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Jobs
                  </span>
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Residency
                  </span>
                  <span className="rounded-full bg-[#F1EAE2] px-4 py-2 text-sm font-semibold text-[#3B3531]">
                    Documents
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Curved transition */}
        <div className="absolute bottom-[-1px] left-0 z-20 h-12 w-full rounded-t-[50%] bg-[#F7F1EA] md:h-16" />
      </section>

      {/* Popular Guides */}
      <section id="guides" className="relative z-30 bg-[#F7F1EA] pb-20 pt-8 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Explore Malta
              </p>

              <h2 className="font-serif text-4xl font-medium text-[#171717] md:text-5xl">
                Popular Guides
              </h2>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#625D57] md:text-lg">
                Curated guides to help you explore, plan and settle in Malta.
              </p>
            </div>

            <a
              href="#"
              className="font-semibold text-[#B83F29] transition hover:tracking-wide"
            >
              View all guides →
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Best Beaches */}
            <a
              href="/beaches"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/golden-bay.jpg"
                  alt="Golden Bay beach in Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Visit Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium text-[#171717]">
                  Best Beaches
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Explore Malta&apos;s most beautiful beaches, bays and swimming
                  spots.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Explore beaches →
                </span>
              </div>
            </a>

            {/* Find a Home */}
            <a
              href="#"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/home-malta.jpg"
                  alt="Traditional Maltese home"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Move to Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium text-[#171717]">
                  Find a Home
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Compare neighbourhoods, rental prices and the best areas to
                  live.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Explore housing →
                </span>
              </div>
            </a>

            {/* Find a Job */}
            <a
              href="#"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/jobs-malta.jpg"
                  alt="Working in Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Work in Malta
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium text-[#171717]">
                  Find a Job
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Learn where to search, what documents you need and how to
                  apply.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Explore jobs →
                </span>
              </div>
            </a>

            {/* Transport */}
            <a
              href="#"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/transport-malta.jpg"
                  alt="Public transport in Malta"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                  Getting Around
                </p>

                <h3 className="mb-3 font-serif text-3xl font-medium text-[#171717]">
                  Transport
                </h3>

                <p className="mb-6 flex-1 text-base leading-relaxed text-[#625D57]">
                  Understand buses, ferries, taxis, parking and travelling
                  around Malta.
                </p>

                <span className="font-semibold text-[#B83F29]">
                  Explore transport →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Why GoMaltaNow */}
      <section className="bg-[#111315] py-20 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#D96A4A]">
                Why GoMaltaNow
              </p>

              <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight md:text-6xl">
                Malta explained clearly, all in one place.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Practical information for holidays, relocation and everyday life,
                created to help you make better decisions without wasting time.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
                  ✓
                </div>
                <h3 className="mb-3 font-serif text-2xl">Local knowledge</h3>
                <p className="leading-relaxed text-white/65">
                  Useful guidance shaped around real life in Malta, not generic
                  travel advice.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
                  ↻
                </div>
                <h3 className="mb-3 font-serif text-2xl">Up-to-date guides</h3>
                <p className="leading-relaxed text-white/65">
                  Clear articles and checklists designed to stay useful as rules
                  and services change.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
                  ◇
                </div>
                <h3 className="mb-3 font-serif text-2xl">Simple navigation</h3>
                <p className="leading-relaxed text-white/65">
                  Choose whether you are visiting or moving and quickly reach the
                  information that matters to you.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C94F32] text-xl">
                  →
                </div>
                <h3 className="mb-3 font-serif text-2xl">One complete guide</h3>
                <p className="leading-relaxed text-white/65">
                  Beaches, housing, jobs, transport and documents brought
                  together in one consistent experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#C7442D] py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-white/70">
              Start your Malta journey
            </p>
            <h2 className="max-w-3xl font-serif text-4xl font-medium md:text-5xl">
              Visiting for a week or building a new life?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#visit-malta"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#A92F20] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Visit Malta
            </a>

            <a
              href="#move-to-malta"
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#A92F20]"
            >
              Move to Malta
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-14 text-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <a
                href="/"
                className="font-serif text-3xl font-semibold tracking-tight"
              >
                <span className="text-white">GoMalta</span>
                <span className="text-[#C94F32]">Now</span>
              </a>

              <p className="mt-4 max-w-sm leading-relaxed text-white/60">
                Malta Made Simple. Practical guides for visiting, moving and
                living on the Maltese islands.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Visit Malta</h3>
              <div className="flex flex-col gap-3 text-white/60">
                <a className="transition hover:text-white" href="/beaches">
                  Beaches
                </a>
                <a className="transition hover:text-white" href="#">
                  Restaurants
                </a>
                <a className="transition hover:text-white" href="#">
                  Experiences
                </a>
                <a className="transition hover:text-white" href="#">
                  Itineraries
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Move to Malta</h3>
              <div className="flex flex-col gap-3 text-white/60">
                <a className="transition hover:text-white" href="#">
                  Housing
                </a>
                <a className="transition hover:text-white" href="#">
                  Jobs
                </a>
                <a className="transition hover:text-white" href="#">
                  Residency
                </a>
                <a className="transition hover:text-white" href="#">
                  Documents
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">GoMaltaNow</h3>
              <div className="flex flex-col gap-3 text-white/60">
                <a className="transition hover:text-white" href="#guides">
                  Guides
                </a>
                <a className="transition hover:text-white" href="#">
                  Blog
                </a>
                <a className="transition hover:text-white" href="#">
                  About
                </a>
                <a className="transition hover:text-white" href="#">
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>© 2026 GoMaltaNow. All rights reserved.</p>
            <p>Malta Made Simple.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
