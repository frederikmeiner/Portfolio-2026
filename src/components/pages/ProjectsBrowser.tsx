"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import BentoGrid from "@/components/cards/BentoGrid";
import type { BentoItem } from "@/lib/sanity/queries";
import type { TechCount } from "@/lib/tech-slug";

type Props = { items: BentoItem[]; techs: TechCount[] };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Projektoversigten med teknologi-filter. Filteret bor i ?tech=, så et klik på
 * "Next.js" på en projektside eller under kompetencer lander direkte i det
 * rigtige udsnit — og linket kan deles.
 */
export default function ProjectsBrowser({ items, techs }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Et ukendt ?tech= (gammelt link, omdøbt teknologi) viser alt frem for en tom side.
  const active = techs.find((t) => t.slug === params.get("tech")) ?? null;
  const visible = active ? items.filter((item) => item.tags?.includes(active.slug)) : items;

  function select(slug: string | null) {
    router.replace(slug ? `${pathname}?tech=${slug}` : pathname, { scroll: false });
  }

  const chips = [{ slug: null, name: "Alle", count: items.length }, ...techs];

  // På mobil er mærkerne én række man swiper i. Kommer man ind via et link til
  // fx ?tech=multisite, skal det valgte mærke være synligt — ikke gemt til højre.
  const activeChip = useRef<HTMLButtonElement>(null);
  const activeSlug = active?.slug ?? null;
  useEffect(() => {
    activeChip.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeSlug]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Én række man swiper i på mobil; ombrydes fra md. Den negative margin lader
          rækken gå helt ud til skærmkanten, så mærkerne ikke klippes ved padding'en. */}
      <div
        role="group"
        aria-label="Filtrér på teknologi"
        className="scrollbar-hide -mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {chips.map((chip) => {
          const selected = (active?.slug ?? null) === chip.slug;
          return (
            <button
              key={chip.slug ?? "alle"}
              ref={selected ? activeChip : undefined}
              onClick={() => select(selected ? null : chip.slug)}
              aria-pressed={selected}
              className="relative flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-medium outline-offset-2 transition-colors duration-300"
              style={{
                color: selected ? "var(--background)" : "var(--foreground)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-body)",
              }}
            >
              {/* Én delt pille: den glider fra det gamle mærke til det nye i stedet for at blinke. */}
              {selected && (
                <motion.span
                  layoutId="tech-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--foreground)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">
                {chip.name} <span style={{ opacity: 0.55 }}>{chip.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Fast højde, så grid'et ikke hopper, når linjen kommer og går. */}
      <div className="mb-6 flex h-6 items-center" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.p
              key={active.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              <span>
                <strong style={{ color: "var(--foreground)" }}>{visible.length}</strong>{" "}
                {visible.length === 1 ? "projekt" : "projekter"} med {active.name}
              </span>
              <button
                onClick={() => select(null)}
                className="flex cursor-pointer items-center gap-1 text-xs underline-offset-4 transition-opacity hover:underline hover:opacity-80"
                style={{ color: "var(--muted)" }}
              >
                <X size={12} /> Ryd
              </button>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <BentoGrid items={visible} emptyText="Ingen projekter med den teknologi endnu." />
    </MotionConfig>
  );
}
