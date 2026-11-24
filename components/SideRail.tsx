"use client";

import { useEffect, useState } from "react";
import AdSlot from "@/components/AdSlot";
import { hasAd } from "@/lib/ads";

// Annuncio laterale fisso 160×600, nel margine vuoto a destra del contenuto.
// Compare solo se lo schermo è abbastanza largo da non coprire nulla
// e solo dopo aver superato la prima schermata (non copre le foto in alto).
export default function SideRail({ contentWidth }: { contentWidth: number }) {
  const minWidth = contentWidth + 360;
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hasAd("rail")) return null;

  return (
    <div
      className="fixed top-24 z-30 hidden transition-opacity duration-300"
      style={{
        // centrato nello spazio libero tra il contenuto e il bordo della finestra
        right: `calc((100vw - ${contentWidth}px) / 4 - 64px)`,
        opacity: pastHero ? 1 : 0,
        pointerEvents: pastHero ? "auto" : "none",
      }}
      data-min={minWidth}
    >
      <style>{`@media (min-width: ${minWidth}px) { [data-min="${minWidth}"] { display: block; } }`}</style>
      <AdSlot placement="rail" size="rail" minWidth={minWidth} className="" />
    </div>
  );
}
