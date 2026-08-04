import Image from "next/image";

const checklist = [
  "Valid passport or national identity card",
  "European Health Insurance Card for your first period",
  "Copies of qualifications and employment documents",
  "Temporary accommodation for your arrival",
  "A realistic budget for rent, deposits and everyday costs",
  "Digital and printed copies of important documents",
];

const sections = [
  {
    title: "Documents",
    text: "Keep your identity documents, employment papers, qualifications and useful certificates together before travelling.",
  },
  {
    title: "Accommodation",
    text: "Arrange somewhere safe to stay while you visit properties and learn which Maltese area suits your daily routine.",
  },
  {
    title: "Budget",
    text: "Prepare for rent, a security deposit, transport, food and the initial costs involved in setting up your new life.",
  },
];

export default function BeforeYouMovePage() {
  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
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

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Before You Move
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Prepare your move before you arrive.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                A clear plan before travelling can save you time, money and
                unnecessary stress during your first weeks in Malta.
              </p>

              <a
                href="#checklist"
                className="mt-8 inline-flex rounded-full bg-[#B83F29] px-6 py-3 font-semibold text-white transition hover:bg-[#953220]"
              >
                View the checklist ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/before-you-move.jpg"
              alt="Planning a move to Malta"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Organise the essentials first.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Focus on the practical things that will make your first days in
              Malta easier.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-[#E7DDD3] bg-[#F9F5F0] p-7"
              >
                <h3 className="font-serif text-3xl">{section.title}</h3>
                <p className="mt-4 leading-relaxed text-[#625D57]">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="checklist" className="bg-[#173E63] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Moving checklist
            </p>
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              What to prepare.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Use this as a starting checklist and adapt it to your work, family
              and accommodation situation.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#173E63]">
                  ✓
                </span>
                <p className="leading-relaxed text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
