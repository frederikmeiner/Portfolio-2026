"use client";

import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";

type Props = {
  profileLabel: string;
  gifUrl?: string;
};

export default function HeroSection({ profileLabel, gifUrl = "https://media4.giphy.com/media/huJmPXfeir5JlpPAx0/giphy.gif" }: Props) {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ height: "70vh" }}>
      {/* GIF background */}
      <div className="absolute inset-0">
        <img
          src={gifUrl}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }}
        />
        {/* Bottom gradient fade into page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
        >
          {profileLabel} View
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-heading)", color: "var(--on-media)" }}
        >
          Frederik
          <br />
          Meiner
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--on-media-muted)", fontFamily: "var(--font-body)" }}
        >
          Senior Frontend Developer. Jeg er vokset op med internettet og følger stadig med forrest – i dag bygger jeg WordPress-løsninger, integrationer og AI-agenter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="/CV - Frederik Meiner.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all duration-200 cursor-pointer"
            style={{
              background: "var(--on-media)",
              color: "var(--on-media-ink)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            <FileText size={16} />
            Resume
          </a>
          <a
            href="https://linkedin.com/in/frederikmeiner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all duration-200 cursor-pointer"
            style={{
              background: "var(--on-media-tint)",
              color: "var(--on-media)",
              border: "1px solid var(--on-media-tint-strong)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--on-media-tint-strong)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--on-media-tint)")}
          >
            <ExternalLink size={16} />
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
