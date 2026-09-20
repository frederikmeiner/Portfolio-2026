"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import BentoGrid from "@/components/cards/BentoGrid";
import type { BentoItem } from "@/lib/sanity/queries";
import type { TechCount } from "@/lib/tech-slug";

type Props = { items: BentoItem[]; techs: TechCount[] };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Så mange teknologier vises fra start. Med alle 18 stod mærkerne som én lang
 * stribe på brede skærme og som en væg på mobil — resten ligger bag "flere".
 */
const PRIMARY = 8;

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

  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(0, techs.length - PRIMARY);
  // Er filteret sat til en af de skjulte (fx via et link), foldes listen ud af sig selv.
  const showAll = expanded || (active !== null && techs.indexOf(active) >= PRIMARY);
  const chips = [{ slug: null, name: "Alle", count: items.length }, ...(showAll ? techs : techs.slice(0, PRIMARY))];

  return (
    <MotionConfig reducedMotion="user">
      {/* Brydes på alle skærme, og holdes smal nok til at ende som to-tre pæne
          linjer frem for én stribe tværs over en bred skærm. */}
      <div role="group" aria-label="Filtrér på teknologi" className="mb-4 flex max-w-3xl flex-wrap gap-2">
        <AnimatePresence initial={false}>
        {chips.map((chip) => {
          const selected = (active?.slug ?? null) === chip.slug;
          return (
            <motion.button
              key={chip.slug ?? "alle"}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => select(selected ? null : chip.slug)}
              aria-pressed={selected}
              className="relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium outline-offset-2 transition-colors duration-300 md:px-4 md:py-2"
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
            </motion.button>
          );
        })}
        </AnimatePresence>

        {hiddenCount > 0 && (
          <motion.button
            layout
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => setExpanded(!showAll)}
            aria-expanded={showAll}
            className="flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-70 md:px-4 md:py-2"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            {showAll ? "Færre" : `+ ${hiddenCount} flere`}
            <ChevronDown
              size={13}
              style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
            />
          </motion.button>
        )}
      </div>

      {/* layout="position": når mærkerne folder ud, glider resten ned i stedet for at hoppe. */}
      <motion.div layout="position" transition={{ duration: 0.3, ease: EASE }}>
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
      </motion.div>
    </MotionConfig>
  );
}
