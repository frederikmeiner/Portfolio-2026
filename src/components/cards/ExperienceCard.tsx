"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/lib/sanity/queries";

function formatYear(date: string) {
  return new Date(date).getFullYear();
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 rounded-lg p-4 flex flex-col gap-3 cursor-default"
      style={{
        width: 220,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        scrollSnapAlign: "start",
      }}
    >
      {experience.current && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
          style={{ background: "#16a34a22", color: "#16a34a", fontFamily: "var(--font-body)" }}
        >
          Nuværende
        </span>
      )}
      <div>
        <p
          className="text-sm font-bold leading-snug"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
        >
          {experience.role}
        </p>
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
        >
          {experience.company}
        </p>
      </div>
      <p
        className="text-xs"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {formatYear(experience.startDate)} —{" "}
        {experience.current ? "Nu" : experience.endDate ? formatYear(experience.endDate) : ""}
      </p>
      {experience.technologies && experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {experience.technologies.slice(0, 4).map((t) => (
            <span
              key={t._id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--surface)", color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              {t.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
