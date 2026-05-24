"use client";

import { motion } from "framer-motion";
import { Award, Star, Mail, Download, Music, BookOpen, Rss, ExternalLink } from "lucide-react";

const icons = { Award, Star, Mail, Download, Music, BookOpen, Rss, ExternalLink };

type IconName = keyof typeof icons;

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  color?: string;
  href?: string;
};

export default function GenericCard({ title, subtitle, icon, color = "#2563eb", href }: Props) {
  const Icon = icon ? icons[icon] : null;

  const inner = (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 rounded-lg p-5 flex flex-col gap-3"
      style={{
        width: 180,
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        scrollSnapAlign: "start",
        cursor: href ? "pointer" : "default",
      }}
    >
      {Icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon size={20} color={color} />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    );
  }
  return inner;
}
