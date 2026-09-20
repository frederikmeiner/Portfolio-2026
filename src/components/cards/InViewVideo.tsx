"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = { src: string; className?: string };

/**
 * Et baggrundsklip, der kun hentes og afspilles, mens det er på skærmen.
 *
 * Med autoPlay på alle kort hentede projektoversigten samtlige klip på én gang —
 * flere af dem 4K-filer på kundernes egne servere — også dem langt nede ad siden.
 * Her får videoen først sin src, når kortet nærmer sig viewporten, og den
 * pauses igen, når kortet forlader den.
 *
 * Komponenten har ingen poster. Billedet bag klippet er kortets eget next/image,
 * som browseren kan prioritere; klippet ligger ovenpå og toner ind, når det kører.
 * Og der ventes, til siden er færdig med at indlæse: de første klip lå ellers og
 * tog båndbredden fra det billede, der er sidens største element.
 */
export default function InViewVideo({ src, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reducedMotion) return;

    // Har brugeren bedt om at spare data, bliver det ved billedet.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    let observer: IntersectionObserver | undefined;
    let timer: number | undefined;

    const observe = () => {
      observer = new IntersectionObserver(
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
    };
    const afterLoad = () => {
      timer = window.setTimeout(observe, 600);
    };

    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      window.removeEventListener("load", afterLoad);
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      preload="none"
      autoPlay={near}
      muted
      loop
      playsInline
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      className={className}
      style={{ opacity: playing ? 1 : 0, transition: "opacity 0.6s ease" }}
    />
  );
}
