import Image from "next/image";

const guides = [
  {
    label: "Get ready",
    title: "Before You Move",
    description:
      "Prepare your documents, budget and first practical steps before arriving in Malta.",
    image: "/images/before-you-move.jpg",
    href: "/move-to-malta/eu-citizen/before-you-move",
    cta: "Open guide",
  },
  {
    label: "Your documents",
    title: "Residence",
    description:
      "Understand the residence process and the most important documents EU citizens usually need.",
    image: "/images/residence-malta.jpg",
    href: "/move-to-malta/eu-citizen/residence",
    cta: "Open guide",
  },
  {
    label: "Where to live",
    title: "Find a Home",
    description:
      "Compare areas, rental prices, contracts and the main steps involved in renting.",
    image: "/images/find-home-malta.jpg",
    href: "/move-to-malta/eu-citizen/find-a-home",
    cta: "Open guide",
  },
  {
    label: "Work opportunities",
    title: "Find a Job",
    description:
      "Learn where to search, how to prepare your application and what to expect from the job market.",
    image: "/images/find-job-malta.jpg",
    href: "/move-to-malta/eu-citizen/find-a-job",
    cta: "Open guide",
  },
  {
    label: "Money matters",
    title: "Banking & Payments",
    description:
      "See what you may need to open a bank account, receive your salary and manage local payments.",
    image: "/images/banking-payments-malta.jpg",
    href: "/move-to-malta/eu-citizen/banking-payments",
    cta: "Open guide",
  },
  {
    label: "Daily life",
    title: "Healthcare",
    description:
      "Discover how healthcare works in Malta and what to organise after your move.",
    image: "/images/healthcare-malta.jpg",
    href: "#",
    cta: "Open guide",
  },
];

const journeySteps = [
  "Prepare your documents and budget before arrival",
  "Find the right area and organise your accommodation",
  "Complete residence and everyday registrations",
  "Set up work, banking, healthcare and local essentials",
];

export default function EUCitizenPage() {
  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <a href="/" className="font-serif text-2xl font-semibold md:text-3xl">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </a>

          <a
            href="/move-to-malta"
            className="text-sm font-medium text-white/85 transition hover:text-[#D96A4A]"
          >
            ← Change citizenship route
          </a>
        </div>
      </nav>

      <section className="border-b border-[#E7DDD3] bg-[#FBF7F2]">
        <div className="mx-auto grid max-w-7xl overflow-hidden md:grid-cols-2">
          <div className="flex items-center px-6 py-16 md:px-10 md:py-20">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#2F5F8A]">
                EU / EEA / Swiss citizens
              </p>

              <h1 className="font-serif text-5xl font-medium leading-[1.02] md:text-6xl">
                Everything you need to know before moving to Malta.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-[#625D57]">
                This page brings together the essential information to help you
                organise your move with more clarity — from documents and
                residence to housing, work and everyday life.
              </p>

              <a
                href="#guides"
                className="mt-8 inline-flex rounded-full bg-[#2F5F8A] px-6 py-3 font-semibold text-white transition hover:bg-[#23496C]"
              >
                Explore the guides
              </a>
            </div>
          </div>

          <div>
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Traditional Maltese house with blue balcony"
              width={1200}
              height={1200}
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="guides" className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl font-medium md:text-5xl">
              Start with what you need now.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-[#625D57]">
              Choose the topic you want to begin with. Each guide is designed to
              make the process easier, clearer and less overwhelming.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <a
                key={guide.title}
                href={guide.href}
                className="group overflow-hidden rounded-2xl border border-[#E7DDD3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <Image
                  src={guide.image}
                  alt={guide.title}
                  width={900}
                  height={600}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="p-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#B83F29]">
                    {guide.label}
                  </p>

                  <h3 className="mb-3 font-serif text-3xl font-medium">
                    {guide.title}
                  </h3>

                  <p className="mb-5 leading-relaxed text-[#625D57]">
                    {guide.description}
                  </p>

                  <span className="font-semibold text-[#B83F29]">
                    {guide.cta} →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/65">
              Your journey
            </p>

            <h2 className="max-w-md font-serif text-4xl font-medium md:text-5xl">
              Move with a clearer plan.
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-white/80">
              GoMaltaNow helps you focus on the right things at the right time.
            </p>
          </div>

          <div className="space-y-4">
            {journeySteps.map((step) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4"
              >
                <div className="mt-1 h-3 w-3 rounded-full bg-[#D96A4A]" />
                <p className="leading-relaxed text-white/90">{step}</p>
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
          <p className="text-sm text-white/60">
            © 2026 GoMaltaNow. Malta Made Simple.
          </p>
        </div>
      </footer>
    </main>
  );
}
