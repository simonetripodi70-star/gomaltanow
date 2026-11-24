"use client";

import { useRef, useState } from "react";

// Pagina admin: traduce automaticamente tutti i contenuti nelle 6 lingue.
const LANGS = ["it", "pl", "fr", "de", "es", "uk"];

type Status = { remaining: number; total: number; last?: string; error?: string; done?: boolean };

export default function TranslatePage() {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const stop = useRef(false);

  async function call(lang: string, action: string) {
    const r = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, lang }),
    });
    return (await r.json()) as Status & { translated?: string; error?: string };
  }

  async function check() {
    for (const l of LANGS) {
      const s = await call(l, "status");
      setStatus((p) => ({ ...p, [l]: { ...p[l], ...s } }));
    }
  }

  async function worker(lang: string) {
    let errors = 0;
    while (!stop.current) {
      try {
        const s = await call(lang, "next");
        if (s.error) throw new Error(s.error);
        errors = 0;
        setStatus((p) => ({ ...p, [lang]: { remaining: s.remaining, total: s.total, last: s.translated, done: s.done } }));
        if (s.done || s.remaining === 0) break;
      } catch (e) {
        errors++;
        setStatus((p) => ({ ...p, [lang]: { ...p[lang], error: String(e) } as Status }));
        if (errors >= 5) break;
        await new Promise((r) => setTimeout(r, 5000 * errors));
      }
    }
  }

  async function start() {
    stop.current = false;
    setRunning(true);
    await Promise.all(LANGS.map(worker));
    setRunning(false);
  }

  const total = Object.values(status).reduce((a, s) => a + (s.total || 0), 0);
  const left = Object.values(status).reduce((a, s) => a + (s.remaining || 0), 0);

  return (
    <main className="min-h-screen bg-[#F5F0E9] px-6 py-12 text-[#171717]">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl">Translate the site</h1>
        <p className="mt-3 text-[#625D57]">
          Translates places, beaches, articles, Move to Malta guides and page texts into 6 languages with OpenAI. Keep this page open until it finishes.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            id="start-translation"
            onClick={start}
            disabled={running}
            className="rounded-full bg-[#B83F29] px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {running ? "Translating…" : "Start"}
          </button>
          <button onClick={() => (stop.current = true)} className="rounded-full border border-[#B83F29] px-6 py-3 font-bold text-[#B83F29]">
            Stop
          </button>
          <button onClick={check} className="rounded-full border border-black/20 px-6 py-3 font-bold">
            Check status
          </button>
        </div>
        {total > 0 && (
          <p id="progress" className="mt-6 text-xl font-semibold">
            {total - left} / {total} done
          </p>
        )}
        <ul className="mt-6 grid gap-3">
          {LANGS.map((l) => (
            <li key={l} className="rounded-2xl bg-white p-4 text-sm" data-lang={l}>
              <b className="uppercase">{l}</b>{" "}
              {status[l] ? `${(status[l].total || 0) - (status[l].remaining || 0)} / ${status[l].total || "?"}` : "—"}
              {status[l]?.last && <span className="ml-2 text-[#625D57]">{status[l].last}</span>}
              {status[l]?.error && <span className="ml-2 text-red-700">{status[l].error}</span>}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
