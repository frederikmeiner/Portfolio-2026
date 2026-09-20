"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import BentoCard from "@/components/cards/BentoCard";
import type { BentoItem } from "@/lib/sanity/queries";

type Props = {
  items: BentoItem[];
  emptyText?: string;
};

function getSpans(size?: string) {
  if (size === "large") return { col: 2, row: 2 };
  if (size === "tall") return { col: 1, row: 2 };
  return { col: 1, row: 1 };
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BentoGrid({ items, emptyText = "Tilføj indhold i Sanity Studio → /studio" }: Props) {
  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl py-24"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          {emptyText}
        </p>
      </div>
    );
  }

  return (
    // reducedMotion="user": med "reducér bevægelse" slået til skifter kortene uden at flyve rundt.
    <MotionConfig reducedMotion="user">
      {/* `dense` fylder hullerne ud: når et 2×2-felt ikke kan være i de resterende
          kolonner, rykker et senere 1×1-felt op i det tomrum, det ellers ville efterlade. */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ gridAutoRows: "200px", gridAutoFlow: "dense" }}
      >
        {/* Når listen filtreres, glider de kort der bliver, hen på deres nye plads
            (layout), mens resten toner ud. popLayout tager de udgående kort ud af
            grid'et med det samme, så de andre ikke venter på dem. initial={false}:
            ingen animation ved første visning — kun når noget ændrer sig. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) => {
            const { col, row } = getSpans(item.size);
            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: EASE, layout: { duration: 0.55, ease: EASE } }}
                style={{ gridColumn: `span ${col}`, gridRow: `span ${row}` }}
              >
                <BentoCard item={item} index={i} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
