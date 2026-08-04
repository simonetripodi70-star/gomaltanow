import Image from "next/image";

const essentials = [
  {
    title: "Choose the right area",
    text: "Think about work, transport, daily services, noise levels and the type of lifestyle you want before comparing properties.",
  },
  {
    title: "Understand the full cost",
    text: "Look beyond the monthly rent and consider deposits, utilities, agency fees and the cost of travelling from the property.",
  },
  {
    title: "Review the agreement",
    text: "Read the rental agreement carefully and make sure important details are written clearly before you sign.",
  },
];

const checklist = [
  "Set a realistic monthly housing budget",
  "Choose two or three areas to compare",
  "Check transport and nearby services",
  "Ask what is included in the monthly rent",
  "Inspect the property before signing",
  "Keep copies of the agreement and payments",
];

const questions = [
  "How long is the rental term?",
  "What is included in the rent?",
  "How are utilities paid?",
  "Is a security deposit required?",
  "Who is responsible for repairs?",
  "What notice period applies?",
];

export default function FindAHomePage() {
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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
                Find a Home
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Find the right place to live in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Compare areas, understand the real monthly cost and prepare the
                right questions before choosing a property.
              </p>

              <a
                href="#checklist"
                className="mt-8 inline-flex rounded-full bg-[#8A3B2B] px-6 py-3 font-semibold text-white transition hover:bg-[#6E2E22]"
              >
                View the checklist ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/find-home-malta.jpg"
              alt="Searching for a home in Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Essentials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Start with the decisions that matter most.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              A good property is not only about appearance. Location, total
              cost and the rental agreement all affect your everyday life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {essentials.map((item) => (
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
      <section id="checklist" className="bg-[#8A3B2B] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Housing checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Before you agree to rent.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Use this checklist when comparing options and keep your notes for
              every property you visit.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#8A3B2B]">
                  ✓
                </span>
                <p className="leading-relaxed text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="bg-[#F4E6DF] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#8A3B2B]">
              Ask before signing
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Important questions for the landlord or agent.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question) => (
              <div
                key={question}
                className="flex items-center justify-between gap-6 rounded-2xl border border-[#D9C4B8] bg-white/70 p-5"
              >
                <p className="font-semibold text-[#4D3B34]">{question}</p>
                <span className="text-xl text-[#8A3B2B]">?</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8A3B2B]">
            Good practice
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Keep everything clear and documented.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Keep written records of agreements, payments and important
            communication. For legal or contractual questions, seek appropriate
            professional advice before committing.
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
