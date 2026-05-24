"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
};

export default function CategoryCard({ title, description, href, gradient, icon: Icon }: Props) {
  return (
    <Link href={href} className="flex-shrink-0 cursor-pointer" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative rounded-xl overflow-hidden"
        style={{ width: 264, height: 168 }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: gradient }} />

        {/* Large decorative icon */}
        <div className="absolute -top-2 -right-2 opacity-[0.18] select-none pointer-events-none">
          <Icon size={110} color="white" strokeWidth={1} />
        </div>

        {/* Hover brightness overlay */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* Bottom gradient for text legibility */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon size={14} color="white" strokeWidth={2.5} style={{ opacity: 0.95, flexShrink: 0 }} />
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
            >
              {title}
            </p>
          </div>
          {description && (
            <p
              className="text-xs leading-snug"
              style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}
            >
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
