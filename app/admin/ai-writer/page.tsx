"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Draft = {
  title: string; slug: string; summary: string; introduction: string;
  sections: Array<{ heading: string; content: string }>;
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ name: string; url: string }>;
  lastChecked: string; status: "draft";
};

const inputStyle = "mt-2 w-full rounded-2xl border border-[#D9CEC2] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#9B928B] focus:border-[#B83F29] focus:ring-4 focus:ring-[#B83F29]/10";

export default function AiWriterPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setDraft(null);
    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch("/api/ai-writer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The draft could not be generated.");
      setDraft(data.draft);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected error.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-8">
          <Link href="/" className="font-serif text-3xl font-semibold">GoMalta<span className="text-[#C94F32]">Now</span></Link>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">Private workspace</span>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">Content studio</p>
          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">AI Writer</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#625D57]">Create a structured first draft from approved sources. Every result remains a draft for human review.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={generate} className="h-fit rounded-3xl border border-black/5 bg-[#FFFDF9] p-6 shadow-xl md:p-8">
            <div className="grid gap-6">
              <label className="font-semibold">Topic<input className={inputStyle} name="topic" required placeholder="Public transport in Malta" /></label>
              <label className="font-semibold">Category<input className={inputStyle} name="category" required placeholder="Transport" /></label>
              <label className="font-semibold">Sources<textarea className={`${inputStyle} min-h-36 resize-y`} name="sources" required placeholder={"Paste approved URLs, notes or source excerpts here.\nOne source per line works well."} /><small className="mt-2 block font-normal leading-relaxed text-[#766F69]">URLs are searched only within their approved domains. Notes and excerpts are used directly. The writer must not invent missing facts.</small></label>
              <label className="font-semibold">Instructions<textarea className={`${inputStyle} min-h-28 resize-y`} name="instructions" placeholder="Write a practical guide for people moving to Malta. Keep the tone clear and friendly." /></label>
              <label className="font-semibold">Language<select className={inputStyle} name="language" defaultValue="English"><option>English</option><option>Italiano</option><option>Français</option><option>Deutsch</option><option>Español</option></select></label>
              <button disabled={loading} className="rounded-2xl bg-[#B83F29] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#9F3422] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Generating draft…" : "Generate draft"}</button>
            </div>
            {error && <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
          </form>

          <section aria-live="polite" className="min-h-[520px] rounded-3xl bg-[#111315] p-6 text-white shadow-2xl md:p-9">
            {!draft ? (
              <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C94F32] text-2xl">✦</div>
                <h2 className="font-serif text-3xl">Your draft will appear here</h2>
                <p className="mt-3 max-w-md text-white/55">Title, summary, sections, FAQs and source list will be returned in a consistent structure.</p>
              </div>
            ) : <DraftPreview draft={draft} />}
          </section>
        </div>
      </section>
    </main>
  );
}

function DraftPreview({ draft }: { draft: Draft }) {
  return <article>
    <div className="mb-7 flex flex-wrap items-center gap-3"><span className="rounded-full bg-[#C94F32] px-3 py-1 text-xs font-bold uppercase tracking-wider">{draft.status}</span><span className="text-sm text-white/50">Last checked: {draft.lastChecked}</span></div>
    <h2 className="font-serif text-4xl leading-tight md:text-5xl">{draft.title}</h2><p className="mt-3 text-sm text-white/40">/{draft.slug}</p>
    <p className="mt-6 text-xl leading-relaxed text-white/75">{draft.summary}</p><p className="mt-8 leading-8 text-white/70">{draft.introduction}</p>
    <div className="mt-10 space-y-8">{draft.sections.map((section, index) => <section key={`${section.heading}-${index}`} className="border-t border-white/10 pt-7"><h3 className="font-serif text-3xl">{section.heading}</h3><p className="mt-4 whitespace-pre-wrap leading-8 text-white/70">{section.content}</p></section>)}</div>
    <section className="mt-10 border-t border-white/10 pt-7"><h3 className="font-serif text-3xl">FAQ</h3><div className="mt-5 space-y-5">{draft.faq.map((item, index) => <div key={`${item.question}-${index}`} className="rounded-2xl bg-white/5 p-5"><h4 className="font-semibold">{item.question}</h4><p className="mt-2 leading-7 text-white/65">{item.answer}</p></div>)}</div></section>
    <section className="mt-10 border-t border-white/10 pt-7"><h3 className="font-serif text-3xl">Sources</h3><ul className="mt-4 space-y-3 text-white/65">{draft.sources.map((source, index) => <li key={`${source.url}-${index}`}>{source.url ? <a className="underline decoration-[#C94F32] underline-offset-4 hover:text-white" href={source.url} target="_blank" rel="noreferrer">{source.name}</a> : source.name}</li>)}</ul></section>
  </article>;
}
