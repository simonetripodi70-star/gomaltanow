"use client";

import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, isTranslatedPath, type Locale } from "@/lib/i18n";

// Selettore lingua (in basso a sinistra, accanto al pulsante chiaro/scuro).
// Mostra solo le lingue in cui la pagina corrente è tradotta.
export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const first = pathname.split("/")[1] as Locale;
  const current: Locale =
    first && first !== "en" && (LOCALES as readonly string[]).includes(first)
      ? first
      : "en";
  const base =
    current === "en" ? pathname : pathname.slice(current.length + 1) || "/";

  const available = isTranslatedPath(base) ? [...LOCALES] : ["en" as Locale];

  if (available.length < 2) return null;

  function go(lang: string) {
    const target = lang === "en" ? base : `/${lang}${base === "/" ? "" : base}`;
    window.location.href = target;
  }

  return (
    <label className="fixed bottom-5 left-[4.25rem] z-40 flex h-11 items-center rounded-full border border-black/10 bg-white px-3 text-sm font-semibold text-[#171717] shadow-lg">
      <span className="sr-only">Language</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      <select
        value={current}
        onChange={(e) => go(e.target.value)}
        className="ml-1.5 cursor-pointer appearance-none bg-transparent pr-1 outline-none"
      >
        {available.map((l) => (
          <option key={l} value={l} className="text-black">
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
