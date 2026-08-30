"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ContentRow({ title, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  /**
   * Pilene måles ved mount og hver gang rækken skifter bredde.
   *
   * Før blev højrepilen kun slået fra i onScroll, som aldrig fyrer når
   * indholdet er smallere end rækken. På en bred skærm med få kort stod
   * pilen derfor og pegede på en scroll der ikke fandtes.
   */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();

    // Både rækkens egen bredde og kortenes kan ændre sig — vinduet skaleres,
    // billeder lander, indhold kommer ind. Begge dele observeres.
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);

    return () => observer.disconnect();
  }, [updateArrows]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2
        className="px-5 md:px-16 mb-4 text-lg md:text-xl font-semibold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
      >
        {title}
      </h2>

      <div className="relative group">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label={`Rul ${title} mod venstre`}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center cursor-pointer transition-opacity duration-200"
            style={{ background: "linear-gradient(to right, var(--row-fade), transparent)" }}
          >
            <ChevronLeft size={28} color="var(--foreground)" />
          </button>
        )}

        {/* Scrollable row — pt-6 giver plads til hover scale/y uden at blive klippet */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-5 md:px-16 pt-6 pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {children}
        </div>

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            aria-label={`Rul ${title} mod højre`}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center cursor-pointer transition-opacity duration-200"
            style={{ background: "linear-gradient(to left, var(--row-fade), transparent)" }}
          >
            <ChevronRight size={28} color="var(--foreground)" />
          </button>
        )}
      </div>
    </motion.section>
  );
}
