"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const profiles = [
  { id: "developer", label: "Udvikler",    emoji: "💻", href: "/developer" },
  { id: "recruiter", label: "Rekrutterer", emoji: "🎯", href: "/recruiter" },
];

type Props = {
  profileLabel: string;
  profileEmoji: string;
};

export default function NetflixNav({ profileLabel, profileEmoji }: Props) {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const dropdownRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const others = profiles.filter((p) => p.label !== profileLabel);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-4 transition-all duration-300"
      style={{
        background: scrolled
          ? "linear-gradient(to bottom, rgba(20,20,20,0.98) 0%, rgba(20,20,20,0.92) 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <Link href="/">
        <span
          className="text-xl font-bold tracking-widest cursor-pointer"
          style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
        >
          FM
        </span>
      </Link>

      {/* Profile switcher */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 transition-colors duration-150 hover:bg-white/10"
          style={{ background: "none", border: "none" }}
        >
          <span className="text-base">{profileEmoji}</span>
          <span className="text-sm font-medium" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {profileLabel}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", color: "var(--muted)" }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden"
              style={{
                background: "rgba(28,28,28,0.97)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                minWidth: 180,
              }}
            >
              <div className="px-3 py-2">
                <p
                  className="text-xs uppercase tracking-widest mb-2 px-1"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
                >
                  Skift profil
                </p>
                {others.map((p) => (
                  <Link
                    key={p.id}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <div>
                      <p
                        className="text-sm font-semibold leading-tight"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                      >
                        {p.label}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                >
                  <span className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                    ← Forsiden
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
