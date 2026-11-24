import AdSlot from "@/components/AdSlot";
import { MOVE_GUIDES } from "@/lib/move-guides";

// Blocco "guida passo-passo" per le pagine Move to Malta.
export default function MoveGuideDetail({ guide }: { guide: string }) {
  const g = MOVE_GUIDES[guide];
  if (!g) return null;

  return (
    <>
      {/* STEP BY STEP */}
      <section id="step-by-step" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            {g.kicker}
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl font-medium leading-tight md:text-5xl">
            {g.title}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#625D57]">
            {g.intro}
          </p>

          <ol className="mt-12 grid gap-5">
            {g.steps.map((s, i) => (
              <li
                key={s.title}
                className="grid gap-5 rounded-3xl border border-[#E0D7CC] bg-[#FFFDF9] p-6 md:grid-cols-[72px_1fr] md:p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B83F29] font-serif text-2xl text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-3xl leading-7 text-[#625D57]">{s.text}</p>
                  {(s.where || s.cost || s.time) && (
                    <dl className="mt-5 flex flex-wrap gap-3 text-sm">
                      {s.where && (
                        <div className="rounded-full bg-[#F3EDE5] px-4 py-2">
                          <dt className="inline font-bold">Where: </dt>
                          <dd className="inline text-[#625D57]">{s.where}</dd>
                        </div>
                      )}
                      {s.cost && (
                        <div className="rounded-full bg-[#F3EDE5] px-4 py-2">
                          <dt className="inline font-bold">Cost: </dt>
                          <dd className="inline text-[#625D57]">{s.cost}</dd>
                        </div>
                      )}
                      {s.time && (
                        <div className="rounded-full bg-[#F3EDE5] px-4 py-2">
                          <dt className="inline font-bold">Time: </dt>
                          <dd className="inline text-[#625D57]">{s.time}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {s.link && (
                    <a
                      href={s.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex font-bold text-[#B83F29] hover:underline"
                    >
                      {s.link.label} ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* COSTS */}
      {g.costs.length > 0 && (
        <section className="bg-[#173E63] py-16 text-white md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Costs at a glance
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              What it costs.
            </h2>
            <dl className="mt-10 grid gap-4 md:grid-cols-2">
              {g.costs.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-6"
                >
                  <dt className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">
                    {c.label}
                  </dt>
                  <dd className="mt-2 text-xl font-semibold">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <AdSlot placement="guideMid" />

      {/* FAQ */}
      {g.faq.length > 0 && (
        <section className="bg-[#F8F4EE] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
              FAQ
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Common questions.
            </h2>
            <div className="mt-10 grid gap-4">
              {g.faq.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-[#E0D7CC] bg-white p-6"
                >
                  <summary className="cursor-pointer list-none font-serif text-xl font-medium">
                    {f.question}
                  </summary>
                  <p className="mt-4 leading-7 text-[#625D57]">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOURCES */}
      <section className="bg-[#FBF7F2] py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Official sources · last checked {g.lastChecked}
          </p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {g.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#D8CCBF] bg-white px-4 py-2 text-sm font-semibold text-[#171717] transition hover:border-[#B83F29] hover:text-[#B83F29]"
                >
                  {s.name} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#7A736B]">
            Rules and fees change often. Always confirm the current
            requirements with the official authority before you apply.
          </p>
        </div>
      </section>
    </>
  );
}
