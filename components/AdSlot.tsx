"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADSENSE_CLIENT,
  AD_SLOTS,
  SPONSORS,
  type AdPlacement,
} from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

// auto = banner adattabile · tall = 300×600 · rail = 160×600
type AdSize = "auto" | "tall" | "rail";

const FIXED: Record<Exclude<AdSize, "auto">, [number, number]> = {
  tall: [300, 600],
  rail: [160, 600],
};

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
  size?: AdSize;
  // Se indicato, l'annuncio si carica solo su schermi almeno così larghi (px)
  minWidth?: number;
};

export default function AdSlot({
  placement,
  className = "mx-auto w-full max-w-5xl px-6 py-10 md:px-8",
  size = "auto",
  minWidth,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const sponsor = SPONSORS[placement];
  const slot = AD_SLOTS[placement];
  const [allowed, setAllowed] = useState(!minWidth);

  useEffect(() => {
    if (!minWidth) return;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => {
      // Una volta caricato, l'annuncio resta (il CSS lo nasconde se la finestra si stringe)
      if (mq.matches) setAllowed(true);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);

  useEffect(() => {
    const ad = adRef.current;

    if (!allowed || sponsor || !slot || !ad || ad.dataset.adsbygoogleStatus) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Se AdSense è bloccato (per esempio da un ad blocker) lo spazio resta vuoto.
    }
  }, [allowed, sponsor, slot]);

  if ((!sponsor && !slot) || !allowed) {
    return null;
  }

  const fixed = size === "auto" ? null : FIXED[size];

  return (
    <aside
      aria-label={sponsor ? "Sponsored" : "Advertisement"}
      className={className}
    >
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8A827B]">
        {sponsor ? "Sponsored" : "Advertisement"}
      </p>

      {sponsor ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="block overflow-hidden rounded-3xl shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sponsor.image}
            alt={sponsor.name}
            loading="lazy"
            width={fixed?.[0]}
            height={fixed?.[1]}
            className="h-auto w-full"
          />
        </a>
      ) : fixed ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "inline-block", width: fixed[0], height: fixed[1] }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
        />
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
}
