"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/lib/sanity/queries";

type Variant = "large" | "standard";

type Props = {
  project: Project;
  variant: Variant;
  index: number;
};

const gradientPool = [
  "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
  "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
  "linear-gradient(135deg, #881337 0%, #e11d48 100%)",
  "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
  "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
  "linear-gradient(135deg, #713f12 0%, #ca8a04 100%)",
];

export default function ProjectBentoCard({ project, variant, index }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageUrl = project.image?.asset?.url
    ? `${project.image.asset.url}?w=900&h=600&fit=crop&auto=format`
    : null;
  const fallbackGradient = gradientPool[index % gradientPool.length];

  const colSpan = variant === "large" ? 2 : 1;
  const rowSpan = variant === "large" ? 2 : 1;

  function handleMouseEnter() {
    videoRef.current?.play().catch(() => {});
  }
  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Media layer ── */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full" style={{ background: fallbackGradient }} />
        )}
      </div>

      {/* ── Default state: bottom gradient + title ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:opacity-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }}
      >
        <p
          className="font-bold leading-tight text-white"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: variant === "large" ? "1.25rem" : "0.875rem",
          }}
        >
          {project.title}
        </p>
        {project.technologies && project.technologies.length > 0 && (
          <p className="text-xs mt-1 opacity-60 text-white" style={{ fontFamily: "var(--font-body)" }}>
            {project.technologies.slice(0, 2).map(t => t.name).join(" · ")}
          </p>
        )}
      </div>

      {/* ── Hover state: full info overlay ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(2px)" }}
      >
        <div className="flex flex-col gap-3">
          <p
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: variant === "large" ? "1.5rem" : "1rem",
            }}
          >
            {project.title}
          </p>

          {project.description && (
            <p
              className="text-sm leading-relaxed text-white/70"
              style={{
                fontFamily: "var(--font-body)",
                display: "-webkit-box",
                WebkitLineClamp: variant === "large" ? 4 : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </p>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, variant === "large" ? 5 : 3).map((t) => (
                <span
                  key={t._id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "var(--font-body)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-1">
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <ExternalLink size={12} />
                Live
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-body)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Code2 size={12} />
                GitHub
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
      />
    </div>
  );
}
