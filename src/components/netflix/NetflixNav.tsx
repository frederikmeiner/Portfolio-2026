"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const profiles = [
  { id: "developer", label: "Udvikler",    avatar: "/avatar-developer.png", href: "/developer" },
  { id: "recruiter", label: "Rekrutterer", avatar: "/avatar-recruiter.png", href: "/recruiter" },
];

type Props = {
  profileLabel: string;
  profileAvatar: string;
};

export default function NetflixNav({ profileLabel, profileAvatar }: Props) {
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

  // Øverst ligger nav'en oven på hero-billedet og skal bruge lyse farver
  // uanset tema; scrollet ligger den på sidens egen baggrund.
  const ink = scrolled ? "var(--foreground)" : "var(--on-media)";
  const inkMuted = scrolled ? "var(--muted)" : "var(--on-media-muted)";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-16 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "var(--nav-scrolled)" : "var(--nav-top)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <Link href="/">
        <span
          className="text-xl font-bold tracking-widest cursor-pointer"
          style={{ fontFamily: "var(--font-heading)", color: ink, transition: "color 0.3s ease" }}
        >
          FM
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Profile switcher */}
        <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 hover-tint"
          style={{ background: "none", border: "none" }}
        >
          <Image
            src={profileAvatar}
            alt={profileLabel}
            width={320}
            height={320}
            className="w-7 h-7 rounded object-cover"
          />
          <span className="text-sm font-medium" style={{ color: inkMuted, fontFamily: "var(--font-body)" }}>
            {profileLabel}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", color: inkMuted }}
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
                background: "var(--surface-2)",
                backdropFilter: "blur(16px)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover-tint cursor-pointer"
                  >
                    <Image
                      src={p.avatar}
                      alt={p.label}
                      width={320}
                      height={320}
                      className="w-8 h-8 rounded object-cover"
                    />
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
                <div className="my-2" style={{ borderTop: "1px solid var(--border)" }} />
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover-tint cursor-pointer"
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
      </div>
    </motion.nav>
  );
}
