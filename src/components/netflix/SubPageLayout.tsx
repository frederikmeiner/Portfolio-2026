"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import TrackVisit from "@/components/netflix/TrackVisit";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  /** Valgfri indholdsbredde, fx "1320px". Centrerer nav og indhold på samme akse. */
  maxWidth?: string;
  /** Fuldbredde-hero over indholdet (titel-sider). Indholdet starter så uden top-padding. */
  hero?: React.ReactNode;
  /** Navn i Continue Watching. Falder tilbage til `title`; sæt den når title er tom. */
  trackTitle?: string;
  /** Billede til kortet i Continue Watching (fx projektets). */
  trackImage?: string;
  children: React.ReactNode;
};

export default function SubPageLayout({ title, backHref, backLabel, maxWidth, hero, trackTitle, trackImage, children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <TrackVisit title={trackTitle ?? title} image={trackImage} />

      {/* Nav */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-5 md:px-16 py-4 transition-all duration-300"
        style={{
          background: scrolled ? "var(--nav-scrolled)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="mx-auto flex w-full items-center gap-4" style={{ maxWidth }}>
          <Link
            href={backHref}
            className="flex items-center gap-1 text-sm font-medium transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            <ChevronLeft size={18} />
            {backLabel}
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
          >
            {title}
          </span>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {hero}

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${hero ? "pt-6" : "pt-24"} pb-24 px-5 md:px-16`}
      >
        <div className="mx-auto w-full" style={{ maxWidth }}>
          {title && (
            <h1
              className="text-3xl md:text-5xl font-bold mb-10"
              style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
            >
              {title}
            </h1>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
