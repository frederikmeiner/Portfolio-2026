"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Rocket } from "lucide-react";
import type { Project } from "@/lib/sanity/queries";

type Props = {
  project: Project;
  href: string;
  /** Plads på Top 10 — tegner det store tal bag kortets venstre kant. */
  rank?: number;
};

/** Netflix venter et øjeblik, så klip ikke starter mens musen bare kører forbi. */
const PREVIEW_DELAY = 600;

/** "2024 · Next.js · TypeScript" — samme slags linje som på titel-siden. */
function metaLine(project: Project) {
  const year = project.publishedAt ? new Date(project.publishedAt).getFullYear() : null;
  const tech = (project.technologies ?? []).slice(0, 3).map((t) => t.name);
  return [year, ...tech].filter(Boolean).join(" · ");
}

/** Projektkort til rækker — samme mål som CategoryCard, men med projektets billede. */
export default function ProjectCard({ project, href, rank }: Props) {
  const image = project.image?.asset?.url;
  const meta = metaLine(project);
  const reducedMotion = useReducedMotion();

  // Klippet hentes først, når nogen bliver hængende på kortet. Flere af dem er
  // store filer hos kunderne selv, så de må ikke loade for en hel række ad gangen.
  const [active, setActive] = useState(false);
  const [preview, setPreview] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  function startPreview() {
    setActive(true);
    if (!project.videoUrl || reducedMotion || timer.current !== null) return;
    // Touch har ingen hover — der fører et tryk direkte til titel-siden.
    if (!window.matchMedia("(hover: hover)").matches) return;
    timer.current = window.setTimeout(() => setPreview(true), PREVIEW_DELAY);
  }

  function stopPreview() {
    setActive(false);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setPreview(false);
    setPlaying(false);
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  return (
    <Link
      href={href}
      className="flex flex-shrink-0 items-end"
      style={{ scrollSnapAlign: "start" }}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
    >
      {rank !== undefined && (
        <span
          aria-hidden="true"
          className="select-none font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 176,
            lineHeight: 0.76,
            letterSpacing: "-0.08em",
            marginRight: -22,
            color: "var(--background)",
            WebkitTextStroke: "3px var(--muted)",
          }}
        >
          {rank}
        </span>
      )}

      <motion.div
        // Styres af state og ikke whileHover: fokus lander på linket, ikke på
        // kortet, og tastaturbrugere skal have samme forhåndsvisning.
        initial="idle"
        animate={active ? "hovered" : "idle"}
        whileTap={{ scale: 0.98 }}
        variants={{ idle: { scale: 1, zIndex: 0 }, hovered: { scale: 1.08, zIndex: 10 } }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative rounded-xl overflow-hidden"
        style={{ width: 264, height: 168, background: "var(--surface-2)" }}
      >
        {image ? (
          <Image src={image} alt={project.title} fill sizes="264px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket size={40} color="var(--muted)" strokeWidth={1.2} />
          </div>
        )}

        {preview && project.videoUrl && (
          <video
            src={project.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onPlaying={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            // Billedet bliver stående, til klippet faktisk kører — ingen sort ramme imens.
            style={{ opacity: playing ? 1 : 0 }}
          />
        )}

        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.p
            className="text-sm font-bold leading-tight"
            style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
            variants={{ idle: { y: 0 }, hovered: { y: meta ? -18 : 0 } }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {rank !== undefined && <span className="sr-only">Nummer {rank}: </span>}
            {project.title}
          </motion.p>
          {meta && (
            <motion.p
              className="absolute bottom-4 left-4 right-4 truncate text-xs"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)" }}
              variants={{ idle: { opacity: 0, y: 6 }, hovered: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {meta}
            </motion.p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
