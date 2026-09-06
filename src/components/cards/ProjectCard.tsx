"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import type { Project } from "@/lib/sanity/queries";

type Props = { project: Project; href: string };

/** Projektkort til rækker — samme mål som CategoryCard, men med projektets billede. */
export default function ProjectCard({ project, href }: Props) {
  const image = project.image?.asset.url;

  return (
    <Link href={href} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
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
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
        />
        <p
          className="absolute bottom-0 left-0 right-0 p-4 text-sm font-bold leading-tight"
          style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
        >
          {project.title}
        </p>
      </motion.div>
    </Link>
  );
}
