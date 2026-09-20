"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = { src: string; poster?: string; className?: string };

/**
 * Et baggrundsklip, der kun hentes og afspilles, mens det er på skærmen.
 *
 * Med autoPlay på alle kort hentede projektoversigten samtlige klip på én gang —
 * flere af dem 4K-filer på kundernes egne servere — også dem langt nede ad siden.
 * Her får videoen først sin src, når kortet nærmer sig viewporten, og den
 * pauses igen, når kortet forlader den. Posteren står i mellemtiden.
 */
export default function InViewVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reducedMotion) return;

    // Har brugeren bedt om at spare data, bliver det ved billedet.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          // play() afvises, hvis videoen pauses igen inden den er startet — uden betydning.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // Lidt før kortet er inde, så klippet kører, når man når frem til det.
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      preload="none"
      autoPlay={near}
      muted
      loop
      playsInline
      aria-hidden="true"
      className={className}
    />
  );
}
