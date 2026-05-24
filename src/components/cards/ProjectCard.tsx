"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/image";
import type { Project } from "@/lib/sanity/queries";

type Props = {
  project: Project;
  index?: number;
};

export default function ProjectCard({ project, index = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = project.image
    ? urlFor(project.image).width(600).height(340).fit("crop").url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl overflow-hidden flex flex-col w-full"
      style={{
        background: "var(--surface-2)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "var(--border)"}`,
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        transition: "border-color 200ms, box-shadow 200ms",
      }}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video relative overflow-hidden" style={{ background: "var(--surface)" }}>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
            />
            {/* Cinematic bottom gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-10"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            {project.title}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p
          className="text-sm font-bold leading-snug"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
        >
          {project.title}
        </p>

        {/* Description with toggle */}
        {project.description && (
          <div>
            <AnimatePresence initial={false}>
              <motion.p
                key={expanded ? "expanded" : "collapsed"}
                initial={false}
                className="text-xs leading-relaxed"
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  ...(!expanded && {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }),
                }}
              >
                {project.description}
              </motion.p>
            </AnimatePresence>

            {project.description.length > 100 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs mt-1.5 cursor-pointer transition-opacity duration-150 hover:opacity-70"
                style={{ color: "var(--accent)", fontFamily: "var(--font-body)", background: "none", border: "none", padding: 0 }}
              >
                {expanded ? "Læs mindre" : "Læs mere"}
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex" }}
                >
                  <ChevronDown size={13} />
                </motion.span>
              </button>
            )}
          </div>
        )}

        {/* Tech tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((t) => (
              <span
                key={t._id}
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: "var(--surface)", color: "var(--muted)", fontFamily: "var(--font-body)", border: "1px solid var(--border)" }}
              >
                {t.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
              >
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-4 mt-auto pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              <ExternalLink size={12} />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              <Code2 size={12} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
