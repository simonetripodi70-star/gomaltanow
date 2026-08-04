import Image from "next/image";

const essentials = [
  {
    title: "Prepare your application",
    text: "Update your CV, organise your qualifications and prepare a clear introduction for employers.",
  },
  {
    title: "Search in the right places",
    text: "Use trusted job platforms, company websites, recruitment agencies and professional networks.",
  },
  {
    title: "Understand the offer",
    text: "Review the role, salary, working hours, probation period and contract terms before accepting.",
  },
];

const checklist = [
  "Create an updated CV in English",
  "Prepare copies of qualifications and references",
  "Set up a professional email address",
  "Research companies before applying",
  "Prepare for online and in-person interviews",
  "Keep a record of every application",
];

const interviewTips = [
  "Explain clearly why you are moving to Malta",
  "Research the company before the interview",
  "Prepare examples of your experience",
  "Ask about working hours and responsibilities",
  "Confirm the contract type and start date",
  "Send a short follow-up message afterwards",
];

export default function FindAJobPage() {
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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#5C477A]">
                Find a Job
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] md:text-7xl">
                Prepare for your job search in Malta.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                Build a strong application, search with a clear strategy and
                understand the important details before accepting an offer.
              </p>

              <a
                href="#checklist"
                className="mt-8 inline-flex rounded-full bg-[#5C477A] px-6 py-3 font-semibold text-white transition hover:bg-[#493762]"
              >
                View the checklist ↓
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] md:min-h-[640px]">
            <Image
              src="/images/find-job-malta.jpg"
              alt="Job interview in Malta"
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
              Build a clear job search plan.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              A focused approach helps you apply more effectively and compare
              opportunities with greater confidence.
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
      <section id="checklist" className="bg-[#5C477A] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Application checklist
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Get ready before applying.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Prepare these essentials before sending applications so you can
              respond quickly when an opportunity appears.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#5C477A]">
                  ✓
                </span>
                <p className="leading-relaxed text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview tips */}
      <section className="bg-[#E9E3F2] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#5C477A]">
              Interview preparation
            </p>

            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Make a stronger first impression.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {interviewTips.map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-4 rounded-2xl border border-[#D1C3E1] bg-white/75 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5C477A] text-sm font-bold text-white">
                  ✓
                </span>
                <p className="font-semibold text-[#443653]">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-[#FBF7F2] py-14">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#5C477A]">
            Before accepting
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Read the complete offer carefully.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#625D57]">
            Confirm the main conditions in writing and ask questions about any
            detail that is unclear before you accept a role.
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
