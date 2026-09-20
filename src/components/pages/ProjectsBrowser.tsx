"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import BentoGrid from "@/components/cards/BentoGrid";
import type { BentoItem } from "@/lib/sanity/queries";
import type { TechCount } from "@/lib/tech-slug";

type Props = { items: BentoItem[]; techs: TechCount[] };

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

  const chip = (selected: boolean) => ({
    background: selected ? "var(--foreground)" : "var(--surface-2)",
    color: selected ? "var(--background)" : "var(--foreground)",
    border: `1px solid ${selected ? "var(--foreground)" : "var(--border)"}`,
    fontFamily: "var(--font-body)",
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrér på teknologi">
        <button
          onClick={() => select(null)}
          aria-pressed={!active}
          className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
          style={chip(!active)}
        >
          Alle <span style={{ opacity: 0.6 }}>{items.length}</span>
        </button>
        {techs.map((tech) => (
          <button
            key={tech.slug}
            onClick={() => select(active?.slug === tech.slug ? null : tech.slug)}
            aria-pressed={active?.slug === tech.slug}
            className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={chip(active?.slug === tech.slug)}
          >
            {tech.name} <span style={{ opacity: 0.6 }}>{tech.count}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {active ? `${visible.length} projekter med ${active.name}` : `${visible.length} projekter`}
      </p>

      <BentoGrid items={visible} emptyText="Ingen projekter med den teknologi endnu." />
    </>
  );
}
