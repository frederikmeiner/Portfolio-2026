"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Skill } from "@/lib/sanity/queries";

const categoryColors: Record<string, string> = {
  Frontend: "#2563eb",
  Backend:  "#16a34a",
  CMS:      "#f97316",
  Database: "#d97706",
  DevOps:   "#7c3aed",
  Design:   "#db2777",
  Andet:    "#6b7280",
};

export default function SkillCard({ skill }: { skill: Skill }) {
  const color = categoryColors[skill.category] ?? "#6b7280";

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-shrink-0 rounded-xl overflow-hidden flex flex-col items-center cursor-default"
      style={{
        width: 128,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Category color top bar */}
      <div className="w-full h-[3px] flex-shrink-0" style={{ background: color }} />

      <div className="flex flex-col items-center gap-3 p-4 w-full">
        {/* Liquid Glass icon container */}
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: 52,
            height: 52,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          {skill.icon ? (
            <Image
              src={skill.icon}
              alt={skill.name}
              width={30}
              height={30}
              className="object-contain"
              unoptimized
            />
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color, fontFamily: "var(--font-body)" }}
            >
              {skill.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name */}
        <p
          className="text-xs font-semibold text-center leading-tight"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
        >
          {skill.name}
        </p>

        {/* Category dot + label */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-xs truncate" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {skill.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
