"use client";

import { useEffect, useRef } from "react";
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

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

export default function AdSlot({
  placement,
  className = "mx-auto w-full max-w-5xl px-6 py-10 md:px-8",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const sponsor = SPONSORS[placement];
  const slot = AD_SLOTS[placement];

  useEffect(() => {
    const ad = adRef.current;

    if (sponsor || !slot || !ad || ad.dataset.adsbygoogleStatus) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Se AdSense è bloccato (per esempio da un ad blocker) lo spazio resta vuoto.
    }
  }, [sponsor, slot]);

  if (!sponsor && !slot) {
    return null;
  }

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
            className="h-auto w-full"
          />
        </a>
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
