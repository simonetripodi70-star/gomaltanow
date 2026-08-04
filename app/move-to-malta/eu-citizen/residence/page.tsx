import Image from "next/image";

const overview = [
  {
    title: "Who this guide is for",
    text: "EU, EEA and Swiss citizens planning to live in Malta for an extended period.",
  },
  {
    title: "What to prepare",
    text: "Identity documents, proof of your situation in Malta and supporting records relevant to your application.",
  },
  {
    title: "What happens next",
    text: "Review the current requirements, prepare your documents and follow the official application process.",
  },
];

const checklist = [
  "Valid passport or national identity card",
  "Proof of your reason for living in Malta",
  "Proof of address or accommodation",
  "Supporting financial or employment documents where required",
  "Healthcare or insurance documents where applicable",
  "Copies of every document submitted",
];

export default function ResidencePage() {
  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      {/* Navbar */}
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <a href="/" className="font-serif text-2xl font-semibold md:text-3xl">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </a>

          <a
            href="/move-to-malta/eu-citizen"
            className="text-sm font-semibold text-white/75 transition hover:text-white"
          >
            ← Back to EU guides
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Residence
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Understand your residence path in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Use this guide to organise the main documents, questions and
                steps involved before starting your residence application.
              </p>

              <a
                href="#checklist"
                className="mt-8 inline-flex rounded-full bg-[#315846] px-6 py-3 font-semibold text-white transition hover:bg-[#243F33]"
              >
                View the checklist ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/residence-malta.jpg"
              alt="Residence documents for moving to Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Start with the right information.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Residence requirements can depend on your personal situation, so
              begin by identifying which category applies to you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {overview.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#E7DDD3] bg-[#F9F5F0] p-7"
              >
                <h3 className="font-serif text-3xl">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-[#625D57]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="bg-[#315846] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Preparation checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Documents to organise.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              This is a planning checklist, not a final legal list. Always
              confirm the current official requirements before applying.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#315846]">
                  ✓
                </span>
                <p className="leading-relaxed text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="bg-[#E8EFEA] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#315846]">
            Important
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#243F33] md:text-4xl">
            Check the latest official requirements before applying.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#536159]">
            Procedures, forms and supporting documents can change. This page is
            designed to help users prepare and understand the process, while
            official Maltese authorities remain the final source.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <a href="/" className="font-serif text-2xl font-semibold">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </a>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta Made Simple.
          </p>
        </div>
      </footer>
    </main>
  );
}
