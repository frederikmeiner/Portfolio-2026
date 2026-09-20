"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  /** Basisnavn på klippet i /public — .webm, .mp4 og .jpg med samme navn. */
  media: string;
};

/**
 * Baggrunden bag begge heroes: selvhostet klip med plakat, mørkt overlay til
 * læsbar tekst og en fade ned i sidens baggrund. Respekterer reduced motion.
 *
 * Plakaten er et rigtigt, prioriteret billede og ikke <video poster>: browseren
 * forhåndsindlæser ikke en poster, så den blev sidens langsomste element. Klippet
 * monteres først, når siden er færdig med at indlæse — afkodningen lå ellers
 * midt i opstarten og blokerede hovedtråden i trekvart sekund på en telefon.
 */
export default function HeroBackdrop({ media }: Props) {
  const reduceMotion = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setShowVideo(true), 400);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0">
      <Image
        src={`/${media}.jpg`}
        alt=""
        aria-hidden="true"
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        <video
          key={media}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          // Plakaten bliver stående, til klippet faktisk kører — ingen sort ramme imens.
          style={{ opacity: playing ? 1 : 0 }}
        >
          <source src={`/${media}.webm`} type="video/webm" />
          <source src={`/${media}.mp4`} type="video/mp4" />
        </video>
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </div>
  );
}
