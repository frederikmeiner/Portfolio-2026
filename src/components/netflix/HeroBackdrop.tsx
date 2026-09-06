"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  /** Basisnavn på klippet i /public — .webm, .mp4 og .jpg med samme navn. */
  media: string;
};

/**
 * Baggrunden bag begge heroes: selvhostet klip med plakat, mørkt overlay til
 * læsbar tekst og en fade ned i sidens baggrund. Respekterer reduced motion.
 */
export default function HeroBackdrop({ media }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0">
      {reduceMotion ? (
        <Image src={`/${media}.jpg`} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <video key={media} autoPlay loop muted playsInline poster={`/${media}.jpg`} aria-hidden="true" className="w-full h-full object-cover">
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
